use std::sync::Arc;

pub struct SSIProcessor;

impl SSIProcessor {
    pub fn new() -> Self {
        SSIProcessor
    }

    pub fn process(&self, content: &Arc<String>) -> String {
        // Dummy implementation: just return the content as-is
        content.to_string()
    }
}
