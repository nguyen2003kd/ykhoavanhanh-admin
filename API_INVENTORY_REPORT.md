# Báo cáo kiểm kê API — BVVH Hospital Frontend

> Ngày lập: 2026-06-17
> Dùng để báo cáo backend/management

---

## Tổng quan

| # | Hạng mục | Số lượng | Priority cao |
|---|---------|---------|------------|
| 1 | API chưa có | 69 endpoint | 37 |
| 2 | API đã có nhưng thiếu trường | 3 endpoint | 3 |
| 3 | Type chưa định nghĩa | 8 type | 4 |

---

## Phần 1 — API chưa có

> Frontend đã có UI nhưng chưa có API endpoint.

---

### 1.1 📊 Dashboard — 4 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 1 | Thống kê tổng quan (doanh thu, hoàn tiền, phiếu, BS, nội dung) | GET | `/api/v1.0/dashboard/stats` | 🔴 Cao |
| 2 | Lịch khám ngày mai | GET | `/api/v1.0/dashboard/upcoming-schedules` | 🔴 Cao |
| 3 | Tỷ lệ trạng thái phiếu (pie chart) | GET | `/api/v1.0/dashboard/ticket-ratios` | 🔴 Cao |
| 4 | Danh sách phiếu gần đây | GET | `/api/v1.0/dashboard/recent-tickets` | 🔴 Cao |

---



### 1.3 🏥 Khu vực khám — 5 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 10 | Danh sách khu vực khám | GET | `/api/v1.0/exam-areas` | 🔴 Cao |
| 11 | Thêm khu vực khám | POST | `/api/v1.0/exam-areas` | 🔴 Cao |
| 12 | Cập nhật khu vực khám | PUT | `/api/v1.0/exam-areas/{id}` | 🔴 Cao |
| 13 | Xóa khu vực khám | DELETE | `/api/v1.0/exam-areas/{id}` | 🔴 Cao |
| 14 | Bật/tắt hoạt động | PATCH | `/api/v1.0/exam-areas/{id}/toggle` | 🔴 Cao |

---

### 1.4 🚪 Phòng khám — HIS chỉ GET, cần thêm 3 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 15 | Thêm phòng khám | POST | `/api/v1.0/rooms` | 🔴 Cao |
| 16 | Cập nhật phòng khám | PUT | `/api/v1.0/rooms/{id}` | 🔴 Cao |
| 17 | Xóa phòng khám | DELETE | `/api/v1.0/rooms/{id}` | 🔴 Cao |

HIS hiện chỉ trả GET. Cần xác nhận backend có endpoint POST/PUT/DELETE riêng không.

---

### 1.5 👨‍⚕️ Bác sĩ — HIS thiếu PUT + 2 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 18 | Cập nhật bác sĩ | PUT | `/api/v1.0/doctors/{id}` | 🔴 Cao |
| 19 | Xuất danh sách bác sĩ | GET | `/api/v1.0/doctors/export` | 🟡 TB |
| 20 | Nhập danh sách bác sĩ | POST | `/api/v1.0/doctors/import` | 🟡 TB |

---

### 1.6 💰 dịch vụ khám — HIS chỉ GET, cần thêm 4 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 21 | Thêm giá dịch vụ | POST | `/api/v1.0/services` | 🔴 Cao |
| 22 | Cập nhật giá dịch vụ | PUT | `/api/v1.0/services/{id}` | 🔴 Cao |
| 23 | Xóa giá dịch vụ | DELETE | `/api/v1.0/services/{id}` | 🔴 Cao |
| 24 | Xuất báo cáo giá dịch vụ | GET | `/api/v1.0/services/export` | 🟡 TB |

---


### 1.8 📅 Lịch làm việc bác sĩ — 6 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 32 | Danh sách lịch làm việc | GET | `/api/v1.0/schedules` | 🔴 Cao |
| 33 | Thêm lịch làm việc | POST | `/api/v1.0/schedules` | 🔴 Cao |
| 34 | Cập nhật lịch làm việc | PUT | `/api/v1.0/schedules/{id}` | 🔴 Cao |
| 35 | Xóa lịch làm việc | DELETE | `/api/v1.0/schedules/{id}` | 🔴 Cao |
| 36 | Bật/tắt lịch | PATCH | `/api/v1.0/schedules/{id}/toggle` | 🔴 Cao |
| 37 | Import lịch khám | POST | `/api/v1.0/schedules/import` | 🟡 TB |

---

### 1.9 👤 Tài khoản (Users) — 6 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 38 | Danh sách tài khoản | GET | `/api/v1.0/users` | 🟡 TB |
| 39 | Chi tiết tài khoản | GET | `/api/v1.0/users/{id}` | 🟡 TB |
| 40 | Thêm tài khoản | POST | `/api/v1.0/users` | 🟡 TB |
| 41 | Cập nhật tài khoản | PUT | `/api/v1.0/users/{id}` | 🟡 TB |
| 42 | Khóa/mở khóa tài khoản | PATCH | `/api/v1.0/users/{id}/toggle` | 🟡 TB |
| 43 | Ngưng hoạt động | PATCH | `/api/v1.0/users/{id}/deactivate` | 🟡 TB |

