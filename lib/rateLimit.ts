// lib/rateLimit.ts
import { NextApiRequest, NextApiResponse } from 'next';

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (req: NextApiRequest, res: NextApiResponse) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
             (req.connection.remoteAddress as string);
  
  const now = Date.now();
  const clientData = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
  
  if (now > clientData.resetTime) {
    clientData.count = 0;
    clientData.resetTime = now + RATE_LIMIT_WINDOW_MS;
  }
  
  clientData.count += 1;
  requestCounts.set(ip, clientData);
  
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX_REQUESTS - clientData.count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000));
  
  if (clientData.count > RATE_LIMIT_MAX_REQUESTS) {
    res.status(429).json({ 
      error: 'Demasiadas solicitudes. Por favor, inténtalo de nuevo más tarde.' 
    });
    return false;
  }
  
  return true;
};