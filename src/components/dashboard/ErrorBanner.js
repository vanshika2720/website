import React from "react";

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="overview-error" role="alert">
      <div className="overview-error__icon">&#x26A0;</div>
      <div className="overview-error__body">
        <strong>Unable to reach Kmesh API</strong>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          className="overview-error__retry"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}