---

### 1.10 🏥 Bệnh nhân (Patients) — 4 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 44 | Danh sách bệnh nhân | GET | `/api/v1.0/patients` | 🟡 TB |
| 45 | Chi tiết bệnh nhân | GET | `/api/v1.0/patients/{id}` | 🟡 TB |
| 46 | Cập nhật hồ sơ BN | PUT | `/api/v1.0/patients/{id}` | 🟡 TB |
| 47 | Xử lý trùng/lệch mã BN HIS | POST | `/api/v1.0/patients/{id}/merge` | 🟡 TB |

---

### 1.11 🔔 Thông báo — 6 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 48 | Danh sách thông báo | GET | `/api/v1.0/notifications` | 🟡 TB |
| 49 | Chi tiết thông báo | GET | `/api/v1.0/notifications/{id}` | 🟡 TB |
| 50 | Tạo thông báo | POST | `/api/v1.0/notifications` | 🟡 TB |
| 51 | Gửi ngay | POST | `/api/v1.0/notifications/{id}/send` | 🟡 TB |
| 52 | Lên lịch gửi | POST | `/api/v1.0/notifications/{id}/schedule` | 🟡 TB |
| 53 | Quản lý mẫu thông báo | CRUD | `/api/v1.0/notification-templates` | 🟡 TB |

---

### 1.12 ⭐ Đánh giá — 5 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 54 | Danh sách đánh giá | GET | `/api/v1.0/reviews` | 🟡 TB |
| 55 | Chi tiết đánh giá | GET | `/api/v1.0/reviews/{id}` | 🟡 TB |
| 56 | Cập nhật trạng thái xử lý | PUT | `/api/v1.0/reviews/{id}` | 🟡 TB |
| 57 | Xuất báo cáo đánh giá | GET | `/api/v1.0/reviews/export` | 🟡 TB |
| 58 | Quản lý biểu mẫu đánh giá | CRUD | `/api/v1.0/review-templates` | 🟡 TB |

---

### 1.13 💬 Chat CSKH — 5 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 59 | Danh sách cuộc chat | GET | `/api/v1.0/chats` | 🟡 TB |
| 60 | Chi tiết cuộc chat | GET | `/api/v1.0/chats/{id}` | 🟡 TB |
| 61 | Phản hồi tin nhắn | POST | `/api/v1.0/chats/{id}/reply` | 🟡 TB |
| 62 | Gán người xử lý | PATCH | `/api/v1.0/chats/{id}/assign` | 🟡 TB |
| 63 | Đóng cuộc chat | PATCH | `/api/v1.0/chats/{id}/close` | 🟡 TB |

---

### 1.14 📈 Báo cáo — 3 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 64 | Báo cáo doanh thu | GET | `/api/v1.0/reports/revenue` | 🟡 TB |
| 65 | Báo cáo đối soát ngân hàng/HIS | GET | `/api/v1.0/reports/reconciliation` | 🟡 TB |
| 66 | Báo cáo đánh giá chất lượng | GET | `/api/v1.0/reports/reviews` | 🟡 TB |

---

### 1.15 🔐 Phân quyền — 3 API

| # | Chức năng | Method | Endpoint | Priority |
|---|-----------|--------|----------|----------|
| 67 | Danh sách vai trò | GET | `/api/v1.0/roles` | 🟢 Thấp |
| 68 | Danh sách quyền | GET | `/api/v1.0/permissions` | 🟢 Thấp |
| 69 | Gán vai trò cho user | PUT | `/api/v1.0/users/{id}/roles` | 🟢 Thấp |

---

## Phần 2 — API đã có nhưng THIẾU TRƯỜNG dữ liệu

> API đã tích hợp nhưng schema trả về chưa đủ trường theo SRS.

---

### 2.1 🚪 HIS Rooms API (`GET /rooms`)

| Trường đã có | Trường CÒN THIẾU | Mô tả |
|-------------|-----------------|-------|
| `roomid` | | Mã phòng |
| `roomname` | | Tên phòng khám |
| `description` | | Mô tả chung |
| `updatetime` | | Thời gian cập nhật |
| `mavp` | | Mã dịch vụ liên kết |
| | ❌ `clinic_type` | Loại phòng khám |
| | ❌ `guide_room` | Hướng dẫn vào khám |
| | ❌ `booking_note` | Ghi chú đặt khám |
| | ❌ `area_id` | Khu khám bệnh |
| | ❌ `internal_id` | ID nội bộ đồng bộ HIS |
| | ❌ `status` | Trạng thái hoạt động |

---

### 2.2 👨‍⚕️ HIS Doctors API (`GET /doctors`)

