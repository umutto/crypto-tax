import axios from "axios";
import { format } from "date-fns";
import coinNames from "./coingecko_list_1633249541145.json";

const priceCache = new Map<string, number>();

const symbolPriority = {
  xrp: "ripple",
  ada: "cardano",
  ltc: "litecoin",
  dot: "polkadot",
};

export const getPriceAtDate = async (
  token: string,
  date: string,
  retry?: number
): Promise<number> => {
  const _tokenId =
    coinNames.find(
      (coin) =>
        coin.symbol === token.toLowerCase() &&
        (symbolPriority[token.toLowerCase() as keyof typeof symbolPriority]
          ? symbolPriority[token.toLowerCase() as keyof typeof symbolPriority] === coin.id
          : true)
    )?.id || token;
  const _date = format(new Date(date), "dd-MM-yyyy");

  // // @TODO: REMOVE AFTER, FOR TEST ONLY
  // if (token === "btc" && _date === "11-06-2019") {
  //   return 700;
  // } else if (token === "btc" && _date === "11-06-2020") {
  //   return 800;
  // } else if (token === "btc" && _date === "17-08-2020") {
  //   return 850;
  // } else if (token === "btc" && _date === "04-09-2020") {
  //   return 900;
  // } else if (token === "btc" && _date === "13-11-2020") {
  //   return 950;
  // }
  // // @TODO: REMOVE AFTER, FOR TEST ONLY

  const getUrl = `https://api.coingecko.com/api/v3/coins/${_tokenId}/history`;

  const _price = priceCache.get(`${_tokenId}-${_date}`);
  if (_price) {
    return _price;
  }

  try {
    const response = await axios.get(getUrl, {
      params: {
        date: _date,
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    if (!response.data.market_data) {
      console.error(`Cant find price for ${token} on ${date}`);
    }
    priceCache.set(
      `${_tokenId}-${_date} url:${getUrl}`,
      response.data.market_data.current_price.jpy
    );

    return response.data.market_data.current_price.jpy;
  } catch (error) {
    console.error(error);
    if (!retry || retry <= 5) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return await getPriceAtDate(token, date, retry ? retry + 1 : 1);
    }
    console.error(
      `FAILED GET THE PRICE FOR ${token} ON ${date} AFTER 5 RETRIES, WILL ASSUME THE PRICE IS 0.`
    );
    return 0;
  }
};
