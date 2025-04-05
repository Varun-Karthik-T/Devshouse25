import requests
import pandas as pd
import os
from dotenv import load_dotenv
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras import Input

from datetime import datetime, timedelta

load_dotenv()

api_key = os.getenv("APCA_API_KEY_ID")
api_secret = os.getenv("APCA_API_SECRET_KEY")

headers = {
    "accept": "application/json",
    "APCA-API-KEY-ID": api_key,
    "APCA-API-SECRET-KEY": api_secret
}

def fetch_stock_data(symbol, start, end, timeframe="12H", limit=10000):
    base_url = "https://data.alpaca.markets/v2/stocks/bars"
    all_bars = []
    page_token = None

    while True:
        params = {
            "symbols": symbol,
            "timeframe": timeframe,
            "start": start,
            "end": end,
            "limit": limit,
            "adjustment": "raw",
            "feed": "sip",
            "sort": "asc"
        }
        if page_token:
            params["page_token"] = page_token

        response = requests.get(base_url, headers=headers, params=params)
        data = response.json()
        bars = data.get("bars", {}).get(symbol, [])
        all_bars.extend(bars)

        page_token = data.get("next_page_token")
        if not page_token:
            break

    df = pd.DataFrame(all_bars)
    return df


def predict_for_company(symbol, future_days=[30, 60, 90, 180, 365]):
    start_date = "2024-01-03T00:00:00Z"
    end_date = "2025-04-05T00:00:00Z"

    df = fetch_stock_data(symbol, start_date, end_date)

    if df.empty or len(df) < 30:
        return {day: None for day in future_days}  # Not enough data

    df = df.rename(columns={
        't': 'timestamp',
        'o': 'open',
        'h': 'high',
        'l': 'low',
        'c': 'close',
        'v': 'volume',
        'n': 'trade_count',
        'vw': 'vwap'
    })

    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')
    df.set_index('timestamp', inplace=True)

    df['close_lag_1'] = df['close'].shift(1)
    df['close_lag_2'] = df['close'].shift(2)
    df['ma_3'] = df['close'].rolling(window=3).mean()
    df['ma_5'] = df['close'].rolling(window=5).mean()
    df.dropna(inplace=True)

    features = ['close_lag_1', 'close_lag_2', 'ma_3', 'ma_5', 'volume', 'trade_count', 'vwap']
    target = 'close'

    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()

    X_scaled = scaler_X.fit_transform(df[features])
    y_scaled = scaler_y.fit_transform(df[[target]])

    X_lstm = X_scaled.reshape((X_scaled.shape[0], 1, X_scaled.shape[1]))

    split_index = int(len(X_lstm) * 0.8)
    X_train, X_test = X_lstm[:split_index], X_lstm[split_index:]
    y_train, y_test = y_scaled[:split_index], y_scaled[split_index:]



    model = Sequential()
    model.add(Input(shape=(1, X_scaled.shape[1])))
    model.add(LSTM(64, activation='relu'))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mse')
    model.fit(X_train, y_train, epochs=30, batch_size=8, verbose=0)

    # Predict future days
    future_predictions = []
    last_known_row = df.iloc[-1][features].copy()
    last_closes = [df.iloc[-2]['close'], df.iloc[-1]['close']]

    for i in range(365):
        close_lag_1 = last_closes[-1]
        close_lag_2 = last_closes[-2]
        ma_3 = np.mean(last_closes[-2:] + [close_lag_1])
        ma_5 = np.mean((last_closes + [close_lag_1])[-5:])

        last_known_row['close_lag_1'] = close_lag_1
        last_known_row['close_lag_2'] = close_lag_2
        last_known_row['ma_3'] = ma_3
        last_known_row['ma_5'] = ma_5

        # Random variation to volume, trade_count, vwap
        last_known_row['volume'] *= 1 + np.random.normal(0, 0.01)
        last_known_row['trade_count'] *= 1 + np.random.normal(0, 0.01)
        last_known_row['vwap'] *= 1 + np.random.normal(0, 0.005)

        input_features = scaler_X.transform(pd.DataFrame([last_known_row[features]], columns=features))
        input_features = input_features.reshape((1, 1, len(features)))

        scaled_prediction = model.predict(input_features, verbose=0)
        predicted_close = scaler_y.inverse_transform(scaled_prediction)[0][0]

        future_predictions.append(predicted_close)

        last_closes.append(predicted_close)
        last_closes = last_closes[-5:]
        last_known_row['close'] = predicted_close

    results = {day: float(round(future_predictions[day - 1], 2)) for day in future_days}

    return results


def predict_multiple_stocks(symbols):
    all_predictions = {}
    for symbol in symbols:
        print(f"Training & predicting for {symbol}...")
        all_predictions[symbol] = predict_for_company(symbol)
    return all_predictions


