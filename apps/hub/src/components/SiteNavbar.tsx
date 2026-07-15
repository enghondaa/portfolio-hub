"use client";

import { usePathname } from "next/navigation";
import { Navbar, ThemeToggle, type NavLink } from "@portfolio/ui";

export function SiteNavbar({ brand, links }: { brand: string; links: NavLink[] }) {
  const pathname = usePathname();
  return <Navbar brand={brand} links={links} activeHref={pathname} actions={<ThemeToggle />} />;
}
