# API Documentation — Khaizel Hijab Backend

## 1. Overview

Dokumentasi ini mencatat API yang sudah dibuat pada project **Khaizel - Hijab Backend** sampai tahap saat ini.

Backend menggunakan:

- NestJS
- Prisma ORM
- MySQL
- JWT untuk autentikasi
- DTO untuk validasi request
- NanoID untuk membantu generate `USER_ID`

> Catatan: contoh response di bawah menggambarkan struktur API yang sudah kita bahas. Sesuaikan nama endpoint/field jika implementasi aktual di controller berbeda.

---

# 2. Authentication API

## Register User

### Endpoint

```http
POST /auth/register
```

### Request Body

```json
{
  "USER_EMAIL": "user@example.com",
  "USER_NAME": "Gilang",
  "USER_PASSWORD": "Password123!",
  "USER_PHONENUMBER": "081234567890"
}
```

### Penjelasan Request

| Field | Tipe | Wajib | Keterangan |
|---|---|---:|---|
| `USER_EMAIL` | string | Ya | Email user, harus unik |
| `USER_NAME` | string | Tidak | Nama user |
| `USER_PASSWORD` | string | Ya | Password user |
| `USER_PHONENUMBER` | string | Tidak | Nomor telepon, harus unik jika diisi |

`USER_ID` **tidak dikirim dari client**.

Backend membuat `USER_ID` menggunakan `UserIdService`.

Format yang digunakan:

```text
USRMMYY + NanoID
```

Dengan panjang maksimal 25 karakter.

Contoh:

```text
USR09267Kx9mP2Qa8Tn4Lc7
```

### Proses Backend

```text
Client
  ↓
CreateUserDto
  ↓
AuthController
  ↓
AuthService
  ↓
Hash Password
  ↓
UserIdService
  ↓
Prisma USER_MASTER.create()
  ↓
Database
```

Password tidak disimpan dalam bentuk plaintext. Password di-hash sebelum disimpan ke database.

### Success Response

HTTP `201 Created`

Contoh:

```json
{
  "message": "User berhasil dibuat",
  "data": {
    "USER_ID": "USR09267Kx9mP2Qa8Tn4Lc7",
    "USER_EMAIL": "user@example.com",
    "USER_NAME": "Gilang",
    "USER_PHONENUMBER": "081234567890",
    "USER_STATUS": 0,
    "USER_POINT": 0
  }
}
```

> Password sebaiknya tidak pernah dikembalikan dalam response.

### Duplicate Response

Jika email atau field unique lainnya sudah digunakan:

HTTP `409 Conflict`

```json
{
  "statusCode": 409,
  "message": "Email sudah terdaftar",
  "error": "Conflict"
}
```

Prisma menggunakan error code `P2002` untuk unique constraint violation.

---

# 3. Login User

## Endpoint

```http
POST /auth/login
```

### Request Body

```json
{
  "USER_EMAIL": "user@example.com",
  "USER_PASSWORD": "Password123!"
}
```

### Success Response

Contoh:

HTTP `200 OK`

```json
{
  "message": "Login berhasil",
  "data": {
    "USER_ID": "USR09267Kx9mP2Qa8Tn4Lc7",
    "USER_EMAIL": "user@example.com",
    "USER_NAME": "Gilang",
    "access_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

`access_token` digunakan untuk mengakses endpoint yang membutuhkan autentikasi.

Client mengirim token melalui HTTP header:

```http
Authorization: Bearer <access_token>
```

---

# 4. JWT Authentication

Setelah login berhasil:

```text
Login
  ↓
Validasi email + password
  ↓
Generate JWT
  ↓
Client menerima access_token
```

Untuk request berikutnya:

```text
Client
  ↓
Authorization: Bearer <JWT>
  ↓
JwtStrategy
  ↓
Validasi token
  ↓
Endpoint dapat diakses
```

Jika token tidak valid atau sudah expired, request akan ditolak.

---

# 5. Product API

## Get All Active Products

### Endpoint

```http
GET /products
```

API mengambil product dengan:

```text
PRODUCT_STATUS = 1
```

### Request

Tidak membutuhkan request body.

Contoh:

```http
GET /products
```

### Response

Contoh struktur response:

```json
[
  {
    "PRODUCT_ID": 1,
    "PRODUCT_NAME": "Hijab Premium",
    "PRODUCT_SLUG": "hijab-premium",
    "PRODUCT_DESC": "Hijab premium dengan bahan nyaman",
    "PRODUCT_STATUS": 1,

    "VARIANTS": [
      {
        "SIZE": {
          "SIZE_ID": 1,
          "SIZE_NAME": "M"
        },
        "COLOR": {
          "COLOR_ID": 1,
          "COLOR_NAME": "Black",
          "COLOR_CODE": "#000000"
        },
        "INVENTORY": {
          "STOCK": 10,
          "RESERVED": 0
        }
      }
    ],

    "IMAGES": [
      {
        "IMAGE_ID": 1,
        "IMAGE_URL": "https://example.com/image.jpg",
        "SORT_ORDER": 0,
        "IS_PRIMARY": true
      }
    ],

    "CATEGORIES": [
      {
        "CATEGORY_ID": 1,
        "CATEGORY": {
          "CATEGORY_NAME": "Hijab",
          "CATEGORY_SLUG": "hijab"
        }
      }
    ]
  }
]
```

### Struktur Relasi Product

```text
PRODUCT_MASTER
│
├── VARIANTS
│   ├── SIZE
│   ├── COLOR
│   └── INVENTORY
│
├── IMAGES
│
└── CATEGORIES
    └── CATEGORY
