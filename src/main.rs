use http_body_util::Full;
use hyper::body::Bytes;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::StatusCode;
use hyper::{Request, Response};
use hyper_util::rt::{TokioIo, TokioTimer};
use std::convert::Infallible;
use std::fs;
use std::net::SocketAddr;
use std::path::{Path, PathBuf};
use tokio::net::TcpListener;

const LISTEN_ADDR: [u8; 4] = [0, 0, 0, 0];
const PORT: u16 = 1337;

// Function to handle template files (HTML only)
async fn handle_template(path: &str) -> Response<Full<Bytes>> {
    // Construct path relative to project root
    let template_dir = PathBuf::from("templates");
    let request_path = path.trim_start_matches("/templates/");
    let path = template_dir.join(request_path);
    println!("Request for template: {:?}", path);

    // Check if it's an HTML file
    if let Some(extension) = path.extension() {
        if extension != "html" {
            let mut response = Response::new(Full::new(Bytes::from("Not Found")));
            *response.status_mut() = StatusCode::NOT_FOUND;
            return response;
        }
    } else {
        let mut response = Response::new(Full::new(Bytes::from("Not Found")));
        *response.status_mut() = StatusCode::NOT_FOUND;
        return response;
    }

    if path.exists() && path.starts_with(&template_dir) {
        match fs::read(&path) {
            Ok(contents) => {
                let mut response = Response::new(Full::new(Bytes::from(contents)));
                response
                    .headers_mut()
                    .insert("content-type", "text/html".parse().unwrap());
                response
            }
            Err(_) => {
                let mut response = Response::new(Full::new(Bytes::from("Internal Server Error")));
                *response.status_mut() = StatusCode::INTERNAL_SERVER_ERROR;
                response
            }
        }
    } else {
        let mut response = Response::new(Full::new(Bytes::from("Not Found")));
        *response.status_mut() = StatusCode::NOT_FOUND;
        response
    }
}

// Function to handle static files
async fn handle_static_file(path: &str) -> Response<Full<Bytes>> {
    let static_dir = PathBuf::from("static");
    let request_path = path.trim_start_matches("/static/");
    let path = static_dir.join(request_path);
    println!("Request for static file: {:?}", path);

    if path.exists() && path.starts_with(&static_dir) {
        match fs::read(&path) {
            Ok(contents) => {
                let mut response = Response::new(Full::new(Bytes::from(contents)));
                if let Some(ext) = Path::new(&path).extension() {
                    let content_type = match ext.to_str().unwrap_or("") {
                        "html" => "text/html",
                        "css" => "text/css",
                        "js" => "application/javascript",
                        "png" => "image/png",
                        "jpg" | "jpeg" => "image/jpeg",
                        _ => "application/octet-stream",
                    };
                    response
                        .headers_mut()
                        .insert("content-type", content_type.parse().unwrap());
                }
                response
            }
            Err(_) => {
                let mut response = Response::new(Full::new(Bytes::from("Internal Server Error")));
                *response.status_mut() = StatusCode::INTERNAL_SERVER_ERROR;
                response
            }
        }
    } else {
        let mut response = Response::new(Full::new(Bytes::from("Not Found")));
        *response.status_mut() = StatusCode::NOT_FOUND;
        response
    }
}

// Router function that handles all requests
async fn router(req: Request<impl hyper::body::Body>) -> Result<Response<Full<Bytes>>, Infallible> {
    let uri = req.uri().path();

    // Route requests based on path
    let response = match uri {
        "/" => handle_template("/templates/index.html").await,
        path if path.starts_with("/static/") => handle_static_file(path).await,
        _ => handle_template(uri).await,
    };

    Ok(response)
}

#[tokio::main]
pub async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    pretty_env_logger::init();
    let addr: SocketAddr = (LISTEN_ADDR, PORT).into();
    let listener = TcpListener::bind(addr).await?;
    println!("Listening on http://{}", addr);

    loop {
        let (tcp, _) = listener.accept().await?;
        let io = TokioIo::new(tcp);

        tokio::task::spawn(async move {
            if let Err(err) = http1::Builder::new()
                .timer(TokioTimer::new())
                .serve_connection(io, service_fn(router))
                .await
            {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}

