import Papa, { ParseError } from "papaparse";
import { ITransaction } from "./";

const convertCsvToTransaction = (csv: Record<string, string>[]): ITransaction[] => {
  const transactions: ITransaction[] = [];
  csv.forEach((r) => {
    const transaction: ITransaction = {
      id: r["Id"],
      currencyPair: r["Sent Currency"] + "#" + r["Received Currency"],
      transactionDate: (new Date(r["Date"]).getTime() / 1000).toString(),
      sentAmount: parseFloat(r["Sent Amount"]),
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

export default async function parseCsv(
  file: File,
  onSuccess = (r: ITransaction[]) => {},
  onError = (e: ParseError) => {}
) {
  return Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    error: function (err) {
      onError(err);
    },
    complete: function (results) {
      onSuccess(convertCsvToTransaction(results.data as Record<string, string>[]));
    },
  });
}
