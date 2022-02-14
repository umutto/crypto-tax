import Papa, { ParseResult } from "papaparse";
import { csvWithHeader, humanReadable, ITransaction } from "./";
import { getAdapter } from "./adapters";
import { coincheckPreprocess } from "./coincheck.adapter";

const convertCsvToTransaction = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  if (!csv.meta.fields) {
    throw new Error("Cannot extract the headers from csv!");
  }

  const adapterFn = getAdapter(csv.meta.fields);
  if (!adapterFn) {
    throw new Error("Cannot find adapter for csv!");
  }

  return await adapterFn(csv);
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

export async function parseCsv(
  files: File[],
  onSuccess = (r: ITransaction[], n: number) => {},
  onError = (e?: any) => {}
) {
  const promises = files.map((file) => parseCsvFile(file));

  try {
    let rowLength = 0;
    const results = (await Promise.all(promises)) as ParseResult<csvWithHeader>[];
    const transactions: ITransaction[] = [];

    for (const result of results) {
      rowLength += result.data.length;
      const extracted = await convertCsvToTransaction(result);
      transactions.push(...extracted);
    }

    onSuccess(
      transactions.sort(
        (a, b) => parseInt(a.transactionDate) - parseInt(b.transactionDate)
      ),
      rowLength
    );
  } catch (error) {
    onError(error);
  }
}

export async function writeToCsv(transactions: ITransaction[], filename?: string) {
  const _filename = filename || `transactions_${new Date().toJSON().slice(0, 16)}.csv`;
  const readable = transactions.map((t) =>
    Object.fromEntries(
      Object.entries(t).map(([key, value]) => [humanReadable(key), value])
    )
  );

  const csv = Papa.unparse(readable);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", _filename);
  document.body.appendChild(link);
  link.click();

  setTimeout(function () {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 250);
}
