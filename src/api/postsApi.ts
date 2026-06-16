import { createApi } from "./createApi";
import type { Post } from "@/types/hospital-admin";

export const {
  service: postsService,
  keys: postsKeys,
  hooks: postsHooks,
} = createApi<Post>("posts");
