import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useDashboard } from './useDashboard';
import { dashboardService } from '@/features/dashboards/services/dashboard.service';

vi.mock('@/features/dashboards/services/dashboard.service', () => ({
  dashboardService: {
    getStudentOverview: vi.fn(),
    getInstructorOverview: vi.fn(),
    getAdminOverview: vi.fn(),
  },
}));

const mockedDashboardService = vi.mocked(dashboardService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedDashboardService.getStudentOverview.mockReturnValue(new Promise(() => {}));
    mockedDashboardService.getInstructorOverview.mockReturnValue(new Promise(() => {}));
    mockedDashboardService.getAdminOverview.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    expect(result.current.isStudentLoading).toBe(true);
    expect(result.current.isInstructorLoading).toBe(true);
    expect(result.current.isAdminLoading).toBe(true);
    expect(result.current.studentOverview).toBeUndefined();
  });

  it('should fetch student overview successfully', async () => {
    const mockOverview = { enrolledCourses: 5, completedCourses: 2 };
    mockedDashboardService.getStudentOverview.mockResolvedValue({ success: true, data: mockOverview } as any);
    mockedDashboardService.getInstructorOverview.mockResolvedValue({ success: true, data: {} } as any);
    mockedDashboardService.getAdminOverview.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isStudentLoading).toBe(false));
    expect(result.current.studentOverview).toEqual(mockOverview);
  });

  it('should fetch instructor overview successfully', async () => {
    const mockOverview = { totalCourses: 10, totalStudents: 100 };
    mockedDashboardService.getStudentOverview.mockResolvedValue({ success: true, data: {} } as any);
    mockedDashboardService.getInstructorOverview.mockResolvedValue({ success: true, data: mockOverview } as any);
    mockedDashboardService.getAdminOverview.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isInstructorLoading).toBe(false));
    expect(result.current.instructorOverview).toEqual(mockOverview);
  });

  it('should fetch admin overview successfully', async () => {
    const mockOverview = { totalUsers: 1000, totalCourses: 50 };
    mockedDashboardService.getStudentOverview.mockResolvedValue({ success: true, data: {} } as any);
    mockedDashboardService.getInstructorOverview.mockResolvedValue({ success: true, data: {} } as any);
    mockedDashboardService.getAdminOverview.mockResolvedValue({ success: true, data: mockOverview } as any);

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isAdminLoading).toBe(false));
    expect(result.current.adminOverview).toEqual(mockOverview);
  });
});
