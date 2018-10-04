const app = require('express')()
const port = 3200
const axios = require('axios')
const WebSocket = require('ws');
const ws = new WebSocket('wss://api2.poloniex.com');
const wss = new WebSocket.Server({ port: 8080 })

const socketSubscription = {
    "command": "subscribe",
    "channel": 1002
}

ws.on('open', function open() {
  ws.send(JSON.stringify(socketSubscription));
});

wss.broadcast = function (data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data)
        }
    });
}

const getUsdPrice = (lastEthPrice) => {
    axios.get("https://api.coinmarketcap.com/v1/ticker/bitcoin/").then(res => {
    const priceUsd = res.data[0].price_usd
    let output = {lastEthPrice, priceUsd}
    wss.broadcast(JSON.stringify(output))
    })
}
 
ws.on('message', function incoming(data) {
      const message = JSON.parse(data)
      if (message[1] === null) {
        const channel = message[2][0]
        if (channel === 148) {
            const lastEthPrice = message[2][1]
            getUsdPrice(lastEthPrice)
        }
      }
});

// app.use('/', (req, res) => {
//     // res.set('Content-Type', 'text/html')
//     res.sendFile(__dirname + '/client/index.html').end(200)
// })

app.listen(port, () => {console.log(`listening on ${port}`)})