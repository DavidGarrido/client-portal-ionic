import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditService } from '../../../services/credit';
import { CreditModel, PaymentSummary, CreditSummaryResponse, TenantSnapshot } from '../../../models/credit';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: false,
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  credit!: CreditModel;
  summary!: PaymentSummary | null;

  /** Datos del summary multi-tenant (landlord) */
  summaryResponse!: CreditSummaryResponse | null;
  otherTenants: TenantSnapshot[] = [];
  isLoadingSummary = false;
  summaryError = '';

  isLoading = true;
  errorMessage = '';
  creditId = 0;

  // Nombre del tenant actual (lo tomamos del host o de una variable)
  currentTenantId = Number(localStorage.getItem('tenant_id') || '0');

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
        this.loadSummary();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al cargar crédito';
        this.isLoading = false;
      },
    });
  }

  /** Carga el resumen multi-tenant del landlord */
  loadSummary() {
    this.isLoadingSummary = true;
    this.summaryError = '';
    this.creditService.getSummary(this.creditId).subscribe({
      next: (res) => {
        this.summaryResponse = res;
        // Filtrar tenants que NO son el actual para mostrar como "otros comercios"
        this.otherTenants = res.tenants.filter(
          (t) => t.tenantId !== this.currentTenantId && t.pendingInstallments > 0
        );
        this.isLoadingSummary = false;
      },
      error: () => {
        this.isLoadingSummary = false;
        // No es crítico — el detalle del crédito local ya se cargó
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

  downloadPazYSalvo() {
    const token = localStorage.getItem('auth_token') || '';
    const url = `${environment.tenantApiUrl}/credits/${this.creditId}/paz-y-salvo?token=${encodeURIComponent(token)}`;
    window.open(url, '_system');
  }
}
