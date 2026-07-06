"use client";
import {
  FiRefreshCw,
  FiAlertCircle,
  FiPlus,
  FiTag,
  FiCalendar,
} from "react-icons/fi";
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="sticky top-12 bg-white/[0.03] border border-white/-[0.08] backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl relative overfow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700" />
              <div className="relative space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all duration-700">
                    <FiPlus className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-semibold">New Period</h2>
                </div>

                <form className="space-y-6">
                  {/*<div>
                    <label
                      htmlFor="label"
                      className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-2"
                    >
                      <FiTag className="text-indigo-400" />
                    </label>
                    <input
                      id="label"
                      placeholder="label "
                      className="w-ful bg-black/40 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 outline-none transition-all [color-schema:dark]"
                    />
                  </div>*/}
                  <div>
                    <label
                      htmlFor="label"
                      className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-2"
                    >
                      <FiTag className="text-indigo-400" />
                    </label>
                    <input
                      id="label"
                      placeholder="label"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/40 focus:border-purple-500 outline-none transition-all"
                    ></input>
                  </div>
                  <div>
                    <label
                      htmlFor="school year"
                      className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-2"
                    >
                      School Yaer
                    </label>
                    <input
                      id="school year"
                      placeholder="shool year"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/40 focus:border-purple-500 outline-none transition-all"
                    ></input>
                  </div>
                  <div>
                    <label
                      htmlFor="start date"
                      className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-2"
                    >
                      <FiCalendar className="text-blue-400" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start date"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:ring-indigo-500/40 focus:border-purple-500 outline-none transition-all"
                    ></input>
                  </div>
                  <div>
                    <label
                      htmlFor="end date"
                      className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-2"
                    >
                      <FiCalendar className="text-blue-400" />
                      End Date
                    </label>
                    <input
                      type="date"
                      id="end date"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:ring-indigo-500/40 focus:border-purple-500 outline-none transition-all"
                    ></input>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2  "
                  >
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
