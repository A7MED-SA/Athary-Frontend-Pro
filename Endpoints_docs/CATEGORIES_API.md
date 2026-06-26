# Athary Platform — Categories API Documentation

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
2. [Categories Endpoints](#2-categories-endpoints)
3. [DTO Reference](#3-dto-reference)
4. [Endpoint Summary Table](#4-endpoint-summary-table)

---

## 1. Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| `CATEGORY_NOT_FOUND` | 404 | Category not found |
| `PARENT_CATEGORY_NOT_FOUND` | 404 | Parent category not found |
| `CATEGORY_SELF_PARENT` | 400 | Category cannot be its own parent |
| `CATEGORY_HAS_SUBCATEGORIES` | 400 | Cannot delete category with subcategories |
| `CATEGORY_HAS_COURSES` | 400 | Cannot delete category with courses |
| `FILE_MUST_BE_IMAGE` | 400 | Uploaded file must be an image |
| `FILE_NOT_READY` | 400 | File not in Ready status |
| `VALIDATION_ERROR` | 400 | FluentValidation or argument error |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

---

## 2. Categories Endpoints

### 2.1 `GET /api/categories`

**Auth:** Anonymous

**Business Logic:**
1. Returns all non-deleted categories with hierarchical children
2. Ordered by `Position`

**Success Response — `200 OK`:**
```jsonc
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "name": "Arts & Humanities",
      "description": "Courses covering arts and humanities",
      "parentId": null,
      "imageUrl": null,
      "slug": "arts-humanities",
      "position": 1,
      "children": [
        {
          "id": "guid",
          "name": "Calligraphy",
          "description": "Arabic and Islamic calligraphy",
          "parentId": "guid",
          "imageUrl": null,
          "slug": "calligraphy",
          "position": 1,
          "children": []
        }
      ]
    }
  ],
  "message": null
}
```

**Errors:**
| Code | Condition |
|---|---|
| 500 | Server error |

### 2.2 `GET /api/categories/{id}`

**Auth:** Anonymous

**Business Logic:**
1. Load category by ID → 404 if not found or deleted

**Success Response — `200 OK`:** Returns single `CategoryResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 404 | Category not found |

### 2.3 `POST /api/categories`

**Auth:** Required, Role: Admin

**Request Body:**
```jsonc
{
  "name": "string",                // required, max 200
  "description": "string | null",
  "slug": "string | null",         // optional, auto-generated from name if null
  "parentId": "guid | null",
  "position": 0                    // optional, default 0
}
```

**Business Logic:**
1. Validate name (required, max 200 chars)
2. Generate slug from name if not provided
3. If `parentId` provided → validate parent exists → 404 if not
4. Validate `parentId` is not the same as id (for updates)
5. Create category

**Success Response — `201 Created`:** Returns `CategoryResponseDto` with Location header.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure / self-parent |
| 401 | Missing/invalid JWT |
| 403 | Not an admin |
| 404 | Parent category not found |

### 2.4 `PUT /api/categories/{id}`

**Auth:** Required, Role: Admin

**Request Body:**
```jsonc
{
  "name": "string",                // required, max 200
  "description": "string | null",
  "slug": "string | null",
  "parentId": "guid | null",
  "position": 0
}
```

**Business Logic:**
1. Validate category exists → 404 if not
2. Validate `parentId` is not the category's own ID → `CATEGORY_SELF_PARENT`
3. Update fields

**Success Response — `200 OK`:** Returns `CategoryResponseDto`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | Validation failure / self-parent |
| 401 | Missing/invalid JWT |
| 403 | Not an admin |
| 404 | Category not found |

### 2.5 `DELETE /api/categories/{id}`

**Auth:** Required, Role: Admin

**Business Logic:**
1. Validate category exists → 404 if not
2. Check no subcategories → `CATEGORY_HAS_SUBCATEGORIES` if exists
3. Check no courses → `CATEGORY_HAS_COURSES` if exists
4. Soft delete (sets `DeletedAt`)

**Success Response — `204 No Content`**

**Errors:**
| Code | Condition |
|---|---|
| 400 | Category has subcategories / category has courses |
| 401 | Missing/invalid JWT |
| 403 | Not an admin |
| 404 | Category not found |

### 2.6 `PUT /api/categories/{categoryId}/image`

**Auth:** Required, Role: Admin

**Request Body:**
```jsonc
{
  "fileId": "guid"    // required, ID of uploaded image file
}
```

**Business Logic:**
1. Validate file exists, is image type, is Ready status → error codes
2. Validate file ownership → 403 if not owned by user
3. Update category's image file reference

**Success Response — `200 OK`:** Returns `CategoryResponseDto` with updated `imageUrl`.

**Errors:**
| Code | Condition |
|---|---|
| 400 | File is not an image / file not ready |
| 401 | Missing/invalid JWT |
| 403 | Not an admin / file not owned |
| 404 | Category not found |

---

## 3. DTO Reference

| DTO | Fields |
|---|---|
| **CategoryResponseDto** | `id`, `name`, `description?`, `parentId?`, `imageUrl?`, `slug?`, `position`, `children: CategoryResponseDto[]` |
| **CreateCategoryDto** | `name`\*, `description?`, `slug?`, `parentId?`, `position` |
| **UpdateCategoryDto** | `name`\*, `description?`, `slug?`, `parentId?`, `position` |
| **SetCategoryImageRequest** | `fileId`\* |

---

## 4. Endpoint Summary Table

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/categories` | No | — | List all categories |
| `GET` | `/api/categories/{id}` | No | — | Get category by ID |
| `POST` | `/api/categories` | Yes | Admin | Create category |
| `PUT` | `/api/categories/{id}` | Yes | Admin | Update category |
| `DELETE` | `/api/categories/{id}` | Yes | Admin | Delete category (soft) |
| `PUT` | `/api/categories/{categoryId}/image` | Yes | Admin | Set category image |
