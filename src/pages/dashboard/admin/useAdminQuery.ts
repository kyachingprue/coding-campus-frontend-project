import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";

function isAutoRefreshEnabled() {
  try {
    return localStorage.getItem("admin-dashboard-auto-refresh") === "true";
  } catch {
    return false;
  }
}

export function useAdminQuery<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((current) => current + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    apiRequest<T>(path)
      .then((result) => { if (active) setData(result); })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load admin data.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [path, refreshKey]);

  useEffect(() => {
    if (!isAutoRefreshEnabled()) return undefined;
    const interval = window.setInterval(() => setRefreshKey((current) => current + 1), 60_000);
    return () => window.clearInterval(interval);
  }, [path]);

  return { data, loading, error, refresh };
}
