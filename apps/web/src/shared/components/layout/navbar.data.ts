export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const navItems: NavSection[] = [
  {
    title: 'Browse',
    items: [
      {
        label: 'All Listings',
        href: '/search',
        description: 'Find items',
      },
      {
        label: 'Categories',
        href: '/search?sort=category',
        description: 'Browse by item type',
      },
    ],
  },
  {
    title: 'Sell',
    items: [
      {
        label: 'Create Listing',
        href: '/listing/new',
        description: 'Post an item for sale',
      },
      {
        label: 'My Listings',
        href: '/my-listings',
        description: 'Manage your posted items',
      },
    ],
  },
];
