import { axiosInstance, API_ENDPOINTS, apiMiddleware, mockDelay, API_CONFIG } from '../api.config';
import { SUPPORT_FAQS, SUPPORT_CONTACT_INFO } from '@/mockData/support';

export const getSupportTickets = async () => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return {
      success: true,
      tickets: [
        { id: '1', subject: 'Login Issue', status: 'Open', createdAt: '2025-01-15' },
        { id: '2', subject: 'Profile Update', status: 'Resolved', createdAt: '2025-01-14' },
      ],
      faqs: SUPPORT_FAQS,
      contactInfo: SUPPORT_CONTACT_INFO,
    };
  }
  return apiMiddleware(() => axiosInstance.get(API_ENDPOINTS.support.tickets));
};

export const createSupportTicket = async (data: any) => {
  if (API_CONFIG.MOCK_MODE) {
    await mockDelay();
    return {
      success: true,
      ticket: {
        id: 'ticket_' + Date.now(),
        ...data,
        status: 'Open',
        createdAt: new Date().toISOString(),
      },
    };
  }
  return apiMiddleware(() => axiosInstance.post(API_ENDPOINTS.support.create, data));
};
