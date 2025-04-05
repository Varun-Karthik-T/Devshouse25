import requests
import os
def place_order(symbol, qty=1, side="buy", order_type="market", time_in_force="day"):
    """
    Places an order for the given stock symbol.

    Parameters:
        symbol (str): The stock symbol to trade.
        qty (int): The quantity of shares to trade. Default is 1.
        side (str): The side of the trade, either "buy" or "sell". Default is "buy".
        order_type (str): The type of order, e.g., "market". Default is "market".
        time_in_force (str): The time in force for the order. Default is "day".

    Returns:
        dict: The response from the Alpaca API.
    """
    url = "https://paper-api.alpaca.markets/v2/orders"

    api_key = os.getenv("APCA_API_KEY_ID")
    api_secret = os.getenv("APCA_API_SECRET_KEY")

    payload = {
        "symbol": symbol,
        "type": order_type,
        "time_in_force": time_in_force,
        "side": side,
        "qty": str(qty)
    }

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "APCA-API-KEY-ID": api_key,
        "APCA-API-SECRET-KEY": api_secret
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error placing order: {response.text}")
        return None