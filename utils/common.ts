import { totalAverage } from "../lib/total_average";
import { transactionStats, YearStatsLocale } from "../lib/utils";
import { ITransaction } from "../model";

type CoinCard = {
  name: string;
  ticker: string;
  icon?: string;
  description: string;
  URL: string;
};

export const getCoinCards = (): CoinCard[] => {
  // TODO: fetch, sort and return as name/description objects.
  return [];
};

export const getYearlyStats = (
  rows?: ITransaction[]
): Record<string, YearStatsLocale> => {
  const transactions = rows || [];
  const yearlySummary = totalAverage(transactions);
  const yearlyStats = Object.fromEntries(
    Object.entries(yearlySummary).map(([year, summary]) => [
      year,
      transactionStats(summary),
    ])
  );

  return yearlyStats;
};