```

Relasi tersebut berasal dari schema Prisma.

---

# 6. Error Response

## 400 Bad Request

Digunakan ketika request tidak lolos validasi DTO.

Contoh:

```json
{
  "statusCode": 400,
  "message": [
    "USER_EMAIL must be an email"
  ],
  "error": "Bad Request"
}
```

---

## 401 Unauthorized

Digunakan ketika autentikasi gagal atau JWT tidak valid.

Contoh:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## 409 Conflict

Digunakan ketika data bertabrakan dengan unique constraint.

Contoh:

```json
{
  "statusCode": 409,
  "message": "Email sudah terdaftar",
  "error": "Conflict"
}
```

---

## 500 Internal Server Error

Digunakan untuk error server yang tidak diharapkan.

Contoh:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

Error database sebaiknya ditangani terlebih dahulu agar error yang memang diketahui, seperti duplicate data (`P2002`), tidak dikembalikan sebagai HTTP 500.

---

# 7. DTO

DTO (Data Transfer Object) digunakan untuk menentukan bentuk data yang boleh diterima endpoint.

Contoh:

```ts
export class CreateUserDto {
  USER_EMAIL: string;
  USER_NAME?: string;
  USER_PASSWORD: string;
  USER_PHONENUMBER?: string;
}
```

Dengan `class-validator`, request dapat divalidasi sebelum masuk ke service.

Contoh:

```ts
@IsEmail()
USER_EMAIL: string;

@IsString()
@MinLength(8)
USER_PASSWORD: string;
```

DTO bertugas pada **validasi dan bentuk input**, sedangkan business logic tetap berada di service.

---

# 8. Controller, Service, dan Module

Struktur umum:

```text
Controller
    ↓
Service
    ↓
PrismaService
    ↓
Database
```

### Controller

Menerima HTTP request dan menentukan endpoint.

Contoh:

```ts
@Post('register')
register(@Body() dto: CreateUserDto) {
  return this.authService.register(dto);
}
```

### Service

Berisi business logic.

Contoh:

```text
AuthService
├── validasi user
├── hash password
├── generate User ID
├── insert user
└── generate JWT
```

### Module

Mengelompokkan controller, service, dan dependency yang berkaitan.

Contoh:

```text
AuthModule
├── AuthController
├── AuthService
├── JwtStrategy
└── JwtModule
```

---

# 9. PrismaService

`PrismaService` adalah wrapper NestJS untuk `PrismaClient`.

Contoh fungsi:

```ts
async onModuleInit() {
  await this.$connect();
}

async onModuleDestroy() {
  await this.$disconnect();
}
```

Service lain dapat menggunakan:

```ts
this.prisma.uSER_MASTER
this.prisma.pRODUCT_MASTER
```

untuk berinteraksi dengan database.

---

# 10. User ID

User ID tidak menggunakan auto increment.

Format:

```text
USRMMYY + NanoID
```

Contoh:

```text
USR09267Kx9mP2Qa8Tn4Lc7
```

Maksimal:

```text
25 karakter
```

Keuntungan:

- Tidak membutuhkan query `MAX()`
- Tidak membutuhkan counter table
- Ringan diproses
- Memiliki informasi bulan dan tahun pembuatan
- NanoID memberikan ruang kombinasi yang sangat besar
- Primary key database tetap menjadi perlindungan terakhir terhadap duplicate

---

# 11. Catatan Arsitektur

Project saat ini memisahkan area user dan admin.

```text
src/
├── auth/
├── users/
├── products/
├── admin/
├── common/
└── prisma/
```

User dan admin menggunakan model database berbeda:

```text
USER_MASTER
ADMIN_MASTER
```

Hal ini memungkinkan authentication dan authorization user/admin berkembang secara terpisah.

---

# 12. Status Implementasi

Fitur yang sudah dibahas:

- [x] Prisma + MySQL
- [x] USER_MASTER
- [x] ADMIN_MASTER
- [x] Register User
- [x] Password hashing
- [x] User ID generator
- [x] Login
- [x] JWT
- [x] DTO
- [x] Validation
- [x] Product query
- [x] Product variants
- [x] Product images
- [x] Product categories
- [x] Inventory relation
- [x] Duplicate handling dengan Prisma `P2002`

Fitur ecommerce berikutnya dapat dikembangkan dari:

```text
Product
  ↓
Cart
  ↓
Checkout
  ↓
Order
  ↓
Payment
  ↓
Inventory
  ↓
Shipping
```
