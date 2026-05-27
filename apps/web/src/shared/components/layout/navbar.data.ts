export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const navItems: NavSection[] = [];
