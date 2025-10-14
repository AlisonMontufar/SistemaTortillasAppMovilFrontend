import RecoverPasswordRepository from "../../domain/repositories/RecoverPasswordRepository"

export default class RecoverPasswordRepositoryImpl extends RecoverPasswordRepository {
  constructor() {
    super();
    this.apiSendCodeBaseUrl = 'http://192.168.137.57:5149/api/v1/Auth/send-recovery-code';
    this.apiVerifyCodeBaseUrl = 'http://192.168.137.57:5149/api/v1/Auth/verify-recovery-code';
    this.apiResetPasswordBaseUrl = 'http://192.168.137.57:5149/api/v1/Auth/reset-password';
  }

  async sendRecoveryCode(email) {
    try {
      const response = await fetch(this.apiSendCodeBaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el código de recuperación');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con la API');
    }
  }

  async verifyRecoveryCode(email, code) {
    try {
      const response = await fetch(this.apiVerifyCodeBaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        throw new Error('Código de verificación incorrecto');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión con la API');
    }
  }

  async resetPassword(email, newPassword, confirmPassword) {
    try {
      console.log('📤 Enviando solicitud de restablecer contraseña...');

      // Agregar el email como parámetro en la URL
      const url = `${this.apiResetPasswordBaseUrl}?email=${encodeURIComponent(email)}`;

      console.log('➡️ URL:', url);
      console.log('➡️ Datos enviados:', { newPassword, confirmPassword });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword,
          confirmPassword,
        }),
      });

      console.log('📥 Respuesta recibida:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error del servidor:', errorText);
        throw new Error('Error al restablecer la contraseña');
      }

      const data = await response.json();
      console.log('✅ Respuesta JSON:', data);

      return data;
    } catch (error) {
      console.log('⚠️ Error en resetPassword:', error);
      throw new Error(error.message || 'Error de conexión con la API');
    }
  }
  
}
