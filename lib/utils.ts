import { ITransaction } from "../model";
import { TransactionSummary } from "./constants";

export const p = (n: number, p = 12): number => {
  const result = Number.isNaN(n) ? 0 : parseFloat(n.toFixed(p));

  return Object.is(result, -0) ? 0 : result;
};

export const c = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "JPY",
});

export function transactionStats(
  summary: Record<string, TransactionSummary>
): Record<string, number | string> {
  return {
    TotalProfit: c.format(
      Object.values(summary).reduce((a, b) => a + b.profit - b.feeTotal, 0)
    ),
    TotalAcquisition: c.format(
      Object.values(summary).reduce((a, b) => a + b.buyPrice, 0)
    ),
    TotalSales: c.format(Object.values(summary).reduce((a, b) => a + b.sellPrice, 0)),
  };
}

export const groupByYear = (
  transactions: ITransaction[]
): Record<string, ITransaction[]> => {
  const result: Record<string, ITransaction[]> = {};

  transactions.forEach((t) => {
    const year = new Date(parseInt(t.transactionDate) * 1000).getFullYear().toString();
    if (!result[year]) {
      result[year] = [];
    }
    result[year].push(t);
  });

  return result;
};
