import { ParseResult } from "papaparse";
import { csvWithHeader, humanReadable, ITransaction, readableToCamel } from ".";

export const convertDefaultCsv = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  const transactions: ITransaction[] = [];

  csv.data.forEach((r) => {
    const transaction: ITransaction = {
      id: r.id,
      currencyPair: r.currencyPair,
      transactionTicks: r.transactionTicks,
      transactionDate: r.transactionDate,
      sentCurrency: r.sentCurrency,
      receivedCurrency: r.receivedCurrency,
      sentAmount: parseFloat(r.sentAmount),
      receivedAmount: parseFloat(r.receivedAmount),
      feeAmount: parseFloat(r.feeAmount),
      feeCurrency: r.feeCurrency,
      label: r.label,
      description: r.description,
      txHash: r.txHash,
      wallet: r.wallet,
    };
    transactions.push(transaction);
  });

  return transactions;
};

export const convertDefaultCsvReadable = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  return convertDefaultCsv({
    meta: csv.meta,
    errors: csv.errors,
    data: csv.data.map((r) =>
      Object.fromEntries(Object.entries(r).map(([k, v]) => [readableToCamel(k), v]))
    ),
  });
};
