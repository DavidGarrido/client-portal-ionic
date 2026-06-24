import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditService } from '../../../services/credit';
import { CreditModel, PaymentSummary } from '../../../models/credit';

@Component({
  standalone: false,
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  credit!: CreditModel;
  summary!: PaymentSummary | null;
  isLoading = true;
  errorMessage = '';
  creditId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private creditService: CreditService
  ) {}

  ngOnInit() {
    this.creditId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCredit();
  }

  loadCredit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.creditService.getCreditDetail(this.creditId).subscribe({
      next: (data) => {
        this.credit = data;
        this.summary = data.summary;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al cargar crédito';
        this.isLoading = false;
      },
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: 'success', pending: 'warning', blocked: 'danger',
      canceled: 'medium', rejected: 'medium',
    };
    return colors[status] || 'medium';
  }

  get progressPercent(): number {
    if (!this.summary?.totalInstallments) return 0;
    return (this.summary.paidInstallments / this.summary.totalInstallments) * 100;
  }

  get progressColor(): string {
    if (this.progressPercent > 80) return '#16A34A';
    if (this.progressPercent > 40) return '#F59E0B';
    return '#1A56DB';
  }

  goToPeriods() {
    this.router.navigate(['/tabs/dashboard/credits', this.creditId, 'periods']);
  }

  goToAmortization() {
    this.router.navigate(['/tabs/dashboard/credits', this.creditId, 'amortization']);
  }

  goToPay() {
    this.router.navigate(['/tabs/dashboard/credits', this.creditId, 'pay']);
  }
}
