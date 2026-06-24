import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreditService } from '../../services/credit';
import { Store } from '../../models/credit';

@Component({
  standalone: false,
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss'],
})
export class StoresComponent implements OnInit {
  stores: Store[] = [];
  filtered: Store[] = [];
  isLoading = true;
  error = '';
  searchQuery = '';

  constructor(
    private router: Router,
    private creditService: CreditService
  ) {}

  ngOnInit() {
    this.loadStores();
  }

  loadStores() {
    this.isLoading = true;
    this.error = '';
    this.creditService.getStores().subscribe({
      next: (data) => {
        this.stores = data;
        this.filtered = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cargar comercios';
        this.isLoading = false;
      },
    });
  }

  onSearch(ev: any) {
    this.searchQuery = (ev.detail.value || '').toLowerCase();
    this.filtered = this.stores.filter(
      (s) =>
        s.name.toLowerCase().includes(this.searchQuery) ||
        (s.address || '').toLowerCase().includes(this.searchQuery)
    );
  }

  goBack() {
    this.router.navigate(['/tabs/dashboard']);
  }
}
