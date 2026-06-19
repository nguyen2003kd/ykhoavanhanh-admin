# Admin Gap Analysis — BVVH Hospital Frontend

> Dựa trên SRS `[BVVH]_SRS.docx` (2431 dòng, toàn bộ phần Admin) và codebase hiện tại.
> Ngày phân tích: 2026-06-17

---

## Tóm tắt nhanh

| STT | Module SRS | Trạng thái src | Tỷ lệ |
|-----|-----------|---------------|-------|
| 1 | Dashboard | UI mock cứng | ~15% |
| 2 | Đồng bộ HIS | Chỉ có trong Operations (mock) | ~10% |
| 3 | Khu vực khám (Exam Areas) | UI + mock | ~30% |
| 4 | Chuyên khoa (Specialties) | **API integrated** | ~90% |
| 5 | Phòng khám (Clinics) | **API HIS** (roomsApi, chỉ GET) | ~60% |
| 6 | Bác sĩ (Doctors) | **API HIS** (doctorsApi) | ~80% |
| 7 | Tài khoản (Users) | UI tồn tại | ~40% |
| 8 | Bệnh nhân (Patients) | UI tồn tại | ~30% |
| 9 | Lịch đặt khám (Tickets) | UI + mock | ~25% |
| 10 | Lịch làm việc bác sĩ (Schedules) | UI + mock | ~30% |
| 11 | Giá dịch vụ (Exam Services) | **API HIS** (hisServicesApi, chỉ GET) | ~50% |
| 12 | Nội dung (Content/News) | **API integrated** | ~85% |
| 13 | Thông báo (Notifications) | UI tồn tại | ~20% |
| 14 | Đánh giá (Reviews) | UI tồn tại | ~20% |
| 15 | Chat CSKH (Chats) | UI tồn tại | ~20% |
| 16 | Phân quyền (RBAC) | Chưa có | ~10% |

---

## 1. Dashboard

**Yêu cầu SRS:** Bộ lọc tuần, thẻ thống kê (doanh thu, hoàn tiền, phiếu, bác sĩ, nội dung), lịch khám ngày mai, tỷ lệ trạng thái phiếu (pie chart), phiếu gần đây với trạng thái đồng bộ HIS + actions (Xem/Cập nhật/Hủy), điều hướng nhanh, phân quyền theo vai trò.

**Thực tế:** 6 KPI cards mock cứng. Không có bộ lọc tuần, doanh thu, lịch khám ngày mai, biểu đồ, phiếu gần đây thật, trạng thái HIS, phân quyền.

**Còn thiếu:** API Dashboard, bộ lọc tuần, thẻ thống kê từ API, lịch khám ngày mai, pie chart trạng thái phiếu, bảng phiếu gần đây với HIS sync + actions, phân quyền.

---

## 2. Đồng bộ HIS

**Yêu cầu SRS:** Trang Đồng bộ HIS riêng biệt. Danh sách phiếu cần xử lý thủ công (lỗi, thiếu mã BN, đổi BS/phòng, hủy, hoàn tiền). Tìm kiếm/lọc theo mã phiếu, mã BN, tên, SĐT, BS, phòng, ngày khám, trạng thái đồng bộ. Chi tiết: thông tin BN, lịch hẹn, khám, slot, STT, dịch vụ, giá, thanh toán, trạng thái đồng bộ, lỗi. Thao tác: Xem chi tiết, Đồng bộ, Đồng bộ lại. Lịch sử đồng bộ.

**Thực tế:** Chỉ có trong Operations page (mock từ Zustand store). Không có trang riêng, không có trạng thái đồng bộ HIS, không có lịch sử.

**Còn thiếu:** Trang Đồng bộ HIS riêng, API lấy danh sách cần đồng bộ, API đồng bộ thủ công, hiển thị trạng thái HIS trong phiếu, lịch sử đồng bộ.

---

## 3. Khu vực khám (Exam Areas)

**Yêu cầu SRS:** Quản lý khu vực khám (PK1, BV). Thông tin: tên, mô tả, địa chỉ, ID nội bộ, trạng thái. Thao tác CRUD, tìm kiếm, bật/tắt. Validation: không xóa khu đã dùng trong phòng khám, lịch khám, phiếu.

**Thực tế:** UI HospitalCrudPage với mock data.

**Còn thiếu:** API Exam Areas (GET, POST, PUT, DELETE), tích hợp API, validation xóa.

---

## 4. Chuyên khoa (Specialties)

**Yêu cầu SRS:** Quản lý chuyên khoa với tên, phòng hướng dẫn, ghi chú đặt khám, ID nội bộ, nhóm đặt khám, ưu tiên hiển thị, ẩn tìm kiếm.

**Thực tế:** `specialtiesApi.ts` dùng `createApi`. GET (phân trang), POST, PUT, DELETE. Toast + server-side pagination.

**Còn thiếu:** Validation xóa chuyên khoa đã có dữ liệu liên quan. Bộ lọc trạng thái.

