"use client";

import { useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import Loading from "../../components/ui/Loading";
import { CourseForm } from "./_components/CourseForm";
import { CourseList } from "./_components/courseList";
import { useCourses } from "./_hooks/usecourse";
import type { Course } from "./_types";

export default function CoursePage() {
  const {
    courses,
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchCourses,
    handleRefresh,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleStatus,
  } = useCourses();

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSubmit = async (data: {
    name: string;
    code: string;
    coefficient: number;
    classIds: number[];
  }) => {
    if (editingCourse) {
      await handleUpdate(editingCourse.courseId, data);
      setEditingCourse(null);
    } else {
      await handleCreate(data);
    }
  };

  if (loading && courses.length === 0) {
    return <Loading skeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 text-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Course management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Define and manage school courses and assign them to classes.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Toasts */}
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {error && (
            <div className="pointer-events-auto flex items-center gap-3 bg-white border border-red-100 text-red-600 px-4 py-3 rounded-2xl shadow-sm text-sm">
              <FiAlertCircle className="shrink-0" />
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-3 text-gray-400 hover:text-gray-700 font-bold"
              >
                ×
              </button>
            </div>
          )}
          {success && (
            <div className="pointer-events-auto flex items-center gap-3 bg-white border border-green-100 text-green-700 px-4 py-3 rounded-2xl shadow-sm text-sm">
              <FiCheckCircle className="shrink-0" />
              <span>{success}</span>
              <button
                type="button"
                onClick={() => setSuccess(null)}
                className="ml-3 text-gray-400 hover:text-gray-700 font-bold"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <CourseForm
            onSubmit={handleSubmit}
            onError={(msg) => setError(msg)}
            editingCourse={editingCourse}
            onCancelEdit={() => setEditingCourse(null)}
          />
          <CourseList
            courses={courses}
            loading={loading}
            onToggleStatus={handleToggleStatus}
            onEdit={(course) => setEditingCourse(course)}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
