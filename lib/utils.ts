import { ITransaction } from "../model";
import { TransactionSummary } from "./constants";

export const p = (n: number, p = 16): number => {
  const result = Number.isNaN(n) ? 0 : parseFloat(n.toFixed(p));

  return Object.is(result, -0) ? 0 : result;
};

export const c = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "JPY",
});

/**
 * Code taken from https://stackoverflow.com/a/29273131/826970
 *
 * Parse a localized number to a float.
 * @param {string} n - the localized number
 * @param {string} locale - [optional] the locale that the number is represented in. Omit this parameter to use the current locale.
 */
export const rc = (n: string, locale?: string): number => {
  var thousandSeparator = Intl.NumberFormat(locale || "ja-JP")
    .format(11111)
    .replace(/\p{Number}/gu, "");
  var decimalSeparator = Intl.NumberFormat(locale || "ja-JP")
    .format(1.1)
    .replace(/\p{Number}/gu, "");

  return parseFloat(
    n
      .replace(new RegExp("\\" + thousandSeparator, "g"), "")
      .replace(new RegExp("\\" + decimalSeparator), ".")
  );
};

export type YearStatsLocale = {
  TotalAcquisition: string;
  TotalSales: string;
  TotalProfit: string;
};

export function transactionStats(
  summary: Record<string, TransactionSummary>
): YearStatsLocale {
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
    const year = new Date(parseInt(t.transactionTicks) * 1000).getFullYear().toString();
    if (!result[year]) {
      result[year] = [];
    }
    result[year].push(t);
  });

  return result;
};