---

## 5. Phòng khám (Clinics)

**Yêu cầu SRS:** Quản lý phòng khám theo khu vực. Thông tin: tên, loại, hướng dẫn, ghi chú, khu khám, mô tả khu, ID nội bộ. CRUD, tìm kiếm. Validation: không xóa phòng đã dùng trong lịch khám, phiếu, HIS.

**Thực tế:** `roomsApi.ts` custom HIS. **Chỉ có GET**. HIS schema: roomid, roomname, description, updatetime, mavp.

**Còn thiếu:** API POST/PUT/DELETE (nếu backend hỗ trợ), validation xóa.

---

## 6. Bác sĩ (Doctors)

**Yêu cầu SRS:** Quản lý bác sĩ với tên, chức danh, SĐT, email, giới tính, ngày sinh, ghi chú, ID nội bộ, trạng thái, nhóm đặt khám, ưu tiên, nhóm hiển thị giá, hiển thị giá, ảnh đại diện, chuyên khoa. CRUD + xuất/nhập danh sách. Tìm kiếm/lọc theo tên, SĐT, email, ID, trạng thái, chuyên khoa. Validation: không xóa BS đã dùng trong lịch khám, phiếu, HIS.

**Thực tế:** `doctorsApi.ts` custom HIS. GET list, GET by ID, POST, DELETE. **Chưa có PUT**. HIS schema: doctorid, doctorname, description, updatetime.

**Còn thiếu:** API PUT, xuất/nhập Excel, upload ảnh đại diện, chọn chuyên khoa, bộ lọc chuyên khoa/trạng thái, validation xóa.

---

## 7. Tài khoản (Users)

**Yêu cầu SRS:** Quản lý tài khoản đăng nhập. Thông tin: họ tên, SĐT, email, mật khẩu (nếu tạo admin), trạng thái, ghi chú. Thao tác: thêm, cập nhật, khóa/mở khóa, ngưng hoạt động. Tìm kiếm/lọc theo tên, SĐT, email, mã TK, loại TK, trạng thái, vai trò, ngày tạo. Chi tiết: số lượng hồ sơ BN liên kết, số lịch khám đã đặt, lần đăng nhập gần nhất. Phân quyền vai trò.

**Thực tế:** UI tồn tại, chưa kiểm tra API đầy đủ.

**Còn thiếu:** Kiểm tra/tích hợp API Users, khóa/mở khóa, xem chi tiết với hồ sơ BN liên kết, phân quyền vai trò.

---

## 8. Bệnh nhân (Patients)

**Yêu cầu SRS:** Quản lý hồ sơ BN/sổ sức khỏe. Thông tin: họ tên, ngày sinh, giới tính, nghề nghiệp, quốc tịch, dân tộc, CCCD, SĐT, mã BN HIS. Thành viên gia đình. Sức khỏe: tiểu sử bệnh lý, dị ứng, ghi chú, BHYT. Xử lý trùng/lệch mã BN HIS. Tìm kiếm/lọc theo tên, SĐT, CCCD, mã BN HIS, loại hồ sơ, mối quan hệ, trạng thái, ngày tạo.

**Thực tế:** UI tồn tại, chưa kiểm tra chi tiết.

**Còn thiếu:** Kiểm tra/tích hợp API Patients, hiển thị thành viên gia đình, xử lý trùng/lệch mã BN HIS, thông tin sức khỏe/BHYT.

---

## 9. Lịch đặt khám (Tickets / Appointments)

**Yêu cầu SRS:** Quản lý lịch đặt khám phát sinh từ App. Thông tin: người đi khám, mã BN HIS, tài khoản đặt, khu vực, chuyên khoa, phòng, bác sĩ, ngày/giờ khám, STT, dịch vụ, tổng tiền, trạng thái thanh toán, trạng thái lịch khám, trạng thái đồng bộ HIS, ghi chú. Thao tác: xem chi tiết, cập nhật BS/phòng, hủy lịch. Tìm kiếm/lọc theo mã phiếu, mã BN, tên, SĐT, CCCD, BS, ngày khám, khu vực, chuyên khoa, phòng, đối tượng khám, trạng thái lịch, trạng thái thanh toán, trạng thái HIS. Chi tiết: thông tin người đặt, người đi khám, giá gốc, giảm giá, BHYT, phương thức thanh toán, lý do hủy, trạng thái hoàn tiền.

**Thực tế:** `appointments/page.tsx` UI với mock schedules. `operations/page.tsx` UI với mock tickets (đồng bộ mã BN, đổi phòng/BS, hoàn tiền, hủy — tất cả mock).

**Còn thiếu:** API Tickets (GET, PUT, DELETE), API đồng bộ mã BN, API đổi phòng/BS, API hoàn tiền, API hủy phiếu, API trạng thái HIS, hiển thị đầy đủ trạng thái (lịch khám, thanh toán, HIS), chi tiết phiếu với thanh toán/BHYT/giảm giá.

