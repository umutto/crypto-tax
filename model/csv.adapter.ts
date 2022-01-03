import Papa, { ParseResult } from "papaparse";
import { csvWithHeader, ITransaction } from "./";
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
      const extracted = await convertCsvToTransaction(result);
      transactions.push(...extracted);
    }

    onSuccess(transactions);
  } catch (error) {
    onError(error);
  }
}
