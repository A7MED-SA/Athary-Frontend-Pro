import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { instructorRequestService } from '../services/instructorRequest.service';
import type { SubmitInstructorRequestDto } from '@/types/api/instructorRequest';

export function useInstructorRequest() {
  const queryClient = useQueryClient();

  const myRequestsQuery = useQuery({
    queryKey: ['instructor-request', 'my-requests'],
    queryFn: () => instructorRequestService.getMyRequests(),
  });

  const canSubmitQuery = useQuery({
    queryKey: ['instructor-request', 'can-submit'],
    queryFn: () => instructorRequestService.canSubmit(),
  });

  const submitMutation = useMutation({
    mutationFn: (data: SubmitInstructorRequestDto) =>
      instructorRequestService.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-request', 'my-requests'] });
      queryClient.invalidateQueries({ queryKey: ['instructor-request', 'can-submit'] });
    },
  });

  const requests = myRequestsQuery.data?.data ?? [];
  const latestRequest = requests.length > 0 ? requests[0] : null;
  const canSubmit = canSubmitQuery.data?.data ?? true;

  return {
    requests,
    latestRequest,
    canSubmit,
    isLoading: myRequestsQuery.isLoading || canSubmitQuery.isLoading,
    submit: submitMutation.mutate,
    isSubmitPending: submitMutation.isPending,
    error: submitMutation.error,
  };
}
