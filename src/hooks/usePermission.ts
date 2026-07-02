/**
 * usePermission Hook
 * Kiểm tra và quản lý quyền của user
 */

import { useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import type { Permission, RoleType } from "@/types/permissions";
import { DEFAULT_ROLE_PERMISSIONS } from "@/types/permissions";

/**
 * Lấy danh sách role_type của user từ userRoles
 * Backend trả về flags: accountant, customer_service, marketing, receptionist
 * ADMIN có tất cả các flags đều = true
 *
 * Cấu trúc sau khi map từ authApi:
 * {
 *   id: ur.id,
 *   roleId: ur.role_id,
 *   roleName: ur.role.role_name,        // "ADMIN", "MARKETING", ...
 *   description: ur.role.description,
 *   receptionist: boolean,
 *   membership: boolean,
 *   marketing: boolean,
 *   accountant: boolean,
 *   customerService: ur.role.customer_service  // camelCase!
 * }
 */
function getUserRoleTypes(userRoles: any[]): RoleType[] {
  if (!userRoles || !Array.isArray(userRoles)) return [];

  const roleTypes: RoleType[] = [];

  for (const ur of userRoles) {
    // Cấu trúc đã flatten từ authApi.ts - không có .role nữa
    const roleName = (ur.roleName || "").toLowerCase();

    // Kiểm tra ADMIN: có tất cả các flags đều = true
    // Hoặc role_name chứa "admin"
    if (
      (ur.accountant === true &&
        ur.customerService === true &&
        ur.marketing === true &&
        ur.receptionist === true) ||
      roleName.includes("admin")
    ) {
      roleTypes.push("admin");
      continue; // Admin có tất cả quyền, không cần kiểm tra tiếp
    }

    // Các role đơn lẻ (dùng camelCase vì đã map từ authApi)
    if (ur.accountant === true) roleTypes.push("accountant");
    if (ur.customerService === true) roleTypes.push("cskh");
    if (ur.marketing === true) roleTypes.push("marketing");
    if (ur.receptionist === true) roleTypes.push("receptionist");
  }

  return [...new Set(roleTypes)]; // Loại bỏ duplicates
}

function getPermissionsFromRoles(roleTypes: RoleType[]): Permission[] {
  const permissions: Permission[] = [];

  for (const roleType of roleTypes) {
    const rolePerms = DEFAULT_ROLE_PERMISSIONS[roleType] || [];
    permissions.push(...rolePerms);
  }

  return [...new Set(permissions)]; // Loại bỏ duplicates
}

/**
 * Hook chính để kiểm tra quyền
 */
export function usePermission() {
  const user = useAuthStore((state) => state.user);

  // Kiểm tra is_admin từ API
  const isSuperAdmin = user?.is_admin === true;

  const userRoleTypes = useMemo(() => {
    return getUserRoleTypes(user?.userRoles || []);
  }, [user?.userRoles]);

  const userPermissions = useMemo(() => {
    return getPermissionsFromRoles(userRoleTypes);
  }, [userRoleTypes]);

  /**
   * Kiểm tra user có một quyền cụ thể không
   */
  const hasPermission = (permission: Permission): boolean => {
    // is_admin = true → có tất cả quyền
    if (isSuperAdmin) return true;
    // Admin role có admin.all → có tất cả quyền
    if (userPermissions.includes("admin.all")) return true;
    return userPermissions.includes(permission);
  };

  /**
   * Kiểm tra user có tất cả các quyền được yêu cầu không
   */
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (isSuperAdmin) return true;
    if (userPermissions.includes("admin.all")) return true;
    return permissions.every((p) => userPermissions.includes(p));
  };

  /**
   * Kiểm tra user có ít nhất một trong các quyền được yêu cầu không
   */
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (isSuperAdmin) return true;
    if (userPermissions.includes("admin.all")) return true;
    return permissions.some((p) => userPermissions.includes(p));
  };

  /**
   * Kiểm tra user có một role cụ thể không
   */
  const hasRole = (roleType: RoleType): boolean => {
    if (isSuperAdmin) return true;
    return userRoleTypes.includes(roleType);
  };

  /**
   * Kiểm tra user có ít nhất một trong các roles được yêu cầu không
   */
  const hasAnyRole = (roleTypes: RoleType[]): boolean => {
    if (isSuperAdmin) return true;
    return roleTypes.some((r) => userRoleTypes.includes(r));
  };

  /**
   * Kiểm tra user có tất cả các roles được yêu cầu không
   */
  const hasAllRoles = (roleTypes: RoleType[]): boolean => {
    if (isSuperAdmin) return true;
    return roleTypes.every((r) => userRoleTypes.includes(r));
  };

  return {
    // Danh sách
    roleTypes: userRoleTypes,
    permissions: userPermissions,
    // Kiểm tra quyền
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    // Kiểm tra role
    hasRole,
    hasAnyRole,
    hasAllRoles,
    // Tiện ích - isAdmin = is_super_admin hoặc có admin role
    isAdmin: isSuperAdmin || userRoleTypes.includes("admin"),
    isAccountant: userRoleTypes.includes("accountant"),
    isCSKH: userRoleTypes.includes("cskh"),
    isMarketing: userRoleTypes.includes("marketing"),
    isReceptionist: userRoleTypes.includes("receptionist"),
    // Cờ super admin
    isSuperAdmin,
  };
}

/**
 * Kiểm tra quyền không cần hook (dùng trong non-react context)
 */
export function checkPermission(
  userRoles: any[] | undefined,
  permission: Permission
): boolean {
  const roleTypes = getUserRoleTypes(userRoles || []);
  const permissions = getPermissionsFromRoles(roleTypes);

  if (permissions.includes("admin.all")) return true;
  return permissions.includes(permission);
}

/**
 * Kiểm tra role không cần hook
 */
export function checkRole(
  userRoles: any[] | undefined,
  roleType: RoleType
): boolean {
  const roleTypes = getUserRoleTypes(userRoles || []);
  return roleTypes.includes(roleType);
}
