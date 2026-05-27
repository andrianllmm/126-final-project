'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useDeleteListing } from '@/features/listings/hooks/use-delete-listing';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

interface DeleteListingDialogProps {
  listingId: string;
  listingTitle?: string;
  onDeleted?: () => void;
  triggerLabel?: string;
}

export function DeleteListingDialog({
  listingId,
  listingTitle,
  onDeleted,
  triggerLabel = 'Delete',
}: DeleteListingDialogProps) {
  const router = useRouter();
  const deleteMutation = useDeleteListing();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(listingId);
      setOpen(false);
      toast.success('Listing deleted');

      if (onDeleted) {
        onDeleted();
        return;
      }

      router.push('/');
    } catch {
      toast.error('Failed to delete listing');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="w-full"
          onClick={(event) => event.stopPropagation()}
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete listing</DialogTitle>
          <DialogDescription>
            This will permanently delete
            {listingTitle ? ` "${listingTitle}"` : ' this listing'} and cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={deleteMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete listing'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
