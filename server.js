const express = require("express");
const app = express();
const port = 3200;
const axios = require("axios");
const moment = require("moment");
const WebSocket = require("ws");
const ws = new WebSocket("wss://api2.poloniex.com");
const wss = new WebSocket.Server({
  port: 8080
});

const socketSubscription = {
  command: "subscribe",
  channel: 1002
};

ws.on("open", function open() {
  ws.send(JSON.stringify(socketSubscription));
});

wss.broadcast = function(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const getUsdPrice = async lastEthPrice => {
  const res = await axios.get(
    "https://api.coinmarketcap.com/v1/ticker/bitcoin/"
  );
  const priceUsd = res.data[0].price_usd;
  return {
    lastEthPrice,
    priceUsd
  };
};

ws.on("message", async function incoming(data) {
  const message = JSON.parse(data);
  if (message[1] === null) {
    const channel = message[2][0];
    if (channel === 148) {
      const lastEthPrice = message[2][1];
      const momentTime = moment().format("MMMM Do YYYY, h:mm:ss a");
      let coinDataOutput = await getUsdPrice(lastEthPrice);
      output = {
        ...coinDataOutput,
        momentTime
      };
      wss.broadcast(JSON.stringify(output));
    }
  }
});

app.use("/", express.static("client"));

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
