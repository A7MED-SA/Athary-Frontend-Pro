import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  SubmitInstructorRequestDto,
  InstructorRequestDto,
} from '@/types/api/instructorRequest';

export const instructorRequestService = {
  submit: (data: SubmitInstructorRequestDto) =>
    api
      .post<ApiResponse<InstructorRequestDto>>('/instructor-requests', data)
      .then((r) => r.data),

  getMyRequests: () =>
    api
      .get<ApiResponse<InstructorRequestDto[]>>('/instructor-requests/my-requests')
      .then((r) => r.data),

  canSubmit: () =>
    api
      .get<ApiResponse<boolean>>('/instructor-requests/can-submit')
      .then((r) => r.data),
};
