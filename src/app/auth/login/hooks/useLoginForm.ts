"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { useToast } from "@/components/ui/ToastProvider";

export function useLoginForm() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.login({ identifier: form.email, password: form.password });
      router.push("/");
    } catch (err: any) {
      toast.error(err?.message || "Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}
