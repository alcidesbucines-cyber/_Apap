import { VercelRequest, VercelResponse } from '@vercel/node';
import { getEstadoUsuario, limpiarEstado } from '../lib/telegram';

interface OTPRequest {
  usuario: string;
  otp: string;
}

export async function handleOtp(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { usuario, otp } = req.body as OTPRequest;
    
    if (!usuario || !otp) {
      return res.status(400).json({ 
        error: 'Usuario y código OTP son requeridos' 
      });
    }

    const estado = getEstadoUsuario(usuario);
    
    if (!estado || estado.otp_code !== otp) {
      return res.status(400).json({ 
        error: 'Código OTP inválido o expirado' 
      });
    }

    if (estado.decision !== 'approved') {
      return res.status(403).json({ 
        error: 'El registro no ha sido aprobado' 
      });
    }

    // Limpiar estado después de verificación exitosa
    limpiarEstado(usuario);

    return res.status(200).json({ 
      success: true, 
      message: 'Código OTP verificado correctamente' 
    });
  } catch (error) {
    console.error('Error en verificación OTP:', error);
    return res.status(500).json({ error: 'Error al verificar el código OTP' });
  }
}