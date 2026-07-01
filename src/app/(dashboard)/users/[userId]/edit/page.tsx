"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Badge } from "@/components/ui/Badge";
import { LoadingSection } from "@/components/ui/Spinner";
import { toast } from "@/components/ui/Toast";
import { useUserById, useUpdateUser } from "@/api/userApi";
import { useRolesList } from "@/api/rolesApi";
import { useUserRolesList, useCreateUserRole, useDeleteUserRole } from "@/api/userRolesApi";

interface RoleChange {
  type: "add" | "remove";
  roleId: string;
  roleName: string;
}

export default function EditUserPage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    cccd: "",
    phone: "",
    isActive: true,
  });

  // Track pending role changes
  const [pendingRoleChanges, setPendingRoleChanges] = useState<RoleChange[]>([]);

  // Fetch user data
  const { data: apiUser, isLoading: userLoading } = useUserById(userId);

  // Fetch all roles
  const { data: rolesData, isLoading: rolesLoading } = useRolesList({ pageSize: 100 });

  // Fetch user's current roles
  const { data: userRolesData, isLoading: userRolesLoading } = useUserRolesList({
    user_id: userId,
    pageSize: 100,
  });

  // Update user mutation
  const updateUser = useUpdateUser({
    onSuccess: () => {
      toast.success("Cap nhat thong tin thanh cong!");
      router.push(`/users/${userId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Cap nhat that bai");
    },
  });

  // Add role mutation
  const addRoleMutation = useCreateUserRole({
    onSuccess: () => {},
    onError: (error) => {
      toast.error(error.message || "Gan vai tro that bai");
    },
  });

  // Remove role mutation
  const removeRoleMutation = useDeleteUserRole({
    onSuccess: () => {},
    onError: (error) => {
      toast.error(error.message || "Go vai tro that bai");
    },
  });

  // Sync form when user data loads
  useEffect(() => {
    if (apiUser && !updateUser.isPending) {
      setForm({
        fullName: apiUser.full_name ?? "",
        cccd: apiUser.cccd ?? "",
        phone: apiUser.phone ?? "",
        isActive: apiUser.is_active ?? true,
      });
    }
  }, [apiUser, updateUser.isPending]);

  // Current role IDs of user (excluding pending removals)
  const currentRoleIds = useMemo(() => {
    const currentIds = new Set(userRolesData?.rows.map((ur) => ur.role_id) || []);
    pendingRoleChanges
      .filter((c) => c.type === "remove")
      .forEach((c) => currentIds.delete(c.roleId));
    return currentIds;
  }, [userRolesData, pendingRoleChanges]);

  // Available roles to add (excluding current roles and pending adds)
  const availableRoles = useMemo(() => {
    if (!rolesData?.rows) return [];
    const pendingAddIds = new Set(
      pendingRoleChanges.filter((c) => c.type === "add").map((c) => c.roleId)
    );
    return rolesData.rows.filter(
      (role) => !currentRoleIds.has(role.id) && !pendingAddIds.has(role.id)
    );
  }, [rolesData, currentRoleIds, pendingRoleChanges]);

  // Get roles to display (including pending removes)
  const displayRoles = useMemo(() => {
    if (!userRolesData?.rows) return [];
    const pendingRemoveIds = new Set(
      pendingRoleChanges
        .filter((c) => c.type === "remove")
        .map((c) => c.roleId)
    );
    return userRolesData.rows.filter((ur) => !pendingRemoveIds.has(ur.role_id));
  }, [userRolesData, pendingRoleChanges]);

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save user info first
    updateUser.mutate({
      id: userId,
      payload: {
        full_name: form.fullName,
        // email: form.email,
        cccd: form.cccd,
        phone: form.phone,
        is_active: form.isActive,
      },
    });

    // Process role changes after user update succeeds
    for (const change of pendingRoleChanges) {
      if (change.type === "add") {
        addRoleMutation.mutate({ user_id: userId, role_id: change.roleId });
      } else {
        const userRole = userRolesData?.rows.find(
          (ur) => ur.role_id === change.roleId
        );
        if (userRole) {
          removeRoleMutation.mutate(userRole.id);
        }
      }
    }

    // Clear pending changes
    setPendingRoleChanges([]);
  };

  const handleToggleRole = (roleId: string, roleName: string, isCurrentlyAssigned: boolean) => {
    setPendingRoleChanges((prev) => {
      const existing = prev.find((c) => c.roleId === roleId);
      if (existing) {
        // Remove from pending if already toggled
        return prev.filter((c) => c.roleId !== roleId);
      }
      // Add new pending change
      return [...prev, { type: isCurrentlyAssigned ? "remove" : "add", roleId, roleName }];
    });
  };

  const isRolePending = (roleId: string) => {
    return pendingRoleChanges.some((c) => c.roleId === roleId);
  };

  // Loading state
  if (userLoading || rolesLoading || userRolesLoading) {
    return <LoadingSection text="Dang tai thong tin..." />;
  }

  if (!apiUser) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Khong tim thay nguoi dung.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Quay lai
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Quay lai
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chinh sua nguoi dung</h1>
          <p className="text-sm text-gray-500 mt-0.5">{form.cccd}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        {/* Thong tin tai khoan */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thong tin tai khoan</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  label="Ho va ten *"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <Input
                label="CCCD"
                value={form.cccd}
                onChange={(e) => setForm({ ...form, cccd: e.target.value })}
              />
              <Input
                label="So dien thoai"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Vai tro */}
          <Card>
            <CardHeader>
              <CardTitle>Vai tro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Chon vai tro de gan hoac go bo. Thay doi se duoc luu khi nhan &quot;Luu thay doi&quot;.
              </p>

              {/* Current roles + pending removes */}
              {displayRoles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {displayRoles.map((ur) => (
                    <button
                      key={ur.id}
                      type="button"
                      className="inline-flex items-center gap-2 py-2 px-3 cursor-pointer rounded-md border"
                      onClick={() =>
                        handleToggleRole(
                          ur.role_id,
                          ur.role.description || ur.role.role_name,
                          true
                        )
                      }
                    >
                      <Badge variant={isRolePending(ur.role_id) ? "warning" : "info"} className="pointer-events-none">
                        <span>{ur.role.description || ur.role.role_name}</span>
                        {isRolePending(ur.role_id) && <span className="ml-1">✕</span>}
                      </Badge>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Chua co vai tro nao duoc gan.</p>
              )}

              {/* Available roles to add */}
              {availableRoles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableRoles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      className="inline-flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-muted rounded-md border"
                      onClick={() =>
                        handleToggleRole(
                          role.id,
                          role.description || role.role_name,
                          false
                        )
                      }
                    >
                      <Badge variant="default" className="pointer-events-none">
                        <span>+ {role.description || role.role_name}</span>
                      </Badge>
                    </button>
                  ))}
                </div>
              )}

              {/* Pending changes indicator */}
              {pendingRoleChanges.length > 0 && (
                <p className="text-sm text-amber-600">
                  Co {pendingRoleChanges.length} thay doi cho luu:{" "}
                  {pendingRoleChanges
                    .map((c) =>
                      c.type === "add" ? `+ ${c.roleName}` : `- ${c.roleName}`
                    )
                    .join(", ")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Luu thay doi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Kich hoat tai khoan
                </span>
                <Toggle
                  checked={form.isActive}
                  onChange={(v) => setForm({ ...form, isActive: v })}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? "Dang luu..." : "Luu thay doi"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => router.push(`/users/${userId}`)}
              >
                Huy
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dat lai mat khau</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">
                Gui email de nguoi dung tu dat lai mat khau.
              </p>
              <Button type="button" variant="outline" className="w-full">
                Gui email dat lai mat khau
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}