# 📝 API Post Documentation - Pharmacy Mart

## 🚀 Tóm Tắt

Hệ thống API Post được xây dựng để quản lý các bài đăng (blog posts, tin tức, bài viết) trong Pharmacy Mart. API hỗ trợ đầy đủ các chức năng CRUD với phân quyền admin và public routes cho người dùng cuối.

## 📡 Base URL
```
http://localhost:7000/api/v1/post
```

## 🔐 Authentication
Admin endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <your_jwt_token>
```

## 🔧 API Endpoints

### 📖 Public Endpoints

#### 1. **Lấy Danh Sách Bài Đăng**
```http
GET /api/v1/post/get-all
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Số trang |
| limit | number | No | 10 | Số lượng bài đăng mỗi trang |
| status | string | No | - | Lọc theo trạng thái: `draft`, `published`, `archived` |
| search | string | No | - | Tìm kiếm trong title và content |
| authorId | number | No | - | Lọc theo ID tác giả |

**Example Request:**
```bash
GET /api/v1/post/get-all?page=1&limit=10&status=published&search=vitamin
```

**Response (200 OK):**
```json
{
    "statusCode": 200,
    "message": "Success",
    "data": {
        "result": [
            {
                "id": 1,
                "title": "Lợi ích của Vitamin C đối với sức khỏe",
                "slug": "loi-ich-cua-vitamin-c-doi-voi-suc-khoe",
                "content": "Nội dung chi tiết về vitamin C...",
                "excerpt": "Tóm tắt ngắn gọn về bài viết",
                "thumbnail": "https://example.com/images/vitamin-c.jpg",
                "status": "published",
                "authorId": 1,
                "publishedAt": "2026-01-10T10:00:00.000Z",
                "viewCount": 125,
                "createdAt": "2026-01-09T08:30:00.000Z",
                "updatedAt": "2026-01-10T10:00:00.000Z",
                "author": {
                    "id": 1,
                    "fullName": "Nguyễn Văn A",
                    "email": "admin@example.com"
                }
            },
            {
                "id": 2,
                "title": "Cách sử dụng thuốc an toàn",
                "slug": "cach-su-dung-thuoc-an-toan",
                "content": "Hướng dẫn chi tiết về cách sử dụng thuốc...",
                "excerpt": "Những lưu ý quan trọng khi dùng thuốc",
                "thumbnail": "https://example.com/images/safe-medication.jpg",
                "status": "published",
                "authorId": 1,
                "publishedAt": "2026-01-11T14:30:00.000Z",
                "viewCount": 89,
                "createdAt": "2026-01-11T12:00:00.000Z",
                "updatedAt": "2026-01-11T14:30:00.000Z",
                "author": {
                    "id": 1,
                    "fullName": "Nguyễn Văn A",
                    "email": "admin@example.com"
                }
            }
        ],
        "meta": {
            "page": 1,
            "limit": 10,
            "total": 2,
            "totalPages": 1
        }
    }
}
```

#### 2. **Lấy Chi Tiết Bài Đăng Theo ID**
```http
GET /api/v1/post/get-detail/:id
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | ID của bài đăng |

**Example Request:**
```bash
GET /api/v1/post/get-detail/1
```

**Response (200 OK):**
```json
{
    "statusCode": 200,
    "message": "Retrieved successfully",
    "data": {
        "id": 1,
        "title": "Lợi ích của Vitamin C đối với sức khỏe",
        "slug": "loi-ich-cua-vitamin-c-doi-voi-suc-khoe",
        "content": "<h2>Vitamin C là gì?</h2><p>Vitamin C, còn được gọi là axit ascorbic...</p>",
        "excerpt": "Tóm tắt ngắn gọn về bài viết",
        "thumbnail": "https://example.com/images/vitamin-c.jpg",
        "status": "published",
        "authorId": 1,
        "publishedAt": "2026-01-10T10:00:00.000Z",
        "viewCount": 126,
        "createdAt": "2026-01-09T08:30:00.000Z",
        "updatedAt": "2026-01-10T10:00:00.000Z",
        "isRemoved": false,
        "removedDate": null,
        "modifiedBy": null,
        "author": {
            "id": 1,
            "fullName": "Nguyễn Văn A",
            "email": "admin@example.com"
        }
    }
}
```

**Response (404 Not Found):**
```json
{
    "statusCode": 404,
    "message": "Post not found"
}
```

#### 3. **Lấy Chi Tiết Bài Đăng Theo Slug**
```http
GET /api/v1/post/get-by-slug/:slug
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slug | string | Yes | Slug của bài đăng (URL-friendly) |

**Example Request:**
```bash
GET /api/v1/post/get-by-slug/loi-ich-cua-vitamin-c-doi-voi-suc-khoe
```

