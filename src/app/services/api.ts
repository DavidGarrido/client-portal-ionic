import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.tenantApiUrl;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  getToken(): string | null {
    return this.storage.getToken();
  }

  private headers(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http
      .get<ApiWrapper<T>>(`${this.baseUrl}${endpoint}`, { headers: this.headers() })
      .pipe(
        map((res) => this.unwrap<T>(res)),
        catchError((error) => {
          console.error(`API GET error [${endpoint}]:`, error);
          return throwError(() => error);
        })
      );
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http
      .post<ApiWrapper<T>>(`${this.baseUrl}${endpoint}`, body, { headers: this.headers() })
      .pipe(
        map((res) => this.unwrap<T>(res)),
        catchError((error) => {
          console.error(`API POST error [${endpoint}]:`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Unwraps { success, data } and converts snake_case -> camelCase
   */
  private unwrap<T>(res: ApiWrapper<T>): T {
    let data: any = res;
    if (res.success !== undefined && res.data !== undefined) {
      data = res.data;
    }
    return this.toCamelCase(data) as T;
  }

  /** Recursively convert all object keys from snake_case to camelCase */
  private toCamelCase(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map((item) => this.toCamelCase(item));
    if (typeof obj === 'object' && !(obj instanceof Date)) {
      const result: Record<string, any> = {};
      for (const key of Object.keys(obj)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelKey] = this.toCamelCase(obj[key]);
      }
      return result;
    }
    return obj;
  }
}

/** Backend wraps responses in { success, data } */
interface ApiWrapper<T> {
  success: boolean;
  data: T;
  message?: string;
}
