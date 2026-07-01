/**
 * Addresses API - Get nations, professions, provinces, districts, wards
 */

import { apiGet } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface Nation {
  nationid: string;
  nationname: string;
}

export interface Profession {
  professionid: string;
  professionname: string;
}

export interface Country {
  countrycode: string;
  countryname: string;
}

export interface Province {
  city: string;
  cityname: string;
}

export interface District {
  city: string;
  districtcode: string;
  districtname: string | null;
  type: string | null;
}

export interface Ward {
  districtcode: string;
  wardcode: string;
  wardname: string | null;
  type: string | null;
}

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const addressKeys = {
  nations: ["addresses", "nations"] as const,
  professions: ["addresses", "professions"] as const,
  countries: ["addresses", "countries"] as const,
  provinces: ["addresses", "provinces"] as const,
  districts: (city: string) => ["addresses", "districts", city] as const,
  wards: (districtcode: string) => ["addresses", "wards", districtcode] as const,
};

// ─── Service Functions ─────────────────────────────────────────────────────

async function fetchNations(): Promise<Nation[]> {
  const res = await apiGet<Nation[]>("/nation");
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Khong the lay danh sach dan toc");
}

async function fetchProfessions(): Promise<Profession[]> {
  const res = await apiGet<Profession[]>("/profession");
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Khong the lay danh sach nghe nghiep");
}

async function fetchCountries(): Promise<Country[]> {
  const res = await apiGet<Country[]>("/countries");
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Khong the lay danh sach quoc gia");
}

async function fetchProvinces(): Promise<Province[]> {
  const res = await apiGet<Province[]>("/provinces");
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Khong the lay danh sach tinh thanh");
}

async function fetchDistricts(city: string): Promise<District[]> {
  const res = await apiGet<District[]>("/district", { params: { city } });
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Khong the lay danh sach quan huyen");
}

async function fetchWards(districtcode: string): Promise<Ward[]> {
  const res = await apiGet<Ward[]>("/ward", { params: { districtcode } });
  if (res.data.status === "success" && res.data.responseData) {
    return res.data.responseData;
  }
  throw new Error(res.data.message || "Khong the lay danh sach phuong xa");
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

export function useNations() {
  return useQuery({
    queryKey: addressKeys.nations,
    queryFn: fetchNations,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useProfessions() {
  return useQuery({
    queryKey: addressKeys.professions,
    queryFn: fetchProfessions,
    staleTime: 1000 * 60 * 60,
  });
}

export function useCountries() {
  return useQuery({
    queryKey: addressKeys.countries,
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60,
  });
}

export function useProvinces() {
  return useQuery({
    queryKey: addressKeys.provinces,
    queryFn: fetchProvinces,
    staleTime: 1000 * 60 * 60,
  });
}

export function useDistricts(city: string | null) {
  return useQuery({
    queryKey: addressKeys.districts(city ?? ""),
    queryFn: () => fetchDistricts(city!),
    enabled: Boolean(city),
    staleTime: 1000 * 60 * 60,
  });
}

export function useWards(districtcode: string | null) {
  return useQuery({
    queryKey: addressKeys.wards(districtcode ?? ""),
    queryFn: () => fetchWards(districtcode!),
    enabled: Boolean(districtcode),
    staleTime: 1000 * 60 * 60,
  });
}