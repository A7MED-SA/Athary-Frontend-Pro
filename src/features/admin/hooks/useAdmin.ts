import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService, type CreateCouponRequest } from '../services/admin.service';
import { courseAdminService } from '../services/courseAdmin.service';
import { queryKeys } from '@/lib/query-keys';

export function useAdminCoupons() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.admin.coupons(),
    queryFn: () => adminService.getCoupons(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCouponRequest) => adminService.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.coupons() });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.coupons() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.coupons() });
    },
  });

  return {
    coupons: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutate,
    isCreatePending: createMutation.isPending,
    toggle: toggleMutation.mutate,
    deleteCoupon: deleteMutation.mutate,
    refetch: query.refetch,
  };
}

export function useAdminPaymentMethods() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.admin.paymentMethods(),
    queryFn: () => adminService.getPaymentMethods(),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminService.togglePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.paymentMethods() });
    },
  });

  return {
    methods: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    toggle: toggleMutation.mutate,
    refetch: query.refetch,
  };
}

export function useAdminRefunds() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.admin.refunds(),
    queryFn: () => adminService.getRefunds(),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveRefund(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.refunds() });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectRefund(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.refunds() });
    },
  });

  return {
    refunds: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,
    refetch: query.refetch,
  };
}

export function useAdminInstructorRequests() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.admin.instructorRequests(),
    queryFn: () => adminService.getInstructorRequests(),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveInstructorRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.instructorRequests() });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectInstructorRequest(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.instructorRequests() });
    },
  });

  return {
    requests: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,
    refetch: query.refetch,
  };
}

export function useAdminUsers() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.admin.users(),
    queryFn: () => adminService.getUsers(),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleUserActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
    },
  });

  return {
    users: query.data?.data?.items,
    totalCount: query.data?.data?.totalCount,
    isLoading: query.isLoading,
    error: query.error,
    toggleActive: toggleActiveMutation.mutate,
    refetch: query.refetch,
  };
}

export function useInstructorRequestDetails(id: string | null) {
  return useQuery({
    queryKey: [...queryKeys.admin.instructorRequests(), 'detail', id],
    queryFn: () => adminService.getInstructorRequestDetails(id!),
    enabled: !!id,
  });
}

export function useAdminPendingCourses() {
  return useQuery({
    queryKey: queryKeys.admin.pendingCourses(),
    queryFn: () => Promise.resolve({ items: [], totalCount: 0 }),
  });
}

export function useAdminCourseActions() {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (id: string) => courseAdminService.approveCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pendingCourses() });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      courseAdminService.rejectCourse(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pendingCourses() });
    },
  });

  return {
    approve: approveMutation.mutate,
    isApprovePending: approveMutation.isPending,
    reject: rejectMutation.mutate,
    isRejectPending: rejectMutation.isPending,
  };
}
