import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditService } from '../../../services/credit';
import { PeriodModel } from '../../../models/credit';

@Component({
  standalone: false,
  selector: 'app-periods',
  templateUrl: './periods.component.html',
  styleUrls: ['./periods.component.scss'],
})
export class PeriodsComponent implements OnInit {
  periods: PeriodModel[] = [];
  isLoading = true;
  errorMessage = '';
  creditId = 0;
  expandedPeriods = new Set<string>();

  constructor(
    private route: ActivatedRoute,
    private creditService: CreditService
  ) {}

  ngOnInit() {
    this.creditId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPeriods();
  }

  loadPeriods() {
    this.isLoading = true;
    this.errorMessage = '';
    this.creditService.getPeriods(this.creditId).subscribe({
      next: (data) => {
        this.periods = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al cargar periodos';
        this.isLoading = false;
      },
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      paid: 'success', pending: 'warning', overdue: 'danger',
    };
    return colors[status] || 'medium';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      paid: 'Pagado', pending: 'Pendiente', overdue: 'Vencido',
    };
    return labels[status] || status;
  }

  /** Sum of installments that are paid */
  get totalPaid(): number {
    return this.periods
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.total, 0);
  }

  get totalPending(): number {
    return this.periods
      .filter((p) => p.status !== 'paid')
      .reduce((sum, p) => sum + p.remaining, 0);
  }

  countByStatus(status: string): number {
    return this.periods.filter((p) => p.status === status).length;
  }

  firstInstallmentPaidAt(period: PeriodModel): string | null {
    const paid = period.installments?.find((i) => i.isPaid);
    return paid?.paidAt || null;
  }

  toggleExpand(periodLabel: string) {
    if (this.expandedPeriods.has(periodLabel)) {
      this.expandedPeriods.delete(periodLabel);
    } else {
      this.expandedPeriods.add(periodLabel);
    }
  }

  isExpanded(periodLabel: string): boolean {
    return this.expandedPeriods.has(periodLabel);
  }

  trackByPeriod(index: number, p: PeriodModel): string {
    return p.periodLabel;
  }
}
