export interface EstadosUsuario {
    password?: string;
    tipo?: string;
    decision?: 'pending' | 'approved' | 'rejected';
    canal?: string;
    canal_texto?: string;
    otp_code?: string;
    profile?: {
      serviceType?: string;
      fullName?: string;
      phone?: string;
      email?: string;
    };
    msg_ids?: {
      login?: number;
      registro?: number;
      otp?: number;
    };
  }