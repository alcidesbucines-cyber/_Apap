import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Exito() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al inicio después de 5 segundos
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container">
      <Head>
        <title>APAP - ¡Éxito!</title>
      </Head>

      <main>
        <div className="success-message">
          <h1>¡Registro Exitoso!</h1>
          <p>Tu cuenta ha sido verificada correctamente.</p>
          <p>Serás redirigido a la página de inicio en unos segundos...</p>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
        }
        
        main {
          background: white;
          padding: 3rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
          text-align: center;
        }
        
        .success-message {
          color: #155724;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 1.5rem;
          border-radius: 4px;
        }
        
        h1 {
          margin-top: 0;
          color: #155724;
        }
        
        p {
          margin-bottom: 0.5rem;
          color: #0c5460;
        }
      `}</style>
    </div>
  );
}