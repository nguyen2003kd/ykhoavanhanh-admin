# API Reference — Vạn Hạnh Hospital Backend

> Base URL: `/api/v1.0`
> Auth: Bearer Token — các endpoint có ký hiệu 🔒 yêu cầu header `Authorization: Bearer <token>`

---

## Mục lục

- [HIS Services — Dịch vụ HIS](#his-services)
- [Exam Areas — Khu vực khám](#exam-areas)
- [Patient — Bệnh nhân](#patient)

---

## HIS Services

> Proxy tới HIS external API. Dữ liệu không lưu DB nội bộ (trừ khi có note riêng).

### `GET /his-services`

Lấy danh sách dịch vụ từ HIS.

**Query params**

| Param | Type | Mô tả |
|---|---|---|
| ip | string | IP server HIS |
| idbv | string | Mã đơn vị bệnh viện |
| *(các param HIS khác)* | any | Được forward thẳng sang HIS |

**Response 200**
```json
{
  "success": true,
  "message": "Lấy danh sách dịch vụ thành công",
  "data": [ /* mảng dịch vụ từ HIS */ ]
}
```

---

### `POST /his-services`

Tạo mới dịch vụ trên HIS.

**Body** — forward toàn bộ payload sang `POST /api/service/` của HIS.

```json
{
  "service_id": "DV001",
  "service_name": "Khám tổng quát",
  "service_type": "Khám bệnh",
  "price": 150000,
  "description": "Khám sức khỏe tổng quát"
}
```

> Các field cụ thể phụ thuộc vào tài liệu HIS. Payload được truyền nguyên sang HIS.

**Response 200**
```json
{
  "success": true,
  "message": "Tạo dịch vụ thành công",
  "data": { /* response từ HIS */ }
}
```

---

### `GET /his-services/:id`

Lấy chi tiết một dịch vụ theo ID.

**Path params**

| Param | Type | Mô tả |
|---|---|---|
| id | string | Mã dịch vụ HIS |

**Response 200**
```json
{
  "success": true,
  "message": "Lấy thông tin dịch vụ thành công",
  "data": { /* chi tiết dịch vụ từ HIS */ }
}
```

---

### `PUT /his-services/:id`

Cập nhật dịch vụ theo ID.

**Path params**

| Param | Type | Mô tả |
|---|---|---|
| id | string | Mã dịch vụ HIS |

**Body** — forward sang `PUT /api/service/:id/` của HIS.

```json
{
  "service_name": "Khám tổng quát nâng cao",
  "price": 200000
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Cập nhật dịch vụ thành công",
  "data": { /* response từ HIS */ }
}
```

---

### `DELETE /his-services/:id`

Xóa dịch vụ theo ID.

**Path params**

| Param | Type | Mô tả |
|---|---|---|
| id | string | Mã dịch vụ HIS |

**Response 200**
```json
{
  "success": true,
  "message": "Xóa dịch vụ thành công",
  "data": { /* response từ HIS */ }
}
```

---

### `GET /his-services/export`

Xuất danh sách dịch vụ HIS ra file Excel (`.xlsx`).

**Query params** — giống `GET /his-services`, được forward sang HIS để lọc dữ liệu trước khi xuất.

**Response** — file `dich-vu-his-{timestamp}.xlsx`

| Cột | Key |
|---|---|
| Mã dịch vụ | `service_id` / `id` |
| Tên dịch vụ | `service_name` / `name` |
| Loại dịch vụ | `service_type` / `type` |
| Đơn giá | `price` |
| Mô tả | `description` |

---

## Exam Areas

> Quản lý khu vực khám — lưu trữ trong DB nội bộ (bảng `exam_areas`).

### `GET /exam-areas`

Lấy danh sách khu vực khám có phân trang.

**Query params**

| Param | Type | Default | Mô tả |
|---|---|---|---|
| page | integer | 1 | Trang hiện tại |
| pageSize | integer | 10 | Số bản ghi mỗi trang |
| sortField | string | `created_at` | Trường sắp xếp |
| sortOrder | string | `DESC` | `ASC` hoặc `DESC` |
| filters | string | — | Bộ lọc, ví dụ `status:ACTIVE` |

**Response 200**
```json
{
  "success": true,
  "message": "Lấy danh sách khu vực khám thành công",
  "data": {
    "count": 20,
    "rows": [
      {
        "id": "uuid",
        "code": "KVK01",
        "name": "Khu vực khám tổng quát",
        "short_name": "KVTQ",
        "address": "Tầng 1, Tòa nhà A",
        "phone": "0901234567",
        "description": "Khu vực khám bệnh tổng quát",
        "status": "ACTIVE",
        "created_at": "2025-01-01T00:00:00.000Z",
        "updated_at": "2025-01-01T00:00:00.000Z"
      }
    ],
    "totalPages": 2,
    "currentPage": 1
  }
}
```

---

### `POST /exam-areas` 🔒

Tạo mới khu vực khám.

**Body**

| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| code | string | ✅ | Mã khu vực (unique) |
| name | string | ✅ | Tên khu vực |
| short_name | string | | Tên viết tắt |
| address | string | | Địa chỉ |
| phone | string | | Số điện thoại |
| description | string | | Mô tả |
| status | string | | `ACTIVE` hoặc `INACTIVE`, mặc định `ACTIVE` |

```json
{
  "code": "KVK01",
  "name": "Khu vực khám tổng quát",
  "short_name": "KVTQ",
  "address": "Tầng 1, Tòa nhà A",
  "phone": "0901234567",
  "description": "Khu vực khám bệnh tổng quát",
  "status": "ACTIVE"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Tạo khu vực khám thành công",
  "data": { /* bản ghi vừa tạo */ }
}
```

---

### `GET /exam-areas/:id`

Lấy chi tiết khu vực khám theo ID.

**Path params**

| Param | Type | Mô tả |
|---|---|---|
| id | string (UUID) | ID khu vực khám |

**Response 200**
```json
{
  "success": true,
  "message": "Lấy chi tiết khu vực khám thành công",
  "data": {
    "id": "uuid",
    "code": "KVK01",
    "name": "Khu vực khám tổng quát",
    "short_name": "KVTQ",
    "address": "Tầng 1, Tòa nhà A",
    "phone": "0901234567",
    "description": "...",
    "status": "ACTIVE",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

**Response 404**
```json
{
  "success": false,
  "message": "Không tìm thấy khu vực khám"
}
```

---

### `PUT /exam-areas/:id` 🔒

Cập nhật khu vực khám.

**Path params**

| Param | Type | Mô tả |
|---|---|---|
| id | string (UUID) | ID khu vực khám |

**Body** — tất cả fields đều optional, chỉ truyền field cần cập nhật.

```json
{
  "name": "Khu vực khám nội khoa",
  "address": "Tầng 2, Tòa nhà B",
  "phone": "0909876543",
  "status": "ACTIVE"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Cập nhật khu vực khám thành công",
  "data": { /* bản ghi sau khi cập nhật */ }
}
```

---

### `PATCH /exam-areas/:id` 🔒

Bật/Tắt trạng thái khu vực khám. Tự động toggle: `ACTIVE` ↔ `INACTIVE`.

**Path params**

| Param | Type | Mô tả |
|---|---|---|
| id | string (UUID) | ID khu vực khám |

**Body** — không cần body.

**Response 200**
```json
{
  "success": true,
  "message": "Tắt khu vực khám thành công",
  "data": {
    "id": "uuid",
    "status": "INACTIVE",
    ...
  }
}
```

**Response 404**
```json
{
  "success": false,
  "message": "Không tìm thấy khu vực khám"
}
```

---

### `DELETE /exam-areas/:id` 🔒

Xóa khu vực khám.

**Path params**

| Param | Type | Mô tả |
|---|---|---|
| id | string (UUID) | ID khu vực khám |

**Response 200**
```json
{
  "success": true,
  "message": "Xóa khu vực khám thành công"
}
```

---

### `GET /exam-areas/export`

Xuất danh sách khu vực khám ra file Excel (`.xlsx`). Xuất toàn bộ, không phân trang.

**Response** — file `khu-vuc-kham-{timestamp}.xlsx`

| Cột | Field DB |
|---|---|
| Mã khu vực | `code` |
| Tên khu vực | `name` |
| Tên viết tắt | `short_name` |
| Địa chỉ | `address` |
| Số điện thoại | `phone` |
| Mô tả | `description` |
| Trạng thái | `status` |

---

## Patient

> Proxy tới HIS external API. Dữ liệu tìm kiếm/tạo/cập nhật đều đi qua HIS trước, sau đó đồng bộ vào bảng `his_patients` nội bộ.

### `GET /patient`

Tìm kiếm bệnh nhân trên HIS.

**Query params**

| Param | Type | Mô tả |
|---|---|---|
| ip | string | IP server HIS |
| idbv | string | Mã đơn vị bệnh viện |
| patientcode | string | Mã bệnh nhân |
| patientphonenumber | string | Số điện thoại hoặc số CCCD |

**Response 200**
```json
{
  "success": true,
  "message": "Tìm kiếm bệnh nhân thành công",
  "data": [ /* mảng kết quả từ HIS */ ]
}
```

---

### `POST /patient`

Tạo mới bệnh nhân trên HIS, sau đó lưu vào `his_patients`.

**Query params**

| Param | Type | Mô tả |
|---|---|---|
| ip | string | IP server HIS |
| idbv | string | Mã đơn vị bệnh viện |

**Body**

| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| patientid | string | | Mã bệnh nhân — truyền `""` để HIS tự tạo |
| patientfirstname | string | ✅ | Họ, chữ lót |
| patientlastname | string | ✅ | Tên |
| patientnational | string | | Mã quốc gia/quốc tịch |
| patientbirthday | string | | Ngày sinh `yyyy/mm/dd` hoặc `yyyy-mm-dd` |
| patientbirthyear | string | | Năm sinh `yyyy` |
| patientsex | string | | Giới tính `nam`/`nữ` |
| patientethnic | string | | Mã dân tộc |
| patientphonenumber | string | | Số điện thoại |
| addressdetail | string | | Số nhà |
| addressstreet | string | | Tên đường, thôn phố |
| addressward | string | | Mã Phường/Xã |
| addresscity | string | | Mã Quận/Huyện |
| addressprovince | string | | Mã Tỉnh/Thành |
| addresscountry | string | | Mã quốc gia địa chỉ |
| professionid | string | | Mã nghề nghiệp |

```json
{
  "patientid": "",
  "patientfirstname": "Nguyễn Văn",
  "patientlastname": "An",
  "patientbirthday": "1990/05/15",
  "patientsex": "nam",
  "patientphonenumber": "0901234567",
  "addressprovince": "79"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Tạo bệnh nhân thành công",
  "data": { /* response từ HIS, gồm patientid được tạo */ }
}
```

---

### `GET /patient/:id`

Lấy chi tiết bệnh nhân theo mã bệnh nhân HIS.

**Path params**

| Param | Type | Mô tả |
|---|---|---|
| id | string | Mã bệnh nhân HIS (`patientid`) |

**Query params**

| Param | Type | Mô tả |
|---|---|---|
| ip | string | IP server HIS |
| idbv | string | Mã đơn vị bệnh viện |

**Response 200**
```json
{
  "success": true,
  "message": "Lấy chi tiết bệnh nhân thành công",
  "data": {
    "patientid": "BN001",
    "patientfirstname": "Nguyễn Văn",
    "patientlastname": "An",
    "patientbirthday": "1990/05/15",
    "patientsex": "nam",
    "patientphonenumber": "0901234567",
    ...
  }
}
```

**Response 404**
```json
{
  "success": false,
  "message": "Không tìm thấy bệnh nhân"
}
```

---

### `PUT /patient/:id`

Cập nhật hồ sơ bệnh nhân trên HIS, sau đó đồng bộ lại `his_patients`.

**Path params**

| Param | Type | Mô tả |
|---|---|---|
| id | string | Mã bệnh nhân HIS (`patientid`) |

**Query params**

| Param | Type | Mô tả |
|---|---|---|
| ip | string | IP server HIS |
| idbv | string | Mã đơn vị bệnh viện |

**Body** — các field muốn cập nhật (không bắt buộc toàn bộ).

| Field | Type | Mô tả |
|---|---|---|
| patientfirstname | string | Họ, chữ lót |
| patientlastname | string | Tên |
| patientnational | string | Mã quốc gia/quốc tịch |
| patientbirthday | string | Ngày sinh `yyyy/mm/dd` |
| patientbirthyear | string | Năm sinh `yyyy` |
| patientsex | string | Giới tính |
| patientethnic | string | Mã dân tộc |
| patientphonenumber | string | Số điện thoại |
| addressdetail | string | Số nhà |
| addressstreet | string | Tên đường |
| addressward | string | Mã Phường/Xã |
| addresscity | string | Mã Quận/Huyện |
| addressprovince | string | Mã Tỉnh/Thành |
| addresscountry | string | Mã quốc gia |
| professionid | string | Mã nghề nghiệp |

```json
{
  "patientphonenumber": "0909999888",
  "addressprovince": "79",
  "addresscity": "760"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Cập nhật hồ sơ bệnh nhân thành công",
  "data": { /* response từ HIS sau khi cập nhật */ }
}
```

---

### `POST /patient/merge`

Gộp/Xử lý trùng mã bệnh nhân HIS. Giữ lại `patientid_keep`, chuyển toàn bộ dữ liệu lịch sử của `patientid_merge` sang, sau đó xóa bản trùng trong DB nội bộ.

**Body**

| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| patientid_keep | string | ✅ | Mã bệnh nhân được giữ lại |
| patientid_merge | string | ✅ | Mã bệnh nhân bị gộp vào (sẽ bị xóa) |

**Query params**

| Param | Type | Mô tả |
|---|---|---|
| ip | string | IP server HIS |
| idbv | string | Mã đơn vị bệnh viện |

```json
{
  "patientid_keep": "BN001",
  "patientid_merge": "BN002"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Gộp bệnh nhân BN002 vào BN001 thành công",
  "data": { /* response từ HIS */ }
}
```

**Response 400 — thiếu tham số**
```json
{
  "success": false,
  "message": "Thiếu mã bệnh nhân cần giữ lại hoặc cần gộp"
}
```

**Response 400 — trùng mã**
```json
{
  "success": false,
  "message": "Không thể gộp bệnh nhân với chính nó"
}
```

---

## Ghi chú chung

### Luồng đồng bộ HIS ↔ DB nội bộ

| Endpoint | HIS | DB nội bộ |
|---|---|---|
| `POST /patient` | Tạo mới | Lưu vào `his_patients` |
| `PUT /patient/:id` | Cập nhật | Đồng bộ lại `his_patients` |
| `POST /patient/merge` | Gộp | Xóa bản trùng khỏi `his_patients` |
| `GET /his-services/*` | Đọc/Ghi | Không lưu nội bộ |
| `GET/POST/PUT/DELETE /exam-areas/*` | Không dùng | Chỉ lưu DB nội bộ `exam_areas` |

### Cấu trúc response chuẩn

```json
{
  "success": true | false,
  "message": "Thông báo tiếng Việt",
  "message_en": "English message",
  "data": { } | [ ]
}
```

### Lỗi server

```json
{
  "success": false,
  "message": "Internal server error"
}
```
