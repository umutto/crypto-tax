import fs from "fs";
import path from "path";
import { ICache, ITransaction } from "./constants";

const fetchData = async (lastFetchDate?: string): Promise<ITransaction[]> => {
  // TODO: query the table with the last fetch date
  return [
    {
      currencyPair: "btc#jpy",
      sentCurrency: "btc", // btc
      receivedCurrency: "jpy", // jpy
      transactionTicks: "12345678_02345678",
      transactionDate: "2017-01-01T00:00:00.000Z",
      sentAmount: 1.5,
      receivedAmount: 300356.21,
      feeAmount: 0.0,
      feeCurrency: "jpy",
      label: "transaction",
      description: "monthly dca",
      txHash: "0000155648498762513asd",
      wallet: "coincheck",
    },
  ];
};

const CACHE_PATH = path.resolve(".transactions.cache");

export async function getCache(): Promise<ICache> {
  let cachedData;

  try {
    cachedData = JSON.parse(fs.readFileSync(path.join(__dirname, CACHE_PATH), "utf8"));
  } catch (error) {
    console.warn("Cache file is not initialized, creating a new file.");
  }

  if (!cachedData) {
    const data = fetchData();

    try {
      fs.writeFileSync(path.join(__dirname, CACHE_PATH), JSON.stringify(data), "utf8");
    } catch (error) {
      console.error("Error while writing to file");
      console.error(error);
    }

    cachedData = data;
  }

  return cachedData;
}

export async function updateCache(): Promise<ITransaction[]> {
  if (!fs.existsSync(path.join(__dirname, CACHE_PATH))) {
    return (await getCache()).data;
  }

  let cachedData = await getCache();

  const lastFetchDate = cachedData.lastFetchDate;

  const data = await fetchData(lastFetchDate);
  cachedData.data = [...cachedData.data, ...data];

  try {
    fs.writeFileSync(path.join(__dirname, CACHE_PATH), JSON.stringify(data), "utf8");
  } catch (error) {
    console.error("Error while writing to file");
    console.error(error);
  }

  return data;
}
