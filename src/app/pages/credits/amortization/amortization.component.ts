import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditService } from '../../../services/credit';
import { AmortizationData } from '../../../models/credit';

@Component({
  standalone: false,
  selector: 'app-amortization',
  templateUrl: './amortization.component.html',
  styleUrls: ['./amortization.component.scss'],
})
export class AmortizationComponent implements OnInit {
  data!: AmortizationData;
  isLoading = true;
  errorMessage = '';
  creditId = 0;
  filterStatus: 'all' | 'pending' | 'paid' | 'overdue' = 'all';

  constructor(
    private route: ActivatedRoute,
    private creditService: CreditService
  ) {}

  ngOnInit() {
    this.creditId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAmortization();
  }

  loadAmortization() {
    this.isLoading = true;
    this.errorMessage = '';
    this.creditService.getAmortization(this.creditId).subscribe({
      next: (data) => {
        this.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al cargar amortización';
        this.isLoading = false;
      },
    });
  }

  get filteredInstallments() {
    if (!this.data?.installments) return [];
    if (this.filterStatus === 'all') return this.data.installments;
    const statusMap: Record<string, string> = {
      pending: 'pendiente',
      paid: 'pagado',
      overdue: 'vencido',
    };
    return this.data.installments.filter((i) => i.status === statusMap[this.filterStatus]);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pagado: 'success', pendiente: 'warning', vencido: 'danger',
    };
    return colors[status] || 'medium';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pagado: 'Pagado', pendiente: 'Pendiente', vencido: 'Vencido',
    };
    return labels[status] || status;
  }

  trackByInstallment(index: number, item: any): number {
    return index;
  }
}
