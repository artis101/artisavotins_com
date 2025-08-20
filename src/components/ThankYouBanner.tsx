import { useState } from "react";

interface ThankYouBannerProps {
  onClose: () => void;
}

import "../styles/components.css";

export default function ThankYouBanner({ onClose }: ThankYouBannerProps) {
  const handleOkClick = () => {
    window.location.href = "https://google.com";
  };

  return (
    <div className="thank-you-banner">
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">Thank You</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-body">
          <p>
            Thank you for visiting!
          </p>
          <button onClick={handleOkClick}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}