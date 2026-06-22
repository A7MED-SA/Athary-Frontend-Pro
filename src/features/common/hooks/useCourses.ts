import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/features/courses/services/course.service';
import { publicService } from '@/features/public/services/public.service';
import { queryKeys } from '@/lib/query-keys';
import type { PublicCourseFilterDto, CreateCourseRequestDto, UpdateCourseRequestDto } from '@/types/api/course';

export function useCourses(filters?: PublicCourseFilterDto) {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: queryKeys.courses.list(filters),
    queryFn: () => publicService.getCourses(filters),
  });

  const adminCoursesQuery = useQuery({
    queryKey: queryKeys.courses.list(),
    queryFn: () => courseService.getAdminCourses(),
  });

  const instructorCoursesQuery = useQuery({
    queryKey: ['courses', 'instructor'],
    queryFn: () => courseService.getInstructorCourses(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCourseRequestDto) => courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequestDto }) =>
      courseService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => courseService.publishCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => courseService.archiveCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  });

  return {
    courses: listQuery.data?.data,
    adminCourses: adminCoursesQuery.data?.data,
    instructorCourses: instructorCoursesQuery.data?.data,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    create: createMutation.mutate,
    isCreatePending: createMutation.isPending,
    update: updateMutation.mutate,
    isUpdatePending: updateMutation.isPending,
    publish: publishMutation.mutate,
    archive: archiveMutation.mutate,
    deleteCourse: deleteMutation.mutate,
  };
}

export function useCourseDetail(id: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => publicService.getCourseDetail(id),
  });

  const relatedQuery = useQuery({
    queryKey: queryKeys.courses.related(id),
    queryFn: () => publicService.getRelatedCourses(id),
  });

  return {
    course: query.data?.data,
    relatedCourses: relatedQuery.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    invalidate: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(id) }),
  };
}
