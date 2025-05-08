import React, { useState, useEffect } from "react";
import { loginUser } from "../../servicios/cuentaservicios";
import { Box, AppBar, Toolbar } from "@mui/material";
import Button from 'react-bootstrap/Button';
import { apiURL } from "../UrlBackend";
import { useNavigate } from "react-router-dom";
import { getEspacios} from "../../servicios/taskmasterservicios";
import logo from "../../assets/logo.png";
import logo200 from "../../assets/logo200.png";


const Login = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [espacios, setEspaciosState] = useState([]);

    const accionLogin = async (e) => {
        e.preventDefault();
        console.log("Enviando:", { username, password });
        try {
            const respuetaUsuario = await loginUser(username, password);
            
            localStorage.setItem('token', respuetaUsuario.access);
            localStorage.setItem('access_token', respuetaUsuario.access);
            localStorage.setItem('refresh_token', respuetaUsuario.refresh);
            localStorage.setItem("nombreUsuario", username);

            if (respuetaUsuario.access) {
                obtenerEspaciosDelUsuario(username);
            } else {
                setEmailError("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            console.error("Error al iniciar sesión", error);
            setEmailError("Error al iniciar sesión");
        }
    };

    const obtenerEspaciosDelUsuario = async (usuario) => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await getEspacios(usuario);
            setEspaciosState(response);

            if (response && response.length > 0) {
                navigate('/sel_espacios');
            } else {
                navigate('/espacios');
            }
        } catch (error) {
            console.error("Error al obtener los espacios del usuario:", error);
            navigate('/espacios'); 
        }
    };


    return (
        <>
        <Box sx={{ display: 'flex', justifyContent:'center'}}>
            <AppBar position="static" sx={{ backgroundColor: "#cdcdcd", mt: -1  }}>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        <img src={logo} alt="TaskMaster Logo" style={{ width: '20px', height: '20px', marginRight: '10px' }} /><h5 href="/">TaskMaster</h5>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
        <Box className="contenedor-main">
            <Box className="col-md-7">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <img src={logo200} alt="TaskMaster Logo" style={{ width: '70px', height: '70px', marginBottom: '20px' }} />
                </Box>
                <h3>Inicia Sesión en tu Espacio</h3>
                <h6>Ingresa tu dirección de correo electrónico para empezar.</h6>
                <form onSubmit={accionLogin}>
                <div className="mb-3">
                <label htmlFor="usuario" className="form-label">
                    Correo Electronico
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingresa tu correo electrónico"
                />
                </div>
                <div className="mb-3"></div>
                    <label htmlFor="password" className="form-label">
                    Contraseña
                </label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                />
                <div/>   
                {emailError && (
                    <div style={{ color: 'red', fontSize: '14px' }}>{emailError}</div>
                )}         
                <Button type="submit" className="btn-registro-main">
                    Iniciar Sesión
                </Button>
                <br/>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h6><a href="/recuperar-password/" style={{ marginLeft: '5px' }}>¿Olvidaste tu contraseña? </a></h6>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h6>¿Aún no tienes cuenta? </h6><h6><a href="Registro" style={{ marginLeft: '5px' }}>Registrate Ahora</a></h6>
                </div>
                </form>
            </Box>
        </Box>
        </>
    );
};

export default Login;
