import { useCallback, useState } from "react";
import type { DayOfWeek, Schedule } from "../_types";

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSchedules = useCallback(async (schoolYearId?: number) => {
    setLoading(true);
    try {
      const url = schoolYearId
        ? `/api/schedule?schoolYearId=${schoolYearId}`
        : "/api/schedule";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch schedules");
      setSchedules(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(
    async (schoolYearId?: number) => {
      await fetchSchedules(schoolYearId);
    },
    [fetchSchedules],
  );

  const handleCreate = async (payload: {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    classroom?: string;
    assignmentId: number;
    schoolYearId: number;
  }) => {
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) {
      if (Array.isArray(result.conflicts) && result.conflicts.length > 0) {
        throw new Error(result.conflicts.join("\n"));
      }
      throw new Error(result.error || "Failed to create schedule");
    }
    setSuccess("Schedule created successfully!");
    await fetchSchedules(payload.schoolYearId);
  };

  const handleDelete = async (
    id: number,
    schoolYearId?: number,
  ) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;
    const res = await fetch(`/api/schedule/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || "Failed to delete");
    }
    setSuccess("Schedule deleted successfully");
    await fetchSchedules(schoolYearId);
  };

  return {
    schedules,
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchSchedules,
    handleRefresh,
    handleCreate,
    handleDelete,
  };
}
