import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { instructorRequestService } from '../services/instructorRequest.service';

export function useInstructorRequest() {
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    queryKey: ['instructor-request', 'status'],
    queryFn: () => instructorRequestService.getStatus(),
  });

  const submitMutation = useMutation({
    mutationFn: (data: { qualifications?: string; experience?: string; motivation?: string }) =>
      instructorRequestService.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-request', 'status'] });
    },
  });

  return {
    status: statusQuery.data?.data,
    isLoading: statusQuery.isLoading,
    submit: submitMutation.mutate,
    isSubmitPending: submitMutation.isPending,
    error: submitMutation.error,
  };
}
