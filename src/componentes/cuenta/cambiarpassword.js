import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "axios";
import apiURL from "../UrlBackend";
import { useNavigate } from "react-router-dom";
import NavBar from "../index/navbar";


const CambiarPassword = () => {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const manejarCambio = async () => {
    if (nueva !== confirmar) {
      setError("Las contraseñas no coinciden");
      setMensaje("");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // o donde sea que lo tengas guardado
      const response = await axios.put(`${apiURL}api/cambiar-password/`, {
        password_actual: actual,
        nueva_password: nueva,
        confirmar_password: confirmar,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    
      setMensaje("Contraseña cambiada con éxito");
      setError("");
      setTimeout(() => {
        navigate("/perfil");
      }, 1500);
      setActual("");
      setNueva("");
      setConfirmar("");
    } catch (err) {
      setError("Error al cambiar la contraseña");
      setMensaje("");
    }
  };

  return (
    <>
      <NavBar />    
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
        <Typography variant="h5" mb={2}>
          Cambiar Contraseña
        </Typography>

        {mensaje && <Alert severity="success">{mensaje}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Contraseña actual"
          type="password"
          fullWidth
          margin="normal"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
        />

        <TextField
          label="Nueva contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
        />

        <TextField
          label="Confirmar nueva contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: "#2D572C", color: "#fff" }}
          onClick={manejarCambio}
        >
          Guardar nueva contraseña
        </Button>
      </Box>
    </>
  );
};

export default CambiarPassword;
