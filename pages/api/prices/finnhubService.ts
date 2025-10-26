import axios from 'axios';

export interface PriceData {
  symbol: string;
  price: number;
  timestamp: Date;
  source: 'finnhub' | 'binance' | 'alpha_vantage';
  currency: string;
}

export async function getStockPrice(symbol: string): Promise<PriceData | null> {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      console.error('FINNHUB_API_KEY manquante');
      return null;
    }

    const response = await axios.get('https://finnhub.io/api/v1/quote', {
      params: { 
        symbol: symbol.toUpperCase(), 
        token: apiKey 
      },
      timeout: 5000,
    });

    const { c: price } = response.data;

    if (price === undefined || price === null || price === 0) {
      console.error(`Prix vide pour ${symbol}`);
      return null;
    }

    return {
      symbol: symbol.toUpperCase(),
      price: parseFloat(parseFloat(price).toFixed(2)),
      timestamp: new Date(),
      source: 'finnhub',
      currency: 'USD',
    };
  } catch (error) {
    console.error('Erreur Finnhub:', error);
    return null;
  }
}
