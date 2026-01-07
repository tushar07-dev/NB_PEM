import type { User } from "@/types/user";

export interface AuthResponse {
  authToken: string;
  user: User;
}

// Mock users for development
const mockUsers: Array<{
  id: number;
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
}> = [
  { id: 1, email: "admin@test.com", password: "admin123", name: "Admin User", role: "admin" },
  { id: 2, email: "user@test.com", password: "user123", name: "Regular User", role: "user" },
];

function generateAuthToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function getUser(): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In production, this would check session/cookie
  const testUser: User = {
    id: 1,
    email: "test@email.com",
    role: "admin",
    name: "Test User",
  };

  return {
    authToken: generateAuthToken(),
    user: testUser,
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Find user by email and password
  const user = mockUsers.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  return {
    authToken: generateAuthToken(),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}