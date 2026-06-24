import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/features/profile/services/profile.service';
import { queryKeys } from '@/lib/query-keys';
import type { UpdateProfileRequest, CreatePhoneRequest, CreateAddressRequest } from '@/types/api/profile';

export function useProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.profiles.current(),
    queryFn: () => profileService.getProfile(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.current() });
    },
  });

  const addPhoneMutation = useMutation({
    mutationFn: (data: CreatePhoneRequest) => profileService.addPhone(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.current() });
    },
  });

  const setDefaultPhoneMutation = useMutation({
    mutationFn: (phoneId: string) => profileService.setDefaultPhone(phoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.current() });
    },
  });

  const deletePhoneMutation = useMutation({
    mutationFn: (phoneId: string) => profileService.deletePhone(phoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.current() });
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: CreateAddressRequest) => profileService.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.current() });
    },
  });

  const setDefaultAddressMutation = useMutation({
    mutationFn: (addressId: string) => profileService.setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.current() });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId: string) => profileService.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.current() });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, data }: { addressId: string; data: Partial<CreateAddressRequest> }) =>
      profileService.updateAddress(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.current() });
    },
  });

  const setProfilePictureMutation = useMutation({
    mutationFn: (fileId: string) => profileService.setProfilePicture(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.current() });
    },
  });

  const deleteProfilePictureMutation = useMutation({
    mutationFn: () => profileService.deleteProfilePicture(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.current() });
    },
  });

  return {
    profile: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    update: updateMutation.mutate,
    isUpdatePending: updateMutation.isPending,
    addPhone: addPhoneMutation.mutate,
    setDefaultPhone: setDefaultPhoneMutation.mutate,
    deletePhone: deletePhoneMutation.mutate,
    addAddress: addAddressMutation.mutate,
    setDefaultAddress: setDefaultAddressMutation.mutate,
    deleteAddress: deleteAddressMutation.mutate,
    updateAddress: updateAddressMutation.mutate,
    setProfilePicture: setProfilePictureMutation.mutate,
    deleteProfilePicture: deleteProfilePictureMutation.mutate,
  };
}
