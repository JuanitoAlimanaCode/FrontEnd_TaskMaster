import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, AppBar, Toolbar  } from "@mui/material";
import axios from "axios";
import apiURL from "../UrlBackend";
import logo from "../../assets/logo.png";
import Cookies from 'js-cookie';

const RecuperarPassword = () => {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const enviarCorreo = async () => {
    try {
      const csrfToken = Cookies.get('csrftoken');
      await axios.post(`${apiURL}api/password-reset/`, {
        email: correo
      }, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });
      setMensaje("Si el correo existe, se ha enviado un enlace para restablecer la contraseña.");
      setError("");
    } catch (err) {
      setError("Error al enviar el correo de recuperación.");
      setMensaje("");
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
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
        <Typography variant="h5" mb={2}>Recuperar Contraseña</Typography>

        {mensaje && <Alert severity="success">{mensaje}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Correo electrónico"
          fullWidth
          margin="normal"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: "#2D572C", color: "#fff" }}
          onClick={enviarCorreo}
        >
          Enviar enlace
        </Button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <h6>¿Aún no tienes cuenta? </h6><h6><a href="/registro/" style={{ marginLeft: '5px' }}>Registrate Ahora</a></h6>
        </div>
      </Box>
    </>
  );
};

export default RecuperarPassword;
