'use client';

import { useState, useCallback } from 'react';
import { Listing, UpdateListingInput } from '../types/listing';
import {
  updateListing,
  publishListing,
  markListingAsSold,
} from '../lib/mock-db';

interface UseUpdateListingReturn {
  loading: boolean;
  error: string | null;
  success: boolean;

  updateListing: (
    id: string,
    updates: UpdateListingInput,
  ) => Promise<Listing | undefined>;
  publishListing: (id: string) => Promise<Listing | undefined>;
  markListingAsSold: (id: string) => Promise<Listing | undefined>;
}

export function useUpdateListing(): UseUpdateListingReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdateListing = useCallback(
    async (
      id: string,
      updates: UpdateListingInput,
    ): Promise<Listing | undefined> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const updated = updateListing(id, updates);
        if (updated) {
          setSuccess(true);
        }
        return updated;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to update listing';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handlePublishListing = useCallback(
    async (id: string): Promise<Listing | undefined> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = publishListing(id);
        if (result) {
          setSuccess(true);
        }
        return result;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to publish listing';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleMarkListingAsSold = useCallback(
    async (id: string): Promise<Listing | undefined> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = markListingAsSold(id);
        if (result) {
          setSuccess(true);
        }
        return result;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to mark listing as sold';
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
    updateListing: handleUpdateListing,
    publishListing: handlePublishListing,
    markListingAsSold: handleMarkListingAsSold,
  };
}