**Response:** Giống như endpoint get-detail/:id

**Note:** 
- Cả 2 endpoints get-detail và get-by-slug đều tự động tăng `viewCount` của bài đăng lên 1 khi được gọi.

---

### 🔒 Admin Endpoints

#### 4. **Tạo Bài Đăng Mới**
```http
POST /api/v1/post/admin/create
Content-Type: application/json
Authorization: Bearer <token>
```

**Required Permission:** `create_post`

**Request Body:**
```json
{
    "title": "Lợi ích của Vitamin C đối với sức khỏe",
    "slug": "loi-ich-cua-vitamin-c-doi-voi-suc-khoe",
    "content": "<h2>Vitamin C là gì?</h2><p>Vitamin C, còn được gọi là axit ascorbic, là một vitamin tan trong nước...</p>",
    "excerpt": "Tóm tắt ngắn gọn về những lợi ích tuyệt vời của vitamin C đối với sức khỏe con người",
    "thumbnail": "https://example.com/images/vitamin-c.jpg",
    "status": "published",
    "authorId": 1
}
```

**Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | **Yes** | Tiêu đề bài đăng |
| slug | string | **Yes** | URL-friendly slug (unique) |
| content | string | **Yes** | Nội dung bài đăng (hỗ trợ HTML) |
| excerpt | string | No | Tóm tắt ngắn gọn |
| thumbnail | string | No | URL hình ảnh thumbnail |
| status | string | No | `draft`, `published`, hoặc `archived` (default: `draft`) |
| authorId | number | No | ID của tác giả |

**Response (201 Created):**
```json
{
    "statusCode": 201,
    "message": "Post created successfully",
    "data": {
        "id": 1,
        "title": "Lợi ích của Vitamin C đối với sức khỏe",
        "slug": "loi-ich-cua-vitamin-c-doi-voi-suc-khoe",
        "content": "<h2>Vitamin C là gì?</h2><p>Vitamin C, còn được gọi là axit ascorbic...</p>",
        "excerpt": "Tóm tắt ngắn gọn về những lợi ích tuyệt vời của vitamin C",
        "thumbnail": "https://example.com/images/vitamin-c.jpg",
        "status": "published",
        "authorId": 1,
        "publishedAt": null,
        "viewCount": 0,
        "createdAt": "2026-01-14T10:30:00.000Z",
        "updatedAt": "2026-01-14T10:30:00.000Z",
        "isRemoved": false,
        "removedDate": null,
        "modifiedBy": null
    }
}
```

#### 5. **Cập Nhật Bài Đăng**
```http
PUT /api/v1/post/admin/update/:id
Content-Type: application/json
Authorization: Bearer <token>
```

**Required Permission:** `edit_post`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | ID của bài đăng cần cập nhật |

**Request Body:** (Tất cả các field đều optional)
```json
{
    "title": "Lợi ích tuyệt vời của Vitamin C",
    "content": "<h2>Nội dung đã được cập nhật</h2>",
    "status": "published",
    "thumbnail": "https://example.com/images/new-thumbnail.jpg"
}
```

**Response (200 OK):**
```json
{
    "statusCode": 200,
    "message": "Post updated successfully",
    "data": {
        "id": 1,
        "title": "Lợi ích tuyệt vời của Vitamin C",
        "slug": "loi-ich-cua-vitamin-c-doi-voi-suc-khoe",
        "content": "<h2>Nội dung đã được cập nhật</h2>",
        "status": "published",
        "thumbnail": "https://example.com/images/new-thumbnail.jpg",
        "updatedAt": "2026-01-14T11:00:00.000Z"
    }
}
```

**Response (404 Not Found):**
```json
{
    "statusCode": 404,
    "message": "Post not found"
}
```

#### 6. **Xóa Bài Đăng (Soft Delete)**
```http
DELETE /api/v1/post/admin/delete/:id
Authorization: Bearer <token>
```

**Required Permission:** `delete_post`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | ID của bài đăng cần xóa |

**Example Request:**
```bash
DELETE /api/v1/post/admin/delete/1
```

**Response (200 OK):**
```json
{
    "statusCode": 200,
    "message": "Post deleted successfully",
    "data": null
}
```

**Note:** Đây là soft delete, bài đăng sẽ được đánh dấu `isRemoved = true` thay vì xóa hoàn toàn khỏi database.

#### 7. **Lấy Tất Cả Bài Đăng (Admin)**
```http
GET /api/v1/post/admin/get-all
Authorization: Bearer <token>
```

**Required Permission:** `view_posts`

**Query Parameters:** Giống như public endpoint get-all

**Khác biệt:** 
- Admin có thể xem tất cả bài đăng kể cả `draft` và `archived`
- Có thể xem cả bài đăng đã bị soft delete (nếu cần)

