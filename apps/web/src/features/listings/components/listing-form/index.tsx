'use client';

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/shared/components/ui/stepper';
import { CheckIcon, LoaderCircleIcon } from 'lucide-react';
import { ListingDetailsForm } from '@/features/listings/components/listing-form/listing-details-form';
import { SellerTipsCard } from '@/features/listings/components/listing-form/seller-tips-card';
import { NeedHelpCard } from '@/features/listings/components/listing-form/need-help-card';
import { useCategories } from '@/features/listings/hooks/use-categories';
import { PhotoUploadForm } from './photo-upload-form';
import { PhotoGuidelines } from './image-guide-card';
import { ListingFormStepShell } from './listing-form-step-shell';
import { ListingReviewStep } from './listing-review-step';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateListing } from '../../hooks/use-create-listing';
import {
  useAddListingImages,
  useRemoveListingImage,
} from '../../hooks/use-listing-images';
import { useUpdateListing } from '../../hooks/use-update-listing';
import type { ListingFormHandle } from './listing-details-form';
import type { ListingFormValues, CreateListingInput } from '@repo/api';
import type { UploadedPhoto } from './photo-upload-types';
import { ListingCondition } from '@repo/api';
import { autofillListingFormFromImage } from '../../actions/autofill-listing-form';

const steps = [{ title: 'Photos' }, { title: 'Details' }, { title: 'Review' }];
const listingFormDraftStoragePrefix = 'listing-form-draft';

type ListingFormDraftPhoto = Pick<
  UploadedPhoto,
  'id' | 'preview' | 'existingImageId' | 'isMain'
>;

type ListingFormDraft = {
  currentStep: number;
  formData: ListingFormValues;
  photos: ListingFormDraftPhoto[];
  originalImageIds: string[];
};

function getListingFormDraftStorageKey(
  mode: 'create' | 'edit',
  listingId?: string,
) {
  return `${listingFormDraftStoragePrefix}:${mode}:${listingId ?? 'new'}`;
}

function serializeListingPhoto(photo: UploadedPhoto): ListingFormDraftPhoto {
  return {
    id: photo.id,
    preview: photo.preview,
    existingImageId: photo.existingImageId,
    isMain: photo.isMain,
  };
}

async function restoreListingPhoto(
  photo: ListingFormDraftPhoto,
): Promise<UploadedPhoto> {
  if (photo.existingImageId || !photo.preview.startsWith('data:')) {
    return photo;
  }

  try {
    const response = await fetch(photo.preview);
    const blob = await response.blob();
    const extension = blob.type.split('/')[1] || 'png';

    return {
      ...photo,
      file: new File([blob], `${photo.id}.${extension}`, { type: blob.type }),
    };
  } catch {
    return photo;
  }
}

interface ListingStepperProps {
  mode?: 'create' | 'edit';
  listingId?: string;
  initialData?: ListingFormValues;
  initialPhotos?: UploadedPhoto[];
}

