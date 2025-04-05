import os
from alpaca.data.historical import CryptoHistoricalDataClient
from alpaca.data.requests import CryptoBarsRequest
from alpaca.data.timeframe import TimeFrame
from datetime import datetime  # Importing datetime module
import requests
import pandas as pd
from dotenv import load_dotenv  

load_dotenv()

# No keys required for crypto data
client = CryptoHistoricalDataClient()

# Creating request object
request_params = CryptoBarsRequest(
    symbol_or_symbols=["BTC/USD"],
    timeframe=TimeFrame.Day,
    start=datetime(2022, 9, 1),
    end=datetime(2022, 9, 20)
)

# Retrieve daily bars for Bitcoin in a DataFrame and printing it
btc_bars = client.get_crypto_bars(request_params)

df = btc_bars.df
print(df.head(2))

# Retrieve API keys from environment variables
api_key = os.getenv("APCA_API_KEY_ID")
api_secret = os.getenv("APCA_API_SECRET_KEY")

url = "https://data.alpaca.markets/v2/stocks/bars?symbols=AAPL%2CTSLA&timeframe=1Min&limit=2&adjustment=raw&feed=sip&sort=asc"

headers = {
    "accept": "application/json",
    "APCA-API-KEY-ID": api_key,
    "APCA-API-SECRET-KEY": api_secret
}

response = requests.get(url, headers=headers)

print(response.text)

# Convert the response as DataFrame
#df = pd.DataFrame(response.json()['bars'])
# print(df.head(2))
