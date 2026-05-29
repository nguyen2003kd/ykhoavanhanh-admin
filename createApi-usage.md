# Hướng dẫn sử dụng `createApi`

Factory duy nhất để tạo API service + hooks cho mọi loại resource.

---

## Cú pháp

```ts
createApi<TEntity, TCreate?, TUpdate?>({
  resource?,   // tên resource REST (sinh CRUD tự động)
  queryKey?,   // override cache key (mặc định = resource)
  mutations?,  // custom mutations → sinh useMutation hooks
  queries?,    // custom queries   → sinh useQuery hooks
})
```

**Trả về:** `{ service, hooks, keys }`

---

## Chế độ 1: CRUD tự động

Dùng khi resource có đầy đủ GET/POST/PUT/PATCH/DELETE.

```ts
// src/api/doctorApi.ts
import { createApi } from "./createApi";

interface Doctor {
  id: string;
  full_name: string;
  specialty: string;
  is_active: boolean;
}

interface CreateDoctorDto {
  full_name: string;
  specialty: string;
}

const { service, hooks } = createApi<Doctor, CreateDoctorDto>({
  resource: "doctors",
});

export const doctorService = service!;

// Hooks được sinh tự động:
export const useDoctors      = hooks.useList;    // GET /doctors?page=&limit=
export const useDoctor       = hooks.useDetail;  // GET /doctors/:id
export const useCreateDoctor = hooks.useCreate;  // POST /doctors
export const useUpdateDoctor = hooks.useUpdate;  // PUT /doctors/:id
export const usePatchDoctor  = hooks.usePatch;   // PATCH /doctors/:id
export const useDeleteDoctor = hooks.useDelete;  // DELETE /doctors/:id
```

### Dùng trong component

```tsx
function DoctorListPage() {
  // Danh sách có phân trang
  const { data, isLoading } = useDoctors({ page: 1, limit: 20 });

  // Tạo mới
  const createDoctor = useCreateDoctor();
  createDoctor.mutate({ full_name: "Nguyễn Văn A", specialty: "Tim mạch" });

  // Cập nhật
  const updateDoctor = useUpdateDoctor();
  updateDoctor.mutate({ id: "123", data: { full_name: "Tên mới" } });

  // Xóa
  const deleteDoctor = useDeleteDoctor();
  deleteDoctor.mutate("123");

  return (
    <div>
      {data?.rows.map(d => <div key={d.id}>{d.full_name}</div>)}
      <p>Tổng: {data?.count} | Trang {data?.currentPage}/{data?.totalPages}</p>
    </div>
  );
}

function DoctorDetailPage({ id }: { id: string }) {
  // Chi tiết 1 record
  const { data: doctor } = useDoctor(id);
  return <h1>{doctor?.full_name}</h1>;
}
```

---

## Chế độ 2: Action API (không CRUD)

Dùng cho auth, OTP, và các endpoint không theo REST chuẩn.

```ts
// src/api/authApi.ts
import { createApi } from "./createApi";
import { queryKeys } from "@/types/api-response";

const authService = {
  login:    (payload: LoginPayload) => apiPost("/auth/login", payload),
  logout:   ()                      => apiDelete("/auth/logout").catch(() => {}),
  getMyInfo: ()                     => apiGet("/users/getMyInfo"),
};

const { hooks } = createApi({
  mutations: {
    login:  authService.login,   // → useLogin
    logout: authService.logout,  // → useLogout
  },
  queries: {
    getMyInfo: {
      fn:       authService.getMyInfo,
      queryKey: queryKeys.auth.me(),
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const useLogin    = hooks.useLogin;
export const useLogout   = hooks.useLogout;
export const useGetMyInfo = hooks.useGetMyInfo;
```

### Dùng trong component

```tsx
function LoginPage() {
  const login = useLogin();

  const handleSubmit = async (payload) => {
    const res = await login.mutateAsync(payload);
    // xử lý token tại đây
    setAuth(res.data.responseData);
  };

  return <button disabled={login.isPending}>Đăng nhập</button>;
}

function Header() {
  // Query với enabled mặc định = true
  const { data: user } = useGetMyInfo();

  // Hoặc điều kiện enabled
  const isAuthenticated = useIsAuthenticated();
  const { data } = useGetMyInfo(isAuthenticated);

  return <span>{user?.data?.responseData?.full_name}</span>;
}
```

---

## Chế độ 3: CRUD + Action kết hợp

Dùng khi resource vừa có CRUD vừa có endpoint đặc biệt.

```ts
// src/api/appointmentApi.ts
import { createApi } from "./createApi";
import { apiPost } from "@/lib/axios";

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  status: "pending" | "confirmed" | "cancelled";
}

const { service, hooks } = createApi<Appointment>({
  resource: "appointments",

  // Thêm action đặc biệt ngoài CRUD:
  mutations: {
    approve: (id: string) => apiPost(`/appointments/${id}/approve`),
    cancel:  ({ id, reason }: { id: string; reason: string }) =>
               apiPost(`/appointments/${id}/cancel`, { reason }),
  },
});

export const appointmentService     = service!;
export const useAppointments        = hooks.useList;
export const useAppointment         = hooks.useDetail;
export const useCreateAppointment   = hooks.useCreate;
export const useUpdateAppointment   = hooks.useUpdate;
export const useDeleteAppointment   = hooks.useDelete;
export const useApproveAppointment  = hooks.useApprove;  // custom
export const useCancelAppointment   = hooks.useCancel;   // custom
```

### Dùng trong component

```tsx
function AppointmentPage({ id }: { id: string }) {
  const { data } = useAppointment(id);

  const approve = useApproveAppointment();
  const cancel  = useCancelAppointment();

  return (
    <>
      <p>Trạng thái: {data?.status}</p>
      <button onClick={() => approve.mutate(id)}>Xác nhận</button>
      <button onClick={() => cancel.mutate({ id, reason: "Bệnh nhân hủy" })}>Hủy</button>
    </>
  );
}
```

---

## Bảng tổng hợp hooks

### CRUD hooks (từ `resource`)

| Hook | HTTP | Tham số |
|---|---|---|
| `useList` | `GET /resource?page=&limit=` | `(params?, options?)` |
| `useDetail` | `GET /resource/:id` | `(id, options?)` |
| `useCreate` | `POST /resource` | `(options?)` → `.mutate(data)` |
| `useUpdate` | `PUT /resource/:id` | `(options?)` → `.mutate({ id, data })` |
| `usePatch` | `PATCH /resource/:id` | `(options?)` → `.mutate({ id, data })` |
| `useDelete` | `DELETE /resource/:id` | `(options?)` → `.mutate(id)` |

### Action hooks (từ `mutations` / `queries`)

| Key | Hook tự sinh | Loại |
|---|---|---|
| `login` | `useLogin` | useMutation |
| `forgotPassword` | `useForgotPassword` | useMutation |
| `getMyInfo` | `useGetMyInfo` | useQuery |
| `approve` | `useApprove` | useMutation |

> Quy tắc đặt tên: `camelCase key` → `use` + `PascalCase`

---

## Override cache invalidation

```ts
const updateDoctor = useUpdateDoctor({
  onSuccess: (data, variables) => {
    // Custom logic sau update
    toast.success("Đã cập nhật!");
    queryClient.invalidateQueries({ queryKey: ["schedule"] }); // invalidate thêm
  },
});
```
