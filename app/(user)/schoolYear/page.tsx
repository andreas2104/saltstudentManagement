"use client";

import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import Loading from "../../components/ui/Loading";
import { SchoolYearList } from "./_components/SchoolYearList";
import { SchoolYearForm } from "./_components/ShoolYearForm";
import { useSchoolYears } from "./_hooks/useSchoolYear";

export default function SchoolYearPage() {
  const {
    schoolYears,
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchSchoolYears,
    handleRefresh,
    handleCreate,
    handleDelete,
    handleActivate,
  } = useSchoolYears();

  useEffect(() => {
    fetchSchoolYears();
  }, [fetchSchoolYears]);

  if (loading && schoolYears.length === 0) {
    return <Loading skeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              School year management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Define and manage academic cycles.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all"
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
                className="ml-3 text-gray-400 hover:text-gray-700"
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
                className="ml-3 text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <SchoolYearForm
            onSubmit={handleCreate}
            onError={(msg) => setError(msg)}
          />
          <SchoolYearList
            years={schoolYears}
            loading={loading}
            onActivate={handleActivate}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
