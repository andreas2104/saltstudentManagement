import {
  FiAlertCircle,
  FiBook,
  FiCheckCircle,
  FiEdit3,
  FiLayers,
  FiTrash2,
} from "react-icons/fi";
import type { Course } from "../_types";

interface Props {
  course: Course;
  onToggleStatus: (id: number, currentStatus: "ACTIVE" | "INACTIVE") => void;
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
}

export function CourseItem({
  course,
  onToggleStatus,
  onEdit,
  onDelete,
}: Props) {
  const isActive = course.statusCourse === "ACTIVE";

  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        isActive
          ? "bg-white border-gray-100 hover:border-gray-200"
          : "bg-gray-50 border-gray-900/10"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4 text-gray-900">
          <div
            className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${
              isActive ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
            }`}
          >
            <FiBook className="text-lg" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold text-gray-900">
                {course.name}
              </h4>
              <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                {course.code}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-gray-400">
                Coefficient: <strong>{course.coefficient}</strong>
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                  isActive
                    ? "text-green-700 bg-green-50 border-green-100"
                    : "text-gray-600 bg-gray-50 border-gray-100"
                }`}
              >
                {isActive ? (
                  <>
                    <FiCheckCircle className="text-[10px]" /> Active
                  </>
                ) : (
                  <>
                    <FiAlertCircle className="text-[10px]" /> Inactive
                  </>
                )}
              </span>
            </div>

            {/* Associated Classes */}
            {course.classes && course.classes.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <FiLayers className="text-gray-400 text-xs shrink-0" />
                <span className="text-xs text-gray-400 mr-1">Classes:</span>
                {course.classes.map((cls) => (
                  <span
                    key={cls.classId}
                    className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full"
                  >
                    {cls.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            type="button"
            onClick={() => onToggleStatus(course.courseId, course.statusCourse)}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            onClick={() => onEdit(course)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all"
            aria-label={`Edit ${course.name}`}
          >
            <FiEdit3 />
          </button>
          <button
            type="button"
            onClick={() => onDelete(course.courseId)}
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
            aria-label={`Delete ${course.name}`}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