---

## 10. Lịch làm việc bác sĩ (Schedules)

**Yêu cầu SRS:** Quản lý lịch làm việc BS. Thông tin: dịch vụ khám, chuyên khoa, phòng khám, bác sĩ, ngày làm việc, buổi làm việc, giờ bắt đầu/kết thúc, thời gian mỗi slot, số phiếu tối đa/slot, trạng thái. Ngày làm việc: chọn ngày cụ thể trong tháng (không chỉ checkbox thứ). Tùy chỉnh số phiếu theo khung giờ. Thao tác: thêm, cập nhật, tắt/bật, xóa (nếu chưa phát sinh phiếu), import lịch. Tìm kiếm/lọc theo BS, chuyên khoa, phòng, dịch vụ, khu khám, buổi, trạng thái. Validation: không trùng lịch BS, cảnh báo khi cập nhật/tắt lịch đã có BN đặt.

**Thực tế:** UI HospitalCrudPage với form đầy đủ nhưng mock data.

**Còn thiếu:** API Schedules (GET, POST, PUT, DELETE), tích hợp API, chọn ngày cụ thể trong tháng, tùy chỉnh số phiếu theo khung giờ, import lịch, kiểm tra trùng lịch, cảnh báo khi cập nhật/tắt lịch đã có BN.

---

## 11. Giá dịch vụ (Exam Services)

**Yêu cầu SRS:** Quản lý giá dịch vụ khám. Thông tin: tên dịch vụ, loại, nhóm, loại khám BHYT, giá dịch vụ, giá gốc, tạm ứng, ghi chú, phòng hướng dẫn, ID nội bộ, nhóm đặt khám, nhóm hiển thị, ưu tiên. CRUD + xuất báo cáo. Tìm kiếm theo tên, loại, ID. Validation: giá phải là số, không âm.

**Thực tế:** `hisServicesApi.ts` custom HIS. **Chỉ có GET**. HIS schema: serviceid, servicetype, servicename, price, insurancetype, description, updatetime.

**Còn thiếu:** API POST/PUT/DELETE (nếu backend hỗ trợ), xuất báo cáo, bộ lọc theo loại dịch vụ/BHYT.

---

## 12. Nội dung (Content/News)

**Yêu cầu SRS:** Quản lý tin tức, kiến thức sức khỏe, video, khuyến mãi, hướng dẫn. Thông tin: tiêu đề, danh mục, mô tả ngắn, nội dung chi tiết, ảnh đại diện, video/link, file đính kèm, thời gian đăng, trạng thái (Nháp/Đang hiển thị/Đã ẩn). CRUD + tìm kiếm/lọc theo tiêu đề, danh mục, tác giả, trạng thái, thời gian.

**Thực tế:** `postsApi.ts` dùng `createApi`. GET (phân trang), POST, PUT, DELETE. Toast + server-side pagination.

**Còn thiếu:** Upload ảnh/video/file, trạng thái Nháp/Đang hiển thị/Đã ẩn, danh mục đầy đủ, lên lịch đăng.

---

## 13. Thông báo (Notifications)

**Yêu cầu SRS:** Quản lý thông báo tự động + thủ công. Thông tin: tiêu đề, nội dung, loại thông báo, nhóm người nhận, thời gian gửi, trạng thái gửi. Loại: đặt khám, thanh toán, nhắc lịch, thay đổi lịch, hủy/hoàn tiền, kết quả khám, mời đánh giá, tin tức, hệ thống. Thao tác: tạo, gửi ngay/lên lịch, quản lý mẫu, bật/tắt. Tìm kiếm/lọc theo tiêu đề, nội dung, SĐT, loại, trạng thái gửi, trạng thái đọc, thời gian.

**Thực tế:** UI tồn tại, chưa kiểm tra API.

**Còn thiếu:** Kiểm tra/tích hợp API Notifications, gửi thông báo thủ công, lên lịch gửi, quản lý mẫu, trạng thái gửi/đọc.

---

## 14. Đánh giá (Reviews)

**Yêu cầu SRS:** Quản lý đánh giá người dùng. Thông tin: mã đánh giá, mã phiếu, người đi khám, mã BN HIS, SĐT, BS/dịch vụ được đánh giá, nội dung theo tiêu chí, số sao, góp ý tự do, ngày gửi, trạng thái xử lý, ghi chú xử lý, người xử lý. Tìm kiếm/lọc theo người đánh giá, SĐT, mã phiếu, mã BN, BS, loại đánh giá, số sao, chuyên khoa, phòng, trạng thái xử lý, ngày gửi. Thao tác: xem chi tiết, cập nhật xử lý, xuất báo cáo. Admin tạo/cấu hình biểu mẫu đánh giá (câu hỏi, loại câu hỏi: sao, trắc nghiệm, chọn nhiều, câu trả lời ngắn, góp ý).

**Thực tế:** UI tồn tại, chưa kiểm tra API.

