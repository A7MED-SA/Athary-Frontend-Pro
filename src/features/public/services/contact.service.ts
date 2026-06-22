import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';

export interface ContactMessageDto {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export const contactService = {
  sendContactMessage: (data: ContactMessageDto) =>
    api.post<ApiResponse>('/contact', data).then((r) => r.data),
};
