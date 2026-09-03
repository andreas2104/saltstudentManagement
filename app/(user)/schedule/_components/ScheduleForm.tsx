"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiCalendar,
  FiClock,
  FiLoader,
  FiMapPin,
  FiPlus,
  FiTag,
} from "react-icons/fi";
import * as z from "zod";
import { useSchoolYear } from "@/app/context/SchoolYearContext";
import type { Assignment } from "../../assignment/_types";
import type { DayOfWeek } from "../_types";

const schema = z
  .object({
    dayOfWeek: z.string().min(1, "Day is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    classroom: z.string().optional(),
    assignmentId: z.string().min(1, "Assignment is required"),
    schoolYearId: z.string().min(1, "School year is required"),
  })
  .refine((d) => d.endTime > d.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

type FormValues = z.infer<typeof schema>;

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
];

interface Props {
  onSubmit: (data: {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    classroom?: string;
    assignmentId: number;
    schoolYearId: number;
  }) => Promise<void>;
  onError: (msg: string) => void;
}

export function ScheduleForm({ onSubmit, onError }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const { schoolYears, selectedSchoolYearId } = useSchoolYear();

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await fetch("/api/assignment");
        if (res.ok) setAssignments(await res.json());
      } catch (err) {
        console.error("Failed to load assignments:", err);
      } finally {
        setAssignmentsLoading(false);
      }
    }
    fetchAssignments();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      schoolYearId: selectedSchoolYearId
        ? String(selectedSchoolYearId)
        : "",
    },
  });

  const handleFormSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await onSubmit({
        dayOfWeek: data.dayOfWeek as DayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        classroom: data.classroom || undefined,
        assignmentId: Number(data.assignmentId),
        schoolYearId: Number(data.schoolYearId),
      });
      reset({
        schoolYearId: selectedSchoolYearId
          ? String(selectedSchoolYearId)
          : "",
      });
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sticky top-12 bg-white border border-gray-200 p-8 rounded-2xl shadow-sm text-gray-900">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-gray-900 rounded-xl">
          <FiPlus className="text-white text-lg" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">New schedule</h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="assignmentId"
            className="text-sm font-medium text-gray-600 flex items-center gap-2"
          >
            <FiTag className="text-gray-400" /> Assignment
          </label>
          <select
            id="assignmentId"
            {...register("assignmentId")}
            className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
          >
            <option value="">Select an assignment</option>
            {assignmentsLoading ? (
              <option disabled>Loading assignments...</option>
            ) : (
              assignments.map((assignment) => (
                <option
                  key={assignment.assignmentId}
                  value={String(assignment.assignmentId)}
                >
                  {assignment.course?.name ?? "Course"} —{" "}
                  {assignment.class?.name ?? "Class"} (
                  {assignment.teacher
                    ? `${assignment.teacher.name} ${assignment.teacher.lastname}`
                    : "Teacher"})
                </option>
              ))
            )}
          </select>
          {errors.assignmentId && (
            <p className="text-red-500 text-xs">
              {errors.assignmentId.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="schoolYearId"
            className="text-sm font-medium text-gray-600 flex items-center gap-2"
          >
            <FiTag className="text-gray-400" /> School Year
          </label>
          <select
            id="schoolYearId"
            {...register("schoolYearId")}
            className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
          >
            <option value="">Select a school year</option>
            {schoolYears.map((sy) => (
              <option key={sy.schoolYearId} value={String(sy.schoolYearId)}>
                {sy.label} ({sy.status})
              </option>
            ))}
          </select>
          {errors.schoolYearId && (
            <p className="text-red-500 text-xs">
              {errors.schoolYearId.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="dayOfWeek"
            className="text-sm font-medium text-gray-600 flex items-center gap-2"
          >
            <FiCalendar className="text-gray-400" /> Day
          </label>
          <select
            id="dayOfWeek"
            {...register("dayOfWeek")}
            className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
          >
            <option value="">Select a day</option>
            {DAYS.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
          {errors.dayOfWeek && (
            <p className="text-red-500 text-xs">
              {errors.dayOfWeek.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="startTime"
              className="text-sm font-medium text-gray-600 flex items-center gap-2"
            >
              <FiClock className="text-gray-400" /> Start
            </label>
            <input
              id="startTime"
              type="time"
              {...register("startTime")}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
            />
            {errors.startTime && (
              <p className="text-red-500 text-xs">
                {errors.startTime.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="endTime"
              className="text-sm font-medium text-gray-600 flex items-center gap-2"
            >
              <FiClock className="text-gray-400" /> End
            </label>
            <input
              id="endTime"
              type="time"
              {...register("endTime")}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
            />
            {errors.endTime && (
              <p className="text-red-500 text-xs">{errors.endTime.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="classroom"
            className="text-sm font-medium text-gray-600 flex items-center gap-2"
          >
            <FiMapPin className="text-gray-400" /> Classroom (optional)
          </label>
          <input
            id="classroom"
            {...register("classroom")}
            placeholder="e.g. Room 12"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <FiLoader className="animate-spin" /> Creating...
            </>
          ) : (
            "Create schedule"
          )}
        </button>
      </form>
    </div>
  );
}
