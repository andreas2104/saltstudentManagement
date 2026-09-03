import { FiUsers } from "react-icons/fi";
import type { Student } from "../_types";
import { StudentItem } from "./StudentItem";

interface Props {
  students: Student[];
  loading: boolean;
  onToggleStatus: (id: number, currentStatus: "ACTIVE" | "INACTIVE") => void;
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

export function StudentList({
  students,
  loading,
  onToggleStatus,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden text-gray-900 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Students</h3>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
          {students.length} total
        </span>
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
              <FiUsers className="text-2xl text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                No students yet
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Register your first student to get started.
              </p>
            </div>
          </div>
        ) : (
          students.map((student) => (
            <StudentItem
              key={student.studentId}
              student={student}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
