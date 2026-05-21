"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SchoolYear {
  schoolYearId: number;
  label: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE";
}

interface SchoolYearContextType {
  schoolYears: SchoolYear[];
  selectedSchoolYearId: number | null;
  setSelectedSchoolYearId: (id: number) => void;
  selectedSchoolYear: SchoolYear | null;
  isLoading: boolean;
  refreshSchoolYears: () => Promise<void>;
}

const SchoolYearContext = createContext<SchoolYearContextType | undefined>(undefined);

export const SchoolYearProvider = ({ children }: { children: ReactNode }) => {
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [selectedSchoolYearId, setSelectedSchoolYearId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSchoolYears = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/schoolYear");
      if (res.ok) {
        const data = await res.json();
        setSchoolYears(data);
        
        // Set default selected school year to the active one
        const active = data.find((sy: SchoolYear) => sy.status === "ACTIVE");
        if (active && selectedSchoolYearId === null) {
          setSelectedSchoolYearId(active.schoolYearId);
        } else if (data.length > 0 && selectedSchoolYearId === null) {
          setSelectedSchoolYearId(data[0].schoolYearId);
        }
      }
    } catch (error) {
      console.error("Failed to fetch school years:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolYears();
  }, []);

  const selectedSchoolYear = schoolYears.find(sy => sy.schoolYearId === selectedSchoolYearId) || null;

  return (
    <SchoolYearContext.Provider
      value={{
        schoolYears,
        selectedSchoolYearId,
        setSelectedSchoolYearId,
        selectedSchoolYear,
        isLoading,
        refreshSchoolYears: fetchSchoolYears,
      }}
    >
      {children}
    </SchoolYearContext.Provider>
  );
};

export const useSchoolYear = () => {
  const context = useContext(SchoolYearContext);
  if (context === undefined) {
    throw new Error("useSchoolYear must be used within a SchoolYearProvider");
  }
  return context;
};