**Còn thiếu:** Kiểm tra/tích hợp API Reviews, cập nhật trạng thái xử lý, xuất báo cáo, quản lý biểu mẫu đánh giá.

---

## 15. Chat CSKH (Chats)

**Yêu cầu SRS:** Quản lý cuộc trò chuyện từ App/Mini App. Thông tin: mã cuộc trò chuyện, người gửi, SĐT, mã BN HIS, chủ đề hỗ trợ, nội dung tin nhắn, tệp đính kèm, nhân sự phụ trách, trạng thái xử lý (Mới, đang xử lý, chờ phản hồi, đã xử lý, đã đóng), thời gian. Thao tác: xem chi tiết, phản hồi, gán người xử lý, đóng cuộc chat. Tìm kiếm/lọc theo tên, SĐT, mã BN, nội dung tin nhắn, trạng thái, chủ đề, thời gian. Ghi chú nội bộ, lịch sử thao tác.

**Thực tế:** UI tồn tại, chưa kiểm tra API.

**Còn thiếu:** Kiểm tra/tích hợp API Chats, phản hồi tin nhắn, gán người xử lý, đóng cuộc chat, ghi chú nội bộ, lịch sử thao tác.

---

## 16. Phân quyền (RBAC)

**Yêu cầu SRS:** Phân quyền đa vai trò:
- Admin: toàn quyền (đồng bộ HIS, chỉnh sửa MABN/BS/phòng, khai báo danh mục, hoàn hủy phiếu, báo cáo đối soát)
- Kế toán: hoàn hủy phiếu, trả tiền BN, báo cáo đối soát ngân hàng/HIS
- CSKH: lên lịch nhắc tái khám, mẫu tin nhắn, quản lý khảo sát đánh giá, chat tư vấn
- Marketing: chương trình khuyến mãi, quảng cáo, bán dịch vụ gói khám
- Tiếp tân: lập/chỉnh sửa lịch khám, lịch nghỉ phép BS
- User thường: xem lịch khám BS (chỉ xem)

**Thực tế:** Chưa có hệ thống phân quyền. Tất cả người dùng đăng nhập đều có cùng quyền truy cập.

**Còn thiếu:** Hệ thống RBAC, phân quyền theo vai trò, kiểm tra quyền trước khi hiển thị thao tác.

---

## Chi tiết trường dữ liệu còn thiếu theo module

> So sánh giữa schema/type hiện tại trong codebase với trường yêu cầu trong SRS.

### 1. Phòng khám (Rooms)

| Trường SRS | Trường API HisRoom hiện tại | Trạng thái |
|-----------|----------------------------|------------|
| Tên phòng khám | `roomname` | ✅ |
| Loại phòng khám | — | ❌ **Thiếu** |
| Hướng dẫn vào khám | — | ❌ **Thiếu** |
| Ghi chú đặt khám | — | ❌ **Thiếu** |
| Khu khám bệnh | — | ❌ **Thiếu** |
| Mô tả khu khám | `description` | ⚠️ Khớp nghĩa nhưng chưa rõ khu vực |
| ID nội bộ | `mavp` / `roomid` | ⚠️ Có `mavp`, chưa rõ `internal_id` |
| Trạng thái hoạt động | — | ❌ **Thiếu** |

**Type `Clinic` trong `types/hospital-admin.ts` có đủ trường**: `clinic_type`, `guide_room`, `booking_note`, `area_id`, `internal_id`, nhưng **API HIS `HisRoom` không trả về các trường này**.

---

### 2. Bác sĩ (Doctors)

| Trường SRS | Trường API HisDoctor hiện tại | Trạng thái |
|-----------|------------------------------|------------|
| Tên bác sĩ | `doctorname` | ✅ |
| Chức danh | — | ❌ **Thiếu** |
| Điện thoại | — | ❌ **Thiếu** |
| Email | — | ❌ **Thiếu** |
| Giới tính | — | ❌ **Thiếu** |
| Ngày sinh | — | ❌ **Thiếu** |
| Ghi chú đặt khám | `description` | ⚠️ Khớp nghĩa nhưng không rõ ràng |
| ID nội bộ | `doctorid` | ⚠️ Có nhưng chưa rõ `internal_id` riêng |
| Trạng thái | — | ❌ **Thiếu** |
| Nhóm đặt khám | — | ❌ **Thiếu** |
| Ưu tiên hiển thị | — | ❌ **Thiếu** |
| Nhóm hiển thị giá | — | ❌ **Thiếu** |
| Hiển thị giá | — | ❌ **Thiếu** |
| Ảnh đại diện | — | ❌ **Thiếu** |
| Chuyên khoa phụ trách | — | ❌ **Thiếu** |

**Type `Doctor` trong `types/hospital-admin.ts` có đủ trường**: `title`, `phone`, `email`, `gender`, `date_of_birth`, `booking_note`, `internal_id`, `account_status`, `booking_group`, `display_group`, `show_price`, `display_priority`, nhưng **API HIS `HisDoctor` chỉ trả về `doctorid`, `doctorname`, `description`, `updatetime`**.

