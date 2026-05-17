import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import SummaryCard from "../../components/dashboard/SummaryCard";
import ErrorBanner from "../../components/dashboard/ErrorBanner";
import useMeshStatus from "../../hooks/useMeshStatus";
import "../../css/dashboard-overview.css";

const HEALTH_LABELS = {
  healthy: "Healthy",
  degraded: "Degraded",
  unhealthy: "Unhealthy",
  unknown: "Unknown",
};

const HEALTH_STATUS_MAP = {
  healthy: "green",
  degraded: "yellow",
  unhealthy: "red",
  unknown: "red",
};

function WorkloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M2 9h20M9 21V9" />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function WaypointIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
      <path d="M12 22V16M22 8.5l-10 5M2 8.5l10 5" />
    </svg>
  );
}

function HealthIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function VersionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function formatTimestamp(date) {
  if (!date) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DashboardOverview() {
  const { data, loading, error, refetch } = useMeshStatus();

  return (
    <DashboardLayout title="Overview - Dashboard">
      <div className="overview-header">
        <div className="overview-header__text">
          <h1>Cluster Overview</h1>
          <p className="overview-subtitle">
            Real-time summary of your Kmesh service mesh
          </p>
        </div>
        {data && data.lastUpdated && (
          <span className="overview-timestamp">
            Last updated: {formatTimestamp(data.lastUpdated)}
          </span>
        )}
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <div className="summary-grid">
        <SummaryCard
          icon={<WorkloadIcon />}
          title="Managed Workloads"
          value={loading ? null : data ? data.workloads : "—"}
          status={loading ? null : data ? "green" : null}
          loading={loading}
        />
        <SummaryCard
          icon={<ServiceIcon />}
          title="Services"
          value={loading ? null : data ? data.services : "—"}
          status={loading ? null : data ? "green" : null}
          loading={loading}
        />
        <SummaryCard
          icon={<WaypointIcon />}
          title="Active Waypoints"
          value={loading ? null : data ? data.waypoints : "—"}
          status={
            loading
              ? null
              : data
                ? data.waypoints > 0
                  ? "green"
                  : "yellow"
                : null
          }
          loading={loading}
        />
        <SummaryCard
          icon={<HealthIcon />}
          title="Mesh Health"
          value={
            loading
              ? null
              : data
                ? HEALTH_LABELS[data.health] || "Unknown"
                : "—"
          }
          status={loading ? null : data ? HEALTH_STATUS_MAP[data.health] : null}
          loading={loading}
        />
        <SummaryCard
          icon={<VersionIcon />}
          title="Kmesh Version"
          value={loading ? null : data ? data.version : "—"}
          status={loading ? null : "green"}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
