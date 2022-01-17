import { ParseResult } from "papaparse";
import { csvWithHeader, getPriceAtDate, ITransaction } from ".";

export const coincheckPreprocess = (chunk: string): string => {
  return chunk.replaceAll(/期間指定：.*[\r\n]+/gm, "");
};

export const convertTradeHistory = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  const transactions: ITransaction[] = [];

  for (const row of csv.data) {
    if (row.operation.toLowerCase() === "buy") {
      transactions.push({
        id: row.id,
        currencyPair: row.original_currency + "#" + row.trading_currency,
        transactionDate: (new Date(row.time).getTime() / 1000).toString(),
        sentAmount: Math.abs(parseFloat(row.price)),
        sentCurrency: row.original_currency,
        receivedAmount: parseFloat(row.amount),
        receivedCurrency: row.trading_currency,
        feeAmount: parseFloat(row.fee),
        feeCurrency: row.trading_currency,
        label: row.operation.toLowerCase(),
        description: row.comment,
        wallet: "coincheck",
      });
    } else if (row.operation.toLowerCase() === "sell") {
      transactions.push({
        id: row.id,
        currencyPair: row.trading_currency + "#" + row.original_currency,
        transactionDate: (new Date(row.time).getTime() / 1000).toString(),
        sentAmount: Math.abs(parseFloat(row.amount)),
        sentCurrency: row.trading_currency,
        receivedAmount: parseFloat(row.price),
        receivedCurrency: row.original_currency,
        feeAmount: parseFloat(row.fee),
        feeCurrency: row.trading_currency,
        label: row.operation.toLowerCase(),
        description: row.comment,
        wallet: "coincheck",
      });
    } else if (row.operation.toLowerCase() === "sent") {
      const _feeAmount =
        (await getPriceAtDate(row.trading_currency, row.time)) *
        Math.abs(parseFloat(row.fee));
      transactions.push({
        id: row.id,
        currencyPair: row.trading_currency + "#" + row.original_currency,
        transactionDate: (new Date(row.time).getTime() / 1000).toString(),
        sentAmount: Math.abs(parseFloat(row.amount)),
        sentCurrency: row.trading_currency,
        receivedAmount: 0, // Math.abs(parseFloat(row.amount)) - Math.abs(parseFloat(row.fee)),
        receivedCurrency: row.trading_currency,
        feeAmount: _feeAmount,
        feeCurrency: "JPY",
        label: row.operation.toLowerCase(),
        description: row.comment,
        wallet: "coincheck",
      });
    } else if (row.operation.toLowerCase() === "completed trading contracts") {
      const ratePair = /Rate: ([-+]?\d*\.\d+|\d+), Pair: ([a-zA-Z_]+)/gm.exec(
        row.comment
      );
      if (ratePair) {
        const _rate = parseFloat(ratePair[1]);
        const _pair = ratePair[2];
        const [_sent, _received] = _pair.toUpperCase().split("_");
        const _sentAmount = parseFloat(row.amount) / _rate;
        transactions.push({
          id: row.id,
          currencyPair: _sent + "#" + _received,
          transactionDate: (new Date(row.time).getTime() / 1000).toString(),
          sentAmount: _sentAmount,
          sentCurrency: _sent,
          receivedAmount: parseFloat(row.amount),
          receivedCurrency: _received,
          feeAmount: Math.abs(parseFloat(row.fee)),
          feeCurrency: _sent,
          label: row.operation.toLowerCase(),
          description: row.comment,
          wallet: "coincheck",
        });
      }
    } else if (row.operation.toLowerCase() === "campaign reward") {
      const _sentAmount = 0;
      transactions.push({
        id: row.id,
        currencyPair: "JPY#" + row.trading_currency,
        transactionDate: (new Date(row.time).getTime() / 1000).toString(),
        sentAmount: _sentAmount,
        sentCurrency: "JPY",
        receivedAmount: parseFloat(row.amount),
        receivedCurrency: row.trading_currency,
        feeAmount: Math.abs(parseFloat(row.fee)),
        feeCurrency: row.trading_currency,
        label: row.operation.toLowerCase(),
        description: row.comment,
        wallet: "coincheck",
      });
    } else if (
      row.operation.toLowerCase() === "received" &&
      row.trading_currency === "JPY"
    ) {
      transactions.push({
        id: row.id,
        currencyPair: row.trading_currency + "#" + row.trading_currency,
        transactionDate: (new Date(row.time).getTime() / 1000).toString(),
        sentAmount: parseFloat(row.amount),
        sentCurrency: row.trading_currency,
        receivedAmount: parseFloat(row.amount),
        receivedCurrency: row.trading_currency,
        feeAmount: 275,
        feeCurrency: row.trading_currency,
        label: row.operation.toLowerCase(),
        description: "Bank transfer",
        wallet: "coincheck",
      });
    } else if (row.operation.toLowerCase() === "received") {
      transactions.push({
        id: row.id,
        currencyPair: row.trading_currency + "#" + row.trading_currency,
        transactionDate: (new Date(row.time).getTime() / 1000).toString(),
        sentAmount: 0,
        sentCurrency: row.trading_currency,
        receivedAmount: parseFloat(row.amount),
        receivedCurrency: row.trading_currency,
        feeAmount: 0,
        feeCurrency: "JPY",
        label: row.operation.toLowerCase(),
        description: row.comment,
        wallet: "coincheck",
      });
    } else if (row.operation.toLowerCase() === "bank withdrawal") {
      transactions.push({
        id: row.id,
        currencyPair: row.trading_currency + "#" + row.trading_currency,
        transactionDate: (new Date(row.time).getTime() / 1000).toString(),
        sentAmount: Math.abs(parseFloat(row.amount)),
        sentCurrency: row.trading_currency,
        receivedAmount: Math.abs(parseFloat(row.amount)), // Math.abs(parseFloat(row.amount)) - Math.abs(parseFloat(row.fee)),
        receivedCurrency: row.trading_currency,
        feeAmount: Math.abs(parseFloat(row.fee)),
        feeCurrency: row.trading_currency,
        label: row.operation.toLowerCase(),
        description: row.comment,
        wallet: "coincheck",
      });
    }
  }

  return transactions;
};

export const convertReserveHistory = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  return csv.data.map((r) => ({
    id: r.Id,
    currencyPair: r["Original Currency"] + "#" + r["Trading Currency"],
    transactionDate: (new Date(r["Time"]).getTime() / 1000).toString(),
    sentCurrency: r["Original Currency"],
    sentAmount: parseFloat(r["Price"]),
    receivedCurrency: r["Trading Currency"],
    receivedAmount: parseFloat(r["Amount"]),
    feeAmount: r["Fee Amount"] ? parseFloat(r["Fee Amount"]) : 0,
    feeCurrency: r["Fee Currency"] ? r["Fee Currency"] : "JPY",
    label: r["Label"] ? r["Label"] : "coincheck_reserve_action",
    description: r["Description"] ? r["Description"] : "",
    txHash: r["TxHash"] ? r["TxHash"] : "",
    wallet: "coincheck",
  }));
};