---

### 3. Giá dịch vụ (Exam Services)

| Trường SRS | Trường API HisService hiện tại | Trạng thái |
|-----------|-------------------------------|------------|
| Tên dịch vụ | `servicename` | ✅ |
| Loại dịch vụ | `servicetype` | ✅ |
| Nhóm dịch vụ | — | ❌ **Thiếu** |
| Loại khám bảo hiểm | `insurancetype` | ✅ |
| Giá dịch vụ | `price` | ✅ |
| Giá gốc | — | ❌ **Thiếu** |
| Giá tạm ứng | — | ❌ **Thiếu** |
| Ghi chú đặt khám | `description` | ⚠️ Khớp nghĩa nhưng không rõ ràng |
| Phòng hướng dẫn vào khám | — | ❌ **Thiếu** |
| ID nội bộ | `serviceid` | ⚠️ Có nhưng chưa rõ `internal_id` riêng |
| Nhóm đặt khám | — | ❌ **Thiếu** |
| Nhóm hiển thị | — | ❌ **Thiếu** |
| Ưu tiên hiển thị | — | ❌ **Thiếu** |

**Type `ExamService` trong `types/hospital-admin.ts` có đủ trường**: `service_group`, `base_price`, `deposit`, `booking_note`, `guide_room`, `internal_id`, `booking_group`, `display_group`, `display_priority`, nhưng **API HIS `HisService` không trả về các trường này**.

---

### 4. Chuyên khoa (Specialties)

| Trường SRS | Type AdminSpecialty hiện tại | Trạng thái |
|-----------|-----------------------------|------------|
| Tên chuyên khoa | `name` | ✅ |
| Phòng hướng dẫn vào khám | `guide_room` | ✅ |
| Ghi chú đặt khám | `booking_note` | ✅ |
| ID nội bộ | `internal_id` | ✅ |
| Nhóm đặt khám | `booking_group` | ✅ |
| Ưu tiên hiển thị | `display_priority` | ✅ |
| Ẩn tìm kiếm | `hide_search` | ✅ |

**Type đã đầy đủ, cần kiểm tra backend API có trả về đủ các trường này không.**

---

### 5. Khu vực khám (Exam Areas)

| Trường SRS | Type ExamArea hiện tại | Trạng thái |
|-----------|----------------------|------------|
| Tên khu khám bệnh | `name` | ✅ |
| Mô tả khu khám | `description` | ✅ |
| Địa chỉ | `address` | ✅ |
| ID nội bộ | `internal_id` | ✅ |
| Trạng thái hoạt động | — | ❌ **Thiếu trong type** |

**Cần bổ sung `status: "active" | "inactive"` vào type `ExamArea`.**

---

### 6. Tài khoản (Users)

**Chưa có type/interface `AdminUser` trong `types/hospital-admin.ts`.**

| Trường SRS | Trạng thái trong src |
|-----------|-------------------|
| Họ tên | ❌ Chưa có type |
| SĐT | ❌ Chưa có type |
| Email | ❌ Chưa có type |
| Mật khẩu (nếu tạo admin) | ❌ Chưa có type |
| Trạng thái | ❌ Chưa có type |
| Ghi chú quản trị | ❌ Chưa có type |
| Vai trò (Admin/Kế toán/CSKH/Marketing/Tiếp tân/User) | ❌ Chưa có type |
| Ngày tạo | ❌ Chưa có type |
| Lần đăng nhập gần nhất | ❌ Chưa có type |
| Số lượng hồ sơ BN liên kết | ❌ Chưa có type |
| Số lượng lịch khám đã đặt | ❌ Chưa có type |

---

### 7. Bệnh nhân (Patients)

**Chưa có type/interface `AdminPatient` trong `types/hospital-admin.ts`.**

| Trường SRS | Trạng thái trong src |
|-----------|-------------------|
| Họ tên | ❌ Chưa có type |
| Ngày sinh | ❌ Chưa có type |
| Giới tính | ❌ Chưa có type |
| Nghề nghiệp | ❌ Chưa có type |
| Quốc tịch | ❌ Chưa có type |
| Dân tộc | ❌ Chưa có type |
| CCCD | ❌ Chưa có type |
| SĐT | ❌ Chưa có type |
| Mã BN HIS | ❌ Chưa có type |
| Thành viên gia đình | ❌ Chưa có type |
| Tiểu sử bệnh lý | ❌ Chưa có type |
| Dị ứng | ❌ Chưa có type |
| Ghi chú sức khỏe | ❌ Chưa có type |
| Thông tin BHYT | ❌ Chưa có type |

---

### 8. Lịch đặt khám (Tickets / ExamTicket)

