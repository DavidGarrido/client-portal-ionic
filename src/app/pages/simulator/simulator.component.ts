import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CreditService } from '../../services/credit';
import { SimulateResponse, SimInstallment } from '../../models/credit';

@Component({
  standalone: false,
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss'],
})
export class SimulatorComponent {
  amount = 500000;
  selectedInstallments = 6;
  installmentsOptions = [3, 6, 12, 18, 24, 36];
  isLoading = false;
  result: SimulateResponse | null = null;
  error = '';

  constructor(
    private router: Router,
    private creditService: CreditService
  ) {}

  get formattedAmount(): string {
    return '$ ' + this.amount.toLocaleString('es-CO');
  }

  onAmountChange(ev: any) {
    this.amount = Number(ev.detail.value) || 0;
    this.result = null;
  }

  selectInstallments(n: number) {
    this.selectedInstallments = n;
    this.result = null;
  }

  simulate() {
    if (this.amount < 10000) {
      this.error = 'El monto mínimo es $10,000';
      return;
    }
    this.isLoading = true;
    this.error = '';
    this.result = null;
    this.creditService.simulateAmortization({
      amount: this.amount,
      numberOfInstallments: this.selectedInstallments,
    }).subscribe({
      next: (res) => {
        this.result = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al simular';
        this.isLoading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/tabs/dashboard']);
  }
}