export function ListingForm({
  mode = 'create',
  listingId,
  initialData,
  initialPhotos,
}: ListingStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { data: categories } = useCategories();

  const createListingMutation = useCreateListing();
  const updateListingMutation = useUpdateListing();
  const addImagesMutation = useAddListingImages();
  const removeListingImageMutation = useRemoveListingImage();

  const isSubmitting =
    createListingMutation.isPending ||
    updateListingMutation.isPending ||
    addImagesMutation.isPending ||
    removeListingImageMutation.isPending;

  const [publishError, setPublishError] = useState<string | null>(null);
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [validatingDetails, setValidatingDetails] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const listingFormRef = useRef<ListingFormHandle>(null);
  const hasRestoredDraftRef = useRef(false);
  const [isDraftHydrated, setIsDraftHydrated] = useState(false);
  const draftStorageKey = getListingFormDraftStorageKey(mode, listingId);

  const [formData, setFormData] = useState<ListingFormValues>(
    initialData ?? {
      title: '',
      categoryId: '',
      price: 0,
      description: '',
      condition: '',
    },
  );
  const [photos, setPhotos] = useState<UploadedPhoto[]>(initialPhotos ?? []);
  const [originalImageIds, setOriginalImageIds] = useState<string[]>([]);

  const categoryName = categories?.find(
    (category) => category.id === formData.categoryId,
  )?.categoryName;

  useEffect(() => {
    let isCancelled = false;

    const restoreDraft = async () => {
      if (typeof window === 'undefined') {
        return;
      }

      const savedDraft = window.localStorage.getItem(draftStorageKey);

      if (!savedDraft) {
        if (!isCancelled) {
          setIsDraftHydrated(true);
        }

        return;
      }

      try {
        const parsedDraft = JSON.parse(savedDraft) as ListingFormDraft;
        const restoredPhotos = await Promise.all(
          (parsedDraft.photos ?? []).map((photo) => restoreListingPhoto(photo)),
        );

        if (isCancelled) {
          return;
        }

        hasRestoredDraftRef.current = true;
        setCurrentStep(parsedDraft.currentStep ?? 1);
        setFormData(parsedDraft.formData);
        setPhotos(restoredPhotos);
        setOriginalImageIds(parsedDraft.originalImageIds ?? []);
      } catch {
        window.localStorage.removeItem(draftStorageKey);
      } finally {
        if (!isCancelled) {
          setIsDraftHydrated(true);
        }
      }
    };

    void restoreDraft();

    return () => {
      isCancelled = true;
    };
  }, [draftStorageKey]);

  useEffect(() => {
    if (hasRestoredDraftRef.current || !initialData) {
      return;
    }

    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (hasRestoredDraftRef.current) {
      return;
    }

    setPhotos(initialPhotos ?? []);
    setOriginalImageIds(
      (initialPhotos ?? [])
        .filter((photo) => Boolean(photo.existingImageId))
        .map((photo) => photo.existingImageId as string),
    );
  }, [initialPhotos]);

  useEffect(() => {
    if (!isDraftHydrated || typeof window === 'undefined') {
      return;
    }

    const draft: ListingFormDraft = {
      currentStep,
      formData,
      photos: photos.map(serializeListingPhoto),
      originalImageIds,
    };

    window.localStorage.setItem(draftStorageKey, JSON.stringify(draft));
  }, [
    draftStorageKey,
    formData,
    currentStep,
    isDraftHydrated,
    originalImageIds,
    photos,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleNextFromPhotos = async () => {
    setAnalyzingPhoto(true);
    setPhotoError(null);
    try {
      if (photos.length === 0) {
        setPhotoError('Please upload at least one photo before proceeding.');
        return;
      }

      if (mode === 'create' && photos[0]) {
        const autofillValues = await autofillListingFormFromImage({
          mainImage: photos[0].preview,
          categories: categories ?? [],
        });

        if (autofillValues) {
          setFormData((current) => ({
            ...current,
            ...autofillValues,
          }));
        }
      }

      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } finally {
      setAnalyzingPhoto(false);
    }
  };

  const handleNextFromDetails = async () => {
    setValidatingDetails(true);
    try {
      const isValid = await listingFormRef.current?.triggerValidation();
      if (!isValid) return;

      const latestValues = listingFormRef.current?.getValues();
      if (latestValues) {
        setFormData(latestValues);
      }

      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } finally {
      setValidatingDetails(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      void handleNextFromPhotos();
    } else if (currentStep === 2) {
      void handleNextFromDetails();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const handlePublish = async () => {
    try {
      setPublishError(null);

      const latestValues = listingFormRef.current?.getValues();
      const currentFormData = latestValues ?? formData;

      const listingPayload: CreateListingInput = {
        title: currentFormData.title,
        categoryId: currentFormData.categoryId,
        condition: currentFormData.condition || ListingCondition.GOOD,
        price: currentFormData.price || 0,
        description: currentFormData.description,
      };

      const listing =
        mode === 'edit' && listingId
          ? await updateListingMutation.mutateAsync({
              id: listingId,
              input: listingPayload,
            })
          : await createListingMutation.mutateAsync(listingPayload);

      if (mode === 'edit' && listingId && originalImageIds.length > 0) {
        const keptExistingIds = photos
          .filter((photo) => Boolean(photo.existingImageId))
          .map((photo) => photo.existingImageId as string);

        const removedImageIds = originalImageIds.filter(
          (id) => !keptExistingIds.includes(id),
        );

        if (removedImageIds.length > 0) {
          await Promise.all(
            removedImageIds.map((imageId) =>
              removeListingImageMutation.mutateAsync({ listingId, imageId }),
            ),
          );
        }
      }

      const newFiles = photos
        .filter((photo) => photo.file)
        .map((photo) => photo.file as File);

      if (newFiles.length > 0) {
        await addImagesMutation.mutateAsync({
          listingId: listing.id,
          files: newFiles,
        });
      }

      window.localStorage.removeItem(draftStorageKey);
      router.push(`/listings/${listing.id}`);
    } catch (err) {
      setPublishError(
        err instanceof Error
          ? err.message
          : mode === 'edit'
            ? 'Failed to save listing changes.'
            : 'Failed to publish listing.',
      );
    }
  };

  return (
    <Stepper
      value={currentStep}
      indicators={{
        completed: <CheckIcon className="size-3.5" />,
        loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
      }}
      className="w-full space-y-8"
    >
      <div className="flex justify-center">
        <StepperNav className="max-w-md w-full">
          {steps.map((step, index) => (
            <StepperItem key={index} step={index + 1} className="relative">
              <StepperTrigger className="flex justify-start gap-1.5">
                <StepperIndicator>{index + 1}</StepperIndicator>
                <StepperTitle>{step.title}</StepperTitle>
              </StepperTrigger>

              {steps.length > index + 1 && (
                <StepperSeparator className="group-data-[state=completed]/step:bg-primary md:mx-2.5" />
              )}
            </StepperItem>
          ))}
        </StepperNav>
      </div>

      <StepperPanel>
        <StepperContent value={1}>
          <ListingFormStepShell
            onBack={handleBack}
            onNext={handleNext}
            nextLabel="Continue"
            busyLabel="Analyzing..."
            nextDisabled={analyzingPhoto}
            aside={
              <>
                <PhotoGuidelines />
              </>
            }
          >
            <PhotoUploadForm photos={photos} onChange={setPhotos} />
            {photoError && (
              <div className="my-4 rounded-md border border-destructive/20 bg-destructive/10 p-3">
                <p className="text-sm font-medium text-destructive">
                  {photoError}
                </p>
              </div>
            )}
          </ListingFormStepShell>
        </StepperContent>

        <StepperContent value={2}>
          <ListingFormStepShell
            onBack={handleBack}
            onNext={handleNext}
            nextLabel="Review"
            busyLabel="Validating..."
            nextDisabled={validatingDetails}
            aside={
              <>
                <SellerTipsCard />
                <NeedHelpCard />
              </>
            }
          >
            <ListingDetailsForm
              ref={listingFormRef}
              title={mode === 'edit' ? 'Edit Listing Details' : undefined}
              initialData={formData}
            />
          </ListingFormStepShell>
        </StepperContent>

        <StepperContent value={3}>
          <ListingReviewStep
            formData={formData}
            photos={photos}
            categoryName={categoryName}
            publishError={publishError}
            isSubmitting={isSubmitting}
            mode={mode}
            onBack={handleBack}
            onPublish={handlePublish}
          />
        </StepperContent>
      </StepperPanel>
    </Stepper>
  );
}
