import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreditService } from '../../../services/credit';
import { LimitIncreaseRequest } from '../../../models/credit';

@Component({
  standalone: false,
  selector: 'app-limit-increase-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class LimitIncreaseListComponent implements OnInit {
  requests: LimitIncreaseRequest[] = [];
  isLoading = true;
  error = '';

  constructor(
    private router: Router,
    private creditService: CreditService
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.error = '';
    this.creditService.getLimitIncreaseRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar solicitudes';
        this.isLoading = false;
      },
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
    };
    return colors[status] || 'medium';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobada',
      rejected: 'Rechazada',
    };
    return labels[status] || status;
  }

  goBack() {
    this.router.navigate(['/tabs/dashboard']);
  }
}
