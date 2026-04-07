import { axiosInstance, API_ENDPOINTS, apiMiddleware, mockDelay, API_CONFIG } from '../api.config';
import { MOCK_SUPER_ADMIN_USERS } from '@/mockData/superAdmin';
import { MOCK_USER_PROFILE } from '@/mockData/settings';

export const registerSuperadmin = async (userData: any) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return {
      success: true,
      token: 'mock_superadmin_token_' + Date.now(),
      user: {
        id: 'sa_' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'SuperAdmin',
        moduleAccess: ['dashboard', 'profiles_view', 'profiles_add', 'profiles_edit', 'profiles_delete', 'match_profiles', 'verification', 'reports', 'settings', 'user_management'],
      },
    };
  }
  return apiMiddleware(() => axiosInstance.post(API_ENDPOINTS.auth.registerSuperadmin, userData));
};

export const loginSuperadmin = async (credentials: { email: string; password: string }) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return {
      success: true,
      token: 'mock_superadmin_token_' + Date.now(),
      user: MOCK_SUPER_ADMIN_USERS.find(u => u.role === 'SuperAdmin') || MOCK_SUPER_ADMIN_USERS[0],
    };
  }
  return apiMiddleware(() => axiosInstance.post(API_ENDPOINTS.auth.loginSuperadmin, credentials));
};

export interface LoginUserResponse {
  token?: string;
  user?: any;
  message?: string;
  [key: string]: any;
}

export const loginUser = async (credentials: { phone: string; password: string }): Promise<LoginUserResponse> => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return {
      token: 'mock_user_token_' + Date.now(),
      user: MOCK_USER_PROFILE,
    };
  }
  return apiMiddleware(() => axiosInstance.post(API_ENDPOINTS.auth.loginUser, credentials));
};