| Trường SRS | Type ExamTicket hiện tại | Trạng thái |
|-----------|-------------------------|------------|
| Mã phiếu khám | `ticket_number` | ✅ |
| Người đi khám | `patient_name` | ✅ |
| Mã BN HIS | `patient_code` | ✅ |
| Tài khoản đặt lịch | — | ❌ **Thiếu** |
| Khu vực khám | — | ❌ **Thiếu** |
| Chuyên khoa | `specialty_id` | ✅ (nhưng là ID, không có tên) |
| Phòng khám | `clinic_id` | ✅ (nhưng là ID, không có tên) |
| Bác sĩ | `doctor_id` | ✅ (nhưng là ID, không có tên) |
| Ngày khám | `exam_date` | ✅ |
| Giờ khám | — | ❌ **Thiếu** |
| STT khám | — | ❌ **Thiếu** |
| Dịch vụ khám | `service_id` | ✅ (nhưng là ID) |
| Tổng tiền | — | ❌ **Thiếu** |
| Trạng thái thanh toán | — | ❌ **Thiếu** |
| Trạng thái lịch khám | `status` | ✅ |
| Trạng thái đồng bộ HIS | `his_sync_status` | ✅ |
| Giá gốc | — | ❌ **Thiếu** |
| Giảm giá | — | ❌ **Thiếu** |
| Phần BHYT | — | ❌ **Thiếu** |
| Phương thức thanh toán | — | ❌ **Thiếu** |
| Lý do hủy | `cancel_reason` | ✅ |
| Trạng thái hoàn tiền | `refund_reason` | ⚠️ Có `refund_reason` nhưng chưa có trạng thái hoàn tiền riêng |

---

### 9. Lịch làm việc bác sĩ (Schedules)

| Trường SRS | Type Schedule hiện tại | Trạng thái |
|-----------|----------------------|------------|
| Dịch vụ khám | `service_id` | ✅ |
| Chuyên khoa | `specialty_id` | ✅ |
| Phòng khám | `clinic_id` | ✅ |
| Bác sĩ | `doctor_id` | ✅ |
| Ngày làm việc | `work_dates` | ✅ |
| Buổi làm việc | `shift` | ✅ |
| Giờ bắt đầu | `start_time` | ✅ |
| Giờ kết thúc | — | ❌ **Thiếu** |
| Thời gian mỗi slot | `slot_duration_minutes` | ✅ |
| Số phiếu tối đa/slot | — | ❌ **Thiếu** (hiện chỉ có `ticket_limit` tổng) |
| Tùy chỉnh số phiếu theo khung giờ | — | ❌ **Thiếu** |
| Trạng thái lịch | `status` | ✅ |

---

### 10. Nội dung (Content / Post)

| Trường SRS | Type Post hiện tại | Trạng thái |
|-----------|-------------------|------------|
| Tiêu đề | `name` | ✅ |
| Danh mục | — | ❌ **Thiếu** |
| Mô tả ngắn | `description` | ✅ |
| Nội dung chi tiết | `content` | ✅ |
| Ảnh đại diện | `img_path` | ✅ |
| Video/link video | — | ❌ **Thiếu** |
| File đính kèm | — | ❌ **Thiếu** |
| Thời gian đăng | — | ❌ **Thiếu** (khác với `created_at`) |
| Trạng thái hiển thị (Nháp/Đang hiển thị/Đã ẩn) | — | ❌ **Thiếu** |
| Tác giả/người tạo | `created_by` | ✅ |

---

### 11. Thông báo (Notifications)

**Chưa có type/interface trong `types/hospital-admin.ts`.**

| Trường SRS | Trạng thái trong src |
|-----------|-------------------|
| Tiêu đề thông báo | ❌ Chưa có type |
| Nội dung thông báo | ❌ Chưa có type |
| Loại thông báo | ❌ Chưa có type |
| Nhóm người nhận | ❌ Chưa có type |
| Thời gian gửi | ❌ Chưa có type |
| Trạng thái gửi (Chưa gửi/Đã gửi/Gửi lỗi) | ❌ Chưa có type |
| Trạng thái đọc (Chưa đọc/Đã đọc) | ❌ Chưa có type |
| Người tạo | ❌ Chưa có type |

---

### 12. Đánh giá (Reviews)

**Chưa có type/interface trong `types/hospital-admin.ts`.**

| Trường SRS | Trạng thái trong src |
|-----------|-------------------|
| Mã đánh giá | ❌ Chưa có type |
| Mã phiếu khám | ❌ Chưa có type |
| Người đi khám | ❌ Chưa có type |
| Mã BN HIS | ❌ Chưa có type |
| SĐT | ❌ Chưa có type |
| Bác sĩ/dịch vụ được đánh giá | ❌ Chưa có type |
| Nội dung theo tiêu chí | ❌ Chưa có type |
| Số sao từng tiêu chí | ❌ Chưa có type |
| Góp ý tự do | ❌ Chưa có type |
| Ngày gửi đánh giá | ❌ Chưa có type |
| Trạng thái xử lý (Chưa xử lý/Đang xử lý/Đã xử lý) | ❌ Chưa có type |
| Ghi chú xử lý nội bộ | ❌ Chưa có type |
| Người xử lý | ❌ Chưa có type |

