import { ITransaction } from "../model";
import { TransactionSummary } from "./constants";
import { groupByYear, p } from "./utils";

export function totalAverage(
  transactions: ITransaction[]
): Record<string, Record<string, TransactionSummary>> {
  const result = Object.fromEntries(
    Object.entries(groupByYear(transactions)).map(([year, transactions]) => {
      return [
        year,
        transactions.reduce((a, b) => {
          const pair = b.currencyPair.toLocaleLowerCase().split("#");
          const crypto = pair[0] === "jpy" ? pair[1] : pair[0];

          if (!a[crypto]) {
            a[crypto] = {
              buyPrice: 0,
              buyAmount: 0,
              sellPrice: 0,
              sellAmount: 0,
              feeTotal: 0,
            };
          }

          if (pair[0] === pair[1]) {
            a[crypto].feeTotal += b.feeAmount;
          } else if (pair[0] === "jpy") {
            a[crypto].buyPrice += b.sentAmount;
            a[crypto].buyAmount += b.receivedAmount;
          } else if (pair[1] === "jpy") {
            a[crypto].sellPrice += b.receivedAmount;
            a[crypto].sellAmount += b.sentAmount;
          }
          return a;
        }, Object.create(null)),
      ];
    })
  );

  let yearOffset = Object.create(null);

  Object.keys(result)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((year) => {
      Object.keys(result[year]).forEach((currency) => {
        result[year][currency] = Object.fromEntries(
          Object.entries(result[year][currency]).map(([k, v]) => [k, p(<number>v)])
        );

        result[year][currency].buyAverage = p(
          result[year][currency].buyPrice / result[year][currency].buyAmount
        );
        result[year][currency].sellAverage = p(
          result[year][currency].sellPrice / result[year][currency].sellAmount
        );

        result[year][currency].remainingAmount = p(
          (yearOffset[currency] ? yearOffset[currency].remainingAmount : 0) +
            result[year][currency].buyAmount -
            result[year][currency].sellAmount
        );

        const _buyAverage = yearOffset[currency]
          ? (result[year][currency].buyAverage * result[year][currency].buyAmount +
              yearOffset[currency].buyAverage * yearOffset[currency].remainingAmount) /
            (result[year][currency].buyAmount + yearOffset[currency].remainingAmount)
          : result[year][currency].buyAverage;

        result[year][currency].profit = p(
          (result[year][currency].sellAverage - _buyAverage) *
            result[year][currency].sellAmount
        );
      });

      yearOffset = Object.fromEntries(
        Object.entries(result[year] as Record<string, TransactionSummary>).map(
          ([currency, summary]) => [
            currency,
            {
              remainingAmount: summary.remainingAmount,
              buyAverage: summary.buyAverage,
            },
          ]
        )
      );
    });

  return result;
}
