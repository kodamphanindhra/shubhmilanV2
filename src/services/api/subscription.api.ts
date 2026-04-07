import { axiosInstance, API_ENDPOINTS, apiMiddleware, mockDelay, API_CONFIG } from '../api.config';
import { MOCK_SUBSCRIPTION_PLANS } from '@/mockData/settings';

export const getSubscriptions = async () => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return {
      success: true,
      plans: MOCK_SUBSCRIPTION_PLANS,
    };
  }
  return apiMiddleware(() => axiosInstance.get(API_ENDPOINTS.subscription.list));
};

export const assignSubscription = async (userId: string, data: any) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return {
      success: true,
      subscription: {
        userId,
        ...data,
        assignedAt: new Date().toISOString(),
      },
    };
  }
  return apiMiddleware(() => axiosInstance.post(API_ENDPOINTS.subscription.assign, { userId, ...data }));
};
