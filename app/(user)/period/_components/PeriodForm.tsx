"use client";
import { FiCalendar, FiTag } from "react-icons/fi";

interface Props {
  onSubmit: (data: FormValues) => Promise<void>;
  onError: (msg: string) => void;
}

export function PeriodForm() {
  return (
    <form className="space-y-6">
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
  );
}
