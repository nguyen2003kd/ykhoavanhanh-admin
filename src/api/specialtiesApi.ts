import { createApi } from "./createApi";
import type { AdminSpecialty } from "@/types/hospital-admin";

export const {
  service: specialtiesService,
  keys: specialtiesKeys,
  hooks: specialtiesHooks,
} = createApi<AdminSpecialty>("specialties");
