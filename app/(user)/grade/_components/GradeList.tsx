import { FiEdit3, FiTrash2 } from "react-icons/fi";
import type { Grade } from "../_types";

interface Props {
  grades: Grade[];
  loading: boolean;
  onDelete: (id: number) => void;
}

export function GradeList({ grades, loading, onDelete }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden text-gray-900 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Grades</h3>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
          {grades.length} total
        </span>
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading grades...</p>
          </div>
        ) : grades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
              <FiEdit3 className="text-2xl text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">No grades yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Record the first grade to get started.
              </p>
            </div>
          </div>
        ) : (
          grades.map((grade) => {
            const percentage =
              grade.maxScore > 0 ? (grade.value / grade.maxScore) * 100 : 0;
            return (
              <div
                key={grade.gradeId}
                className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-gray-900">
                    <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                      {grade.value}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-gray-900">
                          {grade.student
                            ? `${grade.student.firstname} ${grade.student.lastname}`
                            : "Student"}
                        </h4>
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {grade.value} / {grade.maxScore}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">
                          {grade.assignment?.course?.name ?? "Assignment"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {grade.period?.label ?? "Period"}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                            percentage >= 50
                              ? "text-green-700 bg-green-50 border-green-100"
                              : "text-red-700 bg-red-50 border-red-100"
                          }`}
                        >
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      {grade.comment && (
                        <p className="text-xs text-gray-500 mt-1">
                          {grade.comment}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDelete(grade.gradeId)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                    aria-label={`Delete grade`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
