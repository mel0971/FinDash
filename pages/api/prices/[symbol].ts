import type { NextApiRequest, NextApiResponse } from 'next';
import { getStockPrice, PriceData as FinnhubPriceData } from './finnhubService';
import { getCryptoPrice, PriceData as BinancePriceData } from './binanceService';
import { getStockPriceAlphaVantage, PriceData as AlphaPriceData } from './alphaVantageService';

type PriceData = FinnhubPriceData | BinancePriceData | AlphaPriceData;

type ResponseData = {
  success: boolean;
  data?: PriceData;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { symbol, type } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Symbol manquant',
    });
  }

  try {
    let priceData: PriceData | null = null;

    if (type === 'crypto') {
      priceData = await getCryptoPrice(symbol);
    } else {
      priceData = await getStockPrice(symbol);
      
      if (!priceData) {
        console.log(`Finnhub n'a pas trouvé ${symbol}, essai Alpha Vantage...`);
        priceData = await getStockPriceAlphaVantage(symbol);
      }
    }

    if (!priceData) {
      return res.status(404).json({
        success: false,
        error: `Prix non trouvé pour ${symbol}`,
      });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

    return res.status(200).json({
      success: true,
      data: priceData,
    });
  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
}
