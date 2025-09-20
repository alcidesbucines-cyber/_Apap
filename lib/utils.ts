export function generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }
  
  export function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  
  export function formatPhoneNumber(phone: string): string {
    // Eliminar todo lo que no sea número
    const cleaned = ('' + phone).replace(/\D/g, '');
    // Formatear según el estándar internacional
    return `+${cleaned}`;
  }