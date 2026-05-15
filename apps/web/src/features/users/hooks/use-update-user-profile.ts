import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '../api/users-api';
import { authClient } from '@/shared/lib/auth-client';
import type { UserProfile, UserProfileUpdateInput } from '@repo/api';

type UseUpdateUserProfileParams = {
  userId: string;
};

export function useUpdateUserProfile({ userId }: UseUpdateUserProfileParams) {
  const queryClient = useQueryClient();
  const session = authClient.useSession();

  return useMutation({
    mutationFn: (values: UserProfileUpdateInput) => updateUserProfile(values),

    onSuccess: async (updatedProfile: UserProfile) => {
      queryClient.setQueryData(['users', 'profile', userId], updatedProfile);

      session.refetch();
    },
  });
}
