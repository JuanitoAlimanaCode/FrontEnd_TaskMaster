import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setEstados } from "../../servicios/taskmasterservicios";
import apiURL from "../UrlBackend";
import estadosImg from '../../assets/03_estados.jpg';
import { Box } from "@mui/material";

const Estados = () => {
  const navigate = useNavigate();
  const [estados, setEstado] = useState({
    estado_1: "",
    estado_2: "",
    estado_3: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Estados a guardar:", estados);

    const espacioId = localStorage.getItem("espacioId"); // Obtener el ID del espacio

    if (!espacioId) {
      console.error("No se encontró el ID del espacio en el localStorage.");
      alert("Hubo un problema al obtener el ID del espacio. Por favor, regresa a la página de creación de espacio.");
      return;
    }

    try {
      // Guardar el primer estado y obtener su respuesta
      const response1 = await setEstados({ estado: estados.estado_1, espacio_id: espacioId });
      console.log("Respuesta de setEstados:", response1.data);
      if (response1) {
        console.log("Primer estado guardado correctamente:", estados.estado_1);
        const estadoId = response1.id;
        console.log("ID del primer estado:", estadoId);
        
        if (estadoId) {
          localStorage.setItem("estadoId", estadoId); // Guarda el ID del primer estado
          localStorage.setItem("estadoNombre", estados.estado_1); // Guarda el nombre del primer estado
        } else {
          console.error("No se recibió el ID del primer estado en la respuesta.");
          alert("Hubo un problema al guardar el primer estado.");
          return; // Detener la ejecución si no se recibe el ID
        }
      } else {
        console.error("Hubo un problema al guardar el primer estado:", response1);
        alert("Hubo un problema al guardar el primer estado");
        return; // Detener la ejecución si hay un error con el primer estado
      }

      // Guardar los otros estados
      await setEstados({ estado: estados.estado_2, espacio_id: espacioId });
      await setEstados({ estado: estados.estado_3, espacio_id: espacioId });

      console.log("Otros estados guardados correctamente.");
      navigate("/Tareas");

    } catch (error) {
      console.error("Error al guardar los estados:", error);
      alert("Hubo un problema al guardar los estados. Por favor, intenta nuevamente.");
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <Box className="col-md-6">
        <h3>Define los estados que quieres manejar en tu espacio:</h3>
        <h6 className="descripciones-h6" style={{textAlign: 'justify'}}>
          Cada estado representa una fase de tu progreso,
          y puedes agregar tareas, ideas, hitos y detalles para organizar tu trabajo.
          <br/>
        </h6>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="estado" className="form-label">
              Introduce el nombre de tus estados:
            </label>
            <input
              type="text"
              className="form-control"
              id="estado_1"
              name="estado_1"
              value={estados.estado_1}
              onChange={(e) => setEstado({ ...estados, estado_1: e.target.value })}
              placeholder="ej: Tareas Pendientes"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="estado_2"
              name="estado_2"
              value={estados.estado_2}
              onChange={(e) => setEstado({ ...estados, estado_2: e.target.value })}
              placeholder="ej: Tareas en Curso"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="estado_3"
              name="estado_3"
              value={estados.estado_3}
              onChange={(e) => setEstado({ ...estados, estado_3: e.target.value })}
              placeholder="ej: Tareas Terminadas"
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
        <img src={estadosImg} alt="Estados" className="img-fluid" style={{ borderRadius: '10px' }} />
      </Box>
    </Box>
  );
};

export default Estados;