**Response:** Giống như public endpoint get-all

---

## 📊 Data Models

### Post Entity
```typescript
{
    id: number;                    // Primary key
    title: string;                 // Tiêu đề bài đăng
    slug: string;                  // URL-friendly slug (unique)
    content: string;               // Nội dung bài đăng (text/HTML)
    excerpt: string | null;        // Tóm tắt ngắn gọn
    thumbnail: string | null;      // URL hình ảnh thumbnail
    status: PostStatus;            // 'draft' | 'published' | 'archived'
    authorId: number | null;       // ID của tác giả
    publishedAt: Date | null;      // Thời gian xuất bản
    viewCount: number;             // Số lượt xem (default: 0)
    createdAt: Date;               // Thời gian tạo
    updatedAt: Date;               // Thời gian cập nhật
    isRemoved: boolean;            // Đánh dấu đã xóa (soft delete)
    removedDate: Date | null;      // Thời gian xóa
    modifiedBy: string | null;     // Người thực hiện thay đổi cuối
    author: SystemUser;            // Relation: Thông tin tác giả
}
```

### Post Status Enum
```typescript
enum PostStatus {
    DRAFT = 'draft',           // Bản nháp, chưa xuất bản
    PUBLISHED = 'published',   // Đã xuất bản, hiển thị công khai
    ARCHIVED = 'archived'      // Đã lưu trữ, không hiển thị
}
```

---

## 🔑 Permissions

Module Post có các permissions sau:

| Permission | Description | Group |
|------------|-------------|-------|
| `view_posts` | Xem danh sách bài đăng | post |
| `view_detail_post` | Xem chi tiết bài đăng | post |
| `create_post` | Tạo bài đăng mới | post |
| `edit_post` | Chỉnh sửa bài đăng | post |
| `delete_post` | Xóa bài đăng | post |

---

## 🎯 Use Cases

### Use Case 1: Người dùng đọc bài viết
```bash
# Bước 1: Lấy danh sách bài đăng published
GET /api/v1/post/get-all?status=published&page=1&limit=10

# Bước 2: Xem chi tiết bài đăng (tự động tăng viewCount)
GET /api/v1/post/get-detail/1
```

### Use Case 2: Admin tạo và xuất bản bài viết
```bash
# Bước 1: Tạo bài đăng dạng draft
POST /api/v1/post/admin/create
{
    "title": "Tiêu đề bài viết",
    "slug": "tieu-de-bai-viet",
    "content": "Nội dung...",
    "status": "draft"
}

# Bước 2: Xem lại và chỉnh sửa
PUT /api/v1/post/admin/update/1
{
    "content": "Nội dung đã được chỉnh sửa..."
}

# Bước 3: Xuất bản
PUT /api/v1/post/admin/update/1
{
    "status": "published"
}
```

### Use Case 3: Tìm kiếm bài viết
```bash
# Tìm kiếm trong title và content
GET /api/v1/post/get-all?search=vitamin&status=published

# Lọc theo tác giả
GET /api/v1/post/get-all?authorId=1&status=published
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
    "statusCode": 400,
    "message": "Validation failed",
    "errors": [
        {
            "field": "title",
            "message": "title should not be empty"
        }
    ]
}
```

### 401 Unauthorized
```json
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
    "statusCode": 403,
    "message": "Forbidden resource"
}
```

### 404 Not Found
```json
{
    "statusCode": 404,
    "message": "Post not found"
}
```

### 500 Internal Server Error
```json
{
    "statusCode": 500,
    "message": "Internal server error"
}
```

---

## 📝 Notes

1. **Slug phải unique:** Khi tạo bài đăng mới, slug phải là duy nhất trong hệ thống
2. **View Count:** Tự động tăng khi người dùng xem chi tiết bài đăng
3. **Soft Delete:** Bài đăng bị xóa chỉ được đánh dấu `isRemoved = true`, không xóa khỏi database
4. **Status:** Chỉ bài đăng có status `published` mới hiển thị cho người dùng public
5. **HTML Support:** Field `content` hỗ trợ HTML để format nội dung bài viết
6. **Pagination:** Mặc định page=1, limit=10. Có thể điều chỉnh theo nhu cầu

---

## 🔄 Migration

Để tạo bảng `posts` trong database, chạy lệnh:

```bash
npm run migration:generate -- src/migrations/CreatePostTable
npm run migration:run
```

Hoặc sử dụng TypeORM synchronize trong development mode.

---

## 🧪 Testing

Xem file [POST_API_TEST.md](POST_API_TEST.md) để có các ví dụ test với curl hoặc HTTP client.

---

**Version:** 1.0.0  
**Last Updated:** January 14, 2026  
**Author:** Pharmacy Mart Development Team
