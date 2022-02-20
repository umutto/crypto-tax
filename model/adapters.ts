import { convertAllStatements, convertSpotHistory } from "./binance.adapter";
import { convertReserveHistory, convertTradeHistory } from "./coincheck.adapter";
import { convertDefaultCsv } from "./default.adapter";
import { convertKoinlyCsv } from "./koinly.adapter";
import { CsvAdapter, compareArrays, CsvAdapterFunction } from ".";

export const Adapters: Record<string, CsvAdapter> = {
  default: {
    name: "default",
    header: [
      "id",
      "currencyPair",
      "transactionTicks",
      "transactionDate(UTC)",
      "sentCurrency",
      "receivedCurrency",
      "sentAmount",
      "receivedAmount",
      "feeAmount",
      "feeCurrency",
      "label",
      "description",
      "txHash",
      "wallet",
    ],
    adapter: convertDefaultCsv,
  },
  koinly: {
    name: "Koinly",
    header: [
      "Id",
      "Date",
      "Sent Amount",
      "Sent Currency",
      "Received Amount",
      "Received Currency",
      "Fee Amount",
      "Fee Currency",
      "Net Worth Amount",
      "Net Worth Currency",
      "Label",
      "Description",
      "TxHash",
    ],
    adapter: convertKoinlyCsv,
  },
  binanceSpotHistory: {
    name: "Binance Spot History",
    header: ["Date(UTC)", "Pair", "Side", "Price", "Executed", "Amount", "Fee"],
    adapter: convertSpotHistory,
  },
  binanceAllStatements: {
    name: "Binance All Statements",
    header: ["User_ID", "UTC_Time", "Account", "Operation", "Coin", "Change", "Remark"],
    adapter: convertAllStatements,
  },
  coincheckReserveHistory: {
    name: "Coincheck Reserve History",
    header: [
      "ID",
      "Amount",
      "Price",
      "Rate",
      "Trading Currency",
      "Original Currency",
      "Plan",
      "Progress",
      "Time",
    ],
    adapter: convertReserveHistory,
  },
  coincheckTradeHistory: {
    name: "Coincheck Trade History",
    header: [
      "id",
      "time",
      "operation",
      "amount",
      "trading_currency",
      "price",
      "original_currency",
      "fee",
      "comment",
    ],
    adapter: convertTradeHistory,
  },
};

export const getAdapter = (headers: string[]): CsvAdapterFunction | undefined => {
  return Object.values(Adapters).find((adapter) => compareArrays(adapter.header, headers))
    ?.adapter;
};
