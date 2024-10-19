use std::error::Error;
use std::path::Path;
use std::sync::Arc;
use tokio::fs;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::OnceCell;
mod ssi_processor;
use ssi_processor::SSIProcessor;

static TEMPLATE_CONTENT: OnceCell<Arc<String>> = OnceCell::const_new();
const LISTEN_ADDR: &str = "0.0.0.0";
const PORT: u16 = 1337;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let listener = TcpListener::bind(format!("{LISTEN_ADDR}:{PORT}")).await?;
    println!("Listening on http://{LISTEN_ADDR}:{PORT}");

    // Initialize the template content
    TEMPLATE_CONTENT
        .get_or_init(|| async {
            let content = tokio::fs::read_to_string("templates/index.html")
                .await
                .expect("Failed to read template file");
            Arc::new(content)
        })
        .await;

    loop {
        let (socket, _) = listener.accept().await?;
        tokio::spawn(async move {
            if let Err(e) = handle_connection(socket).await {
                eprintln!("Failed to handle connection: {}", e);
            }
        });
    }
}

async fn handle_connection(mut socket: TcpStream) -> Result<(), Box<dyn Error + Send + Sync>> {
    let request = process_request(&mut socket).await?;
    println!("Received request:\n{}", request);

    let path = extract_path(&request);
    if path.starts_with("/static/") {
        match serve_static_file(&path).await {
            Ok(content) => {
                let response = add_200_headers(&content, get_mime_type(&path));
                write_response(&mut socket, &response).await?;
            }
            Err(_) => {
                let response = add_404_headers();
                write_response(&mut socket, &response).await?;
            }
        }
    } else {
        let template_content = TEMPLATE_CONTENT.get().expect("Template not initialized");
        let ssi_processor = SSIProcessor::new();
        let processed_content = ssi_processor.process(template_content);
        let response = add_200_headers(&processed_content, "text/html; charset=utf-8");
        write_response(&mut socket, &response).await?;
    }
    Ok(())
}

async fn process_request(socket: &mut TcpStream) -> Result<String, Box<dyn Error + Send + Sync>> {
    let mut buffer = [0; 1024];
    let bytes_read = socket.read(&mut buffer).await?;
    if bytes_read == 0 {
        return Err("Empty request".into());
    }
    Ok(String::from_utf8_lossy(&buffer[..bytes_read]).to_string())
}

async fn write_response(
    socket: &mut TcpStream,
    response: &str,
) -> Result<(), Box<dyn Error + Send + Sync>> {
    socket.write_all(response.as_bytes()).await?;
    socket.flush().await?;
    Ok(())
}

fn add_200_headers(body: &str, content_type: &str) -> String {
    format!(
        "HTTP/1.1 200 OK\r\nContent-Type: {}\r\nContent-Length: {}\r\n\r\n{}",
        content_type,
        body.len(),
        body
    )
}

fn add_404_headers() -> String {
    "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 9\r\n\r\nNot Found"
        .to_string()
}

fn get_mime_type(path: &str) -> &str {
    match Path::new(path).extension().and_then(|ext| ext.to_str()) {
        Some("css") => "text/css",
        Some("js") => "application/javascript",
        Some("html") => "text/html",
        _ => "application/octet-stream",
    }
}

fn extract_path(request: &str) -> String {
    request
        .lines()
        .next()
        .and_then(|line| line.split_whitespace().nth(1))
        .unwrap_or("/")
        .to_string()
}

async fn serve_static_file(path: &str) -> Result<String, Box<dyn Error + Send + Sync>> {
    let full_path = format!(".{}", path);
    fs::read_to_string(full_path).await.map_err(|e| e.into())
}
