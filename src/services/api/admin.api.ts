import { axiosInstance, API_ENDPOINTS, apiMiddleware, mockDelay, API_CONFIG } from '../api.config';
import { MOCK_SUPER_ADMIN_USERS } from '@/mockData/superAdmin';

export const getUsers = async (filters?: any) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    let filtered = [...MOCK_SUPER_ADMIN_USERS];
    
    if (filters?.role) {
      filtered = filtered.filter(u => u.role === filters.role);
    }
    if (filters?.status) {
      filtered = filtered.filter(u => u.status === filters.status);
    }
    
    return {
      success: true,
      users: filtered,
      total: filtered.length,
    };
  }
  return apiMiddleware(() => axiosInstance.get(API_ENDPOINTS.admin.users, { params: filters }));
};

export const updateAccess = async (userId: string, accessList: string[]) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return {
      success: true,
      user: {
        userId,
        moduleAccess: accessList,
        updatedAt: new Date().toISOString(),
      },
    };
  }
  return apiMiddleware(() => axiosInstance.put(API_ENDPOINTS.admin.updateAccess(userId), { accessList }));
};
