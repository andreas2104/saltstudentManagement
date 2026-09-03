export interface NavItem {
  href: string;
  label: string;
  children?: NavItem[];
}

export const NAVIGATION_ROUTES: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/schoolYear", label: "SchoolYear" },
  { href: "/period", label: "Period" },
  { href: "/class", label: "Class" },
  { href: "/course", label: "Course" },
  { href: "/student", label: "Student" },
  { href: "/assignment", label: "Assignment" },
  { href: "/schedule", label: "Schedule" },
  { href: "/grade", label: "Grade" },
  {
    href: "/configuration",
    label: "Configuration",
    children: [
      { href: "/users", label: "Users" },
      { href: "/settings", label: "Settings" },
    ],
  },
];
