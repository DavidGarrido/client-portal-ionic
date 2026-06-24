import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiService } from './api';
import { StorageService } from './storage';
import {
  LoginRequest,
  VerifyRequest,
  ClientData,
} from '../models/auth';

/** Backend wraps responses in { success, data, message } */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface VerifyData {
  token: string;
  client: ClientData;
  expires_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.tenantApiUrl;

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private storage: StorageService
  ) {}

  login(identification: string, phone: string): Observable<any> {
    const body: LoginRequest = { identification, phone };
    return this.http.post(`${this.baseUrl}/auth/login`, body);
  }

  verify(
    clientId: number,
    identification: string,
    code: string
  ): Observable<ApiResponse<VerifyData>> {
    const body: VerifyRequest = { client_id: clientId, identification, code };
    return this.http
      .post<ApiResponse<VerifyData>>(`${this.baseUrl}/auth/verify`, body)
      .pipe(
        tap((res) => {
          if (res.success && res.data?.token) {
            this.storage.setToken(res.data.token);
            if (res.data.client) {
              this.storage.setClient(res.data.client);
            }
          }
        })
      );
  }

  resendCode(clientId: number, identification: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/resend`, {
      client_id: clientId,
      identification,
    });
  }

  logout(): void {
    this.storage.clear();
  }

  isAuthenticated(): boolean {
    return this.storage.getToken() !== null;
  }

  getClient(): ClientData | null {
    return this.storage.getClient();
  }

  getToken(): string | null {
    return this.storage.getToken();
  }
}
