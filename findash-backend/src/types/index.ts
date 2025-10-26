export interface JwtPayload {
  userId: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface PortfolioData {
  name: string;
  description?: string;
  currency?: string;
}

export interface TransactionData {
  symbol: string;
  quantity: number;
  price: number;
  type: "BUY" | "SELL" | "DIVIDEND";
  fees?: number;
  notes?: string;
}
