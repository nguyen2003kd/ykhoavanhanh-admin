"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSection } from "@/components/ui/Spinner";
import { useRolesList } from "@/api/rolesApi";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import {
  DEFAULT_ROLE_PERMISSIONS,
  ROLE_LABELS,
  PERMISSION_LABELS,
  type RoleType,
  type Permission,
} from "@/types/permissions";
import { FiPlus, FiCheck } from "react-icons/fi";

// Permissions theo từng nhóm
const PERMISSION_GROUPS = {
  admin: {
    label: "Quản trị hệ thống",
    permissions: [
      "admin.all",
      "admin.sync_exam",
      "admin.edit_mabn",
      "admin.manage_doctor",
      "admin.manage_exam_room",
      "admin.declare_specialty",
      "admin.declare_service_price",
      "admin.cancel_exam",
      "admin.report_reconciliation",
      "user.manage",
      "user.assign_role",
    ] as Permission[],
  },
  accountant: {
    label: "Kế toán",
    permissions: [
      "accountant.cancel_exam",
      "accountant.refund",
      "accountant.report_bank",
      "accountant.report_his",
    ] as Permission[],
  },
  cskh: {
    label: "CSKH",
    permissions: [
      "cskh.schedule_reminder",
      "cskh.message_template",
      "cskh.survey",
      "cskh.report_survey",
      "cskh.chat",
      "cskh.answer_question",
    ] as Permission[],
  },
  marketing: {
    label: "Marketing",
    permissions: [
      "marketing.promotion",
      "marketing.advertisement",
      "marketing.sell_package",
    ] as Permission[],
  },
  receptionist: {
    label: "Tiếp tân",
    permissions: [
      "receptionist.create_schedule",
      "receptionist.edit_schedule",
      "receptionist.manage_leave",
    ] as Permission[],
  },
};

export default function RolesPage() {
  const { data: rolesData, isLoading } = useRolesList({ pageSize: 100 });

  if (isLoading) {
    return <LoadingSection text="Đang tải danh sách vai trò..." />;
  }

  // Xác định role_type của mỗi role từ backend
  // Ưu tiên: ADMIN (có tất cả) > Các role đơn lẻ
  const getRoleType = (role: any): RoleType => {
    // ADMIN có tất cả các flags đều true
    if (
      role.accountant === true &&
      role.customer_service === true &&
      role.marketing === true &&
      role.receptionist === true
    ) {
      return "admin";
    }
    // Các role đơn lẻ
    if (role.accountant) return "accountant";
    if (role.customer_service) return "cskh";
    if (role.marketing) return "marketing";
    if (role.receptionist) return "receptionist";
    return "admin";
  };

  // Lấy permissions mặc định của role_type
  const getDefaultPermissions = (roleType: RoleType): Permission[] => {
    return DEFAULT_ROLE_PERMISSIONS[roleType] || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý vai trò</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Danh sách vai trò và phân quyền trong hệ thống
          </p>
        </div>
        <PermissionGuard permission="user.assign_role">
          <Button variant="primary">
            <FiPlus className="h-4 w-4 mr-2" />
            Thêm vai trò
          </Button>
        </PermissionGuard>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(rolesData?.rows || []).map((role) => {
          const roleType = getRoleType(role);
          const defaultPerms = getDefaultPermissions(roleType);

          return (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {role.description || role.role_name}
                  </CardTitle>
                  <Badge
                    variant={
                      roleType === "admin"
                        ? "danger"
                        : roleType === "accountant"
                        ? "warning"
                        : roleType === "cskh"
                        ? "info"
                        : roleType === "marketing"
                        ? "success"
                        : "default"
                    }
                  >
                    {ROLE_LABELS[roleType]}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">{role.role_name}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Quyền mặc định:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {defaultPerms.map((perm) => (
                      <Badge
                        key={perm}
                        variant="default"
                        className="text-xs flex items-center gap-1"
                      >
                        <FiCheck className="h-3 w-3" />
                        {PERMISSION_LABELS[perm]}
                      </Badge>
                    ))}
                  </div>
                  <PermissionGuard permission="user.assign_role">
                    <div className="pt-3 border-t">
                      <Button variant="ghost" size="sm" className="w-full">
                        Chỉnh sửa quyền
                      </Button>
                    </div>
                  </PermissionGuard>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permissions Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Tham khảo - Danh sách quyền</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PERMISSION_GROUPS).map(([key, group]) => (
              <div key={key} className="space-y-2">
                <h3 className="font-medium text-gray-900">{group.label}</h3>
                <ul className="space-y-1">
                  {group.permissions.map((perm) => (
                    <li key={perm} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {PERMISSION_LABELS[perm]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
