# BusyBagz

## OANDA feed

XAU uses OANDA's `XAU_USD` five-minute feed. This supplies analysis data; it does not place orders in Exness.

1. Create an OANDA practice account and generate an API token.
2. Set the token before starting the server:

```powershell
$env:OANDA_API_TOKEN = 'your-practice-token'
$env:OANDA_ACCOUNT_ID = 'your-account-id'
```

3. Start BusyBagz with `npm start` and open `/stock.html`.

For a live OANDA account, set the live API URL before starting the server:

```powershell
$env:OANDA_API_URL = 'https://api-fxtrade.oanda.com'
```

The account ID is optional. Without it, the app uses the latest completed five-minute candle. With it, the app also reads the current OANDA bid/ask midpoint.

