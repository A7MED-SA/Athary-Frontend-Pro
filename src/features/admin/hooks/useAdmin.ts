import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService, type CreateCouponRequest } from '../services/admin.service';
import { queryKeys } from '@/lib/query-keys';

export function useAdminCoupons() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: () => adminService.getCoupons(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCouponRequest) => adminService.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
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
    queryKey: ['admin', 'paymentMethods'],
    queryFn: () => adminService.getPaymentMethods(),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminService.togglePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'paymentMethods'] });
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
    queryKey: ['admin', 'refunds'],
    queryFn: () => adminService.getRefunds(),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveRefund(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'refunds'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectRefund(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'refunds'] });
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
    queryKey: ['admin', 'instructorRequests'],
    queryFn: () => adminService.getInstructorRequests(),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveInstructorRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'instructorRequests'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectInstructorRequest(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'instructorRequests'] });
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
    queryKey: ['admin', 'users'],
    queryFn: () => adminService.getUsers(),
  });

  const toggleBlockMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleUserBlock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  return {
    users: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    toggleBlock: toggleBlockMutation.mutate,
    refetch: query.refetch,
  };
}
