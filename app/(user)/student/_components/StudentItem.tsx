import {
  FiAlertCircle,
  FiCheckCircle,
  FiEdit3,
  FiLayers,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import type { Student } from "../_types";

interface Props {
  student: Student;
  onToggleStatus: (id: number, currentStatus: "ACTIVE" | "INACTIVE") => void;
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

export function StudentItem({
  student,
  onToggleStatus,
  onEdit,
  onDelete,
}: Props) {
  const isActive = student.status === "ACTIVE";

  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        isActive
          ? "bg-white border-gray-100 hover:border-gray-200"
          : "bg-gray-50 border-gray-900/10"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-gray-900">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isActive ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
            }`}
          >
            <FiUser className="text-lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-gray-900">
                {student.firstname} {student.lastname}
              </h4>
              {student.registrationNumber && (
                <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {student.registrationNumber}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-400">
                {student.gender === "MALE" ? "Male" : "Female"}
              </span>
              {student.class && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <FiLayers className="text-[10px]" />
                  {student.class.name}
                </span>
              )}
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
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleStatus(student.studentId, student.status)}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            onClick={() => onEdit(student)}
            className="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all"
            aria-label={`Edit ${student.firstname}`}
          >
            <FiEdit3 />
          </button>
          <button
            type="button"
            onClick={() => onDelete(student.studentId)}
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
            aria-label={`Delete ${student.firstname}`}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
