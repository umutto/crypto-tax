import axios from "axios";
import { format } from "date-fns";
import coinNames from "./coingecko_list_1633249541145.json";

const priceCache = new Map<string, number>();

export const getPriceAtDate = async (token: string, date: string): Promise<number> => {
  const _tokenId =
    coinNames.find(
      // temporary fix that filters out id's with dashes, due to symbol not being unique, breaks with a lot of tokens but works for now
      (coin) => coin.symbol === token.toLowerCase() && !coin.id.includes("-")
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
    await new Promise((resolve) => setTimeout(resolve, 500));
    priceCache.set(`${_tokenId}-${_date}`, response.data.market_data.current_price.jpy);
    return response.data.market_data.current_price.jpy;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
