"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import SchoolYearSelector from "../components/SchoolYearSelector";
import Loading from "../components/ui/Loading";
import { UserProvider, useUser } from "../context/userContext";

interface NavItem {
  href: string;
  label: string;
}

const NAVIGATION_ROUTES: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/schoolYear", label: "School Year" },
  { href: "/users", label: "Users" },
];

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-1 p-4">
      {NAVIGATION_ROUTES.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
              active
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <span>{item.label}</span>
            {active && (
              <div className="ml-auto relative flex h-2 w-2">
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="absolute top-[-2px] -right[2px] -block h-4 w-4 bg-blue-600 rounded-full animate-ping"/>
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-gray-200 shadow-md z-30">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-gray-300">
        <span className="text-2xl">🎟️</span>
        <span className="font-bold text-lg text-red-800">StudentManagement</span>
      </div>
      <NavLinks />
    </aside>
  );
}

function MobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Close menu overlay"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClose();
          }
        }}
        className={`lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-gray-200 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-300">
          <span className="font-bold text-gray-800 text-lg">🎟️ SMGM</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-300 text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        <NavLinks onClose={onClose} />
      </aside>
    </>
  );
}

function Header({
  onToggleMenu,
  isOpen,
}: {
  onToggleMenu: () => void;
  isOpen: boolean;
}) {
  const isMounted = useIsMounted();
  const { userFormat, isLoading, logout } = useUser();

  if (!isMounted) return null;

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 bg-gray-200 shadow-md flex items-center justify-between px-4 lg:pl-68">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <span
            className={`block w-5 h-0.5 bg-gray-700 rounded transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-700 rounded my-1 transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-700 rounded transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">🎟️</span>
          <span className="font-bold text-red-500">SMGM</span>
        </Link>
      </div>

      <div className="hidden lg:block" />

      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <SchoolYearSelector />
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loading size={20} message="" />
          ) : (
            userFormat && (
              <span className="hidden sm:block text-sm text-gray-600 font-medium truncate max-w-[140px]">
                {userFormat.name ?? userFormat.email}
              </span>
            )
          )}
          <button
            type="button"
            onClick={logout}
            className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-3 py-1.5 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-300">
        <Sidebar />
        <MobileDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <Header
          onToggleMenu={() => setIsMobileMenuOpen((v) => !v)}
          isOpen={isMobileMenuOpen}
        />
        <main className="pt-16 lg:ml-64 px-1 py-6">
          <div className="bg-gray-200 text-black min-h-[calc(100vh-8rem)] p-5">
            {children}
          </div>
        </main>
      </div>
    </UserProvider>
  );
}