---

### 13. Chat CSKH

**Chưa có type/interface trong `types/hospital-admin.ts`.**

| Trường SRS | Trạng thái trong src |
|-----------|-------------------|
| Mã cuộc trò chuyện | ❌ Chưa có type |
| Người gửi | ❌ Chưa có type |
| SĐT | ❌ Chưa có type |
| Mã BN HIS | ❌ Chưa có type |
| Chủ đề hỗ trợ | ❌ Chưa có type |
| Nội dung tin nhắn | ❌ Chưa có type |
| Tệp đính kèm/hình ảnh | ❌ Chưa có type |
| Nhân sự phụ trách | ❌ Chưa có type |
| Trạng thái xử lý | ❌ Chưa có type |
| Thời gian gửi | ❌ Chưa có type |
| Thời gian phản hồi gần nhất | ❌ Chưa có type |
| Ghi chú nội bộ | ❌ Chưa có type |
| Lịch sử thao tác | ❌ Chưa có type |

---

## Danh sách API còn thiếu

| Endpoint | Mô tả | Priority |
|----------|-------|----------|
| `/api/v1.0/dashboard` | Thống kê tổng quan | Cao |
| `/api/v1.0/sync-his` | Đồng bộ HIS (danh sách + thực hiện) | Cao |
| `/api/v1.0/exam-areas` | Khu vực khám (CRUD) | Cao |
| `/api/v1.0/rooms` POST/PUT/DELETE | Phòng khám (nếu HIS hỗ trợ) | Cao |
| `/api/v1.0/doctors` PUT | Cập nhật bác sĩ | Cao |
| `/api/v1.0/tickets` | Phiếu khám / Lịch đặt khám (CRUD) | Cao |
| `/api/v1.0/schedules` | Lịch làm việc bác sĩ (CRUD) | Cao |
| `/api/v1.0/services` POST/PUT/DELETE | Giá dịch vụ (nếu HIS hỗ trợ) | Trung bình |
| `/api/v1.0/users` | Tài khoản (CRUD + khóa/mở khóa) | Trung bình |
| `/api/v1.0/patients` | Bệnh nhân (CRUD + hợp nhất mã BN) | Trung bình |
| `/api/v1.0/notifications` | Thông báo (CRUD + gửi/lên lịch) | Trung bình |
| `/api/v1.0/reviews` | Đánh giá (CRUD + biểu mẫu) | Trung bình |
| `/api/v1.0/chats` | Chat CSKH (CRUD + phản hồi) | Trung bình |
| `/api/v1.0/reports/*` | Báo cáo | Trung bình |
| `/api/v1.0/roles` | Phân quyền vai trò | Thấp |

---

## Khuyến nghị thực hiện

### Giai đoạn 1 — Cao ưu tiên (Core Admin)
1. API Dashboard → tích hợp vào `page.tsx`
2. API Đồng bộ HIS → tạo trang riêng `/sync-his`
3. API Khu vực khám → tích hợp vào `exam-areas/page.tsx`
4. API Rooms POST/PUT/DELETE → xác nhận backend rồi tích hợp
5. API Doctors PUT → tích hợp cập nhật bác sĩ
6. API Tickets → tích hợp vào `operations/page.tsx`
7. API Schedules → tích hợp vào `appointments/page.tsx`

### Giai đoạn 2 — Trung bình ưu tiên
8. API Services POST/PUT/DELETE → xác nhận backend
9. API Users → tích hợp phân quyền
10. API Patients → tích hợp hồ sơ BN
11. API Reports → tích hợp báo cáo

### Giai đoạn 3 — Thấp ưu tiên
12. API Notifications, Reviews, Chats
13. Hệ thống RBAC phân quyền đa vai trò

---

## Danh sách page/route còn thiếu trong `src/app/(dashboard)`

