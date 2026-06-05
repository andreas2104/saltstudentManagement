"use client";

import { useEffect, useRef, useState } from "react";
import { FiCalendar, FiCheck, FiChevronDown } from "react-icons/fi";
import { useSchoolYear } from "../context/SchoolYearContext";

export default function SchoolYearSelector() {
  const {
    schoolYears,
    selectedSchoolYearId,
    setSelectedSchoolYearId,
    selectedSchoolYear,
  } = useSchoolYear();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (schoolYears.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all active:scale-95 text-gray-700"
      >
        <FiCalendar className="text-blue-500" />
        <span className="font-semibold text-sm">
          {selectedSchoolYear?.label || "Select Year"}
        </span>
        <FiChevronDown
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-56 bg-white border border-gray-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 max-h-64 overflow-y-auto">
            {schoolYears.map((year) => (
              <button
                type="button"
                key={year.schoolYearId}
                onClick={() => {
                  setSelectedSchoolYearId(year.schoolYearId);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors rounded-lg mb-1 last:mb-0 ${
                  selectedSchoolYearId === year.schoolYearId
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-bold">{year.label}</span>
                  <span className="text-[10px] opacity-70">
                    {new Date(year.startDate).getFullYear()} -{" "}
                    {new Date(year.endDate).getFullYear()}
                  </span>
                </div>
                {selectedSchoolYearId === year.schoolYearId && (
                  <FiCheck className="text-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
