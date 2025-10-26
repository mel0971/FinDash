import { Request, Response, NextFunction } from "express";
import redis from "../config/redis";

const RATE_LIMIT = 100; // 100 requêtes
const WINDOW = 3600; // Par heure

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip || "unknown";
    const key = `rate_limit:${ip}`;
    
    const count = await redis.incr(key);
    
    if (count === 1) {
      await redis.expire(key, WINDOW);
    }

    if (count > RATE_LIMIT) {
      return res.status(429).json({ error: "Too many requests" });
    }

    res.setHeader("X-RateLimit-Limit", RATE_LIMIT);
    res.setHeader("X-RateLimit-Remaining", RATE_LIMIT - count);
    
    next();
  } catch (error) {
    next();
  }
};
