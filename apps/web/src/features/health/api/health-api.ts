import { apiClient } from '@/shared/lib/api-client';

export type HealthResponse = {
  status: string;
  info: {
    app: {
      status: string;
      timestamp: string;
    };
  };
};

export const getHealth = () => apiClient.get<HealthResponse>('/health');
