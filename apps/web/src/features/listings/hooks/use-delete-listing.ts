'use client';

import { useState, useCallback } from 'react';
import { deleteListing } from '../lib/mock-db';

interface UseDeleteListingReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  deleteListing: (id: string) => Promise<boolean>;
}

export function useDeleteListing(): UseDeleteListingReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDeleteListing = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = deleteListing(id);
        if (result) {
          setSuccess(true);
        }
        return result;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to delete listing';
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
    deleteListing: handleDeleteListing,
  };
}
