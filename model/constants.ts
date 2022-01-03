import { ParseResult } from "papaparse";

export interface ITransaction {
  id?: string; // UNIQUEIDENTIFIER
  currencyPair: string; // btc#jpy
  transactionDate: string; // 1488888888
  sentCurrency: string; // btc
  receivedCurrency: string; // jpy
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

export type csvWithHeader = Record<string, string>;

export type CsvAdapterFunction = (
  csv: ParseResult<csvWithHeader>
) => Promise<ITransaction[]>;
export type CsvAdapter = {
  name: string;
  header: string[];
  adapter: CsvAdapterFunction;
};
