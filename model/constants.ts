export interface ITransaction {
  currencyPair: string; // btc#jpy
  transactionDate: string; // 1488888888
  sentAmount: number; // 100
  receivedAmount: number; // 100000
  feeAmount?: number; // 0
  feeCurrency?: string; // jpy
  label?: string; // airdrop
  description?: string; // cid_0000000000000001
  txHash?: string; // AEAEEAGAGAEGAGAEGAEGA
  wallet?: string; // coincheck
}

export interface ICache {
  lastFetchDate: string;
  data: ITransaction[];
}
