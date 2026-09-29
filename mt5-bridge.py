import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

try:
    import MetaTrader5 as mt5
except ImportError:
    mt5 = None

HOST = "127.0.0.1"
PORT = int(os.getenv("MT5_BRIDGE_PORT", "5001"))
DEFAULT_SYMBOL = os.getenv("MT5_SYMBOL", "XAUUSD")
BAR_COUNT = 120


def connect_terminal():
    if mt5 is None:
        raise RuntimeError("MetaTrader5 is not installed. Run: pip install -r requirements.txt")

    path = os.getenv("MT5_PATH")
    initialized = mt5.initialize(path=path) if path else mt5.initialize()
    if not initialized:
        error = mt5.last_error()
        raise RuntimeError(f"MT5 initialize failed: {error}")


def read_quote(symbol):
    connect_terminal()
    try:
        if not mt5.symbol_select(symbol, True):
            raise RuntimeError(f"MT5 symbol is unavailable: {symbol}")

        rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_M5, 0, BAR_COUNT)
        tick = mt5.symbol_info_tick(symbol)
        if rates is None or len(rates) < 21 or tick is None:
            raise RuntimeError(f"Not enough MT5 data for {symbol}")

        bars = [
            {
                "time": int(rate["time"]) * 1000,
                "open": float(rate["open"]),
                "high": float(rate["high"]),
                "low": float(rate["low"]),
                "close": float(rate["close"]),
                "volume": int(rate["tick_volume"]),
            }
            for rate in rates
        ]
        price = float(tick.last or tick.bid or tick.ask)
        return {
            "symbol": symbol,
            "price": price,
            "previousClose": bars[-2]["close"],
            "marketTime": int(tick.time) * 1000,
            "bars": bars,
        }
    finally:
        mt5.shutdown()


class Handler(BaseHTTPRequestHandler):
    def send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        symbol = query.get("symbol", [DEFAULT_SYMBOL])[0]
        if symbol != DEFAULT_SYMBOL:
            self.send_json(400, {"success": False, "message": f"Only {DEFAULT_SYMBOL} is enabled."})
            return

        try:
            self.send_json(200, {"success": True, **read_quote(symbol)})
        except Exception as error:
            self.send_json(503, {"success": False, "message": str(error)})

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    print(f"MT5 bridge listening at http://{HOST}:{PORT} for {DEFAULT_SYMBOL}")
    HTTPServer((HOST, PORT), Handler).serve_forever()
