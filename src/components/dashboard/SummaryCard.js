import React from "react";

export default function SummaryCard({ icon, title, value, status, loading }) {
  if (loading) {
    return (
      <div className="summary-card summary-card--loading" aria-busy="true">
        <div className="summary-card__icon skeleton-pulse" />
        <div className="summary-card__body">
          <div className="skeleton-line skeleton-line--short" />
          <div className="skeleton-line skeleton-line--long" />
        </div>
      </div>
    );
  }

  const statusClass = status ? `summary-card--${status}` : "";

  return (
    <div className={`summary-card ${statusClass}`}>
      <div className="summary-card__icon">{icon}</div>
      <div className="summary-card__body">
        <span className="summary-card__title">{title}</span>
        <span className="summary-card__value">{value}</span>
      </div>
      {status && (
        <span
          className={`summary-card__status summary-card__status--${status}`}
          title={status}
        />
      )}
    </div>
  );
}
