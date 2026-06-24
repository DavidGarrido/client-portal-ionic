import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CreditService } from '../../../services/credit';

@Component({
  standalone: false,
  selector: 'app-request-limit-increase',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestLimitIncreaseComponent {
  creditId = 0;
  requestedAmount = 500000;
  reason = '';
  isLoading = false;
  successMessage = '';
  error = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private creditService: CreditService
  ) {
    this.creditId = Number(this.route.snapshot.paramMap.get('id') || '0');
  }

  quickAmounts = [200000, 500000, 1000000, 2000000];

  submit() {
    if (this.requestedAmount < 10000) {
      this.error = 'El monto mínimo es $10,000';
      return;
    }
    if (!this.creditId) {
      this.error = 'No se ha seleccionado un crédito';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.successMessage = '';

    this.creditService.requestLimitIncrease(
      this.creditId,
      this.requestedAmount,
      this.reason
    ).subscribe({
      next: () => {
        this.successMessage = 'Solicitud creada exitosamente';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/tabs/dashboard']), 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al crear solicitud';
        this.isLoading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/tabs/dashboard']);
  }
}
