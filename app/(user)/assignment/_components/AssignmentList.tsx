import { FiCalendar, FiTrash2 } from "react-icons/fi";
import type { Assignment } from "../_types";

interface Props {
  assignments: Assignment[];
  loading: boolean;
  onDelete: (id: number) => void;
}

export function AssignmentList({ assignments, loading, onDelete }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden text-gray-900 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Assignments</h3>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
          {assignments.length} total
        </span>
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
              <FiCalendar className="text-2xl text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                No assignments yet
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Assign a teacher to a class and course to get started.
              </p>
            </div>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.assignmentId}
              className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-gray-900">
                  <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                    <FiCalendar className="text-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold text-gray-900">
                        {assignment.course?.name ?? "Course"}
                      </h4>
                      {assignment.course && (
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {assignment.course.code}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">
                        Class: {assignment.class?.name ?? "-"}
                      </span>
                      <span className="text-xs text-gray-400">
                        Teacher:{" "}
                        {assignment.teacher
                          ? `${assignment.teacher.name} ${assignment.teacher.lastname}`
                          : "-"}
                      </span>
                      {assignment.schoolYear && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FiCalendar className="text-[10px]" />
                          {assignment.schoolYear.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(assignment.assignmentId)}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                  aria-label={`Delete assignment`}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
