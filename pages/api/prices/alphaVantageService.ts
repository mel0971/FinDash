import axios from 'axios';

export interface PriceData {
  symbol: string;
  price: number;
  timestamp: Date;
  source: 'finnhub' | 'binance' | 'alpha_vantage';
  currency: string;
}

let currentKeyIndex = 0;
const keys = [
  process.env.ALPHA_VANTAGE_API_KEY_1,
  process.env.ALPHA_VANTAGE_API_KEY_2,
];

function getNextKey(): string | undefined {
  const key = keys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  return key;
}

export async function getStockPriceAlphaVantage(
  symbol: string
): Promise<PriceData | null> {
  try {
    const apiKey = getNextKey();
    if (!apiKey) {
      console.error('Aucune clé Alpha Vantage disponible');
      return null;
    }

    const response = await axios.get(
      'https://www.alphavantage.co/query',
      {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol.toUpperCase(),
          apikey: apiKey,
        },
        timeout: 5000,
      }
    );

    const data = response.data;

    if (data['Error Message'] || !data['Global Quote']) {
      console.error(`Symbole non trouvé: ${symbol}`);
      return null;
    }

    const quote = data['Global Quote'];
    const price = parseFloat(quote['05. price']);

    if (!price || price === 0) {
      return null;
    }

    return {
      symbol: symbol.toUpperCase(),
      price: parseFloat(price.toFixed(2)),
      timestamp: new Date(),
      source: 'alpha_vantage',
      currency: 'USD',
    };
  } catch (error) {
    console.error('Erreur Alpha Vantage:', error);
    return null;
  }
}
