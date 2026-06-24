import { Component, OnInit } from '@angular/core';
import { CreditService } from '../../services/credit';
import { TransactionModel } from '../../models/transaction';

interface TransactionGroup {
  commerceName: string;
  transactions: TransactionModel[];
  total: number;
}

@Component({
  standalone: false,
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  groups: TransactionGroup[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private creditService: CreditService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.isLoading = true;
    this.errorMessage = '';
    this.creditService.getTransactions().subscribe({
      next: (data) => {
        this.groups = this.groupByCommerce(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al cargar transacciones';
        this.isLoading = false;
      },
    });
  }

  private groupByCommerce(transactions: TransactionModel[]): TransactionGroup[] {
    const map = new Map<string, TransactionModel[]>();
    for (const t of transactions) {
      const key = t.tenantName || 'General';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries())
      .map(([commerceName, txs]) => ({
        commerceName,
        transactions: txs.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
        total: txs.reduce((sum, t) => sum + Number(t.amount), 0),
      }))
      .sort((a, b) => a.commerceName.localeCompare(b.commerceName));
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      purchase: 'cart-outline',
      payment: 'card-outline',
    };
    return icons[type] || 'ellipse-outline';
  }

  formatAmount(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return num.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      completed: 'success', pending: 'warning', failed: 'danger', refunded: 'medium',
    };
    return colors[status] || 'medium';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      completed: 'Completado', pending: 'Pendiente', failed: 'Fallido', refunded: 'Reembolsado',
    };
    return labels[status] || status;
  }

  trackByGroup(index: number, g: TransactionGroup): string {
    return g.commerceName;
  }
}
