import { Injectable } from '@angular/core';
import { ClientData } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly TOKEN_KEY = 'credifacil_token';
  private readonly CLIENT_KEY = 'credifacil_client';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setClient(client: ClientData): void {
    localStorage.setItem(this.CLIENT_KEY, JSON.stringify(client));
  }

  getClient(): ClientData | null {
    const raw = localStorage.getItem(this.CLIENT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ClientData;
    } catch {
      return null;
    }
  }

  removeClient(): void {
    localStorage.removeItem(this.CLIENT_KEY);
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.CLIENT_KEY);
  }
}
