import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  SubmitInstructorRequestDto,
  InstructorRequestResponseDto,
} from '@/types/api/instructorRequest';

export const instructorRequestService = {
  submit: (data: SubmitInstructorRequestDto) =>
    api
      .post<ApiResponse<InstructorRequestResponseDto>>('/instructor-requests', data)
      .then((r) => r.data),

  getStatus: () =>
    api
      .get<ApiResponse<InstructorRequestResponseDto>>('/instructor-requests/status')
      .then((r) => r.data),
};
