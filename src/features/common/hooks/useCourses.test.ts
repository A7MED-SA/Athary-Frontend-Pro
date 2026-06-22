import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCourses, useCourseDetail } from './useCourses';
import { courseService } from '@/features/courses/services/course.service';
import { publicService } from '@/features/public/services/public.service';

vi.mock('@/features/courses/services/course.service', () => ({
  courseService: {
    getAdminCourses: vi.fn(),
    getInstructorCourses: vi.fn(),
    createCourse: vi.fn(),
    updateCourse: vi.fn(),
    publishCourse: vi.fn(),
    archiveCourse: vi.fn(),
    deleteCourse: vi.fn(),
  },
}));

vi.mock('@/features/public/services/public.service', () => ({
  publicService: {
    getCourses: vi.fn(),
    getCourseDetail: vi.fn(),
    getRelatedCourses: vi.fn(),
  },
}));

const mockedCourseService = vi.mocked(courseService);
const mockedPublicService = vi.mocked(publicService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useCourses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedPublicService.getCourses.mockReturnValue(new Promise(() => {}));
    mockedCourseService.getAdminCourses.mockReturnValue(new Promise(() => {}));
    mockedCourseService.getInstructorCourses.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useCourses(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.courses).toBeUndefined();
  });

  it('should fetch courses successfully', async () => {
    const mockCourses = { data: [{ id: '1', title: 'Test Course' }], totalCount: 1 };
    mockedPublicService.getCourses.mockResolvedValue({ success: true, data: mockCourses } as any);
    mockedCourseService.getAdminCourses.mockResolvedValue({ success: true, data: { data: [] } } as any);
    mockedCourseService.getInstructorCourses.mockResolvedValue({ success: true, data: { data: [] } } as any);

    const { result } = renderHook(() => useCourses(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.courses).toEqual(mockCourses);
  });

  it('should call create mutation and invalidate cache', async () => {
    mockedPublicService.getCourses.mockResolvedValue({ success: true, data: { data: [] } } as any);
    mockedCourseService.getAdminCourses.mockResolvedValue({ success: true, data: { data: [] } } as any);
    mockedCourseService.getInstructorCourses.mockResolvedValue({ success: true, data: { data: [] } } as any);
    mockedCourseService.createCourse.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useCourses(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.create({ title: 'New Course' } as any);

    await waitFor(() => expect(mockedCourseService.createCourse).toHaveBeenCalledWith({ title: 'New Course' }));
  });

  it('should call update mutation', async () => {
    mockedPublicService.getCourses.mockResolvedValue({ success: true, data: { data: [] } } as any);
    mockedCourseService.getAdminCourses.mockResolvedValue({ success: true, data: { data: [] } } as any);
    mockedCourseService.getInstructorCourses.mockResolvedValue({ success: true, data: { data: [] } } as any);
    mockedCourseService.updateCourse.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useCourses(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.update({ id: '1', data: { title: 'Updated' } as any });

    await waitFor(() => expect(mockedCourseService.updateCourse).toHaveBeenCalledWith('1', { title: 'Updated' }));
  });

  it('should call delete mutation', async () => {
    mockedPublicService.getCourses.mockResolvedValue({ success: true, data: { data: [] } } as any);
    mockedCourseService.getAdminCourses.mockResolvedValue({ success: true, data: { data: [] } } as any);
    mockedCourseService.getInstructorCourses.mockResolvedValue({ success: true, data: { data: [] } } as any);
    mockedCourseService.deleteCourse.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useCourses(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.deleteCourse('1');

    await waitFor(() => expect(mockedCourseService.deleteCourse).toHaveBeenCalledWith('1'));
  });
});

describe('useCourseDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch course detail', async () => {
    const mockCourse = { id: '1', title: 'Test Course' };
    mockedPublicService.getCourseDetail.mockResolvedValue({ success: true, data: mockCourse } as any);
    mockedPublicService.getRelatedCourses.mockResolvedValue({ success: true, data: [] } as any);

    const { result } = renderHook(() => useCourseDetail('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.course).toEqual(mockCourse);
  });
});
