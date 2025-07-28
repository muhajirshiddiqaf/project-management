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
      "organizationId": "org_id",
      "organizationName": "My Company",
      "organizationSlug": "my-company"
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
```

**Body (JSON):**

```json
{
  "refreshToken": "refresh_token_here"
}
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

### 4. Logout User

**POST** `{{base_url}}/auth/logout`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 5. Get User Profile

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
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin",
      "organizationId": "org_id",
      "organizationName": "My Company",
      "organizationSlug": "my-company"
    }
  }
}
```

---

### 6. Update User Profile

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
  "lastName": "Doe Updated",
  "phone": "+1234567890"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John Updated",
      "lastName": "Doe Updated",
      "phone": "+1234567890"
    }
  }
}
```

---

### 7. Change Password

**POST** `{{base_url}}/auth/change-password`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Body (JSON):**

```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password123"
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

### 8. Verify Token

**GET** `{{base_url}}/auth/verify`

**Headers:**

```
Authorization: Bearer {{access_token}}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "admin"
    }
  }
}
```

---

### 9. Forgot Password

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
  "message": "Password reset email sent successfully"
}
```

---

### 10. Reset Password

**POST** `{{base_url}}/auth/reset-password`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "token": "reset_token_here",
  "newPassword": "new_password123"
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

### 11. Setup 2FA

**POST** `{{base_url}}/auth/2fa/setup`

**Headers:**

```
Authorization: Bearer {{access_token}}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "2FA setup successful",
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "secret": "JBSWY3DPEHPK3PXP"
  }
}
```

---

### 12. Verify 2FA

**POST** `{{base_url}}/auth/2fa/verify`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "2FA verification successful",
  "data": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here"
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
