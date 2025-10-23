import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const useRecoverPasswordValidation = (
  email,
  code,
  newPassword,
  confirmPassword
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

  // Validación general de todos los campos
  const validateFields = () => {
    let isValid = true;

    if (!email?.trim()) {
      setEmailError('El correo no puede estar vacío.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError('Formato de correo inválido.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!code?.trim()) {
      setCodeError('El código no puede estar vacío.');
      isValid = false;
    } else {
      setCodeError('');
    }

    if (!newPassword?.trim()) {
      setPasswordError('La contraseña no puede estar vacía.');
      isValid = false;
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword?.trim()) {
      setConfirmPasswordError('Debes confirmar la contraseña.');
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  // Validación individual con retorno booleano
  const validateField = (fieldName, value) => {
    let isValid = true;

    switch (fieldName) {
      case 'email':
        if (!value?.trim()) {
          setEmailError('El correo no puede estar vacío.');
          isValid = false;
        } else if (!EMAIL_REGEX.test(value)) {
          setEmailError('Formato de correo inválido.');
          isValid = false;
        } else {
          setEmailError('');
        }
        break;

      case 'code':
        if (!value?.trim()) {
          setCodeError('El código no puede estar vacío.');
          isValid = false;
        } else {
          setCodeError('');
        }
        break;

      case 'newPassword':
        if (!value?.trim()) {
          setPasswordError('La contraseña no puede estar vacía.');
          isValid = false;
        } else if (value.length < MIN_PASSWORD_LENGTH) {
          setPasswordError(`Debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
          isValid = false;
        } else {
          setPasswordError('');
        }

        if (confirmPassword) {
          if (value !== confirmPassword) {
            setConfirmPasswordError('Las contraseñas no coinciden.');
            isValid = false;
          } else {
            setConfirmPasswordError('');
          }
        }
        break;

      case 'confirmPassword':
        if (!value?.trim()) {
          setConfirmPasswordError('Debes confirmar la contraseña.');
          isValid = false;
        } else if (value !== newPassword) {
          setConfirmPasswordError('Las contraseñas no coinciden.');
          isValid = false;
        } else {
          setConfirmPasswordError('');
        }
        break;

      default:
        break;
    }

    return isValid;
  };

  return {
    emailError,
    codeError,
    passwordError,
    confirmPasswordError,
    validateFields,
    validateField,
    resetErrors,
  };
};
