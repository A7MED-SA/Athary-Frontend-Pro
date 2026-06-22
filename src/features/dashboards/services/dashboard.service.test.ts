import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dashboardService } from './dashboard.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('dashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStudentOverview', () => {
    it('should fetch student overview', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: { enrolledCoursesCount: 5, completedCoursesCount: 2, inProgressCoursesCount: 3, certificatesCount: 2, totalWatchTimeMinutes: 500, recentEnrollments: [] } },
      });

      const result = await dashboardService.getStudentOverview();

      expect(mockedApi.get).toHaveBeenCalledWith('/dashboards/student/overview');
      expect(result.data.enrolledCoursesCount).toBe(5);
    });
  });

  describe('getAdminOverview', () => {
    it('should fetch admin overview', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: { totalUsers: 100, totalInstructors: 10, totalStudents: 90, totalCourses: 20, pendingApprovals: 5, totalRevenue: 10000, monthlyRevenue: 2000, newUsersThisMonth: 15 } },
      });

      const result = await dashboardService.getAdminOverview();

      expect(mockedApi.get).toHaveBeenCalledWith('/dashboards/admin/overview');
      expect(result.data.totalUsers).toBe(100);
    });
  });
});
