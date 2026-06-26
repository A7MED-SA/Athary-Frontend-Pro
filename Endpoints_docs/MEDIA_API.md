# Athary Platform — Media API Documentation

> **Base URL:** `http://<host>:5000`  
> **Response Envelope:** All responses wrapped in `ApiResponse<T>`

```jsonc
{
  "success": true,        // bool
  "data": null,           // T | null  — actual payload
  "message": null,        // string | null  — status message
  "errorCode": null,      // string | null  — machine-readable error code (only on failure)
  "errors": null          // string[] | null  — validation/error details
}
```

---

## Table of Contents

1. [Error Codes](#1-error-codes)
2. [Media Endpoints](#2-media-endpoints)
3. [Admin Media Endpoints](#3-admin-media-endpoints)
4. [DTO Reference](#4-dto-reference)
5. [Enums Reference](#5-enums-reference)
6. [Endpoint Summary Table](#6-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| **Media** | | |
| `MEDIA_FILE_NOT_FOUND` | 404 | File not found |
| `FILE_NOT_IN_UPLOADING_STATE` | 400 | File not in Uploading state |
| `FILE_NOT_IN_STORAGE` | 400 | File not found in storage provider |
| `STORAGE_METADATA_FAILED` | 500 | Failed to store metadata |
| `FILE_NOT_READY_FOR_VIEWING` | 400 | File not ready for viewing |
| `FILE_ACCESS_DENIED` | 403 | User doesn't have access to file |
| `INVALID_FILE_NAME` | 400 | Invalid file name |
| `UNSUPPORTED_FILE_TYPE` | 400 | Unsupported file type |
| `EXTENSION_NOT_ALLOWED` | 400 | File extension not allowed |
| `CONTENT_TYPE_MISMATCH` | 400 | Content type doesn't match file type |
| `INVALID_OBJECT_KEY` | 400 | Invalid object key |
| `VIDEO_ALREADY_PROCESSED` | 400 | Video already processed |
| **Category** | | |
| `FILE_MUST_BE_IMAGE` | 400 | File must be an image |
| `FILE_NOT_READY` | 400 | File not in Ready status |

---

## 2. Media Endpoints

### 2.1 `POST /api/media/upload-url`

**Auth:** Required

**Request Body:**
```jsonc
{
  "fileType": "Image",              // required, StoredFileType enum
  "fileName": "profile.jpg",        // required, string
  "contentType": "image/jpeg",      // required, string
  "fileSizeBytes": 1048576,         // required, long
  "visibility": "Private",          // optional, defaults Private (Public | EnrolledOnly | Private)
  "relatedEntityId": null,          // optional, Guid?
  "relatedEntityType": null         // optional, string?
}
```

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Validate file name, extension, and content type
3. Generate pre-signed upload URL from storage provider
4. Create `StoredFile` record in `Uploading` status
5. Return upload URL with required headers

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "fileId": "guid",
    "uploadUrl": "https://storage.example.com/upload?...",
    "objectKey": "uploads/uuid-filename.jpg",
    "bucket": "athary-media",
    "expiresAt": "2026-06-26T12:00:00Z",
    "requiredHeaders": {
      "x-amz-acl": "private",
      "Content-Type": "image/jpeg"
    }
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid file name / unsupported type / extension not allowed / content type mismatch |
| 401 | Missing/invalid JWT |

---

### 2.2 `POST /api/media/confirm-upload`

**Auth:** Required

**Request Body:**
```jsonc
{
  "fileId": "guid",             // required, the file ID from upload-url
  "objectKey": "uploads/...",   // required, the object key returned
  "bucket": "athary-media"      // required, the bucket name
}
```

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Verify file exists, belongs to user, and is in `Uploading` state
3. Verify file exists in storage provider
4. Update status to `Ready`, record storage metadata
5. Set `FileStatus.Ready`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "originalName": "profile.jpg",
    "filePath": "uploads/uuid-filename.jpg",
    "bucket": "athary-media",
    "fileType": "Image",
    "visibility": "Private",
    "status": "Ready",
    "mimeType": "image/jpeg",
    "sizeBytes": 1048576,
    "uploadedAt": "2026-06-26T10:00:00Z",
    "uploadedBy": "guid",
    "uploaderName": "John Doe"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | File not in Uploading state / file not in storage |
| 401 | Missing/invalid JWT |
| 403 | File does not belong to user |
| 404 | File not found |
| 500 | Storage metadata failed |

---

### 2.3 `GET /api/media/{fileId:guid}/view-url`

**Auth:** Anonymous (with optional `userId` query param)

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `userId` | Guid | No | User ID for permission checks |

**Business Logic:**
1. Validate file exists and is in `Ready` state
2. Check file visibility + user roles to determine access
3. Generate pre-signed view URL (time-limited)
4. Return URL with content type and size metadata

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "fileId": "guid",
    "viewUrl": "https://storage.example.com/view/...",
    "expiresAt": "2026-06-26T12:05:00Z",
    "contentType": "image/jpeg",
    "sizeBytes": 1048576
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | File not ready for viewing |
| 403 | File access denied |
| 404 | File not found |

---

## 3. Admin Media Endpoints

All admin media endpoints require `Admin` role.

### 3.1 `GET /api/admin/media`

**Auth:** Admin

**Query Parameters (MediaFilterDto):**
| Param | Type | Required | Description |
|---|---|---|---|
| `fileType` | StoredFileType | No | Filter by file type |
| `bucket` | string | No | Filter by bucket |
| `visibility` | FileVisibility | No | Filter by visibility |
| `uploadedBy` | Guid | No | Filter by uploader |
| `fromDate` | DateTime | No | Start date filter |
| `toDate` | DateTime | No | End date filter |
| `status` | FileStatus | No | Filter by status |
| `includeDeleted` | bool | No | Include soft-deleted files |
| `page` | int | No | Page number (default 1) |
| `pageSize` | int | No | Page size (default 20) |
| `searchTerm` | string | No | Search by file name |

**Business Logic:**
1. Return paginated, filterable list of all media files

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "items": [ /* MediaFileDto[] */ ],
    "page": 1,
    "pageSize": 20,
    "totalCount": 100,
    "totalPages": 5,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 3.2 `GET /api/admin/media/{fileId:guid}`

**Auth:** Admin

**Business Logic:**
1. Return detailed file info including related entities (video, document, course)

**Success Response — `200 OK`:** Returns `MediaDetailDto`.

**Errors:**
| Code | Condition |
|---|---|
| 404 | File not found |

---

### 3.3 `DELETE /api/admin/media/{fileId:guid}/soft`

**Auth:** Admin

**Business Logic:**
1. Soft-delete the file (sets `DeletedAt`)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "File soft deleted"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | File not found |

---

### 3.4 `POST /api/admin/media/{fileId:guid}/restore`

**Auth:** Admin

**Business Logic:**
1. Restore a soft-deleted file (clears `DeletedAt`)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "File restored"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | File not found |

---

### 3.5 `DELETE /api/admin/media/{fileId:guid}`

**Auth:** Admin

**Business Logic:**
1. Permanently delete file from database and storage

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "File permanently deleted"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | File not found |

---

### 3.6 `GET /api/admin/media/stats`

**Auth:** Admin

**Business Logic:**
1. Return aggregate storage statistics

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "totalFilesCount": 15000,
    "totalSizeBytes": 107374182400,
    "bucketStats": {
      "athary-media": { "filesCount": 10000, "sizeBytes": 85899345920 },
      "athary-certificates": { "filesCount": 5000, "sizeBytes": 21474836480 }
    },
    "fileTypeCounts": {
      "Image": 8000,
      "Video": 3000,
      "Document": 4000
    }
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

## 4. DTO Reference

### 4.1 Request DTOs

| DTO | Fields |
|---|---|
| **UploadUrlRequestDto** | `fileType`\*, `fileName`\*, `contentType`\*, `fileSizeBytes`\*, `visibility?`, `relatedEntityId?`, `relatedEntityType?` |
| **ConfirmUploadDto** | `fileId`\*, `objectKey`\*, `bucket`\* |
| **MediaFilterDto** | `fileType?`, `bucket?`, `visibility?`, `uploadedBy?`, `fromDate?`, `toDate?`, `status?`, `includeDeleted`, `page`, `pageSize`, `searchTerm?` |

### 4.2 Response DTOs

| DTO | Fields |
|---|---|
| **UploadUrlResponseDto** | `fileId`, `uploadUrl`, `objectKey`, `bucket`, `expiresAt`, `requiredHeaders` |
| **ViewUrlResponseDto** | `fileId`, `viewUrl`, `expiresAt`, `contentType`, `sizeBytes` |
| **MediaFileDto** | `id`, `originalName`, `filePath`, `bucket`, `fileType`, `visibility`, `status`, `mimeType?`, `sizeBytes`, `uploadedAt`, `uploadedBy`, `uploaderName?` |
| **MediaDetailDto** (extends MediaFileDto) | + `deletedAt?`, `storageProvider?`, `video?`, `document?`, `course?` |
| **RelatedVideoDto** | `id`, `title`, `status`, `durationSeconds`, `sectionId?`, `sectionTitle?`, `courseId?`, `courseTitle?` |
| **RelatedDocumentDto** | `id`, `title`, `sectionId?`, `sectionTitle?`, `courseId?`, `courseTitle?` |
| **RelatedCourseDto** | `id`, `title`, `usageType?` |
| **StorageStatsDto** | `totalFilesCount`, `totalSizeBytes`, `bucketStats`, `fileTypeCounts` |
| **BucketStats** | `filesCount`, `sizeBytes` |

---

## 5. Enums Reference

### StoredFileType
| Value | Description |
|---|---|
| `Image` | Image files (jpg, png, etc.) |
| `Video` | Video files (mp4, etc.) |
| `Document` | Document files (pdf, doc, etc.) |
| `Recording` | Recording files |
| `Certificate` | Certificate PDF/images |

### FileVisibility
| Value | Description |
|---|---|
| `Public` | Accessible by anyone |
| `EnrolledOnly` | Accessible only by enrolled students |
| `Private` | Accessible only by owner |

### FileStatus
| Value | Description |
|---|---|
| `Uploading` | File being uploaded (pre-signed URL generated) |
| `Ready` | Upload confirmed, file is available |
| `Failed` | Upload or processing failed |
| `Deleted` | Soft-deleted |

### VideoStatus
| Value | Description |
|---|---|
| `Processing` | Video is being transcoded |
| `Ready` | Video is ready for streaming |
| `Failed` | Processing failed |

---

## 6. Endpoint Summary Table

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/media/upload-url` | Required | Generate pre-signed upload URL |
| `POST` | `/api/media/confirm-upload` | Required | Confirm upload completed |
| `GET` | `/api/media/{fileId:guid}/view-url` | Anonymous | Get pre-signed view URL |
| `GET` | `/api/admin/media` | Admin | List all media (paginated, filterable) |
| `GET` | `/api/admin/media/{fileId:guid}` | Admin | Get media details |
| `DELETE` | `/api/admin/media/{fileId:guid}/soft` | Admin | Soft-delete file |
| `POST` | `/api/admin/media/{fileId:guid}/restore` | Admin | Restore soft-deleted file |
| `DELETE` | `/api/admin/media/{fileId:guid}` | Admin | Permanently delete file |
| `GET` | `/api/admin/media/stats` | Admin | Storage statistics |
