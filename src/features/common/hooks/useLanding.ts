import { useQuery } from '@tanstack/react-query';
import { publicService } from '@/features/auth/services/public.service';
import { queryKeys } from '@/lib/query-keys';

export function useLanding() {
  return useQuery({
    queryKey: queryKeys.landing.data(),
    queryFn: () => publicService.getLanding(),
  });
}
