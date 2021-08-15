export interface ITransaction {
  currencyPair: string;
  transactionDate: string;
  sentAmount: number;
  receivedAmount: number;
  feeAmount?: number;
  feeCurrency?: string;
  label?: string;
  description?: string;
  txHash?: string;
}

export interface ICache {
  lastFetchDate: string;
  data: ITransaction[];
}
