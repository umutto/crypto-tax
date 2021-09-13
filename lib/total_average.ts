import { ITransaction } from "../model";
import { TransactionSummary } from "./constants";
import { p } from "./utils";

export function totalAverage(
  transactions: ITransaction[]
): Record<string, TransactionSummary> {
  const _initial = transactions.reduce(function (r, a) {
    const currency = a.currencyPair.toLowerCase().replace("jpy", "").replace("#", "");
    r[currency] = {
      buyPrice: 0,
      buyAmount: 0,
      sellPrice: 0,
      sellAmount: 0,
    };
    return r;
  }, Object.create(null));

  const result = transactions.reduce((a, b) => {
    if (b.currencyPair.toLowerCase().startsWith("jpy#")) {
      const currency = b.currencyPair.split("#")[1].toLowerCase();
      a[currency].buyPrice += b.sentAmount;
      a[currency].buyAmount += b.receivedAmount;
    } else if (b.currencyPair.toLowerCase().endsWith("#jpy")) {
      const currency = b.currencyPair.split("#")[0].toLowerCase();
      a[currency].sellPrice += b.receivedAmount;
      a[currency].sellAmount += b.sentAmount;
    }
    return a;
  }, _initial);

  Object.keys(result).forEach((currency) => {
    result[currency] = Object.fromEntries(
      Object.entries(result[currency]).map(([k, v]) => [k, p(<number>v)])
    );

    result[currency].buyAverage = p(
      result[currency].buyPrice / result[currency].buyAmount
    );
    result[currency].sellAverage = p(
      result[currency].sellPrice / result[currency].sellAmount
    );

    result[currency].remainingAmount = p(
      result[currency].buyAmount - result[currency].sellAmount
    );

    result[currency].profit = p(
      (result[currency].sellAverage - result[currency].buyAverage) *
        result[currency].sellAmount
    );
  });

  return result;
}
