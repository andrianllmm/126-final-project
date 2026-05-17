'use client';

import { useState, useCallback, useEffect } from 'react';
import { Listing } from '../types/listing';
import {
  getAllListings,
  getListingById,
  getListingsByStatus,
  searchListings,
  getListingsByCategory,
} from '../lib/mock-db';

interface UseListingDetailReturn {
  listings: Listing[];
  loading: boolean;
  error: string | null;

  // Query functions
  getAllListings: () => Listing[];
  getListingById: (id: string) => Listing | undefined;
  getListingsByStatus: (status: Listing['status']) => Listing[];
  searchListings: (query: string) => Listing[];
  getListingsByCategory: (category: string) => Listing[];

  // Refresh
  refetch: () => void;
}

export function useListingDetail(): UseListingDetailReturn {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refetch();
  }, []);

  const refetch = useCallback(() => {
    try {
      setLoading(true);
      const allListings = getAllListings();
      setListings(allListings);
      setError(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to fetch listings';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    listings,
    loading,
    error,
    getAllListings,
    getListingById,
    getListingsByStatus,
    searchListings,
    getListingsByCategory,
    refetch,
  };
}
