## routes for indi sockets?

## switch to route different coins to different

## need getUsdPrice for each coin?

## update ws.on('message') to send to use routing switch

#### migrate this into a helper function with routing switch in if ():
```
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
```