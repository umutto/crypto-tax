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
