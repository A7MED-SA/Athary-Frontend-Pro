# Athary Platform — Dashboard API Documentation

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

1. [Student Dashboard Endpoints](#1-student-dashboard-endpoints)
2. [Instructor Dashboard Endpoints](#2-instructor-dashboard-endpoints)
3. [Admin Dashboard Endpoints](#3-admin-dashboard-endpoints)
4. [DTO Reference](#4-dto-reference)
5. [Endpoint Summary Table](#5-endpoint-summary-table)

---

## 1. Student Dashboard Endpoints

All student dashboard endpoints require `Student` role.

### 1.1 `GET /api/student/dashboard/overview`

**Auth:** Student

**Business Logic:**
1. Extract `userId` from JWT `sub` claim
2. Return aggregate metrics, recent courses, weekly activity chart, recent certificates

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "metrics": [
      { "label": "Enrolled Courses", "value": "8", "change": 12.5, "trend": "up", "icon": null, "color": null },
      { "label": "Completed", "value": "3", "change": 50.0, "trend": "up", "icon": null, "color": null },
      { "label": "Certificates", "value": "2", "change": null, "trend": "neutral", "icon": null, "color": null },
      { "label": "Hours Spent", "value": "47", "change": 8.3, "trend": "up", "icon": null, "color": null }
    ],
    "recentCourses": [ /* StudentCourseDto[] */ ],
    "weeklyActivity": {
      "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
      "series": [{ "name": "Hours", "data": [5, 8, 12, 7] }]
    },
    "recentCertificates": [ /* StudentCertificateDto[] */ ]
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-student) |

---

### 1.2 `GET /api/student/dashboard/courses`

**Auth:** Student

**Business Logic:**
1. Return all enrolled courses with progress, instructor name, and status

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "enrollmentId": "guid",
      "courseId": "guid",
      "courseTitle": "Introduction to Programming",
      "thumbnailUrl": "https://minio-host/thumbnails/abc.jpg",
      "instructorName": "Dr. Smith",
      "progressPercentage": 65.5,
      "status": "InProgress",
      "lastAccessedAt": "2026-06-25T14:00:00Z"
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-student) |

---

### 1.3 `GET /api/student/dashboard/weekly-activity`

**Auth:** Student

**Query Parameters:**
| Param | Type | Required | Default |
|---|---|---|---|
| `weeks` | int | No | 4 |

**Business Logic:**
1. Return weekly activity chart data (hours spent per week)

**Success Response — `200 OK`:** Returns `ChartSeriesDto`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-student) |

---

### 1.4 `GET /api/student/dashboard/certificates`

**Auth:** Student

**Business Logic:**
1. Return all certificates earned by the student

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "courseId": "guid",
      "courseTitle": "Introduction to Programming",
      "verificationCode": "ATH-ABC123",
      "issuedAt": "2026-06-01T00:00:00Z",
      "status": "Active"
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-student) |

---

## 2. Instructor Dashboard Endpoints

All instructor dashboard endpoints require `Instructor` role.

### 2.1 `GET /api/instructor/dashboard/overview`

**Auth:** Instructor

**Business Logic:**
1. Return aggregate metrics, courses, revenue trend, enrollment trend, student level distribution, pending edit requests

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "metrics": [
      { "label": "Total Courses", "value": "5", "change": null, "trend": "neutral", "icon": null, "color": null },
      { "label": "Total Students", "value": "342", "change": 15.2, "trend": "up", "icon": null, "color": null },
      { "label": "Total Revenue", "value": "$12,450", "change": 22.1, "trend": "up", "icon": null, "color": null },
      { "label": "Average Rating", "value": "4.7", "change": 0.3, "trend": "up", "icon": null, "color": null }
    ],
    "courses": [ /* InstructorCourseDto[] */ ],
    "revenueTrend": { "labels": [], "series": [] },
    "enrollmentTrend": { "labels": [], "series": [] },
    "studentLevelDistribution": [ /* DistributionItemDto[] */ ],
    "pendingEditRequests": 2
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-instructor) |

---

### 2.2 `GET /api/instructor/dashboard/courses`

**Auth:** Instructor

**Business Logic:**
1. Return list of instructor's courses with management data

**Success Response — `200 OK`:** Returns `List<ManagementCourseDto>`.

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-instructor) |

---

### 2.3 `GET /api/instructor/dashboard/revenue`

**Auth:** Instructor

**Query Parameters:**
| Param | Type | Required | Default |
|---|---|---|---|
| `months` | int | No | 12 |

**Business Logic:**
1. Return revenue breakdown for the instructor

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "totalRevenue": 12450.00,
    "currentMonthRevenue": 2340.00,
    "previousMonthRevenue": 1890.00,
    "revenueChangePercent": 23.8,
    "monthlyBreakdown": { "labels": [], "series": [] }
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-instructor) |

