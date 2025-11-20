import { useState } from 'react';

export const useSupportValidation = (incidentReason, problemDescription, contactMethod, email) => {
  const [incidentReasonError, setIncidentReasonError] = useState('');
  const [problemDescriptionError, setProblemDescriptionError] = useState('');
  const [contactMethodError, setContactMethodError] = useState('');
  const [emailError, setEmailError] = useState('');

  const resetErrors = () => {
    setIncidentReasonError('');
    setProblemDescriptionError('');
    setContactMethodError('');
    setEmailError('');
  };

  const validateFields = () => {
    let isValid = true;

    // Motivo del incidente
    if (!incidentReason) {
      setIncidentReasonError('El motivo del incidente es obligatorio.');
      isValid = false;
    } else {
      setIncidentReasonError('');
    }

    // Descripción del problema
    if (!problemDescription.trim()) {
      setProblemDescriptionError('La descripción del problema no puede estar vacía.');
      isValid = false;
    } else {
      setProblemDescriptionError('');
    }

    // Medio de contacto
    if (!contactMethod) {
      setContactMethodError('El medio de contacto es obligatorio.');
      isValid = false;
    } else {
      setContactMethodError('');
    }

    // Email (solo si se seleccionó correo electrónico)
    if (contactMethod === 'email') {
      if (!email.trim()) {
        setEmailError('El correo electrónico es obligatorio.');
        isValid = false;
      } else if (!isValidEmail(email)) {
        setEmailError('Por favor ingresa un correo electrónico válido.');
        isValid = false;
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }

    return isValid;
  };

  // Validación individual (mientras escribe o selecciona)
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'incidentReason':
        if (!value) {
          setIncidentReasonError('El motivo del incidente es obligatorio.');
        } else {
          setIncidentReasonError('');
        }
        break;

      case 'problemDescription':
        if (!value.trim()) {
          setProblemDescriptionError('La descripción del problema no puede estar vacía.');
        } else {
          setProblemDescriptionError('');
        }
        break;

      case 'contactMethod':
        if (!value) {
          setContactMethodError('El medio de contacto es obligatorio.');
        } else {
          setContactMethodError('');
          // Si cambia el método de contacto, validar email si es necesario
          if (value !== 'email') {
            setEmailError('');
          }
        }
        break;

      case 'email':
        if (contactMethod === 'email') {
          if (!value.trim()) {
            setEmailError('El correo electrónico es obligatorio.');
          } else if (!isValidEmail(value)) {
            setEmailError('Por favor ingresa un correo electrónico válido.');
          } else {
            setEmailError('');
          }
        }
        break;

      default:
        break;
    }
  };

  // Función auxiliar para validar email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return {
    incidentReasonError,
    problemDescriptionError,
    contactMethodError,
    emailError,
    validateFields,
    validateField,
    resetErrors,
  };
};