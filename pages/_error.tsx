import { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';

interface ErrorProps {
  statusCode: number | null;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  const errorMessages: Record<number, string> = {
    404: 'La página que buscas no existe.',
    403: 'No tienes permiso para acceder a esta página.',
    500: 'Ocurrió un error en el servidor.',
  };

  const errorMessage =
    statusCode && errorMessages[statusCode]
      ? errorMessages[statusCode]
      : 'Ha ocurrido un error inesperado.';

  return (
    <div className="container">
      <Head>
        <title>Error {statusCode || ''} | APAP</title>
      </Head>

      <main className="text-center py-5">
        <h1 className="display-1">{statusCode || 'Error'}</h1>
        <p className="lead">{errorMessage}</p>
        <Link href="/" className="btn btn-primary mt-3">
          Volver al inicio
        </Link>
      </main>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode || 500 : 404;
  return { statusCode };
};

export default Error;