---

### 2.4 `GET /api/instructor/dashboard/students`

**Auth:** Instructor

**Business Logic:**
1. Return student statistics for the instructor

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "totalStudents": 342,
    "activeStudents": 198,
    "newStudentsThisMonth": 27,
    "enrollmentOverTime": { "labels": [], "series": [] }
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-instructor) |

---

### 2.5 `GET /api/instructor/dashboard/pending-requests`

**Auth:** Instructor

**Business Logic:**
1. Return pending edit requests for instructor's courses

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "courseId": "guid",
      "courseTitle": "Course Title",
      "requestType": "ContentUpdate",
      "status": "Pending",
      "requestedAt": "2026-06-25T10:00:00Z",
      "expiresAt": null,
      "isEmergency": false,
      "reviewerNote": null
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-instructor) |

---

### 2.6 `GET /api/instructor/dashboard/recent-reviews`

**Auth:** Instructor

**Query Parameters:**
| Param | Type | Required | Default |
|---|---|---|---|
| `limit` | int | No | 10 |

**Business Logic:**
1. Return most recent reviews for instructor's courses

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "userId": "guid",
      "userFullName": "John Doe",
      "userProfileImageUrl": null,
      "courseId": "guid",
      "courseTitle": "Course Title",
      "rating": 5,
      "comment": "Great course!",
      "createdAt": "2026-06-26T08:00:00Z"
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-instructor) |

---

## 3. Admin Dashboard Endpoints

All admin dashboard endpoints require `Admin` role.

### 3.1 `GET /api/admin/dashboard/overview`

**Auth:** Admin

**Business Logic:**
1. Return platform-wide aggregate metrics

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "totalUsers": 15000,
    "totalInstructors": 350,
    "totalCourses": 800,
    "totalRevenue": 450000.00,
    "totalEnrollments": 45000,
    "pendingInstructors": 12,
    "pendingCourses": 25
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 3.2 `GET /api/admin/dashboard/revenue`

**Auth:** Admin

**Query Parameters:**
| Param | Type | Required | Default |
|---|---|---|---|
| `months` | int | No | 12 |

**Business Logic:**
1. Return platform revenue data with monthly breakdown and distribution by course

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "totalRevenue": 450000.00,
    "monthlyRevenue": { "labels": ["Jan", "Feb", ...], "series": [{ "name": "Revenue", "data": [...] }] },
    "revenueByCourse": [
      { "label": "Course A", "value": 50000, "color": "#4F46E5", "percentage": 11.1 }
    ]
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 3.3 `GET /api/admin/dashboard/user-growth`

**Auth:** Admin

**Query Parameters:**
| Param | Type | Required | Default |
|---|---|---|---|
| `months` | int | No | 6 |

**Business Logic:**
1. Return user growth data with role distribution

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "totalUsers": 15000,
    "growth": { "labels": [], "series": [] },
    "roleDistribution": [
      { "label": "Student", "value": 14000, "color": "#3B82F6", "percentage": 93.3 },
      { "label": "Instructor", "value": 350, "color": "#10B981", "percentage": 2.3 }
    ]
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 3.4 `GET /api/admin/dashboard/enrollment-trend`

**Auth:** Admin

**Query Parameters:**
| Param | Type | Required | Default |
|---|---|---|---|
| `months` | int | No | 12 |

**Business Logic:**
1. Return enrollment trend data with status distribution

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": {
    "trend": { "labels": [], "series": [] },
    "statusDistribution": [
      { "label": "Active", "value": 30000, "color": "#10B981", "percentage": 66.7 },
      { "label": "Completed", "value": 15000, "color": "#3B82F6", "percentage": 33.3 }
    ]
  },
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 401 | Missing/invalid JWT (non-admin) |

---

### 3.5 `GET /api/admin/dashboard/top-courses`

**Auth:** Admin

**Query Parameters:**
| Param | Type | Required | Default |
|---|---|---|---|
| `limit` | int | No | 10 |

**Business Logic:**
1. Return top courses by enrollment/revenue

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "title": "Introduction to Programming",
      "instructorName": "Dr. Smith",
      "price": 99.99,
      "enrollmentCount": 2500,
      "averageRating": 4.7,
      "revenue": 249975.00
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

## 4. DTO Reference

### 4.1 Common Dashboard DTOs

