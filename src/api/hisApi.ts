import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiDelete } from "@/lib/axios";
import { queryKeys, ApiResponse } from "@/types/api-response";

// Types
interface Doctor {
  id: string;
  name?: string;
  full_name?: string;
  specialty?: string;
  room?: string;
  avatar?: string;
  // Add other doctor fields as needed
}

interface DoctorsResponse extends ApiResponse<Doctor[]> {}

// Doctor Service
export const doctorService = {
  // Get all doctors from HIS
  getDoctors: async (): Promise<Doctor[]> => {
    const response = await apiGet<Doctor[]>("/doctors");
    if (response.data.status === "success" && response.data.responseData) {
      return response.data.responseData;
    }
    throw new Error(response.data.message || "Không thể lấy danh sách bác sĩ");
  },
};

// TanStack Query Hooks
export function useDoctors() {
  return useQuery({
    queryKey: queryKeys.doctors.list(),
    queryFn: () => doctorService.getDoctors(),
    staleTime: 1000 * 60 * 10, // 10 minutes - HIS data rarely changes
  });
}

// Room Types
interface Room {
  id: string;
  name?: string;
  code?: string;
  specialty?: string;
  floor?: string;
}

interface RoomsResponse extends ApiResponse<Room[]> {}

// Room Service
export const roomService = {
  getRooms: async (): Promise<Room[]> => {
    const response = await apiGet<Room[]>("/rooms");
    if (response.data.status === "success" && response.data.responseData) {
      return response.data.responseData;
    }
    throw new Error(response.data.message || "Không thể lấy danh sách phòng");
  },
};

// TanStack Query Hooks
export function useRooms() {
  return useQuery({
    queryKey: queryKeys.rooms.list(),
    queryFn: () => roomService.getRooms(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Service Types (HIS Services)
interface HisService {
  id: string;
  name?: string;
  code?: string;
  price?: number;
  description?: string;
}

interface ServicesResponse extends ApiResponse<HisService[]> {}

// Service Service
export const hisService = {
  getServices: async (): Promise<HisService[]> => {
    const response = await apiGet<HisService[]>("/his-services");
    if (response.data.status === "success" && response.data.responseData) {
      return response.data.responseData;
    }
    throw new Error(response.data.message || "Không thể lấy danh sách dịch vụ");
  },
};

// TanStack Query Hooks
export function useHisServices() {
  return useQuery({
    queryKey: queryKeys.services.list(),
    queryFn: () => hisService.getServices(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
