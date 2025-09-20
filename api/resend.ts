import { VercelRequest, VercelResponse } from '@vercel/node';
import { getEstadoUsuario, updateOtpCode } from '../lib/telegram';
import { generateOTP } from '../lib/utils';

interface ResendRequest {
  usuario: string;
  note?: string;
}

export async function handleResend(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { usuario, note } = req.body as ResendRequest;
    
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario es requerido' });
    }

    const estado = getEstadoUsuario(usuario);
    if (!estado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Generar nuevo OTP
    const newOtp = generateOTP(6);
    
    // Actualizar OTP en el estado
    updateOtpCode(usuario, newOtp);

    // Notificar al administrador sobre el reenvío
    await sendResendNotification(usuario, newOtp, note);

    return res.status(200).json({ 
      success: true, 
      message: 'Código reenviado correctamente' 
    });
  } catch (error) {
    console.error('Error al reenviar código:', error);
    return res.status(500).json({ error: 'Error al reenviar el código' });
  }
}

async function sendResendNotification(usuario: string, otp: string, note?: string) {
  // Implementar notificación al administrador
  // Similar a las otras funciones de notificación
}