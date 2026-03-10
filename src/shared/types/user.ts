// src/shared/types/user.ts
import type { Role } from "@/shared/types/roles";

export type UserRole = Role;

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};