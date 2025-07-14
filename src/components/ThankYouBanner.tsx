import { useState } from "react";

interface ThankYouBannerProps {
  onClose: () => void;
}

export default function ThankYouBanner({ onClose }: ThankYouBannerProps) {
  const handleOkClick = () => {
    window.location.href = "https://google.com";
  };

  return (
    <div className="window" style={{ margin: "20px auto", maxWidth: "400px" }}>
      <div className="title-bar">
        <div className="title-bar-text">Thank You</div>
        <div className="title-bar-controls">
          <button aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
      <div className="window-body" style={{ textAlign: "center", padding: "20px" }}>
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          Thank you for visiting!
        </p>
        <button onClick={handleOkClick} style={{ minWidth: "80px" }}>
          OK
        </button>
      </div>
    </div>
  );
}