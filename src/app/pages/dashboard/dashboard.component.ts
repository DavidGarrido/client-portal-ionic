import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreditService } from '../../services/credit';
import { AuthService } from '../../services/auth';
import { CreditModel } from '../../models/credit';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  credits: CreditModel[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    public router: Router,
    private creditService: CreditService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadCredits();
  }

  goToCredit(id: number) {
    this.router.navigate(['/tabs/dashboard/credits', id]);
  }

  goToProfile() {
    this.router.navigate(['/tabs/profile']);
  }

  loadCredits() {
    this.isLoading = true;
    this.errorMessage = '';
    this.creditService.getCredits().subscribe({
      next: (data) => {
        console.log('[DASHBOARD] Credits data:', JSON.stringify(data));
        // Compute usagePercent since API doesn't return it
        this.credits = data.map((c) => ({
          ...c,
          usagePercent:
            c.totalLimit > 0
              ? Math.round(
                  ((c.totalLimit - c.availableAmount) / c.totalLimit) * 100
                )
              : 0,
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al cargar créditos';
        this.isLoading = false;
      },
    });
  }

  get totalAvailable(): number {
    return this.credits.reduce((sum, c) => sum + (c.availableAmount || 0), 0);
  }

  get totalPending(): number {
    return this.credits.reduce((sum, c) => sum + (c.totalPending || 0), 0);
  }

  get clientName(): string {
    return this.auth.getClient()?.full_name?.split(' ')[0] || 'Cliente';
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: 'success',
      pending: 'warning',
      blocked: 'danger',
      canceled: 'medium',
    };
    return colors[status] || 'medium';
  }
}
