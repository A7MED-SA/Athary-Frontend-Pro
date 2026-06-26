export type InstructorRequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'RequiresMoreInfo';

export type DocumentType = 'CV' | 'Certificate' | 'IDCard' | 'Degree' | 'PortfolioLink' | 'Transcript' | 'Other';

export interface InstructorRequestDocumentDto {
  documentType: DocumentType;
  fileId?: string;
  urlValue?: string;
}

export interface InstructorRequestDto {
  id: string;
  userName: string;
  userEmail: string;
  status: InstructorRequestStatus;
  message?: string;
  submittedAt: string;
  processedAt?: string;
  processedByUserName?: string;
  documentsCount: number;
}

export interface SubmitInstructorRequestDto {
  message: string;
  documents: InstructorRequestDocumentDto[];
}

export interface InstructorRequestDetailDto extends InstructorRequestDto {
  documents?: InstructorRequestDocumentDto[];
}
