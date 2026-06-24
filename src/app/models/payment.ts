export interface PaymentOptions {
  pendingPayment: PendingPaymentOption | null;
  currentPeriod: CurrentPeriodOption | null;
  liquidation: LiquidationOption | null;
}

export interface PendingPaymentOption {
  installmentsCount: number;
  totalAmount: number;
  description: string;
}

export interface CurrentPeriodOption {
  periodNumber: number;
  periodKey: string;
  isEarlyPayment: boolean;
  normalAmount: number;
  earlyAmount: number;
  interestSaved: number;
}

export interface LiquidationOption {
  remainingInstallments: number;
  totalAmount: number;
  interestSaved: number;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  message?: string;
  data?: {
    transaction_id?: number;
    amount_paid?: number;
    payment_method?: string;
    payment_date?: string;
    payments?: any[];
  };
}

export interface PayPeriodRequest {
  landlordCreditId: number;
  periodNumber: number;
  paymentMethod: string;
  amount?: number;
  paymentType?: 'period' | 'installment' | 'principal';
  reference?: string;
}

export interface PayPendingRequest {
  landlordCreditId: number;
  paymentMethod: string;
  amount?: number;
  reference?: string;
}

export interface LiquidationRequest {
  landlordCreditId: number;
  paymentMethod: string;
  amount?: number;
  reference?: string;
}
