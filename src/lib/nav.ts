import { LayoutDashboard, Stethoscope, Users, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const primaryNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/patients", label: "Patients", icon: Users },
];

export function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function crumbsFor(pathname: string) {
  if (pathname === "/dashboard") {
    return [{ href: "/dashboard", label: "Dashboard" }];
  }

  const crumbs = [{ href: "/dashboard", label: "Dashboard" }];
  const segments = pathname.split("/").filter(Boolean);
  let href = "";

  for (const segment of segments) {
    href += `/${segment}`;
    const match = primaryNav.find((item) => item.href === href);
    crumbs.push({ href, label: match?.label ?? labelForSegment(segment) });
  }

  return crumbs;
}

function labelForSegment(segment: string) {
  const text = decodeURIComponent(segment).replaceAll("-", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
