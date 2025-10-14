import { useState } from 'react';

const MIN_PASSWORD_LENGTH = 6;

export const useLoginValidation = (username, password) => {
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const resetErrors = () => {
    setUsernameError('');
    setPasswordError('');
  };

  const validateFields = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError('El usuario no puede estar vacío.');
      isValid = false;
    } else {
      setUsernameError('');
    }

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

  // ✅ NUEVO: validación individual (en tiempo real)
  const validateField = (fieldName, value) => {
    if (fieldName === 'username') {
      if (!value.trim()) {
        setUsernameError('El usuario no puede estar vacío.');
      } else {
        setUsernameError('');
      }
    }

    if (fieldName === 'password') {
      if (!value) {
        setPasswordError('La contraseña no puede estar vacía.');
      } else if (value.length < MIN_PASSWORD_LENGTH) {
        setPasswordError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      } else {
        setPasswordError('');
      }
    }
  };

  return {
    usernameError,
    passwordError,
    validateFields,
    validateField, // 👈 agregamos esto
    resetErrors,
  };
};
