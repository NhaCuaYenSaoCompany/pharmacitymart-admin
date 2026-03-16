import type { User } from "~/apis/AuthApi/dto/res-login";


export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Action payload types
export interface LoginSuccessPayload {
  user: User;
  token: string;
}
