import { FiCalendar, FiClock, FiMapPin, FiTrash2 } from "react-icons/fi";
import type { DayOfWeek, Schedule } from "../_types";

const DAY_ORDER: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const DAY_LABEL: Record<DayOfWeek, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
};

const DAY_SHORT: Record<DayOfWeek, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
};

interface Props {
  schedules: Schedule[];
  loading: boolean;
  onDelete: (id: number) => void;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  return `${h}:${m}`;
}

export function ScheduleList({ schedules, loading, onDelete }: Props) {
  const grouped = DAY_ORDER.map((day) => ({
    day,
    items: schedules
      .filter((s) => s.dayOfWeek === day)
      .sort(
        (a, b) =>
          timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
      ),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden text-gray-900 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          Weekly timetable
        </h3>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
          {schedules.length} total
        </span>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading timetable...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
              <FiCalendar className="text-2xl text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                No schedule yet
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Add your first class slot to build the timetable.
              </p>
            </div>
          </div>
        ) : (
          grouped.map(({ day, items }) => (
            <div
              key={day}
              className="border border-gray-100 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                    {DAY_SHORT[day]}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {DAY_LABEL[day]}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {items.length} period{items.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((schedule) => (
                  <div
                    key={schedule.scheduleId}
                    className="p-4 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center justify-center bg-gray-900 text-white rounded-xl w-12 shrink-0 py-2">
                          <FiClock className="text-xs mb-1" />
                          <span className="text-[10px] font-bold leading-none">
                            {formatTime(schedule.startTime)}
                          </span>
                          <span className="text-[8px] opacity-70 leading-none my-0.5">
                            —
                          </span>
                          <span className="text-[10px] font-bold leading-none">
                            {formatTime(schedule.endTime)}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {schedule.assignment?.course?.name ?? "Course"}
                            </h4>
                            {schedule.assignment?.course && (
                              <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {schedule.assignment.course.code}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-400">
                              Class:{" "}
                              {schedule.assignment?.class?.name ?? "-"}
                            </span>
                            <span className="text-xs text-gray-400">
                              Teacher:{" "}
                              {schedule.assignment?.teacher
                                ? `${schedule.assignment.teacher.name} ${schedule.assignment.teacher.lastname}`
                                : "-"}
                            </span>
                          </div>
                          {schedule.classroom && (
                            <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                              <FiMapPin className="text-[10px]" />{" "}
                              {schedule.classroom}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDelete(schedule.scheduleId)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                        aria-label={`Delete schedule`}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
