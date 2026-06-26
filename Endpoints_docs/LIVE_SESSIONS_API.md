# Athary Platform — Live Sessions API Documentation

> **Base URL:** `http://<host>:5000`
> **Response Envelope:** All responses wrapped in `ApiResponse<T>`

```jsonc
{
  "success": true,
  "data": null,
  "message": null,
  "errorCode": null,
  "errors": null
}
```

---

## Table of Contents

1. [Error Codes](#1-error-codes)
2. [Live Session Management Endpoints](#2-live-session-management-endpoints)
3. [Live Attendance Endpoints](#3-live-attendance-endpoints)
4. [Enums Reference](#4-enums-reference)
5. [DTO Reference](#5-dto-reference)
6. [Endpoint Summary Table](#6-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| `LIVE_SESSION_NOT_FOUND` | 404 | Live session not found |
| `SESSION_NOT_LIVE` | 400 | Session is not currently live |
| `MAX_ATTENDEES_REACHED` | 400 | Maximum attendee limit reached |
| `ATTENDANCE_NOT_FOUND` | 404 | Attendance record not found |
| `SECTION_NOT_FOUND` | 404 | Section not found |
| `VALIDATION_ERROR` | 400 | FluentValidation or argument error |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

---

## 2. Live Session Management Endpoints

All management endpoints require `Instructor` role.

### 2.1 `GET /api/courses/{courseId}/live-sessions`

**Auth:** Required, Role: Instructor

**Path Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `courseId` | guid | Course ID |

**Business Logic:**
1. Return all live sessions for a course

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "title": "Week 1 Live Session",
      "description": "Introduction and Q&A",
      "scheduledStart": "2026-07-01T14:00:00Z",
      "scheduledEnd": "2026-07-01T15:00:00Z",
      "status": "Scheduled",
      "meetingUrl": "https://meet.example.com/abc123",
      "password": null,
      "maxAttendees": 100,
      "actualStartAt": null,
      "actualEndAt": null,
      "recordingFileId": null,
      "currentAttendeesCount": 0
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | Not an instructor |

### 2.2 `POST /api/courses/{courseId}/live-sessions`

**Auth:** Required, Role: Instructor

**Request Body:**
```jsonc
{
  "sectionId": "guid",                 // required
  "title": "string",                   // required, max 255
  "description": "string | null",
  "scheduledStart": "2026-07-01T14:00:00Z",   // required
  "scheduledEnd": "2026-07-01T15:00:00Z",     // required, must be after start
  "meetingUrl": "string",              // required, max 2000
  "password": "string | null",
  "maxAttendees": 100                  // optional, must be > 0
}
```

**Business Logic:**
1. Validate section exists and belongs to course
2. Optionally create a streaming room via provider
3. Create session with `Status = Scheduled`
4. Add section item linking session to section

**Success Response — `200 OK`:** Returns `LiveSessionResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure / schedule conflict |
| 401 | Missing/invalid JWT |
| 403 | Not an instructor |
| 404 | Section not found |

### 2.3 `PUT /api/courses/{courseId}/live-sessions/{sessionId}/status`

**Auth:** Required, Role: Instructor

**Request Body:**
```jsonc
{
  "status": "Live",              // required: Scheduled | Live | Finished | Cancelled
  "meetingUrl": "string | null",
  "password": "string | null",
  "maxAttendees": 100 | null
}
```

**Business Logic:**
1. Find session → 404 if not found
2. If status → `Live`: set `ActualStartAt`
3. If status → `Finished` or `Cancelled`: set `ActualEndAt`
4. If `Finished`: end streaming room
5. Update optional fields (meetingUrl, password, maxAttendees)

**Success Response — `200 OK`:** Returns `LiveSessionResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid status transition |
| 401 | Missing/invalid JWT |
| 403 | Not an instructor |
| 404 | Session not found |

### 2.4 `DELETE /api/courses/{courseId}/live-sessions/{sessionId}`

**Auth:** Required, Role: Instructor

**Business Logic:**
1. Find session → `LIVE_SESSION_NOT_FOUND` if not found
2. Delete session and associated section item

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Deleted"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 403 | Not an instructor |
| 404 | Live session not found |

---

## 3. Live Attendance Endpoints

All attendance endpoints require authentication (any role).

### 3.1 `POST /api/live-sessions/{sessionId}/attendance/join`

**Auth:** Required

**Path Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `sessionId` | guid | Live session ID |

**Business Logic:**
1. Find session → `LIVE_SESSION_NOT_FOUND` if not found
2. Validate session is `Live` → `SESSION_NOT_LIVE` if not
3. Check max attendees limit → `MAX_ATTENDEES_REACHED` if at capacity
4. If user already joined (no `LeftAt`) → return success (idempotent)
5. Create attendance record with `JoinedAt = UtcNow`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Joined successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Session not live / max attendees reached |
| 401 | Missing/invalid JWT |
| 404 | Live session not found |

### 3.2 `POST /api/live-sessions/{sessionId}/attendance/leave`

**Auth:** Required

**Path Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `sessionId` | guid | Live session ID |

**Business Logic:**
1. Find active attendance for user + session
2. Set `LeftAt = UtcNow`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": null,
  "message": "Left successfully"
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Session or attendance not found |

### 3.3 `GET /api/live-sessions/{sessionId}/attendance/count`

**Auth:** Required

**Path Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `sessionId` | guid | Live session ID |

**Business Logic:**
1. Count active attendees (where `LeftAt == null`)

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": 42,
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT |
| 404 | Session not found |

---

## 4. Enums Reference

### 4.1 LiveSessionStatus

| Value | Description |
|---|---|
| `Scheduled` | Session planned, not yet started |
| `Live` | Currently streaming |
| `Finished` | Session ended normally |
| `Cancelled` | Session cancelled |

---

## 5. DTO Reference

| DTO | Fields |
|---|---|
| **CreateLiveSessionDto** | `sectionId`\*, `title`\*, `description?`, `scheduledStart`\*, `scheduledEnd`\*, `meetingUrl`\*, `password?`, `maxAttendees?` |
| **UpdateLiveSessionStatusDto** | `status`\* (LiveSessionStatus), `meetingUrl?`, `password?`, `maxAttendees?` |
| **LiveSessionResponseDto** | `id`, `title`, `description?`, `scheduledStart`, `scheduledEnd`, `status`, `meetingUrl`, `password?`, `maxAttendees?`, `actualStartAt?`, `actualEndAt?`, `recordingFileId?`, `currentAttendeesCount` |

---

## 6. Endpoint Summary Table

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/courses/{courseId}/live-sessions` | Yes | Instructor | List sessions for course |
| `POST` | `/api/courses/{courseId}/live-sessions` | Yes | Instructor | Create live session |
| `PUT` | `/api/courses/{courseId}/live-sessions/{sessionId}/status` | Yes | Instructor | Update session status |
| `DELETE` | `/api/courses/{courseId}/live-sessions/{sessionId}` | Yes | Instructor | Delete live session |
| `POST` | `/api/live-sessions/{sessionId}/attendance/join` | Yes | — | Join live session |
| `POST` | `/api/live-sessions/{sessionId}/attendance/leave` | Yes | — | Leave live session |
| `GET` | `/api/live-sessions/{sessionId}/attendance/count` | Yes | — | Get attendee count |
