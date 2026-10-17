"use client";

import { useState } from "react";

declare global {
  interface Window {
    googlefc?: {
      callbackQueue?: Array<Record<string, () => void>>;
      showRevocationMessage?: () => void;
    };
  }
}

export function PrivacyChoicesButton() {
  const [status, setStatus] = useState("");

  function openPrivacyChoices() {
    if (!window.googlefc) {
      setStatus("Google privacy choices are not available right now. Please try again shortly.");
      return;
    }
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: () => {
        if (window.googlefc?.showRevocationMessage) {
          window.googlefc.showRevocationMessage();
        } else {
          console.error("Google Privacy & Messaging did not provide the revocation message API.");
          setStatus("Google privacy choices could not be opened. Please try again shortly.");
        }
      },
    });
    setStatus("");
  }

  return (
    <span className="privacy-choices-control">
      <button type="button" onClick={openPrivacyChoices}>Privacy &amp; advertising choices</button>
      {status && <span role="status">{status}</span>}
    </span>
  );
}