| Trường đã có | Trường CÒN THIẾU | Mô tả |
|-------------|-----------------|-------|
| `doctorid` | | Mã bác sĩ |
| `doctorname` | | Tên bác sĩ |
| `description` | | Mô tả/Ghi chú |
| `updatetime` | | Thời gian cập nhật |
| | ❌ `title` | Chức danh |
| | ❌ `phone` | Điện thoại |
| | ❌ `email` | Email |
| | ❌ `gender` | Giới tính |
| | ❌ `date_of_birth` | Ngày sinh |
| | ❌ `booking_note` | Ghi chú đặt khám |
| | ❌ `internal_id` | ID nội bộ |
| | ❌ `account_status` | Trạng thái (active/inactive) |
| | ❌ `booking_group` | Nhóm đặt khám |
| | ❌ `display_group` | Nhóm hiển thị giá |
| | ❌ `show_price` | Hiển thị giá |
| | ❌ `display_priority` | Ưu tiên hiển thị |
| | ❌ `avatar_url` | Ảnh đại diện |
| | ❌ `specialty_ids` | Chuyên khoa phụ trách |

---

### 2.3 💰 HIS Services API (`GET /his-services`)

| Trường đã có | Trường CÒN THIẾU | Mô tả |
|-------------|-----------------|-------|
| `serviceid` | | Mã dịch vụ |
| `servicetype` | | Loại dịch vụ |
| `servicename` | | Tên dịch vụ |
| `price` | | Giá dịch vụ |
| `fromdate` | | Ngày áp dụng |
| `insurancetype` | | Loại khám bảo hiểm |
| `description` | | Mô tả |
| `updatetime` | | Thời gian cập nhật |
| | ❌ `service_group` | Nhóm dịch vụ |
| | ❌ `base_price` | Giá gốc |
| | ❌ `deposit` | Giá tạm ứng |
| | ❌ `booking_note` | Ghi chú đặt khám |
| | ❌ `guide_room` | Phòng hướng dẫn vào khám |
| | ❌ `internal_id` | ID nội bộ |
| | ❌ `booking_group` | Nhóm đặt khám |
| | ❌ `display_group` | Nhóm hiển thị |
| | ❌ `display_priority` | Ưu tiên hiển thị |

---

## Phần 3 — Type chưa có trong `src/types/hospital-admin.ts`

| # | Type cần tạo | Trường chính | API liên quan | Priority |
|---|-------------|-------------|---------------|----------|
| 1 | `AdminUser` | `name`, `phone`, `email`, `role`, `status`, `last_login_at` | `/users` | 🔴 Cao |
| 2 | `AdminPatient` | `name`, `dob`, `gender`, `id_card`, `phone`, `his_patient_code`, `family_members[]` | `/patients` | 🔴 Cao |
| 3 | `AdminNotification` | `title`, `content`, `type`, `recipient_group`, `send_status`, `read_status` | `/notifications` | 🟡 TB |
| 4 | `AdminReview` | `review_code`, `ticket_code`, `patient_name`, `doctor_name`, `stars[]`, `process_status` | `/reviews` | 🟡 TB |
| 5 | `AdminReviewTemplate` | `name`, `description`, `questions[]`, `question_type`, `required` | `/review-templates` | 🟡 TB |
| 6 | `AdminChat` | `chat_code`, `sender_name`, `topic`, `messages[]`, `assignee`, `status` | `/chats` | 🟡 TB |
| 7 | `AdminDashboardStats` | `revenue`, `refund`, `total_tickets`, `upcoming_schedules[]`, `ticket_status_ratios[]` | `/dashboard` | 🔴 Cao |
| 8 | `HisSyncTicket` | `ticket_code`, `his_patient_code`, `patient_name`, `sync_status`, `error_message` | `/sync-his` | 🔴 Cao |

---

## Phần 4 — Lưu ý cho Backend Team

### 4.1 HIS API chỉ hỗ trợ GET
Các API kết nối HIS (`/rooms`, `/doctors`, `/his-services`) hiện chỉ trả về GET. Frontend cần thêm POST/PUT/DELETE.

**Cần xác nhận:**
- HIS có endpoint POST/PUT/DELETE không?
- Hay frontend phải gọi qua API trung gian của backend?
- Nếu HIS chỉ đọc, backend cần cung cấp API riêng để quản lý metadata.

### 4.2 HIS schema thiếu trường
HIS trả về rất ít trường. Ví dụ: Doctors chỉ có `doctorid`, `doctorname`, `description`, `updatetime` — trong khi App cần ~15 trường.

**Giải pháp đề xuất:**
- **A**: HIS bổ sung trường vào response
- **B**: Backend có bảng metadata riêng, API trả về merge HIS + metadata

### 4.3 Type cần đồng bộ
Các type hiện có cần bổ sung trường:
- `ExamArea` → thêm `status`
- `Schedule` → thêm `end_time`, `slot_ticket_limit`
- `Post` → thêm `category`, `video_url`, `publish_time`, `display_status`
- `ExamTicket` → thêm `exam_time`, `queue_number`, `payment_status`, `total_amount`
