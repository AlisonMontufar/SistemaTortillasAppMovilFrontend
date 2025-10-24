import { useState } from 'react';

// Expresión regular simple para validar el formato del correo electrónico
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]+$/;
const PLACAS_REGEX = /^([A-Za-z]{4}\d{3}|\d{3}[A-Za-z]{4})$/;

const MIN_PASSWORD_LENGTH = 6;
const MIN_PHONE_LENGTH = 10; 
const MIN_VEHICLE_LENGTH = 7;

export const useRegisterValidation = (
  nombre, 
  apellidoP, 
  apellidoM, 
  nombreUsuario, 
  correoUsuario, 
  contrasenaUsuario, 
  confirmarContrasena, 
  telefonoUsuario, 
  placasVehiculo
) => {
  const [nombreError, setNombreError] = useState('');
  const [apellidoPError, setApellidoPError] = useState('');
  const [apellidoMError, setApellidoMError] = useState('');
  const [nombreUsuarioError, setNombreUsuarioError] = useState('');
  const [correoUsuarioError, setCorreoUsuarioError] = useState('');

  const [contrasenaUsuarioError, setContrasenaUsuarioError] = useState('');
  const [confirmarContrasenaError, setConfirmarContrasenaError] = useState('');
  const [telefonoUsuarioError, setTelefonoUsuarioError] = useState('');
  const [placasVehiculoError, setPlacasVehiculoError] = useState('');

const resetErrors = () => {
  setNombreError('');
  setApellidoPError('');
  setApellidoMError('');
  setNombreUsuarioError('');
  setCorreoUsuarioError('');

  setContrasenaUsuarioError('');
  setConfirmarContrasenaError('');
  setTelefonoUsuarioError('');
  setPlacasVehiculoError('');
};

const validateFields = () => {
  let isValid = true;

  if (!nombre.trim()) {
    setNombreError('El usuario no puede estar vacío.');
    isValid = false;
  } else {
    setNombreError('');
  }
  
  if (!apellidoP.trim()) {
    setApellidoPError('El apellido paterno no puede estar vacío.');
    isValid = false;
  } else {
    setApellidoPError('');
  }
  
  if (!apellidoM.trim()) {
    setApellidoMError('El apellido materno no puede estar vacío.');
    isValid = false;
  } else {
    setApellidoMError('');
  }

  if (!nombreUsuario.trim()) {
    setNombreUsuarioError('El nombre de usuario no puede estar vacío.');
    isValid = false;
  } else {
    setNombreUsuarioError('');
  }

  if (!correoUsuario.trim()) {
    setCorreoUsuarioError('El correo de usuario no puede estar vacío.');
    isValid = false;
  }else if (!EMAIL_REGEX.test(correoUsuario)) {
      setCorreoUsuarioError('El formato del correo no es válido.');
      isValid = false;
  } else {
    setCorreoUsuarioError('');
  }

  if (!contrasenaUsuario) {
    setContrasenaUsuarioError('La contraseña no puede estar vacía.');
    isValid = false;
  } else if (contrasenaUsuario.length < MIN_PASSWORD_LENGTH) {
    setContrasenaUsuarioError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
    isValid = false;
  } else {
    setContrasenaUsuarioError('');
  }

  if (!confirmarContrasena) {
    setConfirmarContrasenaError('Debes confirmar la contraseña.');
    isValid = false;
  } else if (confirmarContrasena !== contrasenaUsuario) {
    setConfirmarContrasenaError('La contraseña no coinciden.');
    isValid = false;
  } else {
    setConfirmarContrasenaError('');
  }
  
  if (!telefonoUsuario) {
    setTelefonoUsuarioError('El telefono no puede estar vacio.');
    isValid = false;
  }else if (!PHONE_REGEX.test(telefonoUsuario)) {
    setTelefonoUsuarioError('Solo se permiten números.');
    isValid = false;
  } else if (telefonoUsuario.length < MIN_PHONE_LENGTH) {
    setTelefonoUsuarioError(`El Telefono debe tener ${MIN_PHONE_LENGTH} caracteres.`);
    isValid = false;
  } else {
    setTelefonoUsuarioError('');
  }

  if (!placasVehiculo) {
    setPlacasVehiculoError('La placa del vehiculo no puede estar vaciá.');
    isValid = false;
  } else if (!PLACAS_REGEX.test(placasVehiculo)) {
    setPlacasVehiculoError('Formato inválido (4 letras y 3 números o viceversa).');
    isValid = false;
  } else if (placasVehiculo.length < MIN_VEHICLE_LENGTH) {
    setPlacasVehiculoError(`La placa del vehiculo debe tener ${MIN_VEHICLE_LENGTH} caracteres.`);
    isValid = false;
  } else {
    setPlacasVehiculoError('');
  }

  return isValid;
};

// ✅ NUEVO: validación individual (en tiempo real)
  const validateField = (fieldName, value) => {
    if (fieldName === 'nombre') {
      if (!value.trim()) {
        setNombreError('El nombre no puede estar vacío.');
      } else {
        setNombreError('');
      }
    }
    
    if (fieldName === 'apellidoP') {
      if (!value.trim()) {
        setApellidoPError('El apellido paterno no puede estar vacío.');
      } else {
        setApellidoPError('');
      }
    }
    if (fieldName === 'apellidoM') {
      if (!value.trim()) {
        setApellidoMError('El apellido materno no puede estar vacío.');
      } else {
        setApellidoMError('');
      }
    }
    
    if (fieldName === 'nombreUsuario') {
      if (!value.trim()) {
        setNombreUsuarioError('El nombre de usuario no puede estar vacío.');
      } else {
        setNombreUsuarioError('');
      }
    }
    
    if (fieldName === 'correoUsuario') {
      if (!value.trim()) {
        setCorreoUsuarioError('El correo no puede estar vacío.');
      }else if (!EMAIL_REGEX.test(correoUsuario)) {
      setCorreoUsuarioError('El formato del correo no es válido.');
      } else {
        setCorreoUsuarioError('');
      }
    }

    if (fieldName === 'contrasenaUsuario') {
      if (!value) {
        setContrasenaUsuarioError('La contraseña no puede estar vacía.');
      } else if (value.length < MIN_PASSWORD_LENGTH) {
        setContrasenaUsuarioError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      } else {
        setContrasenaUsuarioError('');
      }
    }
    
    if (fieldName === 'confirmarContrasena') {
      if (!value) {
        setConfirmarContrasenaError('Debes confirmar la contraseña.');
      } else if (value !== contrasenaUsuario) {
        setConfirmarContrasenaError('Las contraseñas no coinciden.');
      } else {
        setConfirmarContrasenaError('');
      }
    }
    
    if (fieldName === 'telefonoUsuario') {
      if (!value) {
        setTelefonoUsuarioError('El Telefono no puede estar vacio.');
      } else if (!PHONE_REGEX.test(telefonoUsuario)) {
        setTelefonoUsuarioError('Solo se permiten números.');
      } else if (value.length < MIN_PHONE_LENGTH) {
        setTelefonoUsuarioError(`El Telefono debe tener ${MIN_PHONE_LENGTH} caracteres.`);
      } else {
        setTelefonoUsuarioError('');
      }
    }
    if (fieldName === 'placasVehiculo') {
      if (!value) {
        setPlacasVehiculoError('La Placa del Vehiculo no puede estar vaciá.');
      } else if (!PLACAS_REGEX.test(value)) {
        setPlacasVehiculoError('Formato inválido (4 letras y 3 números o viceversa).');
      } else if (value.length < MIN_VEHICLE_LENGTH) {
        setPlacasVehiculoError(`Las placas debe tener ${MIN_VEHICLE_LENGTH} caracteres.`);
      } else {
        setPlacasVehiculoError('');
      }
    }

  };

  return {
    nombreError,
    apellidoPError,
    apellidoMError,
    nombreUsuarioError,
    correoUsuarioError,
    
    contrasenaUsuarioError,
    confirmarContrasenaError,
    telefonoUsuarioError,
    placasVehiculoError,

    validateFields,
    validateField, // 👈 agregamos esto
    resetErrors,
  };
};
