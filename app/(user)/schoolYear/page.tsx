"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  FiPlus, 
  FiTrash2, 
  FiCheckCircle, 
  FiCalendar, 
  FiTag, 
  FiAlertCircle,
  FiLoader,
  FiRefreshCw
} from "react-icons/fi";
import { useSchoolYear } from "../../context/SchoolYearContext";

// Zod schema for form validation
const schoolYearSchema = z.object({
  label: z.string().min(1, "Label is required (e.g., 2025-2026)"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

type SchoolYearForm = z.infer<typeof schoolYearSchema>;

interface SchoolYear {
  schoolYearId: number;
  label: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export default function SchoolYearManagement() {
  const { refreshSchoolYears } = useSchoolYear();
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SchoolYearForm>({
    resolver: zodResolver(schoolYearSchema),
  });

  const fetchSchoolYears = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schoolYear");
      if (!res.ok) throw new Error("Failed to fetch school years");
      const data = await res.json();
      setSchoolYears(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolYears();
  }, []);

  const handleRefresh = async () => {
    await fetchSchoolYears();
    await refreshSchoolYears();
  };

  const onSubmit = async (data: SchoolYearForm) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      const res = await fetch("/api/schoolYear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create school year");
      }

      setSuccess("School year created successfully!");
      reset();
      handleRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this school year?")) return;

    try {
      const res = await fetch(`/api/schoolYear/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete");
      }

      setSuccess("School year deleted successfully");
      handleRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      const res = await fetch("/api/schoolYear", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "ACTIVE" }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to activate");
      }

      setSuccess("School year activated successfully");
      handleRefresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 p-6 md:p-12 font-[Inter]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              School Year Management
            </h1>
            <p className="text-slate-400 text-lg">
              Define and manage academic cycles for your institution.
            </p>
          </div>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-all active:scale-95"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Status Messages removed to keep UI clean, or you can keep them if you prefer */}
        {/* Letting the user know about errors/success via toast would be better but keeping consistency with existing code */}
        {(error || success) && (
          <div className="fixed top-24 right-6 z-50 pointer-events-none">
            {error && (
              <div className="animate-in slide-in-from-right-full duration-300 pointer-events-auto bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-xl shadow-2xl shadow-red-500/10 mb-3">
                <FiAlertCircle className="shrink-0" />
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-4 hover:text-white pointer-events-auto">×</button>
              </div>
            )}
            {success && (
              <div className="animate-in slide-in-from-right-full duration-300 pointer-events-auto bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-xl shadow-2xl shadow-emerald-500/10">
                <FiCheckCircle className="shrink-0" />
                <span>{success}</span>
                <button onClick={() => setSuccess(null)} className="ml-4 hover:text-white pointer-events-auto">×</button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-4">
            <div className="sticky top-12 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700" />
              
              <div className="relative space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20">
                    <FiPlus className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-semibold">New School Year</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-2">
                      <FiTag className="text-indigo-400" />
                      Label
                    </label>
                    <input
                      {...register("label")}
                      placeholder="e.g. 2025 - 2026"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    />
                    {errors.label && (
                      <p className="text-red-400 text-xs ml-2 mt-1">{errors.label.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-2">
                      <FiCalendar className="text-blue-400" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      {...register("startDate")}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all [color-scheme:dark]"
                    />
                    {errors.startDate && (
                      <p className="text-red-400 text-xs ml-2 mt-1">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-2">
                      <FiCalendar className="text-purple-400" />
                      End Date
                    </label>
                    <input
                      type="date"
                      {...register("endDate")}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 outline-none transition-all [color-scheme:dark]"
                    />
                    {errors.endDate && (
                      <p className="text-red-400 text-xs ml-2 mt-1">{errors.endDate.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create School Year"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-8">
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] overflow-hidden">
              <div className="p-8 border-b border-white/[0.05] flex items-center justify-between">
                <h3 className="text-xl font-semibold">Academic Cycles</h3>
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold bg-slate-800/30 px-3 py-1 rounded-full">
                  {schoolYears.length} Total
                </span>
              </div>

              <div className="p-4 md:p-8">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-slate-500 animate-pulse">Loading school years...</p>
                  </div>
                ) : schoolYears.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-800/30 rounded-full flex items-center justify-center">
                      <FiTag className="text-3xl text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xl font-medium text-slate-400">No school years found</p>
                      <p className="text-slate-600 mt-1">Start by creating your first academic year.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {schoolYears.map((year) => (
                      <div 
                        key={year.schoolYearId}
                        className={`group relative p-6 rounded-3xl border transition-all duration-300 ${
                          year.status === 'ACTIVE' 
                            ? 'bg-indigo-500/5 border-indigo-500/20' 
                            : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                              year.status === 'ACTIVE'
                                ? 'bg-indigo-500/20 text-indigo-400'
                                : 'bg-slate-800 text-slate-600'
                            }`}>
                              <FiTag />
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold group-hover:text-white transition-colors">
                                {year.label}
                              </h4>
                              <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5 bg-slate-800/40 px-2.5 py-1 rounded-lg">
                                  <FiCalendar className="text-xs" />
                                  {new Date(year.startDate).toLocaleDateString()} — {new Date(year.endDate).toLocaleDateString()}
                                </span>
                                {year.status === 'ACTIVE' && (
                                  <span className="flex items-center gap-1 text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    <FiCheckCircle />
                                    Active
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {year.status !== 'ACTIVE' && (
                              <button
                                onClick={() => handleActivate(year.schoolYearId)}
                                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                              >
                                Activate
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(year.schoolYearId)}
                              className="p-2.5 bg-red-400/10 hover:bg-red-400/20 text-red-400 rounded-xl transition-all active:scale-90"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}