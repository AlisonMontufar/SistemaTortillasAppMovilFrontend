import { useState } from 'react';

export const useSignatureValidation = (customerName, signature) => {
  const [customerNameError, setCustomerNameError] = useState('');
  const [signatureError, setSignatureError] = useState('');

  const resetErrors = () => {
    setCustomerNameError('');
    setSignatureError('');
  };

  const validateFields = () => {
    let isValid = true;

    // Nombre
    if (!customerName.trim()) {
      setCustomerNameError('El nombre del cliente no puede estar vacío.');
      isValid = false;
    } else {
      setCustomerNameError('');
    }

    // Firma
    if (!signature) {
      setSignatureError('La firma es obligatoria.');
      isValid = false;
    } else {
      setSignatureError('');
    }

    return isValid;
  };

  // ✔ Validación individual (mientras escribe o dibuja)
  const validateField = (fieldName, value) => {
    if (fieldName === 'customerName') {
      if (!value.trim()) {
        setCustomerNameError('El nombre del cliente no puede estar vacío.');
      } else {
        setCustomerNameError('');
      }
    }

    if (fieldName === 'signature') {
      if (!value) {
        setSignatureError('La firma es obligatoria.');
      } else {
        setSignatureError('');
      }
    }
  };

  return {
    customerNameError,
    signatureError,
    validateFields,
    validateField,
    resetErrors,
  };
};
