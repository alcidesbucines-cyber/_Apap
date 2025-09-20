import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Registro() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [canal, setCanal] = useState('whatsapp');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          usuario, 
          password, 
          canal_texto: canal === 'whatsapp' ? 'WhatsApp' : 'SMS' 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirigir a la página de OTP
        router.push(`/otp?usuario=${encodeURIComponent(usuario)}`);
      } else {
        setMessage(data.error || 'Error en el registro');
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
        <title>APAP - Registro</title>
      </Head>

      <main>
        <h1>Registro</h1>
        {message && <div className="message">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usuario">Usuario:</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Método de verificación:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="canal"
                  value="whatsapp"
                  checked={canal === 'whatsapp'}
                  onChange={() => setCanal('whatsapp')}
                />
                WhatsApp
              </label>
              <label>
                <input
                  type="radio"
                  name="canal"
                  value="sms"
                  checked={canal === 'sms'}
                  onChange={() => setCanal('sms')}
                />
                SMS
              </label>
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 400px;
          width: 100%;
        }
        .form-group {
          margin-bottom: 1rem;
          width: 100%;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .radio-group {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .radio-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .message {
          margin: 1rem 0;
          padding: 1rem;
          border-radius: 4px;
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
}