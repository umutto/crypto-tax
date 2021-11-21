import axios from "axios";
import { format } from "date-fns";
import coinNames from "./coingecko_list_1633249541145.json";

export const compareArrays = <T>(a: T[], b: T[], strict = false): boolean => {
  const _a = strict ? a : [...a].sort().filter((e) => e);
  const _b = strict ? b : [...b].sort().filter((e) => e);

  return _a.length === _b.length && _a.every((value, index) => value === _b[index]);
};

export const getPriceAtDate = async (token: string, date: string): Promise<number> => {
  const _tokenId =
    coinNames.find((coin) => coin.symbol === token.toLowerCase())?.id || token;
  const _date = format(new Date(date), "dd-MM-yyyy");

  const getUrl = `https://api.coingecko.com/api/v3/coins/${_tokenId}/history`;

  try {
    const response = await axios.get(getUrl, {
      params: {
        date: _date,
      },
    });
    return response.data.market_data.current_price.jpy;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
