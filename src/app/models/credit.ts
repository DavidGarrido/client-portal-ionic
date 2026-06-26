export interface CreditSummary {
  totalAvailable: number;
  totalDebt: number;
  activeCredits: number;
}

export interface CreditModel {
  id: number;
  code: string;
  status: string;
  amount: number;
  financedAmount: number;
  installmentAmount: number;
  term: number;
  interestRate: number;
  totalLimit: number;
  availableAmount: number;
  startDate: string | null;
  endDate: string | null;
  nextPaymentDate: string | null;
  nextPaymentAmount: number | null;
  pendingInstallments: number | null;
  totalPaid: number;
  totalPending: number;
  cutoffDay: number | null;
  frequency: string | null;
  /** Computed: (1 - availableAmount/totalLimit) * 100 or 0 */
  usagePercent: number;
  summary: PaymentSummary | null;
}

export interface PaymentSummary {
  totalInstallments: number;
  paidInstallments: number;
  totalPaid: number;
  totalPending: number;
  onTimePaymentRate: string;
  overdueInstallments: number;
}

export interface PeriodModel {
  periodLabel: string;
  status: string;
  dueDate: string;
  total: number;
  paid: number;
  remaining: number;
  installments: InstallmentModel[];
}

export interface InstallmentModel {
  id: number;
  number: number;
  name: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: string;
  isPaid: boolean;
  paidAt: string | null;
}

export interface AmortizationData {
  summary: AmortizationSummary;
  installments: AmortizationRow[];
}

export interface AmortizationSummary {
  totalPrincipal: number;
  totalInterest: number;
  totalInsurance: number;
  totalPayable: number;
}

export interface AmortizationRow {
  number: number;
  dueDate: string;
  principal: number;
  interest: number;
  insurance: number;
  total: number;
  finalBalance: number;
  status: string;
  paidDate: string | null;
}

// ---------------------------------------------------------------------------
// Multi-tenant snapshot summary
// ---------------------------------------------------------------------------

export interface CreditSummaryResponse {
  credit: {
    id: number;
    totalLimit: number;
    availableAmount: number;
    status: string;
  };
  client: {
    id: number;
    name: string;
    identification: string;
  };
  tenants: TenantSnapshot[];
  summary: AggregateSummary;
}

export interface TenantSnapshot {
  tenantId: number;
  totalInstallments: number;
  paidInstallments: number;
  pendingInstallments: number;
  overdueInstallments: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  nextDueDate: string | null;
  nextDueAmount: number;
  lastSyncAt: string | null;
}

export interface AggregateSummary {
  totalPending: number;
  totalPaid: number;
  totalOverdue: number;
  nextDueDate: string | null;
  nextDueAmount: number;
  updatedAt: string | null;
}

export interface CrossTenantSummaryResponse {
  tenants: CrossTenantTenant[];
  summary: AggregateSummary;
}

export interface CrossTenantTenant {
  tenantId: number;
  creditCount: number;
  totalInstallments: number;
  paidInstallments: number;
  pendingInstallments: number;
  overdueInstallments: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  nextDueDate: string | null;
  nextDueAmount: number;
  lastSyncAt: string | null;
}

// ---------------------------------------------------------------------------
// Simulador de amortización
// ---------------------------------------------------------------------------

export interface SimulateRequest {
  amount: number;
  numberOfInstallments: number;
  interestRate?: number;
  insurancePercentage?: number;
  frequency?: string;
}

export interface SimulateResponse {
  installments: SimInstallment[];
  summary: SimSummary;
  config: SimConfig;
}

export interface SimInstallment {
  installmentNumber: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  insuranceAmount: number;
  totalAmount: number;
  initialBalance: number;
  finalBalance: number;
}

export interface SimSummary {
  purchaseAmount: number;
  numberOfInstallments: number;
  totalPrincipal: number;
  totalInterest: number;
  totalInsurance: number;
  grandTotal: number;
  monthlyPayment: number;
}

export interface SimConfig {
  interestRate: number;
  insurancePercentage: number;
  frequency: string;
  effectiveRate: number;
}

// ---------------------------------------------------------------------------
// Aumento de cupo
// ---------------------------------------------------------------------------

export interface LimitIncreaseRequest {
  id: number;
  creditId: number;
  creditCode: string;
  currentLimit: number;
  requestedAmount: number;
  newLimit: number;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

// ---------------------------------------------------------------------------
// Tiendas / Comercios
// ---------------------------------------------------------------------------

export interface Store {
  id: string;
  name: string;
  domain: string | null;
  address: string | null;
  phone: string | null;
}
