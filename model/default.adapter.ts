import { ParseResult } from "papaparse";
import { csvWithHeader, ITransaction } from ".";

export const convertDefaultCsv = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  const transactions: ITransaction[] = [];

  csv.data.forEach((r) => {
    const transaction: ITransaction = {
      id: r.id,
      currencyPair: r.currencyPair,
      transactionDate: r.transactionDate,
      transactionDateUTC: r.transactionDateUTC,
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
