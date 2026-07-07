import { FiTag } from "react-icons/fi";
export function PeriodList() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semobold text-gray-900">
          <span className="">Period</span>
        </h3>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
          Total
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex  flex-col items-center justify-center py-20 gap-3">
          {/*<div className="w-8 h-8 border-gray-200 border-t-gray-700 rounded-full animate-spin">
            <p className="text-sm text-gray-400">Loading Period....</p>
          </div>*/}
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
              <FiTag className="text-2xl text-gray-300" />
            </div>
          </div>
          <div>
            <p>No Period yet</p>
            <p>Create your first Period academic.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
