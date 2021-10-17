const ccxt = require("ccxt");
const moment = require("moment");
const delay = require("delay");
const fs = require("fs");

const binance = new ccxt.binance({
    apiKey: "7vs2fSMN1O62hYNxQNJXgCVHNL4a6QP4PjdUDUcAhF6ZDJRJtOuWK2Azw9Wr3CdZ",
    secret: "EoRxpnyf0vLagqKgFfrEbCkUFrpBZaHAYAs9g5KBZfD95dQvktoaaoih5P7ZJeSM"
});
binance.setSandboxMode(true);

async function printBalance(btcPrice) {
    const balance = await binance.fetchBalance();
    const total = balance.total;

    let data = `Balance: BTC ${total.BTC}, USDT: ${total.USDT}\n`;
    data += `Total USDT: ${(total.BTC - 1) * btcPrice + total.USDT} \n \n`;
    console.log(data);

    fs.appendFile('trade_bot.txt', data, function (err) {
        if (err) throw err;
    });
}

async function tick() {
    const prices = await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 5);
    const bPrices = prices.map(price => {
        return {
            timestamp: moment(price[0]).format(),
            open: price[1],
            hight: price[2],
            low: price[3],
            close: price[4],
            volume: price[5]
        }
    })

    const averagePrice = bPrices.reduce((acc, price) => {return acc + price.close}, 0) /5;
    const lastPrice = bPrices[bPrices.length - 1].close;

    console.log(bPrices.map(p => p.close), averagePrice, lastPrice);
    // Thuật toán đu đỉnh bán đáy

    const direction = averagePrice > lastPrice ? "sell" : "buy";

    const TRADE_SIZE = 100
    const quantity = TRADE_SIZE / lastPrice;

    console.log(`Average price: ${averagePrice}. Last price: ${lastPrice}`);
    const order = await binance.createMarketOrder("BTC/USDT", direction, quantity);
    console.log(`${moment().format()}: ${direction} BTC at ${lastPrice}`);
    await printBalance(lastPrice);

}

async function main() {
    while(true) {
        await tick();
        await delay(60 * 100);
    }
}

main();
// printBalance();