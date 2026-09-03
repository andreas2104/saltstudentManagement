"use client";

import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import Loading from "../../components/ui/Loading";
import { GradeForm } from "./_components/GradeForm";
import { GradeList } from "./_components/GradeList";
import { useGrades } from "./_hooks/useGrade";

export default function GradePage() {
  const {
    grades,
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchGrades,
    handleRefresh,
    handleCreate,
    handleDelete,
  } = useGrades();

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  if (loading && grades.length === 0) {
    return <Loading skeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 text-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Grade management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Record and manage student grades.
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
                x
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
                x
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <GradeForm
            onSubmit={handleCreate}
            onError={(msg) => setError(msg)}
          />
          <GradeList
            grades={grades}
            loading={loading}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
