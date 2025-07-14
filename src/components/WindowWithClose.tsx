import { useState } from "react";
import ThankYouBanner from "./ThankYouBanner";

interface WindowWithCloseProps {
  children: React.ReactNode;
}

export default function WindowWithClose({ children }: WindowWithCloseProps) {
  const [showThankYou, setShowThankYou] = useState(false);

  const handleClose = () => {
    setShowThankYou(true);
  };

  const handleBannerClose = () => {
    setShowThankYou(false);
  };

  if (showThankYou) {
    return <ThankYouBanner onClose={handleBannerClose} />;
  }

  return (
    <div className="window">
      <div className="title-bar">
        <div className="title-bar-text">Artis Avotins - Personal Page</div>
        <div className="title-bar-controls">
          <button aria-label="Close" onClick={handleClose}></button>
        </div>
      </div>
      <div className="window-body">
        {children}
      </div>
    </div>
  );
}