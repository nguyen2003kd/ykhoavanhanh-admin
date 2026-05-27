"use client";

/**
 * Example: How to use the new API layer
 * 
 * This file demonstrates the optimized API patterns with:
 * - TanStack Query for data fetching
 * - Zustand for auth state
 * - Axios with interceptors for token management
 */

import { useState } from "react";
import { useDoctors, useRooms, useHisServices, useUsers } from "@/api";
import { useCurrentUser, useLogin, useLogout } from "@/api/authApi";
import { useDebounce, useOptimisticUpdate } from "@/hooks";
import { toast } from "sonner";

// ============================================
// 1. AUTHENTICATION EXAMPLE
// ============================================

export function AuthExample() {
  const { data: user, isLoading, error } = useCurrentUser();
  const logout = useLogout();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h2>Welcome, {user.fullName || user.email}</h2>
      <button onClick={() => logout.mutate()}>Logout</button>
    </div>
  );
}

// ============================================
// 2. LOGIN EXAMPLE
// ============================================

export function LoginExample() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleLogin = async () => {
    try {
      await login.mutateAsync({ phone, password });
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <div>
      <input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        disabled={login.isPending}
      >
        {login.isPending ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

// ============================================
// 3. DATA FETCHING WITH PAGINATION
// ============================================

export function UsersListExample() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Debounce search input
  const debouncedSearch = useDebounce(search, 400);

  // Fetch users with params
  const { data, isLoading, error } = useUsers({
    currentPage: page,
    pageSize: 10,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <input
        type="search"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {data?.rows?.map((user) => (
          <li key={user.id}>{user.full_name || user.email}</li>
        ))}
      </ul>

      <div>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {data?.totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= (data?.totalPages || 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ============================================
// 4. MASTER DATA (Doctors, Rooms, Services)
// ============================================

export function MasterDataExample() {
  const { data: doctors, isLoading: doctorsLoading } = useDoctors();
  const { data: rooms, isLoading: roomsLoading } = useRooms();
  const { data: services, isLoading: servicesLoading } = useHisServices();

  if (doctorsLoading || roomsLoading || servicesLoading) {
    return <div>Loading master data...</div>;
  }

  return (
    <div>
      <h3>Doctors ({doctors?.length})</h3>
      <ul>
        {doctors?.slice(0, 5).map((doctor) => (
          <li key={doctor.id}>
            {doctor.full_name || doctor.name}
          </li>
        ))}
      </ul>

      <h3>Rooms ({rooms?.length})</h3>
      <ul>
        {rooms?.slice(0, 5).map((room) => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>

      <h3>Services ({services?.length})</h3>
      <ul>
        {services?.slice(0, 5).map((service) => (
          <li key={service.id}>
            {service.name} - {service.price?.toLocaleString()}đ
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// 5. OPTIMISTIC UPDATE EXAMPLE
// ============================================

export function OptimisticUpdateExample() {
  const { optimisticUpdate } = useOptimisticUpdate();
  const deleteUser = useLogout(); // Using logout as example mutation

  const handleDelete = async (userId: string) => {
    await optimisticUpdate(
      ["users"], // queryKey
      () => {
        // Optimistic function - filter out the user immediately
        return { rows: [], count: 0, totalPages: 0, currentPage: 1 };
      },
      () => deleteUser.mutateAsync(), // Real mutation
      {
        successMessage: "User deleted successfully",
        errorMessage: "Failed to delete user",
      }
    );
  };

  return (
    <div>
      <button onClick={() => handleDelete("user-123")}>
        Delete User (Optimistic)
      </button>
    </div>
  );
}

// ============================================
// 6. CUSTOM HOOKS USAGE
// ============================================

export function CustomHooksExample() {
  // Debounce example
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  return (
    <div>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search (debounced 500ms)..."
      />
      <p>Debounced value: {debouncedSearch}</p>
    </div>
  );
}
