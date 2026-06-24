import type { Gender } from './auth';

export type PhoneType = 'Primary' | 'Secondary';

export interface PhoneDto {
  id: string;
  phoneNumber: string;
  type: PhoneType;
  isVerified: boolean;
  isDefault: boolean;
}

export interface AddressDto {
  id: string;
  type: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  stateProvince?: string;
  postalCode: string;
  country: string;
  contactPhone?: string;
  isDefault: boolean;
}

export interface ProfileDto {
  id: string;
  fullName: string;
  email: string;
  bio?: string;
  gender?: Gender;
  dateOfBirth?: string;
  nationality?: string;
  profileImageUrl?: string;
  createdAt: string;
  phones: PhoneDto[];
  addresses: AddressDto[];
}

export interface PublicProfileDto {
  id: string;
  fullName?: string;
  slug?: string;
  bio?: string;
  nationality?: string;
  profileImageUrl?: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  gender?: Gender;
  dateOfBirth?: string;
  nationality?: string;
}

export interface CreatePhoneRequest {
  phoneNumber: string;
  type: PhoneType;
  isDefault?: boolean;
}

export interface CreateAddressRequest {
  type: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  stateProvince?: string;
  postalCode: string;
  country: string;
  contactPhone?: string;
  isDefault?: boolean;
}
