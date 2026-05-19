import { apiClient } from '@/shared/lib/api-client';
import type { SetPasswordInput } from '@repo/api';

type SetPasswordResponse = {
  status: boolean;
};

export const setUserPassword = (input: SetPasswordInput) =>
  apiClient.post<SetPasswordResponse, SetPasswordInput>(
    '/auth/set-password',
    input,
  );
