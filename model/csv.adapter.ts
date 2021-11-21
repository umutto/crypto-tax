import Papa, { ParseResult } from "papaparse";
import { compareArrays, csvWithHeader, ITransaction } from "./";
import {
  coincheckPreprocess,
  convertCoincheckCsv,
  isCoincheckCsv,
} from "./coincheck.adapter";
import { convertKoinlyCsv, isKoinlyCsv } from "./koinly.adapter";

const isDefaultCsv = (headers: string[]): boolean => {
  const expectedHeaders = [
    "id",
    "currencyPair",
    "transactionDate",
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
  ];

  return compareArrays(expectedHeaders, headers);
};
const convertDefaultCsv = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  const transactions: ITransaction[] = [];

  csv.data.forEach((r) => {
    const transaction: ITransaction = {
      id: r.id,
      currencyPair: r.currencyPair,
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

const convertCsvToTransaction = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  if (!csv.meta.fields) {
    throw new Error("Cannot extract the headers from csv!");
  }

  if (isDefaultCsv(csv.meta.fields)) {
    return convertDefaultCsv(csv);
  } else if (isCoincheckCsv(csv.meta.fields)) {
    return convertCoincheckCsv(csv);
  } else if (isKoinlyCsv(csv.meta.fields)) {
    return convertKoinlyCsv(csv);
  }

  throw new Error("Structure of the given csv is unknown");
};

function parseCsvFile(file: File) {
  return new Promise(function (resolve, reject) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      beforeFirstChunk: (chunk) => {
        chunk = coincheckPreprocess(chunk);
        return chunk;
      },
      complete: resolve,
      error: reject,
    });
  });
}

export default async function parseCsv(
  files: File[],
  onSuccess = (r: ITransaction[]) => {},
  onError = (e?: any) => {}
) {
  const promises = files.map((file) => parseCsvFile(file));

  try {
    const results = (await Promise.all(promises)) as ParseResult<csvWithHeader>[];
    const transactions: ITransaction[] = [];

    for (const result of results) {
      transactions.push(...(await convertCsvToTransaction(result)));
    }

    onSuccess(transactions);
  } catch (error) {
    onError(error);
  }
}
