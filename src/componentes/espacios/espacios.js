import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setEspacios } from "../../servicios/taskmasterservicios";
import { Box } from "@mui/material";
import espaciosImg from '../../assets/02_espacios.jpg';

const Espacios = () => {
  const [espacios, setEspacio] = useState({ espacio: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;  // Si ya está en proceso, no hace nada

    console.log("handleSubmit se ha ejecutado");
    console.log("Nombre del espacio a guardar:", espacios);

    const nombreUsuario = localStorage.getItem("nombreUsuario");

    const datosAGuardar = {
      espacio: espacios.espacio,
      usuario: nombreUsuario,
    };

    console.log("Datos a guardar:", datosAGuardar);

    setLoading(true); // Marca como "cargando"

    try {
      const response = await setEspacios(datosAGuardar);
      console.log("Respuesta de setEspacios:", response);

      if (response?.status === 201) {
        console.log("Espacio guardado correctamente.");
        // Asumiendo que la respuesta contiene el ID del espacio en la propiedad 'id' o similar
        const espacioId = response.data?.id; // Ajusta esto según la estructura de tu respuesta
        if (espacioId) {
          localStorage.setItem("espacioId", espacioId);
          console.log("ID del espacio guardado en localStorage:", espacioId);
          navigate("/estados");
        } else {
          console.error("No se recibió el ID del espacio en la respuesta.");
          alert("Hubo un problema al guardar el espacio.");
        }
      } else {
        console.error("Hubo un problema al guardar el espacio:", response);
        alert("Hubo un problema al guardar el espacio");
      }
    } catch (error) {
      console.error("Error al guardar el espacio:", error);
      alert("Hubo un problema al guardar el espacio, por favor intente nuevamente.");
    } finally {
      setLoading(false); // Termina el proceso de "cargando"
    }
  };


  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <Box className="col-md-6">
        <h3>Tu espacio es el inicio de todo:</h3>
        <h6 className="descripciones-h6" style={{ textAlign: 'justify' }}>
          Aquí en Taskmaster administras tus espacios y actividades.<br />
          En ellos encontrarás todo lo que necesitas para administrar tus tareas
          y sus tarjetas, los estados, fechas de vencimientos,
          la prioridad y cualquier otro detalle que necesites
          para tener tus tareas bajo control y cumplir con tus objetivos.<br />
        </h6>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="espacio" className="form-label">
              Introduce el nombre de tu espacio:
            </label>
            <input
              type="text"
              className="form-control"
              id="espacio"
              name="espacio"
              value={espacios.espacio}
              onChange={(e) => {
                setEspacio(prev => ({ ...prev, espacio: e.target.value }));
                console.log("Estado 'espacios' después de onChange:", e.target.value);
              }}
              placeholder="ej: Mi primer espacio"
            />
          </div>
          <button
            type="submit"
            className="btn boton-primario-personalizado"
            style={{ width: "100%", padding: "10px", backgroundColor: "#70AD47", color: '#fff', '&:hover': { backgroundColor: '#F3D301' } }}
          >
            Siguiente
          </button>
        </form>
      </Box>
      <Box className="col-md-5">
        <img src={espaciosImg} alt="Espacios" className="img-fluid" style={{ borderRadius: '10px' }} />
      </Box>
    </Box>
  );
};

export default Espacios;