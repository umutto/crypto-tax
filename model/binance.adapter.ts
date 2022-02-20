import { ParseResult } from "papaparse";
import {
  closestIdx,
  csvWithHeader,
  getPriceAtDate,
  groupBy,
  isCsvDataBinanceAllStatements,
  ITransaction,
} from ".";
import withdrawalFees from "./binance_withdrawal_fees.json";

export const convertAllStatements = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  const operationDict = {
    deposit: ["Deposit"],
    withdraw: ["Withdraw"],
    buyCommission: [
      "Buy",
      "Commission Fee Shared With You",
      "Fee",
      "Transaction Related",
    ],
    buyKickback: ["Buy", "Fee", "Referral Kickback"],
    sell: ["Fee", "Referral Kickback", "Sell"],
    largeOtcTrading: ["Large OTC trading"],
    smallAssetsExchangeBnb: ["Small assets exchange BNB"],
  };
  const transactions: ITransaction[] = [];

  const transactionLogs = groupBy(csv.data, ["UTC_Time"]);
  for (const [date, _transactions] of Object.entries(transactionLogs)) {
    if (!isCsvDataBinanceAllStatements(_transactions)) {
      continue;
    }

    // @TODO: remove debug text
    console.log("==========================================================");
    console.log("Transaction process starts for", date);
    console.log("Transactions: ", _transactions);
    const tLength = transactions.length;
    // @TODO: remove debug text

    const headers = _transactions.map((t) => t.Operation.toLowerCase());
    const operation = Object.keys(operationDict).find((k) => {
      const _headers = Array.from(new Set(headers)).sort();
      const _operations = operationDict[k as keyof typeof operationDict]
        .map((h: string) => h.toLowerCase())
        .sort();

      return (
        _headers.length === _operations.length &&
        _headers.every((value, index) => value === _operations[index])
      );
    });

    if (!operation) {
      console.error(
        "Skipping: Unexpected operation type in",
        Array.from(new Set(headers)).sort()
      );
      continue;
    }

    if (operation === "deposit") {
      const _userId = _transactions[0]["User_ID"];
      const _ticks = (new Date(date).getTime() / 1000).toString();

      const _feeAmount = 0.001;
      const _feeYenPrice = await getPriceAtDate(
        _transactions[0].Coin.toLowerCase(),
        date
      );

      transactions.push({
        id: `${_userId}_${_ticks}_deposit`,
        currencyPair: _transactions[0].Coin + "#" + _transactions[0].Coin,
        transactionDate: _ticks,
        transactionDateUTC: new Date(date).toUTCString(),
        sentAmount: parseFloat(_transactions[0].Change),
        sentCurrency: _transactions[0].Coin.toUpperCase(),
        receivedAmount: parseFloat(_transactions[0].Change),
        receivedCurrency: _transactions[0].Coin.toUpperCase(),
        feeAmount: _feeAmount * _feeYenPrice,
        feeCurrency: "JPY",
        label: "deposit",
        description: _transactions[0].Remark,
        wallet: "binance",
      });
    } else if (operation === "withdraw") {
      const _sendCoin = _transactions[0]["Coin"];
      const _sendAmount = Math.abs(parseFloat(_transactions[0]["Change"]));
      const _fee =
        _sendCoin && _sendCoin in Object.keys(withdrawalFees)
          ? parseFloat(withdrawalFees[_sendCoin as keyof typeof withdrawalFees])
          : 0;
      const _userId = _transactions[0]["User_ID"];
      const _ticks = (new Date(date).getTime() / 1000).toString();
      const _remark = _transactions[0]["Remark"];

      const _price = await getPriceAtDate(_sendCoin.toLowerCase(), date);

      transactions.push({
        id: `${_userId}_${_ticks}_withdraw`,
        currencyPair: _sendCoin + "#" + _sendCoin,
        transactionDate: _ticks,
        transactionDateUTC: new Date(date).toUTCString(),
        sentAmount: _sendAmount,
        sentCurrency: _sendCoin.toUpperCase(),
        receivedAmount: _sendAmount,
        receivedCurrency: _sendCoin.toUpperCase(),
        feeAmount: _fee * _price,
        feeCurrency: "JPY",
        label: "withdraw",
        description: _remark,
        wallet: "binance",
      });
    } else if (operation === "buyCommission") {
      const _receiveTransactions = _transactions.filter(
        (t) => t.Operation.toLowerCase() === "buy"
      );
      const _receiveCoinArr = Array.from(
        new Set(_receiveTransactions.map((t) => t["Coin"]))
      );
      if (_receiveCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 coin transaction during ${operation}.`
        );
        continue;
      }
      const receiveCoin = _receiveCoinArr[0].toUpperCase();
      const receiveAmount = _receiveTransactions.reduce(
        (c, a) => c + parseFloat(a["Change"]),
        0
      );

      const _sendTransactions = _transactions.filter(
        (t) => t.Operation.toLowerCase() === "transaction related"
      );
      const _sendCoinArr = Array.from(new Set(_sendTransactions.map((t) => t["Coin"])));
      if (_sendCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 coin transaction during ${operation}.`
        );
        continue;
      }
      const sendCoin = _sendCoinArr[0].toUpperCase();
      const sendAmount = Math.abs(
        _sendTransactions.reduce((c, a) => c + parseFloat(a["Change"]), 0)
      );

      const _feeTransactions = _transactions.filter(
        (t) => t.Operation.toLowerCase() === "fee"
      );
      const _feeCoinArr = Array.from(new Set(_feeTransactions.map((t) => t["Coin"])));
      if (_feeCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 fee coin during ${operation}.`
        );
        continue;
      }
      const _feeCoin = _feeCoinArr[0].toUpperCase();
      const _feeAmount = Math.abs(
        _feeTransactions.reduce((c, a) => c + parseFloat(a["Change"]), 0)
      );

      const commissionAmount = _transactions
        .filter((t) => t.Operation.toLowerCase() === "commission fee shared with you")
        .reduce((c, a) => c + parseFloat(a.Change), 0);

      const userId = _transactions[0]["User_ID"];
      const ticks = (new Date(date).getTime() / 1000).toString();
      const remarks = _transactions
        .map((t) => t.Remark && `[${t.Account} - ${t.Operation}]: ${t.Remark}`)
        .filter((t) => t)
        .join(", ");

      const _isUSDTSell = sendCoin === "USDT"; // if true, means sell USDT to buy coin
      if (sendCoin !== "USDT" && receiveCoin !== "USDT") {
        console.error(
          "Skipping: Unexpected transaction, non-USDT transactions are not supported yet."
        );
      }

      let intermediateValue = 0;
      if (_isUSDTSell) {
        const sendYenPrice = await getPriceAtDate(sendCoin.toLowerCase(), date);
        intermediateValue = sendYenPrice * sendAmount;
      } else {
        const receiveYenPrice = await getPriceAtDate(receiveCoin.toLowerCase(), date);
        intermediateValue = receiveYenPrice * receiveAmount;
      }
      const _isFeePaidOnCoin = _feeCoin === receiveCoin;
      const feeYenPrice = _isFeePaidOnCoin
        ? 0
        : await getPriceAtDate(_feeCoin.toLowerCase(), date);

      transactions.push({
        id: `${userId}_${ticks}_sell`,
        currencyPair: sendCoin + "#JPY",
        transactionDate: ticks,
        transactionDateUTC: new Date(date).toUTCString(),
        sentAmount: sendAmount,
        sentCurrency: sendCoin.toUpperCase(),
        receivedAmount: intermediateValue,
        receivedCurrency: "JPY",
        feeAmount: 0,
        feeCurrency: "JPY",
        label: "sell",
        description: remarks,
        wallet: "binance",
      });
      transactions.push({
        id: `${userId}_${ticks}_buy`,
        currencyPair: "JPY#" + receiveCoin,
        transactionDate: ticks,
        transactionDateUTC: new Date(date).toUTCString(),
        sentAmount: intermediateValue,
        sentCurrency: "JPY",
        receivedAmount:
          receiveAmount + commissionAmount - (_isFeePaidOnCoin ? _feeAmount : 0),
        receivedCurrency: receiveCoin.toUpperCase(),
        feeAmount: _feeAmount * feeYenPrice,
        feeCurrency: "JPY",
        label: "buy",
        description: remarks,
        wallet: "binance",
      });
    } else if (operation === "buyKickback") {
      const _receiveTransactions = _transactions.filter(
        (t) => t.Operation.toLowerCase() === "buy" && !t.Change.startsWith("-")
      );
      const _receiveCoinArr = Array.from(
        new Set(_receiveTransactions.map((t) => t["Coin"]))
      );
      if (_receiveCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 coin transaction during ${operation}.`
        );
        continue;
      }
      const receiveCoin = _receiveCoinArr[0].toUpperCase();
      const receiveAmount = _receiveTransactions.reduce(
        (c, a) => c + parseFloat(a["Change"]),
        0
      );

      const _sendTransactions = _transactions.filter(
        (t) => t.Operation.toLowerCase() === "buy" && t.Change.startsWith("-")
      );
      const _sendCoinArr = Array.from(new Set(_sendTransactions.map((t) => t["Coin"])));
      if (_sendCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 coin transaction during ${operation}.`
        );
        continue;
      }
      const sendCoin = _sendCoinArr[0].toUpperCase();
      const sendAmount = Math.abs(
        _sendTransactions.reduce((c, a) => c + parseFloat(a["Change"]), 0)
      );

      const _kickbackTransactions = _transactions.filter(
        (t) => t.Operation.toLowerCase() === "referral kickback"
      );
      const _kickbackCoinArr = Array.from(
        new Set(_kickbackTransactions.map((t) => t["Coin"]))
      );
      if (_kickbackCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 coin transaction during ${operation}.`
        );
        continue;
      }
      const kickbackCoin = _kickbackCoinArr[0].toUpperCase();
      const _kickbackAmount = _kickbackTransactions.reduce(
        (c, a) => c + parseFloat(a["Change"]),
        0
      );

      const _feeTransactions = _transactions.filter(
        (t) => t.Operation.toLowerCase() === "fee"
      );
      const _feeCoinArr = Array.from(new Set(_feeTransactions.map((t) => t["Coin"])));
      if (_feeCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 fee coin during ${operation}.`
        );
        continue;
      }
      const _feeCoin = _feeCoinArr[0].toUpperCase();
      const _feeAmount = Math.abs(
        _feeTransactions.reduce((c, a) => c + parseFloat(a["Change"]), 0)
      );

      let feeTotal = 0,
        kickbackTotal = 0;
      if (_feeCoin === kickbackCoin) {
        const feeYenPrice = await getPriceAtDate(_feeCoin.toLowerCase(), date);
        const kickbackYenPrice = feeYenPrice;

        feeTotal = Math.max(_feeAmount - _kickbackAmount, 0) * feeYenPrice;
        kickbackTotal = Math.max(_kickbackAmount - _feeAmount, 0) * kickbackYenPrice;
      } else {
        const feeYenPrice = await getPriceAtDate(_feeCoin.toLowerCase(), date);
        const kickbackYenPrice = await getPriceAtDate(kickbackCoin.toLowerCase(), date);

        feeTotal = _feeAmount * feeYenPrice;
        kickbackTotal = _kickbackAmount * kickbackYenPrice;
      }

      const userId = _transactions[0]["User_ID"];
      const ticks = (new Date(date).getTime() / 1000).toString();
      const remarks = _transactions
        .map((t) => t.Remark && `[${t.Account} - ${t.Operation}]: ${t.Remark}`)
        .filter((t) => t)
        .join(", ");

      const _isUSDTSell = sendCoin === "USDT"; // if true, means sell USDT to buy coin
      if (sendCoin !== "USDT" && receiveCoin !== "USDT") {
        console.error(
          "Skipping: Unexpected transaction, non-USDT transactions are not supported yet."
        );
      }

      let intermediateValue = 0;
      if (_isUSDTSell) {
        const sendYenPrice = await getPriceAtDate(sendCoin.toLowerCase(), date);
        intermediateValue = sendYenPrice * sendAmount;
      } else {
        const receiveYenPrice = await getPriceAtDate(receiveCoin.toLowerCase(), date);
        intermediateValue = receiveYenPrice * receiveAmount;
      }

      transactions.push({
        id: `${userId}_${ticks}_sell`,
        currencyPair: sendCoin + "#JPY",
        transactionDateUTC: new Date(date).toUTCString(),
        transactionDate: ticks,
        sentAmount: sendAmount,
        sentCurrency: sendCoin.toUpperCase(),
        receivedAmount: intermediateValue,
        receivedCurrency: "JPY",
        feeAmount: 0,
        feeCurrency: "JPY",
        label: "sell",
        description: remarks,
        wallet: "binance",
      });
      transactions.push({
        id: `${userId}_${ticks}_buy`,
        currencyPair: "JPY#" + receiveCoin,
        transactionDateUTC: new Date(date).toUTCString(),
        transactionDate: ticks,
        sentAmount: intermediateValue,
        sentCurrency: "JPY",
        receivedAmount:
          receiveAmount + (receiveCoin === kickbackCoin ? _kickbackAmount : 0),
        receivedCurrency: receiveCoin.toUpperCase(),
        feeAmount: feeTotal,
        feeCurrency: "JPY",
        label: "buy",
        description: remarks,
        wallet: "binance",
      });
      if (kickbackCoin !== receiveCoin && kickbackTotal > 0) {
        transactions.push({
          id: `${userId}_${ticks}_kickback`,
          currencyPair: "JPY#" + kickbackCoin,
          transactionDateUTC: new Date(date).toUTCString(),
          transactionDate: ticks,
          sentAmount: 0,
          sentCurrency: "JPY",
          receivedAmount: _kickbackAmount,
          receivedCurrency: kickbackCoin.toUpperCase(),
          feeAmount: 0,
          feeCurrency: "JPY",
          label: "buy",
          description: remarks,
          wallet: "binance",
        });
      }
    } else if (operation === "sell") {
      const _receiveTransactions = _transactions.filter(
        (t) => t.Operation.toLowerCase() === "sell" && !t.Change.startsWith("-")
      );
      const _receiveCoinArr = Array.from(
        new Set(_receiveTransactions.map((t) => t["Coin"]))
      );
      if (_receiveCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 coin transaction during ${operation}.`
        );
        continue;
      }
      const receiveCoin = _receiveCoinArr[0].toUpperCase();
      const receiveAmount = _receiveTransactions.reduce(
        (c, a) => c + parseFloat(a["Change"]),
        0
      );

      const _sendTransactions = _transactions.filter(
        (t) => t.Operation.toLowerCase() === "sell" && t.Change.startsWith("-")
      );
      const _sendCoinArr = Array.from(new Set(_sendTransactions.map((t) => t["Coin"])));
      if (_sendCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 coin transaction during ${operation}.`
        );
        continue;
      }
      const sendCoin = _sendCoinArr[0].toUpperCase();
      const sendAmount = Math.abs(
        _sendTransactions.reduce((c, a) => c + parseFloat(a["Change"]), 0)
      );

      const _feeTransactions = _transactions.filter(
        (t) => t.Operation.toLowerCase() === "fee"
      );
      const _feeCoinArr = Array.from(new Set(_feeTransactions.map((t) => t["Coin"])));
      if (_feeCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 fee coin during ${operation}.`
        );
        continue;
      }
      const _feeCoin = _feeCoinArr[0].toUpperCase();
      const _feeAmount = Math.abs(
        _feeTransactions.reduce((c, a) => c + parseFloat(a["Change"]), 0)
      );

      const _kickbackTransactions = _transactions.filter(
        (t) => t.Operation.toLowerCase() === "referral kickback"
      );
      const _kickbackCoinArr = Array.from(
        new Set(_kickbackTransactions.map((t) => t["Coin"]))
      );
      if (_kickbackCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 coin transaction during ${operation}.`
        );
        continue;
      }
      const kickbackCoin = _kickbackCoinArr[0].toUpperCase();
      const _kickbackAmount = _kickbackTransactions.reduce(
        (c, a) => c + parseFloat(a["Change"]),
        0
      );
      if (kickbackCoin !== "USDT") {
        console.error(
          "Skipping: Non-USDT referral kickbacks on sell operations are not supported yet."
        );
        continue;
      }

      const userId = _transactions[0]["User_ID"];
      const ticks = (new Date(date).getTime() / 1000).toString();
      const remarks = _transactions
        .map((t) => t.Remark && `[${t.Account} - ${t.Operation}]: ${t.Remark}`)
        .filter((t) => t)
        .join(", ");

      const receiveYenPrice = await getPriceAtDate(receiveCoin.toLowerCase(), date);
      const _isFeePaidOnCoin = _feeCoin === receiveCoin;
      const feeYenPrice = _isFeePaidOnCoin
        ? 0
        : await getPriceAtDate(_feeCoin.toLowerCase(), date);
      const intermediateValue =
        receiveAmount +
        (receiveCoin === kickbackCoin ? _kickbackAmount : 0) -
        (_isFeePaidOnCoin ? _feeAmount : 0);

      transactions.push({
        id: `${userId}_${ticks}_sell`,
        currencyPair: sendCoin + "#JPY",
        transactionDate: ticks,
        transactionDateUTC: new Date(date).toUTCString(),
        sentAmount: sendAmount,
        sentCurrency: sendCoin.toUpperCase(),
        receivedAmount: intermediateValue * receiveYenPrice,
        receivedCurrency: "JPY",
        feeAmount: 0,
        feeCurrency: "JPY",
        label: "sell",
        description: remarks,
        wallet: "binance",
      });
      transactions.push({
        id: `${userId}_${ticks}_buy`,
        currencyPair: "JPY#" + receiveCoin,
        transactionDate: ticks,
        transactionDateUTC: new Date(date).toUTCString(),
        sentAmount: intermediateValue * receiveYenPrice,
        sentCurrency: "JPY",
        receivedAmount: intermediateValue,
        receivedCurrency: receiveCoin.toUpperCase(),
        feeAmount: _feeAmount * feeYenPrice,
        feeCurrency: "JPY",
        label: "buy",
        description: remarks,
        wallet: "binance",
      });
    } else if (operation === "largeOtcTrading") {
      const _receiveTransactions = _transactions.filter(
        (t) =>
          t.Operation.toLowerCase() === "large otc trading" && !t.Change.startsWith("-")
      );
      const _receiveCoinArr = Array.from(
        new Set(_receiveTransactions.map((t) => t["Coin"]))
      );
      if (_receiveCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 coin transaction during ${operation}.`
        );
        continue;
      }
      const receiveCoin = _receiveCoinArr[0].toUpperCase();
      const receiveAmount = _receiveTransactions.reduce(
        (c, a) => c + parseFloat(a["Change"]),
        0
      );

      const _sendTransactions = _transactions.filter(
        (t) =>
          t.Operation.toLowerCase() === "large otc trading" && t.Change.startsWith("-")
      );
      const _sendCoinArr = Array.from(new Set(_sendTransactions.map((t) => t["Coin"])));
      if (_sendCoinArr.length !== 1) {
        console.error(
          `Skipping: Unexpected structure, there should be 1 and only 1 coin transaction during ${operation}.`
        );
        continue;
      }
      const sendCoin = _sendCoinArr[0].toUpperCase();
      const sendAmount = Math.abs(
        _sendTransactions.reduce((c, a) => c + parseFloat(a["Change"]), 0)
      );

      const userId = _transactions[0]["User_ID"];
      const ticks = (new Date(date).getTime() / 1000).toString();
      const remarks = _transactions
        .map((t) => t.Remark && `[${t.Account} - ${t.Operation}]: ${t.Remark}`)
        .filter((t) => t)
        .join(", ");

      const sendYenPrice = await getPriceAtDate(sendCoin.toLowerCase(), date);
      const intermediateValue = sendAmount * sendYenPrice;

      transactions.push({
        id: `${userId}_${ticks}_sell`,
        currencyPair: sendCoin + "#JPY",
        transactionDate: ticks,
        transactionDateUTC: new Date(date).toUTCString(),
        sentAmount: sendAmount,
        sentCurrency: sendCoin.toUpperCase(),
        receivedAmount: intermediateValue,
        receivedCurrency: "JPY",
        feeAmount: 0,
        feeCurrency: "JPY",
        label: "sell",
        description: remarks,
        wallet: "binance",
      });
      transactions.push({
        id: `${userId}_${ticks}_buy`,
        currencyPair: "JPY#" + receiveCoin,
        transactionDate: ticks,
        transactionDateUTC: new Date(date).toUTCString(),
        sentAmount: intermediateValue,
        sentCurrency: "JPY",
        receivedAmount: receiveAmount,
        receivedCurrency: receiveCoin.toUpperCase(),
        feeAmount: 0,
        feeCurrency: "JPY",
        label: "buy",
        description: remarks,
        wallet: "binance",
      });
    } else if (operation === "smallAssetsExchangeBnb") {
      const _sendTransactions = _transactions.filter(
        (t) => t.Coin.toUpperCase() !== "BNB" && t.Change.startsWith("-")
      );
      const _sendCoinArr = Array.from(
        new Set(_sendTransactions.map((t) => t["Coin"].toUpperCase()))
      );
      if (_sendCoinArr.length === 0) {
        console.error(
          `Skipping: Unexpected structure, there should be at least 1 coin transaction during ${operation}.`
        );
        continue;
      }
      const _sendCoins = Object.fromEntries(
        _sendCoinArr.map((c) => [
          c,
          {
            amount: Math.abs(
              _sendTransactions
                .filter((t) => t["Coin"].toUpperCase() === c)
                .reduce((c, a) => c + parseFloat(a["Change"]), 0)
            ),
            price: 0,
            bnbEq: 0,
          },
        ])
      );
      let _receiveAmounts = _transactions
        .filter((t) => t.Coin.toUpperCase() === "BNB")
        .map((t) => parseFloat(t.Change));
      if (_receiveAmounts.length === 0 || _receiveAmounts.some((t) => t < 0)) {
        console.error(
          `Skipping: Unexpected structure, there should be at least 1 BNB transaction and all transactions should have a positive value during ${operation}.`
        );
        continue;
      }

      const _bnbPrice = await getPriceAtDate("BNB", date);
      for (const c of Object.keys(_sendCoins)) {
        if (_receiveAmounts.length === 0) {
          throw new Error(
            `Skewed data, not enough BNB received for all coins on operation ${operation}`
          );
        }
        const _price = await getPriceAtDate(c, date);
        _sendCoins[c]["price"] = _price;

        const _bnbEq = closestIdx(
          _receiveAmounts.map((t) => t * _bnbPrice),
          _sendCoins[c].amount * _sendCoins[c]["price"]
        );

        console.log("----------- BNB PARSING: ----------");
        console.log(_receiveAmounts.map((t) => t * _bnbPrice));
        console.log(_sendCoins[c].amount * _sendCoins[c]["price"]);
        console.log("bnbPrice:" + _bnbPrice);
        console.log("bnbEq:" + _bnbEq);
        console.log("----------- BNB PARSING: ----------");

        _sendCoins[c]["bnbEq"] = _receiveAmounts[_bnbEq];
        _receiveAmounts.splice(_bnbEq, 1);
      }

      console.log(_sendCoins);
      const userId = _transactions[0]["User_ID"];
      const ticks = (new Date(date).getTime() / 1000).toString();
      const remarks = _transactions
        .map((t) => t.Remark && `[${t.Account} - ${t.Operation}]: ${t.Remark}`)
        .filter((t) => t)
        .join(", ");

      Object.entries(_sendCoins).forEach(([c, v]) => {
        transactions.push({
          id: `${userId}_${ticks}_sell_${c}`,
          currencyPair: c + "#JPY",
          transactionDate: ticks,
          transactionDateUTC: new Date(date).toUTCString(),
          sentAmount: v.amount,
          sentCurrency: c.toUpperCase(),
          receivedAmount: v.amount * v.price,
          receivedCurrency: "JPY",
          feeAmount: 0,
          feeCurrency: "JPY",
          label: "sell",
          description: remarks,
          wallet: "binance",
        });
        transactions.push({
          id: `${userId}_${ticks}_buy_bnb`,
          currencyPair: "JPY#BNB",
          transactionDate: ticks,
          transactionDateUTC: new Date(date).toUTCString(),
          sentAmount: v.amount * v.price,
          sentCurrency: "JPY",
          receivedAmount: v.bnbEq,
          receivedCurrency: "BNB",
          feeAmount: 0,
          feeCurrency: "JPY",
          label: "buy",
          description: remarks,
          wallet: "binance",
        });
      });
    } else {
      console.error("Skipping: Unknown operation type in", operation);
    }

    console.log("Parsed: ", transactions.slice(tLength));
  }

  return transactions;
};

export const convertSpotHistory = async (
  csv: ParseResult<csvWithHeader>
): Promise<ITransaction[]> => {
  const transactions: ITransaction[] = [];

  console.error("Not implemented");

  return transactions;
};
