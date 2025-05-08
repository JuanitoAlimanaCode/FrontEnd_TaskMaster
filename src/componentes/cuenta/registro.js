import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registro } from "../../servicios/cuentaservicios";
import apiURL from "../UrlBackend";
import registroImg from '../../assets/01_registro.jpg';
import { Box } from "@mui/material";

function PaginatedForm({ onSubmit, initialUser }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({
    username: initialUser || '',
    first_name: '',
    last_name: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialUser && currentPage === 1) {
      setFormData(prev => ({ ...prev, username: initialUser }));
      // No avanzar automáticamente aquí
    }
  }, [initialUser, currentPage]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'username') {
      setEmailError('');
      if (!value.trim()) {
        setEmailError('Debes ingresar un correo electrónico.');
      } else if (!validateEmail(value)) {
        setEmailError('Debes ingresar un correo electrónico válido.');
      } else {
        setEmailError('');
      }
    }
  };

  const nextStep = async () => {
    if (currentPage === 1) {
      const email = formData.username.trim();

      if (!email) {
        setEmailError('Debes ingresar un correo electrónico.');
        return;
      }

      if (!validateEmail(email)) {
        setEmailError('Debes ingresar un correo electrónico válido.');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${apiURL}api/validausuario/?username=${email}`);
        const data = response.data;

        if (data.existe) {
          setEmailError('Este correo ya está registrado.');
          setLoading(false);
          return;
        }

        setEmailError('');
        setCurrentPage((prev) => prev + 1);
      } catch (error) {
        console.error('Error verificando usuario:', error);
        setEmailError('Error al verificar el correo.');
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSubmitInner = async (e) => {
    e.preventDefault();
    const { username, first_name, last_name, password } = formData;

    try {
      await onSubmit({
        username,
        first_name,
        last_name,
        password
      });
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">
                Correo Electronico
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="nombre@empresa.com"
              />
            </div>
            {emailError && (
              <div style={{ color: 'red', fontSize: '14px' }}>{emailError}</div>
            )}
            <button
              type="button"
              className="btn boton-primario-personalizado"
              onClick={nextStep}
              style={{ width: "100%", padding: "10px", backgroundColor: "#70AD47", color: '#fff', '&:hover': { backgroundColor: '#F3D301' } }}
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Siguiente'}
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="mb-3">
              <label htmlFor="first_name" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Tu nombre"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="last_name" className="form-label">
                Apellido
              </label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Tu apellido"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Crea una contraseña"
              />
            </div>

            <div className="d-flex justify-content-between gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                Anterior
              </button>

              <button type="submit" className="btn btn-primary boton-primario-personalizado">
                Registrarse
              </button>
            </div>
          </div>
        );
      default:
        return <p>¡Usuario creado con éxito, puedes iniciar sesión!</p>;
    }
  };

  return (
    <form onSubmit={handleSubmitInner}>
      {renderPage()}
    </form>
  );
}

const Registro = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [isFirstStep, setIsFirstStep] = useState(true);

  const handleInitialSubmit = (event) => {
    event.preventDefault();
    setIsFirstStep(false);
  };

  const handleFullRegistration = (formData) => {
    console.log("Datos completos del registro:", formData);
    registro(formData)
      .then(response => {
        console.log("Registro exitoso:", response.data);
        alert('Usuario registrado! Ya puedes iniciar sesión.');
        navigate('/');
      })
      .catch(error => {
        console.error("Error en el registro:", error);
        alert('Error al registrar el usuario.');
      });
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
        <Box className="col-md-6">
          <h3>Bienvenido a TaskMaster</h3>
          <h6>Transforma tus tareas diarias en un flujo de trabajo optimizado.<br />Empieza ahora.</h6>
          {isFirstStep ? (
            <form onSubmit={handleInitialSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Correo Electronico</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="nombre@empresa.com"
                />
              </div>
              <button type="submit" className="btn boton-primario-personalizado">Siguiente</button>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <br/><br/><h6>¿Ya tienes cuenta? </h6><h6><a href="Login" style={{ marginLeft: '5px' }}>Inicia Sesión</a></h6>
              </div>
            </form>
          ) : (
            <PaginatedForm onSubmit={handleFullRegistration} initialUser={username} />
          )}
        </Box>
        <Box className="col-md-5">
          <img src={registroImg} alt="Registro" className="img-fluid" style={{ borderRadius: '10px' }} />
        </Box>
      </Box>
    </>
  );
};

export default Registro;