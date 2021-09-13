import { TransactionSummary } from "./constants";

export const p = (n: number, p = 12): number => {
  return Number.isNaN(n) ? 0 : parseFloat(n.toPrecision(p));
};

export const c = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "JPY",
});

export function transactionStats(
  summary: Record<string, TransactionSummary>
): Record<string, number | string> {
  return {
    TotalProfit: c.format(Object.values(summary).reduce((a, b) => a + b.profit, 0)),
    TotalAcquisition: c.format(
      Object.values(summary).reduce((a, b) => a + b.buyPrice, 0)
    ),
    TotalSales: c.format(Object.values(summary).reduce((a, b) => a + b.sellPrice, 0)),
  };
}
