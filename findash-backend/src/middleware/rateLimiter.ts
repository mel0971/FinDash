import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

const RATE_LIMIT = 100;
const WINDOW = 3600;

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip || "unknown";
    const key = `rate_limit:${ip}`;
    
    const count = await redisClient.incr(key);
    
    if (count === 1) {
      await redisClient.expire(key, WINDOW);
    }

    if (count > RATE_LIMIT) {
      return res.status(429).json({ error: "Too many requests" });
    }

    res.setHeader("X-RateLimit-Limit", RATE_LIMIT.toString());
    res.setHeader("X-RateLimit-Remaining", (RATE_LIMIT - count).toString());
    
    next();
  } catch (error) {
    next();
  }
};
