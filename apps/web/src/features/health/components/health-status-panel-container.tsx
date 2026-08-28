"use client";

import { useHealthQuery } from "../hooks/use-health-query";
import { HealthStatusPanel } from "./health-status-panel";

export function HealthStatusPanelContainer() {
  const healthQuery = useHealthQuery();

  if (healthQuery.isPending) {
    return <HealthStatusPanel state="loading" />;
  }

  if (healthQuery.isError) {
    return (
      <HealthStatusPanel
        state="error"
        isRetrying={healthQuery.isFetching}
        onRetry={() => void healthQuery.refetch()}
      />
    );
  }

  return (
    <HealthStatusPanel state="success" service={healthQuery.data.service} />
  );
}
