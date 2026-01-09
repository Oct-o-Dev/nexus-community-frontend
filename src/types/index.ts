export interface User {
  sub: string; // The email (from JWT standard)
  iat: number; // Issued at
  exp: number; // Expiration
}

export interface AuthResponse {
  token: string;
}

export interface RegisterRequest {
  name?: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}