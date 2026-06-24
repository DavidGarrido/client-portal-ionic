import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../services/auth';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  identification = '1022978178';
  phone = '3205731318';
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  async login() {
    this.errorMessage = '';

    if (!this.identification.trim()) {
      this.errorMessage = 'Ingresa tu número de documento';
      return;
    }
    if (!this.phone.trim()) {
      this.errorMessage = 'Ingresa tu número de teléfono';
      return;
    }

    this.isLoading = true;
    try {
      const res: any = await firstValueFrom(
        this.auth.login(this.identification.trim(), this.phone.trim())
      );

      console.log('[LOGIN] API response:', JSON.stringify(res));

      if (res.success && res.data?.client_id) {
        const clientId = res.data.client_id;
        const debugCode = res.data.debug_code || '';

        // Save to localStorage as safety net
        localStorage.setItem('credifacil_verify_client_id', String(clientId));
        localStorage.setItem('credifacil_verify_identification', this.identification.trim());

        if (debugCode) {
          // Save debug code for auto-fill on verify page
          localStorage.setItem('credifacil_debug_code', debugCode);
        }

        console.log('[LOGIN] Navigating to verify with client_id:', clientId);
        this.router.navigate(['/auth/verify'], {
          queryParams: {
            client_id: clientId,
            identification: this.identification.trim(),
          },
        });
      } else {
        // Show message from API if provided
        this.errorMessage = res.message || 'Error al iniciar sesión';
        console.log('[LOGIN] No success, message:', this.errorMessage);
      }
    } catch (err: any) {
      console.error('[LOGIN] Error:', err);
      this.errorMessage =
        err.error?.message || err.message || 'Error de conexión';
    } finally {
      this.isLoading = false;
    }
  }
}
