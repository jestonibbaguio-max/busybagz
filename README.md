# BusyBagz

## Market data

The dashboard uses Yahoo Finance chart data with hourly candles. XAU is mapped to Yahoo's `GC=F` gold futures symbol, while the watchlist stocks use their Yahoo symbols.

Start BusyBagz with `npm start` and open `/stock.html`.

For an Exness comparison, enter the current `XAUUSD` price in the 12-hour setup and select **Calculate levels**. The entered quote becomes the current/open price; the latest 12 Yahoo hourly candles supply the volatility estimate, with a 1× ATR stop loss and 2× ATR take-profit. Yahoo's `GC=F` futures quote is not Exness spot pricing.

