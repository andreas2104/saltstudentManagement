import { useCallback, useState } from "react";
import type { Student } from "../_types";

export function useStudents(classId?: number) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const url = classId ? `/api/student?classId=${classId}` : "/api/student";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch students");
      setStudents(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [classId]);

  const handleRefresh = useCallback(async () => {
    await fetchStudents();
  }, [fetchStudents]);

  const handleCreate = async (payload: {
    lastname: string;
    firstname: string;
    gender: "MALE" | "FEMALE";
    birthDate: string;
    classId: number;
    registrationNumber?: string;
    birthPlace?: string;
    address?: string;
    parentPhone?: string;
    parentEmail?: string;
  }) => {
    const res = await fetch("/api/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to create student");
    setSuccess("Student created successfully!");
    handleRefresh();
  };

  const handleUpdate = async (
    id: number,
    payload: Partial<{
      lastname: string;
      firstname: string;
      gender: "MALE" | "FEMALE";
      birthDate: string;
      classId: number;
      registrationNumber: string;
      birthPlace: string;
      address: string;
      parentPhone: string;
      parentEmail: string;
    }>,
  ) => {
    const res = await fetch(`/api/student/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update student");
    setSuccess("Student updated successfully!");
    handleRefresh();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    const res = await fetch(`/api/student/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || "Failed to delete");
    }
    setSuccess("Student deleted successfully");
    handleRefresh();
  };

  const handleToggleStatus = async (
    id: number,
    currentStatus: "ACTIVE" | "INACTIVE",
  ) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const res = await fetch("/api/student", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || "Failed to update student status");
    }
    setSuccess(`Student updated to ${newStatus}`);
    handleRefresh();
  };

  return {
    students,
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchStudents,
    handleRefresh,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleStatus,
  };
}
