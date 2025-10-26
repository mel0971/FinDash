import axios from 'axios';

export interface PriceData {
  symbol: string;
  price: number;
  timestamp: Date;
  source: 'finnhub' | 'binance' | 'alpha_vantage';
  currency: string;
}

export async function getCryptoPrice(symbol: string): Promise<PriceData | null> {
  try {
    const tradingPair = symbol.toUpperCase().replace('/', '') + 'USDT';
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
      params: { symbol: tradingPair },
      timeout: 5000,
    });

    const { price } = response.data;

    if (!price || price === '0') return null;

    return {
      symbol: symbol.toUpperCase(),
      price: parseFloat(parseFloat(price).toFixed(2)),
      timestamp: new Date(),
      source: 'binance',
      currency: 'USDT',
    };
  } catch (error) {
    console.error('Erreur Binance:', error);
    return null;
  }
}
