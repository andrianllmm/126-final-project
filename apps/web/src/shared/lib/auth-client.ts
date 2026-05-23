import { createAuthClient } from 'better-auth/react';
import {
  inferAdditionalFields,
  phoneNumberClient,
} from 'better-auth/client/plugins';

type AdditionalFields = {
  phoneNumber?: string;
  avatarUploadId?: string;
};

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    fetchOptions: {
      credentials: 'include',
    },
    plugins: [inferAdditionalFields<AdditionalFields>(), phoneNumberClient()],
  },
);