| Route file | Mô tả trang | Trạng thái |
|-----------|-------------|------------|
| `src/app/(dashboard)/page.tsx` | Dashboard | ⚠️ Có UI, cần gắn API |
| `src/app/(dashboard)/sync-his/page.tsx` | Đồng bộ HIS (danh sách + xử lý thủ công) | ❌ **Chưa có trang** |
| `src/app/(dashboard)/exam-areas/page.tsx` | Khu vực khám | ⚠️ Có UI mock, cần gắn API |
| `src/app/(dashboard)/specialties/page.tsx` | Chuyên khoa | ✅ API OK |
| `src/app/(dashboard)/clinics/page.tsx` | Phòng khám | ⚠️ API GET OK, thiếu POST/PUT/DELETE |
| `src/app/(dashboard)/doctors/page.tsx` | Bác sĩ | ⚠️ API GET/POST/DELETE OK, thiếu PUT |
| `src/app/(dashboard)/users/page.tsx` | Tài khoản | ⚠️ Có UI, chưa rõ API |
| `src/app/(dashboard)/patients/page.tsx` | Bệnh nhân | ⚠️ Có UI, chưa rõ API |
| `src/app/(dashboard)/appointments/page.tsx` | Lịch làm việc bác sĩ (Schedules) | ⚠️ Có UI mock, cần gắn API |
| `src/app/(dashboard)/operations/page.tsx` | Quản lý phiếu / Lịch đặt khám | ⚠️ Có UI mock, cần gắn API |
| `src/app/(dashboard)/exam-services/page.tsx` | Giá dịch vụ | ⚠️ API GET OK, thiếu POST/PUT/DELETE |
| `src/app/(dashboard)/content/news/page.tsx` | Nội dung / Tin tức | ✅ API OK |
| `src/app/(dashboard)/notifications/page.tsx` | Thông báo | ⚠️ Có UI, chưa rõ API |
| `src/app/(dashboard)/reviews/page.tsx` | Đánh giá | ⚠️ Có UI, chưa rõ API |
| `src/app/(dashboard)/chats/page.tsx` | Chat CSKH | ⚠️ Có UI, chưa rõ API |
| `src/app/(dashboard)/reports/page.tsx` | Báo cáo | ❌ **Chưa có trang** |
| `src/app/(dashboard)/settings/page.tsx` | Cấu hình hệ thống | ⚠️ Có UI cơ bản |

---

## Type / Interface cần bổ sung trong `src/types/hospital-admin.ts`

| Type cần tạo | Trường chính | Priority |
|-------------|-------------|----------|
| `AdminUser` | `name`, `phone`, `email`, `role`, `status`, `last_login_at`, `patient_profile_count`, `ticket_count` | Cao |
| `AdminPatient` | `name`, `dob`, `gender`, `occupation`, `nationality`, `ethnicity`, `id_card`, `phone`, `his_patient_code`, `family_members[]`, `medical_history`, `allergies`, `health_notes`, `insurance_info` | Cao |
| `AdminTicketDetail` | Mở rộng `ExamTicket` thêm `account_id`, `area_id`, `exam_time`, `queue_number`, `total_amount`, `payment_status`, `original_price`, `discount`, `insurance_amount`, `payment_method` | Cao |
| `AdminNotification` | `title`, `content`, `type`, `recipient_group`, `send_time`, `send_status`, `read_status`, `created_by` | Trung bình |
| `AdminReview` | `review_code`, `ticket_code`, `patient_name`, `his_code`, `phone`, `doctor_name`, `criteria[]`, `stars[]`, `feedback`, `send_date`, `process_status`, `process_notes`, `handler_name` | Trung bình |
| `AdminReviewTemplate` | `name`, `description`, `status`, `questions[]`, `question_type`, `options[]`, `required`, `display_order` | Trung bình |
| `AdminChat` | `chat_code`, `sender_name`, `phone`, `his_code`, `topic`, `messages[]`, `attachments[]`, `assignee`, `status`, `send_time`, `last_reply_time`, `internal_notes`, `action_logs[]` | Trung bình |
| `AdminDashboardStats` | `revenue`, `refund`, `total_tickets`, `total_doctors`, `total_posts`, `upcoming_schedules[]`, `ticket_status_ratios[]`, `recent_tickets[]` | Cao |
| `HisSyncTicket` | `ticket_code`, `his_patient_code`, `patient_name`, `exam_date`, `doctor_name`, `clinic_name`, `sync_status`, `error_message`, `processing_type` | Cao |

---

## Lưu ý kỹ thuật quan trọng

### HIS API chỉ hỗ trợ GET
Tất cả API kết nối HIS hiện tại (`roomsApi`, `doctorsApi`, `hisServicesApi`) **chỉ có phương thức GET**. Các thao tác tạo, cập nhật, xóa trên page hiện đang hiển thị toast "Chức năng chưa hỗ trợ".

**Cần xác nhận với backend:**
- HIS có endpoint POST/PUT/DELETE không, hay frontend phải gọi qua một API trung gian?
- Nếu HIS chỉ đọc, cần backend cung cấp API riêng để quản lý metadata (loại phòng, hướng dẫn, trạng thái...) mà HIS không lưu.

### Mapping giữa HIS schema và App schema
Hiện tại HIS trả về rất ít trường (ví dụ: `HisDoctor` chỉ có `doctorid`, `doctorname`, `description`, `updatetime`), trong khi App cần ~15 trường. Cần một **mapping layer** hoặc **bảng metadata** trong DB của backend để bổ sung các trường thiếu.

### Các type cần đồng bộ
- `ExamArea` cần thêm `status: "active" | "inactive"`
- `Schedule` cần thêm `end_time`, `slot_ticket_limit`
- `Post` cần thêm `category`, `video_url`, `attachments`, `publish_time`, `display_status`
- `ExamTicket` cần mở rộng thêm thông tin thanh toán, giờ khám, STT
