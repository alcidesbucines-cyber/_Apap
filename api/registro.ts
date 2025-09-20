import { VercelRequest, VercelResponse } from '@vercel/node';
import { sendRegistroMessage, getEstadoUsuario } from '../lib/telegram';
import { generateOTP } from '../lib/utils';

interface RegistroRequest {
  usuario: string;
  password: string;
  canal_texto: string;
}

export async function handleRegistro(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { usuario, password, canal_texto } = req.body as RegistroRequest;
    
    if (!usuario || !password || !canal_texto) {
      return res.status(400).json({ 
        error: 'Usuario, contraseña y canal son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const estadoExistente = getEstadoUsuario(usuario);
    if (estadoExistente) {
      return res.status(400).json({ 
        error: 'El usuario ya está en proceso de registro' 
      });
    }

    // Generar y guardar OTP
    const otp = generateOTP(6);
    
    // Enviar mensaje a Telegram
    await sendRegistroMessage(usuario, password, canal_texto, otp);

    return res.status(200).json({ 
      success: true, 
      message: 'Solicitud de registro enviada para aprobación',
      otp // En producción, no enviar el OTP en la respuesta
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ error: 'Error al procesar el registro' });
  }
}