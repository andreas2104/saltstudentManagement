"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import { NAVIGATION_ROUTES, type NavItem } from "./Constants";

interface NavLinksProps {
  onClose?: () => void;
}

function NavItemLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
        isActive
          ? "bg-white text-blue-600 shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      <span>{item.label}</span>
      {isActive && (
        <div className="ml-auto relative flex h-2 w-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span className="absolute top-[-2px] -right-[2px] h-4 w-4 bg-blue-600 rounded-full animate-ping" />
        </div>
      )}
    </Link>
  );
}

export default function NavLinks({ onClose }: NavLinksProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const hasActiveChild = (item: NavItem) =>
    item.children?.some((child) => isActive(child.href)) ?? false;

  useEffect(() => {
    NAVIGATION_ROUTES.forEach((item) => {
      if (item.children && hasActiveChild(item)) {
        setExpanded((prev) => ({ ...prev, [item.href]: true }));
      }
    });
  }, [pathname]);

  const toggle = (href: string) => {
    setExpanded((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  return (
    <nav className="flex flex-col gap-1 p-4">
      {NAVIGATION_ROUTES.map((item) => {
        if (!item.children) {
          return (
            <NavItemLink
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              onClick={onClose}
            />
          );
        }

        const open = expanded[item.href] ?? false;
        const parentActive = hasActiveChild(item);

        return (
          <div key={item.href}>
            <button
              type="button"
              onClick={() => toggle(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                parentActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <FiChevronRight
                className={`shrink-0 transition-transform duration-200 ${
                  open ? "rotate-90" : ""
                }`}
              />
              <span>{item.label}</span>
            </button>
            {open && (
              <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-300 pl-2">
                {item.children.map((child) => (
                  <NavItemLink
                    key={child.href}
                    item={child}
                    isActive={isActive(child.href)}
                    onClick={onClose}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
