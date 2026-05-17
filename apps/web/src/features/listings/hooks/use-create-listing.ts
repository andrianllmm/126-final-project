'use client';

import { useState, useCallback } from 'react';
import { Listing, CreateListingInput } from '../types/listing';
import { createListing } from '../lib/mock-db';

interface UseCreateListingReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  createListing: (input: CreateListingInput) => Promise<Listing>;
}

export function useCreateListing(): UseCreateListingReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateListing = useCallback(
    async (input: CreateListingInput): Promise<Listing> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const newListing = createListing(input);
        setSuccess(true);
        return newListing;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to create listing';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    success,
    createListing: handleCreateListing,
  };
}
