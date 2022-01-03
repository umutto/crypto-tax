import { ParseResult } from "papaparse";
import { csvWithHeader, getPriceAtDate, groupBy, ITransaction } from ".";

export default function binance() {
  return "WORK IN PROGRESS";
}

export const convertAllStatements = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  const transactions: ITransaction[] = [];

  console.log(groupBy(csv.data, ["UTC_Time"]));

  return transactions;
};

export const convertSpotHistory = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  const transactions: ITransaction[] = [];

  console.warn("Not implemented");

  return transactions;
};
