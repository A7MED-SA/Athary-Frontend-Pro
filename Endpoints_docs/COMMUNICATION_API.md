# Athary Platform — Communication API Documentation

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
2. [Announcements Endpoints](#2-announcements-endpoints)
3. [Messages Endpoints](#3-messages-endpoints)
4. [Reports Endpoints](#4-reports-endpoints)
5. [Activity Logs Endpoints](#5-activity-logs-endpoints)
6. [System Settings Endpoints](#6-system-settings-endpoints)
7. [DTO Reference](#7-dto-reference)
8. [Endpoint Summary Table](#8-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| **Announcement** | | |
| `ANNOUNCEMENT_PERMISSION_DENIED` | 403 | Not authorized to modify this announcement |
| `ANNOUNCEMENT_NOT_FOUND` | 404 | Announcement not found |
| `INVALID_TARGET_AUDIENCE` | 400 | Invalid target audience value |
| `COURSE_ID_REQUIRED` | 400 | Course ID required for SpecificCourse target |
| **Message** | | |
| `CANNOT_MESSAGE_SELF` | 400 | Cannot send message to self |
| `INVALID_MESSAGE_LENGTH` | 400 | Message content exceeds length limit |
| `MESSAGE_RELATIONSHIP_INVALID` | 400 | Cannot message (no valid relationship) |
| `MESSAGE_NOT_FOUND` | 404 | Message not found |
| **Report** | | |
| `INVALID_REPORT_ENTITY_TYPE` | 400 | Invalid entity type for reporting |
| `INVALID_REPORT_REASON` | 400 | Invalid report reason |
| `REPORT_NOT_FOUND` | 404 | Report not found |
| `INVALID_REPORT_STATUS` | 400 | Invalid report status value |
| **Settings** | | |
| `SETTING_NOT_FOUND` | 404 | Setting not found |
| `SETTING_ALREADY_EXISTS` | 400 | Setting key already exists |
| `INVALID_SETTING_DATA_TYPE` | 400 | Invalid data type |
| `INVALID_SETTING_VALUE` | 400 | Invalid value for data type |
| **Contact** | | |
| `CONTACT_MESSAGE_NOT_FOUND` | 404 | Contact message not found |
| `SPAM_CONTENT_DETECTED` | 400 | Spam content detected |

---

## 2. Announcements Endpoints

### 2.1 `POST /api/announcements`

**Auth:** Required

**Request Body:**
```jsonc
{
  "title": "Course Update",                    // required, string
  "content": "New lectures added...",          // required, string
  "target": "All",                             // optional, default "All" (All | Students | Instructors | SpecificCourse)
  "courseId": null                             // optional, Guid? (required when target == "SpecificCourse")
}
```

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Create announcement with specified target audience
3. Auto-set `IsActive = true`, `PublishedAt = UtcNow`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "title": "Course Update",
    "content": "New lectures added...",
    "target": "All",
    "courseId": null,
    "createdBy": "guid",
    "createdByName": "Admin User",
    "isActive": true,
    "publishedAt": "2026-06-26T10:00:00Z"
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid target / course ID required for SpecificCourse |
| 401 | Missing/invalid JWT |

---

### 2.2 `POST /api/announcements/course/{courseId}`

**Auth:** Required

**Business Logic:**
1. Wraps the create call with `Target = "SpecificCourse"` and sets `CourseId`
2. Same validation as generic create

**Request Body:** Same as `POST /api/announcements`.

**Success Response — `200 OK`:** Returns `AnnouncementResponse`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid input |
| 401 | Missing/invalid JWT |

---

### 2.3 `GET /api/announcements`

**Auth:** Required

**Query Parameters:**
| Param | Type | Required | Default |
|---|---|---|---|
| `page` | int | No | 1 |
| `pageSize` | int | No | 20 |

**Business Logic:**
1. Get personalized announcement feed for the current user based on their role/courses

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "items": [ /* AnnouncementResponse[] */ ],
    "page": 1,
    "pageSize": 20,
    "totalCount": 5
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

---

### 2.4 `PUT /api/announcements/{id}`

**Auth:** Required

**Request Body:**
```jsonc
{
  "title": "Updated Title",
  "content": "Updated content",
  "target": "Students",
  "courseId": null,
  "isActive": true
}
```

**Business Logic:**
1. Verify user has permission to edit this announcement (creator or Admin)
2. Update announcement fields

**Success Response — `200 OK`:** Returns updated `AnnouncementResponse`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | Announcement permission denied |
| 404 | Announcement not found |

---

### 2.5 `PATCH /api/announcements/{id}/deactivate`

**Auth:** Required

**Business Logic:**
1. Verify user has permission
2. Set `IsActive = false`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {},
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | Announcement permission denied |
| 404 | Announcement not found |

---

### 2.6 `DELETE /api/announcements/{id}`

**Auth:** Required

**Business Logic:**
1. Verify user has permission
2. Hard delete the announcement

**Success Response — `204 No Content`:** No body.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | Announcement permission denied |
| 404 | Announcement not found |

---

## 3. Messages Endpoints

**Rate Limit:** `Messaging` limiter applies to all message endpoints.

### 3.1 `POST /api/messages`

**Auth:** Required | **Rate Limit:** Messaging

**Request Body:**
```jsonc
{
  "receiverId": "guid",          // required, recipient user ID
  "content": "Hello!",           // required, string
}
```

**Business Logic:**
1. Validate receiver exists and is not self
2. Validate message relationship (must share a course or valid connection)
3. Create message with `IsRead = false`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "senderId": "guid",
    "receiverId": "guid",
    "content": "Hello!",
    "sentAt": "2026-06-26T10:00:00Z",
    "isRead": false,
    "readAt": null
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Cannot message self / invalid message length / relationship invalid |
| 401 | Missing/invalid JWT |

---

### 3.2 `GET /api/messages/conversations`

**Auth:** Required | **Rate Limit:** Messaging

**Query Parameters:**
| Param | Type | Required | Default |
|---|---|---|---|
| `page` | int | No | 1 |
| `pageSize` | int | No | 20 |

**Business Logic:**
1. Return all conversations for the current user with latest message preview

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "items": [
      {
        "otherUserId": "guid",
        "otherUserName": "Jane Smith",
        "lastMessage": "See you in class!",
        "lastMessageAt": "2026-06-26T09:00:00Z",
        "unreadCount": 2
      }
    ],
    "page": 1,
    "pageSize": 20,
    "totalCount": 3
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

---

### 3.3 `GET /api/messages/conversations/{otherUserId}`

**Auth:** Required | **Rate Limit:** Messaging

**Query Parameters:**
| Param | Type | Required | Default |
|---|---|---|---|
| `page` | int | No | 1 |
| `pageSize` | int | No | 50 |

**Business Logic:**
1. Return paginated messages between current user and specified user
2. Messages ordered by `SentAt` ascending

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "items": [ /* MessageResponse[] */ ],
    "page": 1,
    "pageSize": 50,
    "totalCount": 10
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

---

### 3.4 `GET /api/messages/unread-count`

**Auth:** Required | **Rate Limit:** Messaging

**Business Logic:**
1. Return total count of unread messages across all conversations

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "unreadCount": 5
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |

---

### 3.5 `PATCH /api/messages/{messageId}/read`

**Auth:** Required | **Rate Limit:** Messaging

**Business Logic:**
1. Mark message as read (only the receiver can mark it)
2. Set `IsRead = true`, `ReadAt = UtcNow`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {},
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Message not found |

---

### 3.6 `DELETE /api/messages/{messageId}`

**Auth:** Required | **Rate Limit:** Messaging

**Business Logic:**
1. Soft-delete the message for the current user (sender/receiver)

**Success Response — `204 No Content`:** No body.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Message not found |

---

## 4. Reports Endpoints

### 4.1 `POST /api/reports`

**Auth:** Required

**Request Body:**
```jsonc
{
  "entityType": "Course",          // required, string (e.g. Course, Review, Comment, User)
  "entityId": "guid",              // required, the ID of the entity being reported
  "reason": "Inappropriate Content",  // required, string
  "description": "Details..."      // optional, string?
}
```

**Business Logic:**
1. Validate entity type and reason
2. Create report with status `Pending`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "id": "guid",
    "reporterId": "guid",
    "reporterName": "John Doe",
    "entityType": "Course",
    "entityId": "guid",
    "reason": "Inappropriate Content",
    "description": "Details...",
    "status": "Pending",
    "adminNote": null,
    "createdAt": "2026-06-26T10:00:00Z",
    "resolvedAt": null
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid entity type / reason |
| 401 | Missing/invalid JWT |

---

### 4.2 `GET /api/reports/pending`

**Auth:** Admin

**Query Parameters:**
| Param | Type | Required | Default |
|---|---|---|---|
| `page` | int | No | 1 |
| `pageSize` | int | No | 20 |

**Business Logic:**
1. Return all reports with `Pending` status

**Success Response — `200 OK`:** Returns `ReportListResponse`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 4.3 `PATCH /api/reports/{id}/resolve`

**Auth:** Admin

**Request Body:**
```jsonc
{
  "status": "Dismissed",         // required, string (Dismissed | WarningIssued | ContentRemoved | UserBanned)
  "adminNote": "Reviewed, no action needed"  // optional, string?
}
```

**Business Logic:**
1. Update report status
2. Record admin ID and resolution time

**Success Response — `200 OK`:** Returns `ReportResponse`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid report status |
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Report not found |

---

## 5. Activity Logs Endpoints

### 5.1 `GET /api/activity-logs`

**Auth:** Admin

**Query Parameters (ActivityLogFilterRequest):**
| Param | Type | Required | Description |
|---|---|---|---|
| `userId` | Guid | No | Filter by user |
| `action` | string | No | Filter by action name |
| `entityType` | string | No | Filter by entity type |
| `dateFrom` | DateTime | No | Start date |
| `dateTo` | DateTime | No | End date |
| `ipAddress` | string | No | Filter by IP |
| `page` | int | No | Page number (default 1) |
| `pageSize` | int | No | Page size (default 50) |

**Business Logic:**
1. Return paginated, filterable activity logs

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "guid",
        "userId": "guid",
        "userName": "John Doe",
        "action": "Login",
        "entityType": "Session",
        "entityId": "guid",
        "details": "User logged in via password",
        "ipAddress": "192.168.1.1",
        "createdAt": "2026-06-26T10:00:00Z"
      }
    ],
    "page": 1,
    "pageSize": 50,
    "totalCount": 1000
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

## 6. System Settings Endpoints

### 6.1 `GET /api/system-settings`

**Auth:** Admin

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `group` | string | No | Filter by group (e.g. "General", "Email", "Payment") |

**Business Logic:**
1. Return all settings, optionally filtered by group

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "group": "General",
      "key": "PlatformName",
      "value": "Athary",
      "dataType": "String",
      "description": "Platform display name",
      "isPublic": true,
      "updatedAt": "2026-06-01T00:00:00Z",
      "updatedBy": "guid"
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 6.2 `GET /api/system-settings/{key}`

**Auth:** Admin

**Business Logic:**
1. Return a single setting by its key

**Success Response — `200 OK`:** Returns `SettingResponse`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Setting not found |

---

### 6.3 `POST /api/system-settings`

**Auth:** Admin

**Request Body:**
```jsonc
{
  "group": "General",                 // optional, default "General"
  "key": "MaintenanceMode",           // required, string (unique)
  "value": "false",                   // required, string
  "dataType": "Boolean",              // optional, default "String"
  "description": "Enable maintenance mode"  // optional, string?
}
```

**Business Logic:**
1. Validate key uniqueness
2. Validate value against data type
3. Create setting

**Success Response — `201 Created`:** Returns `SettingResponse` (with `Location` header to `GET /api/system-settings/{key}`).

**Errors:**
| Code | Condition |
|---|---|
| 400 | Setting already exists / invalid data type / invalid value |
| 401 | Missing/invalid JWT (non-admin) |

---

### 6.4 `PUT /api/system-settings/{key}`

**Auth:** Admin

**Request Body:**
```jsonc
{
  "value": "true"     // required, string
}
```

**Business Logic:**
1. Validate value against setting's data type
2. Update value and record updater info

**Success Response — `200 OK`:** Returns `SettingResponse`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid value for data type |
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Setting not found |

---

### 6.5 `DELETE /api/system-settings/{key}`

**Auth:** Admin

**Business Logic:**
1. Hard delete the setting

**Success Response — `204 No Content`:** No body.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |
| 404 | Setting not found |

---

## 7. DTO Reference

### 7.1 Announcement DTOs

| DTO | Fields |
|---|---|
| **CreateAnnouncementRequest** | `title`\*, `content`\*, `target?` (All/Students/Instructors/SpecificCourse), `courseId?` |
| **UpdateAnnouncementRequest** | `title`\*, `content`\*, `target?`, `courseId?`, `isActive` |
| **AnnouncementResponse** | `id`, `title`, `content`, `target`, `courseId?`, `createdBy`, `createdByName`, `isActive`, `publishedAt?` |
| **AnnouncementListResponse** | `items[]`, `page`, `pageSize`, `totalCount` |

### 7.2 Message DTOs

| DTO | Fields |
|---|---|
| **SendMessageRequest** | `receiverId`\*, `content`\* |
| **MessageResponse** | `id`, `senderId`, `receiverId`, `content`, `sentAt`, `isRead`, `readAt?` |
| **ConversationResponse** | `otherUserId`, `otherUserName`, `lastMessage`, `lastMessageAt`, `unreadCount` |
| **ConversationListResponse** | `items[]`, `page`, `pageSize`, `totalCount` |
| **ConversationMessagesResponse** | `items[]` (MessageResponse), `page`, `pageSize`, `totalCount` |
| **UnreadCountResponse** | `unreadCount` |

### 7.3 Report DTOs

| DTO | Fields |
|---|---|
| **CreateReportRequest** | `entityType`\*, `entityId`\*, `reason`\*, `description?` |
| **ResolveReportRequest** | `status`\* (Dismissed/WarningIssued/ContentRemoved/UserBanned), `adminNote?` |
| **ReportResponse** | `id`, `reporterId`, `reporterName`, `entityType`, `entityId`, `reason`, `description?`, `status`, `adminNote?`, `createdAt`, `resolvedAt?` |
| **ReportListResponse** | `items[]`, `page`, `pageSize`, `totalCount` |

### 7.4 Activity Log DTOs

| DTO | Fields |
|---|---|
| **ActivityLogFilterRequest** | `userId?`, `action?`, `entityType?`, `dateFrom?`, `dateTo?`, `ipAddress?`, `page`, `pageSize` |
| **ActivityLogResponse** | `id`, `userId`, `userName`, `action`, `entityType`, `entityId?`, `details?`, `ipAddress?`, `createdAt` |
| **ActivityLogListResponse** | `items[]`, `page`, `pageSize`, `totalCount` |

### 7.5 System Settings DTOs

| DTO | Fields |
|---|---|
| **CreateSettingRequest** | `group?`, `key`\*, `value`\*, `dataType?`, `description?` |
| **UpdateSettingRequest** | `value`\* |
| **SettingResponse** | `id`, `group`, `key`, `value`, `dataType`, `description?`, `isPublic`, `updatedAt?`, `updatedBy?` |

---

## 8. Endpoint Summary Table

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/announcements` | Required | Create announcement |
| `POST` | `/api/announcements/course/{courseId}` | Required | Create course-specific announcement |
| `GET` | `/api/announcements` | Required | Get announcement feed |
| `PUT` | `/api/announcements/{id}` | Required | Update announcement |
| `PATCH` | `/api/announcements/{id}/deactivate` | Required | Deactivate announcement |
| `DELETE` | `/api/announcements/{id}` | Required | Delete announcement |
| `POST` | `/api/messages` | Required | Send message |
| `GET` | `/api/messages/conversations` | Required | List conversations |
| `GET` | `/api/messages/conversations/{otherUserId}` | Required | Get conversation messages |
| `GET` | `/api/messages/unread-count` | Required | Get unread count |
| `PATCH` | `/api/messages/{messageId}/read` | Required | Mark message as read |
| `DELETE` | `/api/messages/{messageId}` | Required | Delete message |
| `POST` | `/api/reports` | Required | Create report |
| `GET` | `/api/reports/pending` | Admin | List pending reports |
| `PATCH` | `/api/reports/{id}/resolve` | Admin | Resolve report |
| `GET` | `/api/activity-logs` | Admin | List activity logs |
| `GET` | `/api/system-settings` | Admin | List all settings |
| `GET` | `/api/system-settings/{key}` | Admin | Get setting by key |
| `POST` | `/api/system-settings` | Admin | Create setting |
| `PUT` | `/api/system-settings/{key}` | Admin | Update setting |
| `DELETE` | `/api/system-settings/{key}` | Admin | Delete setting |
