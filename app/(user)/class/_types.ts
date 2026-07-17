import type { SchoolYear } from "../schoolYear/_types";

export interface Class {
  classId: number;
  nom: string;
  niveau: string;
  status: "ACTIVE" | "INACTIVE";
  schoolYearId: number;
  schoolYear?: SchoolYear;
  createdAt: string;
  updatedAt: string;
}
