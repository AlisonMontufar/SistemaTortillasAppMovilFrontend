import { useState } from 'react';

const MIN_PASSWORD_LENGTH = 6;

/**
 * Hook de validación para la recuperación de contraseña.
 * Compatible con React Native (Expo) y sin dependencias externas.
 */
export const useRecoverPasswordValidation = (
  email = '',
  code = '',
  newPassword = '',
  confirmPassword = ''
) => {
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Limpia todos los errores
  const resetErrors = () => {
    setEmailError('');
    setCodeError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  // --- Validación de correo ---
  const validateEmail = () => {
    const safeEmail = email ? email.toString().trim() : '';
    if (!safeEmail) {
      setEmailError('El correo no puede estar vacío.');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(safeEmail)) {
      setEmailError('Formato de correo inválido.');
      return false;
    }
    setEmailError('');
    return true;
  };

  // --- Validación del código ---
  const validateCode = () => {
    const safeCode = code ? code.toString().trim() : '';
    if (!safeCode) {
      setCodeError('El código no puede estar vacío.');
      return false;
    }
    setCodeError('');
    return true;
  };

  // --- Validación de contraseñas ---
  const validatePasswords = () => {
    const pass = newPassword ? newPassword.toString().trim() : '';
    const confirm = confirmPassword ? confirmPassword.toString().trim() : '';

    if (!pass) {
      setPasswordError('La contraseña no puede estar vacía.');
      return false;
    } else if (pass.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return false;
    }

    if (pass !== confirm) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      return false;
    }

    setPasswordError('');
    setConfirmPasswordError('');
    return true;
  };

  return {
    emailError,
    codeError,
    passwordError,
    confirmPasswordError,
    validateEmail,
    validateCode,
    validatePasswords,
    resetErrors,
  };
};
