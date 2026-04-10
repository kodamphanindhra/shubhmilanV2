import { axiosInstance, API_ENDPOINTS, apiMiddleware, mockDelay, API_CONFIG } from '../api.config';
import {
  MOCK_RELIGIONS,
  MOCK_CASTES,
  MOCK_STATES,
  MOCK_MOTHER_TONGUES,
  MOCK_EDUCATION_LEVELS,
  MOCK_PROFESSIONS,
} from '@/mockData/profiles';
import type { DashboardResponse } from "@/types/api";
import { mockDashboardResponse } from "@/mockData/dashboard";

export const getDashboard = async (): Promise<DashboardResponse> => {
  // if (API_CONFIG.MOCK_MODE) {
  //   await mockDelay();
  //   return mockDashboardResponse;
  // }

  const result = await apiMiddleware<DashboardResponse>(() =>
    axiosInstance.get(API_ENDPOINTS.dashboard.get)
  );

  if (
    !result ||
    (typeof result === "object" && "success" in result && result.success === false)
  ) {
    throw new Error(
      (result as { success: false; message?: string })?.message ?? "Failed to fetch dashboard"
    );
  }

  return result as DashboardResponse;
};

export const getMetaData = async () => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return {
      success: true,
      meta: {
        religions: MOCK_RELIGIONS,
        castes: MOCK_CASTES,
        states: MOCK_STATES,
        motherTongues: MOCK_MOTHER_TONGUES,
        educationLevels: MOCK_EDUCATION_LEVELS,
        professions: MOCK_PROFESSIONS,
      },
    };
  }
  return apiMiddleware(() => axiosInstance.get(API_ENDPOINTS.dashboard.meta));
};