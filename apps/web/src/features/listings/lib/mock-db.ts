import {
  Listing,
  CreateListingInput,
  UpdateListingInput,
} from '../types/listing';

// Mock database stored in memory
const listings: Map<string, Listing> = new Map();

// Initialize with dummy data
const initializeMockDB = () => {
  if (listings.size > 0) return; // Already initialized

  const dummyListings: Listing[] = [
    {
      id: 'listing-1',
      productName: 'Calculus Textbook',
      category: 'books',
      price: 500,
      meetupLocation: 'Admin Building, 2nd Floor',
      description:
        'Used Calculus textbook in good condition. No annotations or damage. Perfect for CMSC courses.',
      photos: [],
      createdAt: new Date('2026-05-10'),
      updatedAt: new Date('2026-05-10'),
      status: 'published',
    },
    {
      id: 'listing-2',
      productName: 'Mini Fridge',
      category: 'electronics',
      price: 2500,
      meetupLocation: 'Library Main Entrance',
      description:
        'Compact mini fridge, works perfectly. Great for dorm rooms. Lightly used for 1 year.',
      photos: [],
      createdAt: new Date('2026-05-12'),
      updatedAt: new Date('2026-05-12'),
      status: 'published',
    },
    {
      id: 'listing-3',
      productName: 'Desk Lamp',
      category: 'furniture',
      price: 800,
      meetupLocation: 'South Campus Gate',
      description:
        'LED desk lamp with adjustable brightness. USB-powered. Very energy efficient.',
      photos: [],
      createdAt: new Date('2026-05-14'),
      updatedAt: new Date('2026-05-14'),
      status: 'draft',
    },
  ];

  dummyListings.forEach((listing) => {
    listings.set(listing.id, listing);
  });
};

// Initialize on module load
initializeMockDB();

// CRUD Operations

/**
 * Get all listings
 */
export const getAllListings = (): Listing[] => {
  return Array.from(listings.values());
};

/**
 * Get a single listing by ID
 */
export const getListingById = (id: string): Listing | undefined => {
  return listings.get(id);
};

/**
 * Get listings by status (draft, published, sold)
 */
export const getListingsByStatus = (status: Listing['status']): Listing[] => {
  return Array.from(listings.values()).filter(
    (listing) => listing.status === status,
  );
};

/**
 * Create a new listing
 */
export const createListing = (input: CreateListingInput): Listing => {
  const id = `listing-${Date.now()}`;
  const now = new Date();

  const newListing: Listing = {
    id,
    ...input,
    createdAt: now,
    updatedAt: now,
    status: 'draft',
  };

  listings.set(id, newListing);
  return newListing;
};

/**
 * Update an existing listing
 */
export const updateListing = (
  id: string,
  updates: UpdateListingInput,
): Listing | undefined => {
  const listing = listings.get(id);
  if (!listing) return undefined;

  const updatedListing: Listing = {
    ...listing,
    ...updates,
    updatedAt: new Date(),
  };

  listings.set(id, updatedListing);
  return updatedListing;
};

/**
 * Delete a listing
 */
export const deleteListing = (id: string): boolean => {
  return listings.delete(id);
};

/**
 * Publish a listing (change status from draft to published)
 */
export const publishListing = (id: string): Listing | undefined => {
  return updateListing(id, { status: 'published' });
};

/**
 * Mark a listing as sold
 */
export const markListingAsSold = (id: string): Listing | undefined => {
  return updateListing(id, { status: 'sold' });
};

/**
 * Search listings by product name or category
 */
export const searchListings = (query: string): Listing[] => {
  const lowerQuery = query.toLowerCase();
  return Array.from(listings.values()).filter(
    (listing) =>
      listing.productName.toLowerCase().includes(lowerQuery) ||
      listing.category.toLowerCase().includes(lowerQuery) ||
      listing.description.toLowerCase().includes(lowerQuery),
  );
};

/**
 * Get listings by category
 */
export const getListingsByCategory = (category: string): Listing[] => {
  return Array.from(listings.values()).filter(
    (listing) => listing.category === category,
  );
};

/**
 * Reset mock database (useful for testing)
 */
export const resetMockDB = (): void => {
  listings.clear();
  initializeMockDB();
};
