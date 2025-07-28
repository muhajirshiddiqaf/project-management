# 📚 Postman Documentation

## 🔧 Setup Environment

### Base URL

```
{{base_url}} = http://localhost:3000/api
```

### Headers

```
Content-Type: application/json
Authorization: Bearer {{access_token}} (untuk routes yang memerlukan auth)
```

---

## 🔐 Authentication Routes

### 1. Register User

**POST** `{{base_url}}/auth/register`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "organizationName": "My Company",
  "organizationSlug": "my-company"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin",
      "organizationId": "org_id"
    },
    "tokens": {
      "accessToken": "jwt_token_here",
      "refreshToken": "refresh_token_here",
      "expiresIn": "24h"
    }
  }
}
```

**Response Error (400):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

### 2. Login User

**POST** `{{base_url}}/auth/login`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin",
      "organizationId": "org_id"
    },
    "tokens": {
      "accessToken": "jwt_token_here",
      "refreshToken": "refresh_token_here",
      "expiresIn": "24h"
    }
  }
}
```

---

### 3. Refresh Token

**POST** `{{base_url}}/auth/refresh`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{refresh_token}}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_token_here",
    "refreshToken": "new_refresh_token_here",
    "expiresIn": "24h"
  }
}
```

---

### 4. Get Profile

**GET** `{{base_url}}/auth/profile`

**Headers:**

```
Authorization: Bearer {{access_token}}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "organizationId": "org_id"
  }
}
```

---

### 5. Update Profile

**PUT** `{{base_url}}/auth/profile`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Body (JSON):**

```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John Updated",
    "lastName": "Doe Updated",
    "role": "admin"
  }
}
```

---

### 6. Change Password

**PUT** `{{base_url}}/auth/change-password`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Body (JSON):**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 7. Forgot Password

**POST** `{{base_url}}/auth/forgot-password`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "user@example.com"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 8. Reset Password

**POST** `{{base_url}}/auth/reset-password`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "token": "reset_token_here",
  "newPassword": "newpassword123"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 9. Setup 2FA

**POST** `{{base_url}}/auth/2fa/setup`

**Headers:**

```
Authorization: Bearer {{access_token}}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "2FA setup initiated",
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "secret": "JBSWY3DPEHPK3PXP"
  }
}
```

---

### 10. Verify 2FA

**POST** `{{base_url}}/auth/2fa/verify`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Body (JSON):**

```json
{
  "token": "123456"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "2FA verified successfully"
}
```

---

### 11. Disable 2FA

**DELETE** `{{base_url}}/auth/2fa/disable`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Body (JSON):**

```json
{
  "token": "123456"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "2FA disabled successfully"
}
```

---

### 12. Logout

**POST** `{{base_url}}/auth/logout`

**Headers:**

```
Authorization: Bearer {{access_token}}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📦 Order Management Routes

### 1. Get All Orders

**GET** `{{base_url}}/orders`

**Headers:**

```
Authorization: Bearer {{access_token}}
```

**Query Parameters:**

```
page=1&limit=10&status=pending&priority=high&client_id=client_uuid&assigned_to=user_uuid&sortBy=created_at&sortOrder=desc
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": "order_uuid",
        "title": "Website Development",
        "description": "Create company website",
        "client_id": "client_uuid",
        "client_name": "ABC Company",
        "client_email": "contact@abc.com",
        "project_id": "project_uuid",
        "project_name": "Website Project",
        "order_date": "2024-01-15T00:00:00.000Z",
        "due_date": "2024-02-15T00:00:00.000Z",
        "total_amount": 5000000,
        "currency": "IDR",
        "status": "pending",
        "priority": "high",
        "assigned_to": "user_uuid",
        "assigned_to_name": "John Doe",
        "notes": "Urgent project",
        "created_at": "2024-01-15T10:00:00.000Z",
        "updated_at": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

### 2. Get Order by ID

**GET** `{{base_url}}/orders/{{order_id}}`

**Headers:**

```
Authorization: Bearer {{access_token}}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": "order_uuid",
    "title": "Website Development",
    "description": "Create company website",
    "client_id": "client_uuid",
    "client_name": "ABC Company",
    "client_email": "contact@abc.com",
    "project_id": "project_uuid",
    "project_name": "Website Project",
    "order_date": "2024-01-15T00:00:00.000Z",
    "due_date": "2024-02-15T00:00:00.000Z",
    "total_amount": 5000000,
    "currency": "IDR",
    "status": "pending",
    "priority": "high",
    "assigned_to": "user_uuid",
    "assigned_to_name": "John Doe",
    "notes": "Urgent project",
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 3. Create Order

