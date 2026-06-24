export interface TransactionModel {
  id: number;
  type: 'purchase' | 'payment';
  description: string | null;
  amount: number;
  isPayment: boolean;
  status: string;
  reference: string | null;
  createdAt: string;
  tenantId: string | null;
  tenantName: string | null;
}
