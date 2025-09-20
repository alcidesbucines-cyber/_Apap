import { VercelRequest, VercelResponse } from '@vercel/node';
import { handleLogin } from './login';
import { handleRegistro } from './registro';
import { handleOtp } from './otp';
import { handleResend } from './resend';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { method, url } = req;
  
  try {
    if (method === 'POST') {
      if (url?.includes('/api/login')) {
        return await handleLogin(req, res);
      } else if (url?.includes('/api/registro')) {
        return await handleRegistro(req, res);
      } else if (url?.includes('/api/otp')) {
        return await handleOtp(req, res);
      } else if (url?.includes('/api/resend')) {
        return await handleResend(req, res);
      }
    }
    
    res.status(404).json({ error: 'Ruta no encontrada' });
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};