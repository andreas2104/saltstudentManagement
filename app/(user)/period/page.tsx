"use client";
import { FiRefreshCw, FiAlertCircle, FiPlus } from "react-icons/fi";
import { PeriodForm } from "./_components/PeriodForm";
import { PeriodList } from "./_components/PeriodList";
export default function PeriodePage() {
  return (
    <div className="min-h-screen  text-slate-20  p-6 md:p-12 front-[Inter]">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent ">
              Period
            </h1>
          </div>
          <button
            type="button"
            className="flex items-center gap-2px-4 py-2 bg-slate-4
            00/50 hover:bg-slate-500 rounded-xl border-slate-700/50 tramsition-all active:scale-95"
          >
            <FiRefreshCw className="animate-spin" />
            Refresh
          </button>
        </div>

        <div className="fixed top-24 right-6 z-50 pointer-events-none ">
          <div className="animate-in slide-in-from-right-full duration-300 pointer-events-auto bg-red-500/10 border-red-500/20 text-400 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-xl shadow-2xl shadow-red-500/10 mb-3">
            <FiAlertCircle className="shrink-0" />
            <span>error</span>
            <button
              type="button"
              className="ml-4 hover:text-white poiter-events-auto"
            >
              x
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/*<div className="lg:col-span-4">
            <div className="sticky top-12 bg-white/[0.03] border border-white/-[0.08] backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl relative overfow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700" />
              <div className="relative space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all duration-700">
                    <FiPlus className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-semibold">New Period</h2>
                </div>*/}

          <PeriodForm />
          <PeriodList />
        </div>
      </div>
    </div>
  );
}
