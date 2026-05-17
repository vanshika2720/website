import { useState, useEffect, useCallback, useRef } from "react";

const REFRESH_INTERVAL_MS = 30000;

const DEFAULT_API_BASE =
  typeof window !== "undefined" && window.__KMESH_API_BASE__
    ? window.__KMESH_API_BASE__
    : "http://localhost:15200";

function deriveHealthStatus(readyData) {
  if (!readyData) return "unknown";
  const bpf = readyData.bpf_status;
  const xds = readyData.xds_status;

  if (!bpf || !xds) return "unhealthy";

  const bpfOk = bpf.programs_loaded && bpf.maps_pinned;
  const xdsOk = xds.adsReceived && xds.cdsConnected;

  if (bpfOk && xdsOk) return "healthy";
  if (bpfOk || xdsOk) return "degraded";
  return "unhealthy";
}

function countFromDump(configDump) {
  if (!configDump) {
    return { workloads: 0, services: 0, waypoints: 0 };
  }

  let workloads = 0;
  let services = 0;
  let waypoints = 0;

  if (Array.isArray(configDump.workloads)) {
    workloads = configDump.workloads.length;
    waypoints = configDump.workloads.filter(
      (w) => w.waypoint || w.isWaypoint,
    ).length;
  } else if (typeof configDump.workloadCount === "number") {
    workloads = configDump.workloadCount;
  }

  if (Array.isArray(configDump.services)) {
    services = configDump.services.length;
  } else if (typeof configDump.serviceCount === "number") {
    services = configDump.serviceCount;
  }

  if (typeof configDump.waypointCount === "number") {
    waypoints = configDump.waypointCount;
  }

  return { workloads, services, waypoints };
}

export default function useMeshStatus(apiBase) {
  const base = apiBase || DEFAULT_API_BASE;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    try {
      const [readyRes, dumpRes] = await Promise.all([
        fetch(`${base}/debug/ready`),
        fetch(`${base}/debug/config_dump`),
      ]);

      if (!readyRes.ok || !dumpRes.ok) {
        throw new Error(
          `API responded with status ${readyRes.status}/${dumpRes.status}`,
        );
      }

      const readyData = await readyRes.json();
      const dumpData = await dumpRes.json();

      const counts = countFromDump(dumpData);
      const health = deriveHealthStatus(readyData);
      const version = readyData.version || dumpData.version || "unknown";

      setData({
        workloads: counts.workloads,
        services: counts.services,
        waypoints: counts.waypoints,
        health,
        version,
        lastUpdated: new Date(),
      });
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to connect to Kmesh API");
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchStatus]);

  return { data, loading, error, refetch: fetchStatus };
}
