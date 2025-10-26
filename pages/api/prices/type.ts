export interface PriceData {
  symbol: string;
  price: number;
  timestamp: Date;
  source: 'finnhub' | 'binance' | 'alpha_vantage';
  currency: string;
}
