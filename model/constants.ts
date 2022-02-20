import { ParseResult } from "papaparse";

export interface ITransaction {
  id?: string; // UNIQUEIDENTIFIER
  currencyPair: string; // btc#jpy
  transactionTicks: string; // 1488888888
  transactionDate: string; // 2017-01-01T00:00:00.000Z
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

export type CsvDataDefault = {
  id: string;
  currencyPair: string;
  transactionTicks: string;
  transactionDate: string;
  sentCurrency: string;
  receivedCurrency: string;
  sentAmount: string;
  receivedAmount: string;
  feeAmount: string;
  feeCurrency: string;
  label: string;
  description: string;
  txHash: string;
  wallet: string;
};
export function isCsvDataDefault(
  csvData: Record<string, string>[]
): csvData is CsvDataDefault[] {
  return (
    (<CsvDataDefault[]>csvData)[0].id !== undefined &&
    (<CsvDataDefault[]>csvData)[0].currencyPair !== undefined &&
    (<CsvDataDefault[]>csvData)[0].transactionTicks !== undefined &&
    (<CsvDataDefault[]>csvData)[0].transactionDate !== undefined &&
    (<CsvDataDefault[]>csvData)[0].sentCurrency !== undefined &&
    (<CsvDataDefault[]>csvData)[0].receivedCurrency !== undefined &&
    (<CsvDataDefault[]>csvData)[0].sentAmount !== undefined &&
    (<CsvDataDefault[]>csvData)[0].receivedAmount !== undefined &&
    (<CsvDataDefault[]>csvData)[0].feeAmount !== undefined &&
    (<CsvDataDefault[]>csvData)[0].feeCurrency !== undefined &&
    (<CsvDataDefault[]>csvData)[0].label !== undefined &&
    (<CsvDataDefault[]>csvData)[0].description !== undefined &&
    (<CsvDataDefault[]>csvData)[0].txHash !== undefined &&
    (<CsvDataDefault[]>csvData)[0].wallet !== undefined
  );
}

export type CsvDataKoinly = {
  Id: string;
  Date: string;
  "Sent Amount": string;
  "Sent Currency": string;
  "Received Amount": string;
  "Received Currency": string;
  "Fee Amount": string;
  "Fee Currency": string;
  "Net Worth Amount": string;
  "Net Worth Currency": string;
  Label: string;
  Description: string;
  TxHash: string;
};
export function isCsvDataKoinly(
  csvData: Record<string, string>[]
): csvData is CsvDataKoinly[] {
  return (
    (<CsvDataKoinly[]>csvData)[0].Id !== undefined &&
    (<CsvDataKoinly[]>csvData)[0].Date !== undefined &&
    (<CsvDataKoinly[]>csvData)[0]["Sent Amount"] !== undefined &&
    (<CsvDataKoinly[]>csvData)[0]["Sent Currency"] !== undefined &&
    (<CsvDataKoinly[]>csvData)[0]["Received Amount"] !== undefined &&
    (<CsvDataKoinly[]>csvData)[0]["Received Currency"] !== undefined &&
    (<CsvDataKoinly[]>csvData)[0]["Fee Amount"] !== undefined &&
    (<CsvDataKoinly[]>csvData)[0]["Fee Currency"] !== undefined &&
    (<CsvDataKoinly[]>csvData)[0]["Net Worth Amount"] !== undefined &&
    (<CsvDataKoinly[]>csvData)[0]["Net Worth Currency"] !== undefined &&
    (<CsvDataKoinly[]>csvData)[0].Label !== undefined &&
    (<CsvDataKoinly[]>csvData)[0].Description !== undefined &&
    (<CsvDataKoinly[]>csvData)[0].TxHash !== undefined
  );
}

export type CsvDataBinanceSpotHistory = {
  "Date(UTC)": string;
  Pair: string;
  Side: string;
  Price: string;
  Executed: string;
  Amount: string;
  Fee: string;
};
export function isCsvDataBinanceSpotHistory(
  csvData: Record<string, string>[]
): csvData is CsvDataBinanceSpotHistory[] {
  return (
    (<CsvDataBinanceSpotHistory[]>csvData)[0]["Date(UTC)"] !== undefined &&
    (<CsvDataBinanceSpotHistory[]>csvData)[0].Pair !== undefined &&
    (<CsvDataBinanceSpotHistory[]>csvData)[0].Side !== undefined &&
    (<CsvDataBinanceSpotHistory[]>csvData)[0].Price !== undefined &&
    (<CsvDataBinanceSpotHistory[]>csvData)[0].Executed !== undefined &&
    (<CsvDataBinanceSpotHistory[]>csvData)[0].Amount !== undefined &&
    (<CsvDataBinanceSpotHistory[]>csvData)[0].Fee !== undefined
  );
}

export type CsvDataBinanceAllStatements = {
  User_ID: string;
  UTC_Time: string;
  Account: string;
  Operation: string;
  Coin: string;
  Change: string;
  Remark: string;
};
export function isCsvDataBinanceAllStatements(
  csvData: Record<string, string>[]
): csvData is CsvDataBinanceAllStatements[] {
  return (
    (<CsvDataBinanceAllStatements[]>csvData)[0].User_ID !== undefined &&
    (<CsvDataBinanceAllStatements[]>csvData)[0].UTC_Time !== undefined &&
    (<CsvDataBinanceAllStatements[]>csvData)[0].Account !== undefined &&
    (<CsvDataBinanceAllStatements[]>csvData)[0].Operation !== undefined &&
    (<CsvDataBinanceAllStatements[]>csvData)[0].Coin !== undefined &&
    (<CsvDataBinanceAllStatements[]>csvData)[0].Change !== undefined &&
    (<CsvDataBinanceAllStatements[]>csvData)[0].Remark !== undefined
  );
}

export type CsvDataCoincheckReserveHistory = {
  ID: string;
  Amount: string;
  Price: string;
  Rate: string;
  "Trading Currency": string;
  "Original Currency": string;
  Plan: string;
  Progress: string;
  Time: string;
};
export function isCsvDataCoincheckReserveHistory(
  csvData: Record<string, string>[]
): csvData is CsvDataCoincheckReserveHistory[] {
  return (
    (<CsvDataCoincheckReserveHistory[]>csvData)[0].ID !== undefined &&
    (<CsvDataCoincheckReserveHistory[]>csvData)[0].Amount !== undefined &&
    (<CsvDataCoincheckReserveHistory[]>csvData)[0].Price !== undefined &&
    (<CsvDataCoincheckReserveHistory[]>csvData)[0].Rate !== undefined &&
    (<CsvDataCoincheckReserveHistory[]>csvData)[0]["Trading Currency"] !== undefined &&
    (<CsvDataCoincheckReserveHistory[]>csvData)[0]["Original Currency"] !== undefined &&
    (<CsvDataCoincheckReserveHistory[]>csvData)[0].Plan !== undefined &&
    (<CsvDataCoincheckReserveHistory[]>csvData)[0].Progress !== undefined &&
    (<CsvDataCoincheckReserveHistory[]>csvData)[0].Time !== undefined
  );
}

export type CsvDataCoincheckTradeHistory = {
  id: string;
  time: string;
  operation: string;
  amount: string;
  trading_currency: string;
  price: string;
  original_currency: string;
  fee: string;
  comment: string;
};
export function isCsvDataCoincheckTradeHistory(
  csvData: Record<string, string>[]
): csvData is CsvDataCoincheckTradeHistory[] {
  return (
    (<CsvDataCoincheckTradeHistory[]>csvData)[0].id !== undefined &&
    (<CsvDataCoincheckTradeHistory[]>csvData)[0].time !== undefined &&
    (<CsvDataCoincheckTradeHistory[]>csvData)[0].operation !== undefined &&
    (<CsvDataCoincheckTradeHistory[]>csvData)[0].amount !== undefined &&
    (<CsvDataCoincheckTradeHistory[]>csvData)[0].trading_currency !== undefined &&
    (<CsvDataCoincheckTradeHistory[]>csvData)[0].price !== undefined &&
    (<CsvDataCoincheckTradeHistory[]>csvData)[0].original_currency !== undefined &&
    (<CsvDataCoincheckTradeHistory[]>csvData)[0].fee !== undefined &&
    (<CsvDataCoincheckTradeHistory[]>csvData)[0].comment !== undefined
  );
}
