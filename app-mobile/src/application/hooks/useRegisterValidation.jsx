import { useState } from 'react';

// Expresión regular simple para validar el formato del correo electrónico
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_PHONE_LENGTH = 10; 

export const useRegisterValidation = (
  nombreUsuario,
  nombre,
  apellidoP,
  apellidoM,
  correoUsuario,
  contrasenaUsuario,
  confirmarContrasena,
  telefonoUsuario,
  placasVehiculo
) => {
  // Estados para manejar los errores de cada campo
  const [errors, setErrors] = useState({});

  const resetErrors = () => {
    setErrors({});
  };

  const validateFields = () => {
    let newErrors = {};
    let isValid = true;

    // Validación de campos obligatorios
    if (!nombre.trim()) { newErrors.nombre = 'El nombre es obligatorio.'; isValid = false; }
    if (!apellidoP.trim()) { newErrors.apellidoP = 'El apellido paterno es obligatorio.'; isValid = false; }
    if (!apellidoM.trim()) { newErrors.apellidoM = 'El apellido materno es obligatorio.'; isValid = false; }
    // El apellido materno es opcional, por lo que no lo marcamos como error
    if (!nombreUsuario.trim()) { newErrors.nombreUsuario = 'El nombre de usuario es obligatorio.'; isValid = false; }
    if (!telefonoUsuario.trim()) { 
        newErrors.telefonoUsuario = 'El teléfono es obligatorio.'; 
        isValid = false; 
    } else if (telefonoUsuario.trim().length < MIN_PHONE_LENGTH) {
        newErrors.telefonoUsuario = 'El teléfono debe tener al menos 10 dígitos.'; 
        isValid = false; 
    }
    if (!placasVehiculo.trim()) { newErrors.placasVehiculo = 'Las placas del vehículo son obligatorias.'; isValid = false; }

    // Validación de Correo Electrónico
    if (!correoUsuario.trim()) {
      newErrors.correoUsuario = 'El correo electrónico es obligatorio.';
      isValid = false;
    } else if (!EMAIL_REGEX.test(correoUsuario)) {
      newErrors.correoUsuario = 'Formato de correo inválido.';
      isValid = false;
    }

    // Validación de Contraseña
    if (!contrasenaUsuario) {
      newErrors.contrasenaUsuario = 'La contraseña es obligatoria.';
      isValid = false;
    } else if (contrasenaUsuario.length < MIN_PASSWORD_LENGTH) {
      newErrors.contrasenaUsuario = `Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
      isValid = false;
    }

    // Validación de Confirmación de Contraseña
    if (!confirmarContrasena) {
      newErrors.confirmarContrasena = 'Debes confirmar la contraseña.';
      isValid = false;
    } else if (contrasenaUsuario !== confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden.';
      isValid = false;
    }


    setErrors(newErrors);
    return isValid;
  };

  return {
    // Errores de campos individuales
    nombreUsuarioError: errors.nombreUsuario,
    nombreError: errors.nombre,
    apellidoPError: errors.apellidoP,
    apellidoMError: errors.apellidoM,
    correoUsuarioError: errors.correoUsuario,
    contrasenaUsuarioError: errors.contrasenaUsuario,
    confirmarContrasenaError: errors.confirmarContrasena,
    telefonoUsuarioError: errors.telefonoUsuario,
    placasVehiculoError: errors.placasVehiculo,
    
    validateFields,
    resetErrors,
  };
};