| DTO | Fields |
|---|---|
| **DashboardMetricDto** | `label`, `value`, `change?`, `trend`, `icon?`, `color?` |
| **ChartSeriesDto** | `labels[]`, `series[]` (SeriesItemDto) |
| **SeriesItemDto** | `name`, `data[]` |
| **DistributionItemDto** | `label`, `value`, `color?`, `percentage` |
| **TopCourseDto** | `id`, `title`, `instructorName?`, `price`, `enrollmentCount`, `averageRating`, `revenue` |
| **PendingItemsDto** | `pendingCourses`, `pendingEditRequests`, `pendingTeacherRequests`, `flaggedReviews` |

### 4.2 Student Dashboard DTOs

| DTO | Fields |
|---|---|
| **StudentOverviewDto** | `metrics[]`, `recentCourses[]` (StudentCourseDto), `weeklyActivity` (ChartSeriesDto), `recentCertificates[]` (StudentCertificateDto) |
| **StudentCourseDto** | `id`, `enrollmentId`, `courseId`, `courseTitle`, `thumbnailUrl?`, `instructorName`, `progressPercentage`, `status`, `lastAccessedAt` |
| **StudentCertificateDto** | `id`, `courseId`, `courseTitle`, `verificationCode`, `issuedAt`, `status` |

### 4.3 Instructor Dashboard DTOs

| DTO | Fields |
|---|---|
| **InstructorOverviewDto** | `metrics[]`, `courses[]` (InstructorCourseDto), `revenueTrend`, `enrollmentTrend`, `studentLevelDistribution[]`, `pendingEditRequests` |
| **InstructorCourseDto** | `id`, `title`, `slug`, `thumbnailUrl?`, `price`, `status`, `enrollmentCount`, `averageRating`, `totalDurationMinutes`, `revenue`, `progressPercentage`, `createdAt`, `publishedAt?` |
| **InstructorDashboardRevenueDto** | `totalRevenue`, `currentMonthRevenue`, `previousMonthRevenue`, `revenueChangePercent`, `monthlyBreakdown` |
| **InstructorDashboardStudentsDto** | `totalStudents`, `activeStudents`, `newStudentsThisMonth`, `enrollmentOverTime` |
| **PendingEditRequestDto** | `id`, `courseId`, `courseTitle`, `requestType`, `status`, `requestedAt`, `expiresAt?`, `isEmergency`, `reviewerNote?` |
| **ReviewSummaryDto** | `id`, `userId`, `userFullName`, `userProfileImageUrl?`, `courseId`, `courseTitle`, `rating`, `comment?`, `createdAt` |

### 4.4 Admin Dashboard DTOs

| DTO | Fields |
|---|---|
| **AdminOverviewDto** | `totalUsers`, `totalInstructors`, `totalCourses`, `totalRevenue`, `totalEnrollments`, `pendingInstructors`, `pendingCourses` |
| **AdminRevenueDto** | `totalRevenue`, `monthlyRevenue`, `revenueByCourse[]` |
| **AdminUserGrowthDto** | `totalUsers`, `growth`, `roleDistribution[]` |
| **AdminEnrollmentTrendDto** | `trend`, `statusDistribution[]` |

### 4.5 Management Course DTOs

| DTO | Fields |
|---|---|
| **ManagementCourseDto** | `id`, `title`, `slug`, `description?`, `thumbnailUrl?`, `price`, `status`, `categoryName`, `totalDurationMinutes`, `enrollmentCount`, `averageRating`, `revenue`, `sectionCount`, `lessonCount`, `createdAt`, `publishedAt?`, `updatedAt?` |

---

## 5. Endpoint Summary Table

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/student/dashboard/overview` | Student | Student overview metrics |
| `GET` | `/api/student/dashboard/courses` | Student | Enrolled courses |
| `GET` | `/api/student/dashboard/weekly-activity` | Student | Weekly activity chart |
| `GET` | `/api/student/dashboard/certificates` | Student | Earned certificates |
| `GET` | `/api/instructor/dashboard/overview` | Instructor | Instructor overview metrics |
| `GET` | `/api/instructor/dashboard/courses` | Instructor | Instructor courses |
| `GET` | `/api/instructor/dashboard/revenue` | Instructor | Revenue breakdown |
| `GET` | `/api/instructor/dashboard/students` | Instructor | Student statistics |
| `GET` | `/api/instructor/dashboard/pending-requests` | Instructor | Pending edit requests |
| `GET` | `/api/instructor/dashboard/recent-reviews` | Instructor | Recent reviews |
| `GET` | `/api/admin/dashboard/overview` | Admin | Platform overview |
| `GET` | `/api/admin/dashboard/revenue` | Admin | Platform revenue |
| `GET` | `/api/admin/dashboard/user-growth` | Admin | User growth data |
| `GET` | `/api/admin/dashboard/enrollment-trend` | Admin | Enrollment trend |
| `GET` | `/api/admin/dashboard/top-courses` | Admin | Top courses |
