import { ParseResult } from "papaparse";
import { compareArrays, csvWithHeader, ITransaction } from ".";

export const isKoinlyCsv = (headers: string[]): boolean => {
  const expectedHeaders = [
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
  ];

  return compareArrays(headers, expectedHeaders);
};

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
