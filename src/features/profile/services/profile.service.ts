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

function toPascalCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
    result[pascalKey] = obj[key];
  }
  return result;
}

export const profileService = {
  getProfile: () =>
    api.get<ApiResponse<ProfileDto>>('/profile/me').then((r) => r.data),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<ApiResponse<ProfileDto>>('/profile', toPascalCase(data as unknown as Record<string, unknown>)).then((r) => r.data),

  addPhone: (data: CreatePhoneRequest) => {
    const body = toPascalCase(data as unknown as Record<string, unknown>);
    console.log('[ProfileService] addPhone request:', body);
    return api.post<ApiResponse<PhoneDto>>('/profile/phones', body).then((r) => r.data);
  },

  setDefaultPhone: (phoneId: string) =>
    api.put<ApiResponse>(`/profile/phones/${phoneId}/default`).then((r) => r.data),

  deletePhone: (phoneId: string) =>
    api.delete<ApiResponse>(`/profile/phones/${phoneId}`).then((r) => r.data),

  addAddress: (data: CreateAddressRequest) =>
    api
      .post<ApiResponse<AddressDto>>('/profile/addresses', toPascalCase(data as unknown as Record<string, unknown>))
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
      .put<ApiResponse<AddressDto>>(`/profile/addresses/${addressId}`, toPascalCase(data as unknown as Record<string, unknown>))
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
    api.post<ApiResponse<ProfileDto>>('/profile/picture', { FileId: fileId }).then((r) => r.data),

  deleteProfilePicture: () =>
    api.delete<ApiResponse>('/profile/picture').then((r) => r.data),
};
