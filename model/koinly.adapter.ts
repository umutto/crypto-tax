import { ParseResult } from "papaparse";
import { csvWithHeader, ITransaction } from ".";

export const convertKoinlyCsv = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  const transactions: ITransaction[] = [];

  csv.data.forEach((r) => {
    const transaction: ITransaction = {
      id: r["Id"],
      currencyPair: r["Sent Currency"] + "#" + r["Received Currency"],
      transactionTicks: (new Date(r["Date"]).getTime() / 1000).toString(),
      transactionDate: new Date(r["Date"]).toUTCString(),
      sentCurrency: r["Sent Currency"],
      sentAmount: parseFloat(r["Sent Amount"]),
      receivedCurrency: r["Received Currency"],
      receivedAmount: parseFloat(r["Received Amount"]),
      ...(r["Fee Amount"] && { feeAmount: parseFloat(r["Fee Amount"]) }),
      ...(r["Fee Currency"] && { feeCurrency: r["Fee Currency"] }),
      ...(r["Label"] && { label: r["Label"] }),
      ...(r["Description"] && { description: r["Description"] }),
      ...(r["TxHash"] && { txHash: r["TxHash"] }),
      ...(r["Wallet"] && { wallet: r["Wallet"] }),
    };
    transactions.push(transaction);
  });

  return transactions;
};