**POST** `{{base_url}}/orders`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Body (JSON):**

```json
{
  "title": "Website Development",
  "description": "Create company website with modern design",
  "client_id": "client_uuid",
  "project_id": "project_uuid",
  "order_date": "2024-01-15",
  "due_date": "2024-02-15",
  "total_amount": 5000000,
  "currency": "IDR",
  "status": "draft",
  "priority": "high",
  "assigned_to": "user_uuid",
  "notes": "Urgent project for client"
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order_uuid",
    "title": "Website Development",
    "description": "Create company website with modern design",
    "client_id": "client_uuid",
    "project_id": "project_uuid",
    "order_date": "2024-01-15T00:00:00.000Z",
    "due_date": "2024-02-15T00:00:00.000Z",
    "total_amount": 5000000,
    "currency": "IDR",
    "status": "draft",
    "priority": "high",
    "assigned_to": "user_uuid",
    "notes": "Urgent project for client",
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 4. Update Order

**PUT** `{{base_url}}/orders/{{order_id}}`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Body (JSON):**

```json
{
  "title": "Website Development - Updated",
  "description": "Create company website with modern design and SEO",
  "total_amount": 6000000,
  "status": "approved",
  "priority": "urgent",
  "notes": "Updated requirements from client"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    "id": "order_uuid",
    "title": "Website Development - Updated",
    "description": "Create company website with modern design and SEO",
    "client_id": "client_uuid",
    "project_id": "project_uuid",
    "order_date": "2024-01-15T00:00:00.000Z",
    "due_date": "2024-02-15T00:00:00.000Z",
    "total_amount": 6000000,
    "currency": "IDR",
    "status": "approved",
    "priority": "urgent",
    "assigned_to": "user_uuid",
    "notes": "Updated requirements from client",
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 5. Delete Order

**DELETE** `{{base_url}}/orders/{{order_id}}`

**Headers:**

```
Authorization: Bearer {{access_token}}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

---

### 6. Search Orders

**GET** `{{base_url}}/orders/search`

**Headers:**

```
Authorization: Bearer {{access_token}}
```

**Query Parameters:**

```
q=website&page=1&limit=10&status=pending&priority=high&sortBy=created_at&sortOrder=desc
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Orders search completed",
  "data": {
    "orders": [
      {
        "id": "order_uuid",
        "title": "Website Development",
        "description": "Create company website",
        "client_id": "client_uuid",
        "client_name": "ABC Company",
        "client_email": "contact@abc.com",
        "project_id": "project_uuid",
        "project_name": "Website Project",
        "order_date": "2024-01-15T00:00:00.000Z",
        "due_date": "2024-02-15T00:00:00.000Z",
        "total_amount": 5000000,
        "currency": "IDR",
        "status": "pending",
        "priority": "high",
        "assigned_to": "user_uuid",
        "assigned_to_name": "John Doe",
        "notes": "Urgent project",
        "created_at": "2024-01-15T10:00:00.000Z",
        "updated_at": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

### 7. Update Order Status

**PATCH** `{{base_url}}/orders/{{order_id}}/status`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Body (JSON):**

```json
{
  "status": "in_progress",
  "notes": "Started development work"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": "order_uuid",
    "title": "Website Development",
    "description": "Create company website",
    "client_id": "client_uuid",
    "project_id": "project_uuid",
    "order_date": "2024-01-15T00:00:00.000Z",
    "due_date": "2024-02-15T00:00:00.000Z",
    "total_amount": 5000000,
    "currency": "IDR",
    "status": "in_progress",
    "priority": "high",
    "assigned_to": "user_uuid",
    "notes": "Started development work",
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T12:00:00.000Z"
  }
}
```

---

### 8. Assign Order

**PATCH** `{{base_url}}/orders/{{order_id}}/assign`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Body (JSON):**

```json
{
  "assigned_to": "user_uuid"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Order assigned successfully",
  "data": {
    "id": "order_uuid",
    "title": "Website Development",
    "description": "Create company website",
    "client_id": "client_uuid",
    "project_id": "project_uuid",
    "order_date": "2024-01-15T00:00:00.000Z",
    "due_date": "2024-02-15T00:00:00.000Z",
    "total_amount": 5000000,
    "currency": "IDR",
    "status": "pending",
    "priority": "high",
    "assigned_to": "user_uuid",
    "notes": "Urgent project",
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T13:00:00.000Z"
  }
}
```

---

### 9. Get Order Statistics

**GET** `{{base_url}}/orders/statistics`

**Headers:**

```
Authorization: Bearer {{access_token}}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Order statistics retrieved successfully",
  "data": {
    "total_orders": 25,
    "draft_orders": 5,
    "pending_orders": 8,
    "approved_orders": 3,
    "in_progress_orders": 6,
    "completed_orders": 2,
    "cancelled_orders": 1,
    "urgent_orders": 3,
    "high_priority_orders": 10,
    "total_amount": 125000000,
    "average_amount": 5000000
  }
}
```

---

## 🔧 Postman Environment Variables

### Setup Environment Variables:

1. Buka Postman
2. Klik "Environments" di sidebar
3. Buat environment baru dengan nama "Project Management API"
4. Tambahkan variables berikut:

| Variable          | Initial Value               | Current Value               |
| ----------------- | --------------------------- | --------------------------- |
| `base_url`        | `http://localhost:3000/api` | `http://localhost:3000/api` |
| `access_token`    | ``                          | ``                          |
| `refresh_token`   | ``                          | ``                          |
| `user_id`         | ``                          | ``                          |
| `organization_id` | ``                          | ``                          |
| `order_id`        | ``                          | ``                          |

### Auto-save Token Script:

Tambahkan script berikut di tab "Tests" untuk setiap login/register request:

```javascript
// Auto-save tokens
if (pm.response.code === 200) {
  const response = pm.response.json();
  if (response.data && response.data.tokens) {
    pm.environment.set('access_token', response.data.tokens.accessToken);
    pm.environment.set('refresh_token', response.data.tokens.refreshToken);
  }
  if (response.data && response.data.user) {
    pm.environment.set('user_id', response.data.user.id);
    pm.environment.set('organization_id', response.data.user.organizationId);
  }
}
```

---

## 📋 Test Cases

### 1. Register Flow

1. Register user baru
2. Verify response contains tokens
3. Save tokens to environment

### 2. Login Flow

1. Login dengan credentials
2. Verify response contains user data
3. Save tokens to environment

### 3. Protected Routes Test

1. Get profile (should work with token)
2. Update profile (should work with token)
3. Logout (should clear token)

### 4. Error Handling Test

1. Login dengan wrong password
2. Access protected route tanpa token
3. Use expired token

### 5. Order Management Test

1. Create new order
2. Get all orders
3. Get order by ID
4. Update order
5. Search orders
6. Update order status
7. Assign order
8. Get order statistics
9. Delete order

---

## 🚀 Quick Start

1. **Import Collection:**

   - Download collection JSON
   - Import ke Postman

2. **Setup Environment:**

   - Set `base_url` sesuai server
   - Run register/login untuk dapat token

3. **Test Routes:**
   - Start dengan register/login
   - Test protected routes dengan token
   - Verify error handling

---

## 📝 Notes

- Semua routes menggunakan JSON format
- Authentication menggunakan JWT Bearer token
- Error responses konsisten dengan format yang sama
- Refresh token untuk extend session
- 2FA optional untuk security tambahan
- Order management supports multi-tenant isolation
- Order status: draft, pending, approved, in_progress, completed, cancelled
- Order priority: low, medium, high, urgent
