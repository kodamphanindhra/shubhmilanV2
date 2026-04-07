import { axiosInstance, API_ENDPOINTS, apiMiddleware, mockDelay, API_CONFIG } from '../api.config';
import { mockProfiles } from '@/mockData/profiles';

// Create profile (multipart/form-data)
export const createProfile = async (data: any) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return {
      success: true,
      profile: {
        id: 'profile_' + Date.now(),
        ...data,
        verified: false,
        createdAt: new Date().toISOString(),
      },
    };
  }
  // Convert data to FormData for file upload
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, typeof v === 'string' || v instanceof Blob ? v : JSON.stringify(v)));
    } else if (key === 'mediaFiles' && value) {
      (Array.isArray(value) ? value : [value]).forEach((file) => formData.append('mediaFiles', file));
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, typeof value === 'string' || value instanceof Blob ? value : JSON.stringify(value));
    }
  });
  return apiMiddleware(() => axiosInstance.post(API_ENDPOINTS.profile.create, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }));
};

export const updateProfile = async (id: string, data: any) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return {
      success: true,
      profile: { id, ...data, updatedAt: new Date().toISOString() },
    };
  }
  return apiMiddleware(() => axiosInstance.put(API_ENDPOINTS.profile.update(id), data));
};

export const getProfile = async (id: string, fields?: string) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return mockProfiles.find(p => p.id === id) || null;
  }
  const params = fields ? { params: { fields } } : undefined;
  return apiMiddleware(() => axiosInstance.get(API_ENDPOINTS.profile.get(id), params));
};

export const listProfiles = async (filters?: any) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    let filtered = [...mockProfiles];
    if (filters?.gender) {
      filtered = filtered.filter(p => p.gender === filters.gender);
    }
    if (filters?.religion) {
      filtered = filtered.filter(p => p.religion === filters.religion);
    }
    if (filters?.verified !== undefined) {
      filtered = filtered.filter(p => p.verified === filters.verified);
    }
    return {
      success: true,
      profiles: filtered,
      total: filtered.length,
    };
  }
  return apiMiddleware(() => axiosInstance.get(API_ENDPOINTS.profile.list, { params: filters }));
};

// Delete profile (soft delete)
export const deleteProfile = async (id: string) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return { success: true };
  }
  return apiMiddleware(() => axiosInstance.delete(API_ENDPOINTS.profile.delete(id)));
};

// Match profile
export const matchProfile = async (id: string, filters?: any) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return [];
  }
  return apiMiddleware(() => axiosInstance.get(API_ENDPOINTS.profile.match(id), { params: filters }));
};
