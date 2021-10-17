const chart = require ('asciichart')
const fs = require("fs");

function plotAsset() {
    const lines = fs.readFileSync("./trade_bot.txt", 'utf-8').split('\n');
    const assets = [];

    for(const line of lines) {
        if(line.includes('Total USDT')) {
            const asset = line.replace('Total USDT: ', '').trim();
            assets.push(+asset);
        }
    }

    console.clear();
    console.log(chart.plot(assets, {
        height: 30
    }))
}

function main() {
    setInterval(plotAsset, 600);
};

main();