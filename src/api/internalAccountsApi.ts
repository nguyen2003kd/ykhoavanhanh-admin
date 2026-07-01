/**
 * Internal Accounts API - Create Internal Staff Accounts
 * Base path: /api/v1.0/internal-accounts
 */

import { apiPost } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ApiInternalAccount {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  user_roles: Array<{
    id: string;
    user_id: string;
    role_id: string;
    role: {
      id: string;
      role_name: string;
      description: string | null;
      receptionist: boolean;
      membership: boolean;
      marketing: boolean;
      accountant: boolean;
      customer_service: boolean;
    };
  }>;
}

export interface CreateInternalAccountPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role_id: string;
}

// ─── Query Keys ────────────────────────────────────────────────────────────────

const internalAccountsBase = ["internal-accounts"] as const;

export const internalAccountKeys = {
  all: internalAccountsBase,
  create: [...internalAccountsBase, "create"] as const,
};

// ─── Service Functions ─────────────────────────────────────────────────────

async function createInternalAccount(
  payload: CreateInternalAccountPayload
): Promise<ApiInternalAccount> {
  const res = await apiPost<ApiInternalAccount>("/internal-accounts", payload);
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Tạo tài khoản nội bộ thất bại");
}

// ─── Hooks ─────────────────────────────────────────────────────────────

export function useCreateInternalAccount(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInternalAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: internalAccountKeys.all });
      options?.onSuccess?.();
    },
    onError: (error) => options?.onError?.(error),
  });
}