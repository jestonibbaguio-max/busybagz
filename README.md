# BusyBagz

## Market data

The dashboard uses Yahoo Finance chart data with five-minute candles. XAU is mapped to Yahoo's `GC=F` gold futures symbol, while the watchlist stocks use their Yahoo symbols.

Start BusyBagz with `npm start` and open `/stock.html`.

For an Exness comparison, enter the current `XAUUSD` price in the Aggressive setup and select **Calculate in 5 min**. The app refreshes the five-minute candles after the countdown and uses the entered price as the entry basis with 1× ATR stop loss and 2× ATR take-profit.

