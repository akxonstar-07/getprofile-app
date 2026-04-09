"use client";

import { useState, useEffect } from "react";
import { getRoleDashboardConfig, type RoleDashboardConfig } from "@/lib/role-dashboard-config";

/**
 * Hook that fetches the user's profile role and returns the
 * role-specific dashboard config. Used by all dashboard pages.
 */
export function useRoleDashboardConfig(): { config: RoleDashboardConfig; role: string; loading: boolean } {
  const [role, setRole] = useState("personal_brand");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => {
        if (data.user?.profileRole) {
          setRole(data.user.profileRole);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { config: getRoleDashboardConfig(role), role, loading };
}
