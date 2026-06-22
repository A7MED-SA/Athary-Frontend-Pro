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
    api.get<ApiResponse<ProfileDto>>('/profiles').then((r) => r.data),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<ApiResponse<ProfileDto>>('/profiles', data).then((r) => r.data),

  addPhone: (data: CreatePhoneRequest) =>
    api.post<ApiResponse<PhoneDto>>('/profiles/phones', data).then((r) => r.data),

  setDefaultPhone: (phoneId: string) =>
    api.put<ApiResponse>(`/profiles/phones/${phoneId}/default-phone`).then((r) => r.data),

  deletePhone: (phoneId: string) =>
    api.delete<ApiResponse>(`/profiles/phones/${phoneId}`).then((r) => r.data),

  addAddress: (data: CreateAddressRequest) =>
    api
      .post<ApiResponse<AddressDto>>('/profiles/addresses', data)
      .then((r) => r.data),

  setDefaultAddress: (addressId: string) =>
    api
      .put<ApiResponse>(`/profiles/addresses/${addressId}/default-address`)
      .then((r) => r.data),

  deleteAddress: (addressId: string) =>
    api
      .delete<ApiResponse>(`/profiles/addresses/${addressId}`)
      .then((r) => r.data),

  getPublicProfile: (slug: string) =>
    api
      .get<ApiResponse<PublicProfileDto>>(`/profiles/public/${slug}`)
      .then((r) => r.data),

  getPublicProfileById: (id: string) =>
    api
      .get<ApiResponse<PublicProfileDto>>(`/profiles/public/id/${id}`)
      .then((r) => r.data),
};
