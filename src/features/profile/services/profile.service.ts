import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  ProfileDto,
  PublicProfileDto,
  PhoneDto,
  AddressDto,
  UpdateProfileRequest,
  CreatePhoneRequest,
  CreateAddressRequest,
} from '@/types/api/profile';

export const profileService = {
  getProfile: () =>
    api.get<ApiResponse<ProfileDto>>('/profile/me').then((r) => r.data),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<ApiResponse<ProfileDto>>('/profile', data).then((r) => r.data),

  addPhone: (data: CreatePhoneRequest) =>
    api.post<ApiResponse<PhoneDto>>('/profile/phones', data).then((r) => r.data),

  setDefaultPhone: (phoneId: string) =>
    api.put<ApiResponse>(`/profile/phones/${phoneId}/default`).then((r) => r.data),

  deletePhone: (phoneId: string) =>
    api.delete<ApiResponse>(`/profile/phones/${phoneId}`).then((r) => r.data),

  addAddress: (data: CreateAddressRequest) =>
    api
      .post<ApiResponse<AddressDto>>('/profile/addresses', data)
      .then((r) => r.data),

  setDefaultAddress: (addressId: string) =>
    api
      .put<ApiResponse>(`/profile/addresses/${addressId}/default`)
      .then((r) => r.data),

  deleteAddress: (addressId: string) =>
    api
      .delete<ApiResponse>(`/profile/addresses/${addressId}`)
      .then((r) => r.data),

  updateAddress: (addressId: string, data: Partial<CreateAddressRequest>) =>
    api
      .put<ApiResponse<AddressDto>>(`/profile/addresses/${addressId}`, data)
      .then((r) => r.data),

  getPublicProfile: (slug: string) =>
    api
      .get<ApiResponse<PublicProfileDto>>(`/public/instructors/${slug}`)
      .then((r) => r.data),

  getPublicProfileById: (id: string) =>
    api
      .get<ApiResponse<PublicProfileDto>>(`/profile/${id}`)
      .then((r) => r.data),

  setProfilePicture: (fileId: string) =>
    api.post<ApiResponse<ProfileDto>>('/profile/picture', { fileId }).then((r) => r.data),

  deleteProfilePicture: () =>
    api.delete<ApiResponse>('/profile/picture').then((r) => r.data),
};
