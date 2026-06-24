export interface LoginRequest {
  identification: string;
  phone: string;
}

export interface VerifyRequest {
  client_id: number;
  identification: string;
  code: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  client_id?: number;
  identification?: string;
  just_linked?: boolean;
}

export interface VerifyResponse {
  status: string;
  token: string;
  client: ClientData;
  expires_at: string;
}

export interface ClientData {
  id: number;
  identification: string;
  full_name: string;
  phone: string;
  email: string | null;
  created_at: string;
}

export interface AuthState {
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  token: string | null;
  client: ClientData | null;
}
