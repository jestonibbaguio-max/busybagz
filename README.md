# BusyBagz

## Exness MT5 feed

XAU uses the local MT5 bridge and the `XAUUSD` symbol from the logged-in Exness MT5 terminal.

1. Install Python 3 and the Exness MT5 desktop terminal on Windows.
2. Log in to the Exness account in MT5 and confirm `XAUUSD` is visible in Market Watch.
3. Install the bridge dependency:

```powershell
python -m pip install -r requirements.txt
```

4. Start the bridge in a separate terminal:

```powershell
python mt5-bridge.py
```

5. Start BusyBagz with `npm start` and open `/stock.html`.

The bridge reads the logged-in terminal session; credentials are not stored in this project. Set `MT5_SYMBOL` if Exness shows a broker-specific symbol such as `XAUUSDm`.
