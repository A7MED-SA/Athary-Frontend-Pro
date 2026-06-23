import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/features/dashboards/services/dashboard.service';
import { queryKeys } from '@/lib/query-keys';

export function useDashboard() {
  const studentOverviewQuery = useQuery({
    queryKey: queryKeys.dashboards.studentOverview(),
    queryFn: () => dashboardService.getStudentOverview(),
  });

  const instructorOverviewQuery = useQuery({
    queryKey: queryKeys.dashboards.instructorOverview(),
    queryFn: () => dashboardService.getInstructorOverview(),
  });

  const adminOverviewQuery = useQuery({
    queryKey: queryKeys.dashboards.adminOverview(),
    queryFn: () => dashboardService.getAdminOverview(),
  });

  return {
    studentOverview: studentOverviewQuery.data?.data,
    instructorOverview: instructorOverviewQuery.data?.data,
    adminOverview: adminOverviewQuery.data?.data,
    isStudentLoading: studentOverviewQuery.isLoading,
    isInstructorLoading: instructorOverviewQuery.isLoading,
    isAdminLoading: adminOverviewQuery.isLoading,
    isStudentError: studentOverviewQuery.isError,
    isInstructorError: instructorOverviewQuery.isError,
    isAdminError: adminOverviewQuery.isError,
    refetchStudent: studentOverviewQuery.refetch,
    refetchInstructor: instructorOverviewQuery.refetch,
    refetchAdmin: adminOverviewQuery.refetch,
  };
}
