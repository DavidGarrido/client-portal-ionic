import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../services/auth';

@Component({
  standalone: false,
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit, OnDestroy {
  clientId = 0;
  identification = '';
  code = ['', '', '', '', '', ''];
  isLoading = false;
  errorMessage = '';
  resendCooldown = 60;
  focusedIndex = -1;
  private cooldownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // Read from query params (set by login component on navigation)
    this.route.queryParams.subscribe((params) => {
      if (params['client_id']) {
        this.clientId = Number(params['client_id']);
        this.identification = params['identification'] || '';
      }

      // Fallback to localStorage (also set by login before navigating)
      if (!this.clientId) {
        const savedId = localStorage.getItem('credifacil_verify_client_id');
        if (savedId) {
          this.clientId = Number(savedId);
          this.identification =
            localStorage.getItem('credifacil_verify_identification') || '';
        }
      }

      // If still no clientId, redirect to login
      if (!this.clientId) {
        this.router.navigate(['/auth/login'], { replaceUrl: true });
        return;
      }

      this.startResendCooldown();
      this.focusFirstInput();
    });
  }

  ngOnDestroy() {
    if (this.cooldownInterval) clearInterval(this.cooldownInterval);
  }

  onCodeInput(index: number, event: any) {
    // Only allow single digit
    const raw = event.target?.value ?? '';
    const digit = raw.replace(/\D/g, '').slice(0, 1);
    this.code[index] = digit;

    // If a digit was entered, move to next
    if (digit && index < 5) {
      const nextInput = document.querySelector(`#code-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }

    // If last digit, auto-verify after short delay
    if (index === 5 && digit) {
      setTimeout(() => this.verify(), 200);
    }
  }

  onKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      // Clear current
      this.code[index] = '';
      // Move to previous if current was already empty
      if (!this.code[index] && index > 0) {
        const prevInput = document.querySelector(`#code-${index - 1}`) as HTMLInputElement;
        if (prevInput) {
          this.code[index - 1] = '';
          prevInput.focus();
        }
      }
      event.preventDefault();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  async verify() {
    const fullCode = this.code.join('');
    if (fullCode.length !== 6) {
      this.errorMessage = 'Ingresa el código completo de 6 dígitos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    try {
      const res: any = await firstValueFrom(
        this.auth.verify(this.clientId, this.identification, fullCode)
      );
      console.log('[VERIFY] API response:', JSON.stringify(res));
      if (res.success && res.data?.token) {
        this.clearStoredData();
        this.router.navigate(['/tabs/dashboard'], { replaceUrl: true });
      } else {
        this.errorMessage = res.message || 'Código inválido';
      }
    } catch (err: any) {
      console.error('[VERIFY] Error:', err);
      this.errorMessage = err.error?.message || 'Error al verificar el código';
      this.code = ['', '', '', '', '', ''];
      this.focusFirstInput();
    } finally {
      this.isLoading = false;
    }
  }

  async resendCode() {
    if (this.resendCooldown > 0 || this.isLoading) return;
    try {
      await firstValueFrom(
        this.auth.resendCode(this.clientId, this.identification)
      );
      this.startResendCooldown();
      this.errorMessage = '';
    } catch (err: any) {
      this.errorMessage = err.error?.message || 'Error al reenviar código';
    }
  }

  private startResendCooldown() {
    this.resendCooldown = 60;
    this.cooldownInterval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.cooldownInterval);
      }
    }, 1000);
  }

  private focusFirstInput() {
    setTimeout(() => {
      const firstInput = document.querySelector('#code-0') as HTMLInputElement;
      firstInput?.focus();
    }, 200);
  }

  private clearStoredData() {
    localStorage.removeItem('credifacil_verify_client_id');
    localStorage.removeItem('credifacil_verify_identification');
  }
}
