import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { CreditModel } from '../models/credit';
import { PeriodModel } from '../models/credit';
import { AmortizationData } from '../models/credit';
import { PaymentOptions } from '../models/payment';
import { PaymentResult } from '../models/payment';
import { TransactionModel } from '../models/transaction';
import { CreditSummaryResponse, CrossTenantSummaryResponse, SimulateRequest, SimulateResponse, LimitIncreaseRequest, Store } from '../models/credit';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  constructor(private api: ApiService) {}

  getCredits(): Observable<CreditModel[]> {
    return this.api.get<CreditModel[]>('/credits');
  }

  getCreditDetail(id: number): Observable<CreditModel> {
    return this.api.get<CreditModel>(`/credits/${id}`);
  }

  getPeriods(creditId: number): Observable<PeriodModel[]> {
    return this.api.get<PeriodModel[]>(`/credits/${creditId}/periods`);
  }

  getPaymentOptions(creditId: number): Observable<PaymentOptions> {
    return this.api.get<PaymentOptions>(`/credits/${creditId}/payment-options`);
  }

  getAmortization(creditId: number): Observable<AmortizationData> {
    return this.api.get<AmortizationData>(
      `/credits/${creditId}/amortization`
    );
  }

  getSummary(creditId: number): Observable<CreditSummaryResponse> {
    return this.api.get<CreditSummaryResponse>(`/credits/${creditId}/summary`);
  }

  getCrossTenantSummary(): Observable<CrossTenantSummaryResponse> {
    return this.api.get<CrossTenantSummaryResponse>('/cross-tenant-summary');
  }

  // ---- Simulador ----

  simulateAmortization(data: SimulateRequest): Observable<SimulateResponse> {
    return this.api.post<SimulateResponse>('/simulate-amortization', {
      amount: data.amount,
      number_of_installments: data.numberOfInstallments,
      interest_rate: data.interestRate,
      insurance_percentage: data.insurancePercentage,
      frequency: data.frequency,
    });
  }

  // ---- Aumento de cupo ----

  requestLimitIncrease(creditId: number, requestedAmount: number, reason?: string): Observable<any> {
    return this.api.post<any>(`/credits/${creditId}/request-limit-increase`, {
      requested_amount: requestedAmount,
      reason: reason || '',
    });
  }

  getLimitIncreaseRequests(): Observable<LimitIncreaseRequest[]> {
    return this.api.get<LimitIncreaseRequest[]>('/limit-increase-requests');
  }

  // ---- Dónde comprar ----

  getStores(): Observable<Store[]> {
    return this.api.get<Store[]>('/stores');
  }

  getTransactions(): Observable<TransactionModel[]> {
    return this.api.get<TransactionModel[]>('/transactions');
  }

  // ---- Payment processing ----

  payPeriod(data: {
    landlordCreditId: number;
    periodNumber: number;
    paymentMethod: string;
    amount?: number;
    paymentType?: string;
    reference?: string;
  }): Observable<PaymentResult> {
    return this.api.post<PaymentResult>('/payments/period', {
      landlord_credit_id: data.landlordCreditId,
      period_number: data.periodNumber,
      payment_method: data.paymentMethod,
      amount: data.amount,
      payment_type: data.paymentType || 'period',
      reference: data.reference,
    });
  }

  payPending(data: {
    landlordCreditId: number;
    paymentMethod: string;
    amount?: number;
    reference?: string;
  }): Observable<PaymentResult> {
    return this.api.post<PaymentResult>('/payments/pending', {
      landlord_credit_id: data.landlordCreditId,
      payment_method: data.paymentMethod,
      amount: data.amount,
      reference: data.reference,
    });
  }

  liquidate(data: {
    landlordCreditId: number;
    paymentMethod: string;
    amount?: number;
    reference?: string;
  }): Observable<PaymentResult> {
    return this.api.post<PaymentResult>('/payments/liquidation', {
      landlord_credit_id: data.landlordCreditId,
      payment_method: data.paymentMethod,
      amount: data.amount,
      reference: data.reference,
    });
  }
}
