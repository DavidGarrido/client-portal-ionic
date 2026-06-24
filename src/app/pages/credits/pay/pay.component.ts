import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditService } from '../../../services/credit';
import { CreditModel } from '../../../models/credit';
import { PaymentOptions, CurrentPeriodOption, PendingPaymentOption, LiquidationOption, PaymentResult } from '../../../models/payment';
import { AlertController, ToastController } from '@ionic/angular';

type PaymentMode = 'period' | 'pending' | 'liquidation' | null;

@Component({
  standalone: false,
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent implements OnInit {
  creditId = 0;
  credit: CreditModel | null = null;
  options: PaymentOptions | null = null;
  isLoading = true;
  isProcessing = false;
  errorMessage = '';

  // Selected payment mode
  selectedMode: PaymentMode = null;

  // Form fields
  paymentMethod = 'efectivo';
  customAmount: number | null = null;
  reference = '';

  // Double-click confirmation
  isConfirming = false;
  confirmTimer: any = null;

  // Period info for current period payment
  periodInfo: CurrentPeriodOption | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private creditService: CreditService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.creditId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.errorMessage = '';
    this.creditService.getCreditDetail(this.creditId).subscribe({
      next: (credit) => {
        this.credit = credit;
        this.creditService.getPaymentOptions(this.creditId).subscribe({
          next: (opts) => {
            this.options = opts;
            if (opts.currentPeriod) {
              this.periodInfo = opts.currentPeriod;
            }
            // Auto-select first available option
            if (opts.pendingPayment) {
              this.selectedMode = 'pending';
            } else if (opts.currentPeriod) {
              this.selectedMode = 'period';
            } else if (opts.liquidation) {
              this.selectedMode = 'liquidation';
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.errorMessage = 'Error al cargar opciones de pago';
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar información del crédito';
        this.isLoading = false;
      },
    });
  }

  selectMode(mode: PaymentMode) {
    this.selectedMode = mode;
    this.resetConfirmation();
  }

  // ---- Amount helpers ----

  get amountToPay(): number {
    if (this.customAmount !== null && this.customAmount > 0) {
      return this.customAmount;
    }
    return this.defaultAmount;
  }

  get defaultAmount(): number {
    switch (this.selectedMode) {
      case 'period':
        if (this.periodInfo?.isEarlyPayment) {
          return this.periodInfo.earlyAmount;
        }
        return this.periodInfo?.normalAmount || 0;
      case 'pending':
        return this.options?.pendingPayment?.totalAmount || 0;
      case 'liquidation':
        return this.options?.liquidation?.totalAmount || 0;
      default:
        return 0;
    }
  }

  get hasEarlyPaymentDiscount(): boolean {
    return this.selectedMode === 'period' && !!this.periodInfo?.isEarlyPayment;
  }

  get interestSaved(): number {
    switch (this.selectedMode) {
      case 'period':
        return this.periodInfo?.interestSaved || 0;
      case 'liquidation':
        return this.options?.liquidation?.interestSaved || 0;
      default:
        return 0;
    }
  }

  // ---- Submit ----

  async submit() {
    if (this.isConfirming) {
      // Second click — process
      this.isConfirming = false;
      if (this.confirmTimer) clearTimeout(this.confirmTimer);
      await this.processPayment();
      return;
    }

    // First click — start confirmation
    this.isConfirming = true;
    this.confirmTimer = setTimeout(() => {
      this.isConfirming = false;
    }, 5000);
  }

  resetConfirmation() {
    this.isConfirming = false;
    if (this.confirmTimer) clearTimeout(this.confirmTimer);
  }

  private processPayment() {
    this.isProcessing = true;
    this.errorMessage = '';

    const base = {
      landlordCreditId: this.creditId,
      paymentMethod: this.paymentMethod,
      reference: this.reference || undefined,
      amount: this.customAmount ?? undefined,
    };

    const onSuccess = () => {
      this.isProcessing = false;
      this.showSuccessToast();
      this.router.navigate(['/tabs/dashboard/credits', this.creditId]);
    };

    const onError = (err: any) => {
      this.isProcessing = false;
      this.errorMessage = err.error?.message || err.message || 'Error al procesar el pago';
    };

    switch (this.selectedMode) {
      case 'period':
        this.creditService.payPeriod({
          ...base,
          periodNumber: this.periodInfo?.periodNumber || 1,
          paymentType: this.periodInfo?.isEarlyPayment ? 'period' : 'installment',
        }).subscribe({ next: onSuccess, error: onError });
        break;
      case 'pending':
        this.creditService.payPending(base).subscribe({ next: onSuccess, error: onError });
        break;
      case 'liquidation':
        this.creditService.liquidate(base).subscribe({ next: onSuccess, error: onError });
        break;
    }
  }

  private async showSuccessToast() {
    const toast = await this.toastCtrl.create({
      message: '✅ Pago registrado exitosamente',
      duration: 3000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  // ---- Utilities ----

  formatCurrency(amount: number | null | undefined): string {
    const val = amount ?? 0;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(val);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: 'success', pending: 'warning', blocked: 'danger',
      canceled: 'medium',
    };
    return colors[status] || 'medium';
  }
}
