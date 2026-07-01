"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "@/components/ui/Toast";
import { useRolesList } from "@/api/rolesApi";
import { useCreateInternalAccount } from "@/api/internalAccountsApi";

export default function NewInternalAccountPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
  });

  const { data: rolesData, isLoading: rolesLoading } = useRolesList({ pageSize: 100 });

  const createMutation = useCreateInternalAccount({
    onSuccess: () => {
      toast.success("Tao tai khoan thanh cong!");
      router.push("/internal-accounts");
    },
    onError: (error) => {
      toast.error(error.message || "Tao tai khoan that bai");
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.role_id) {
        toast.error("Vui long chon vai tro");
        return;
      }
      createMutation.mutate({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role_id: form.role_id,
      });
    },
    [form, createMutation]
  );

  const roleOptions =
    rolesData?.rows.map((role) => ({
      value: role.id,
      label: role.description || role.role_name,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Quay lai
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Them tai khoan noi bo</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Tao tai khoan nhan Vien moi
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
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
                label="Email *"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="So dien thoai"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <div className="col-span-2">
                {rolesLoading ? (
                  <div className="py-2">
                    <Spinner size="sm" /> Dang tai vai tro...
                  </div>
                ) : (
                  <Select
                    label="Vai tro *"
                    value={form.role_id}
                    onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                    options={roleOptions}
                    placeholder="Chon vai tro"
                  />
                )}
              </div>
              <div className="col-span-2">
                <Input
                  label="Mat khau tam thoi *"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  hint="Toi thieu 6 ky tu"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Tao tai khoan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">
                Tai khoan se duoc tao voi quyen admin. Nguoi dung se dang nhap bang email va mat khau.
              </p>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Dang tao..." : "Tao tai khoan"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => router.back()}
              >
                Huy
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}