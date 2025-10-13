import { useState } from 'react';

// Constantes de validación
const MIN_PASSWORD_LENGTH = 6;

/**
 * Hook personalizado para manejar la lógica de validación de los campos de login.
 *
 * @param {string} username - El valor actual del campo de usuario/email.
 * @param {string} password - El valor actual del campo de contraseña.
 * @returns {{
 * usernameError: string,
 * passwordError: string,
 * validateFields: () => boolean,
 * resetErrors: () => void
 * }}
 */
export const useLoginValidation = (username, password) => {
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Función para limpiar todos los mensajes de error
  const resetErrors = () => {
    setUsernameError('');
    setPasswordError('');
  };

  /**
   * Ejecuta la validación de ambos campos y actualiza los estados de error.
   * @returns {boolean} True si ambos campos son válidos, False en caso contrario.
   */
  const validateFields = () => {
    let isValid = true;

    // --- Validación de Usuario/Email ---
    if (!username.trim()) {
      setUsernameError('El usuario o email no puede estar vacío.');
      isValid = false;
    } else {
      // Nota: Aquí podrías añadir un regex para verificar formato de email si solo esperas emails.
      setUsernameError('');
    }

    // --- Validación de Contraseña ---
    if (!password) {
      setPasswordError('La contraseña no puede estar vacía.');
      isValid = false;
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  return {
    usernameError,
    passwordError,
    validateFields,
    resetErrors,
  };
};
