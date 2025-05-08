import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setTareas } from "../../servicios/taskmasterservicios";
import apiURL from "../UrlBackend";
import tareasImg from '../../assets/04_tareas.jpg';
import { Box } from "@mui/material";

const Tareas = () => {
    const navigate = useNavigate();
    const [tareas, setTarea] = useState({
        tarea_1: "",
        tarea_2: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Tareas a guardar:", tareas);

        const espacioId = localStorage.getItem("espacioId"); 
        const estadoId = localStorage.getItem("estadoId"); 

        try {
            // Guardar cada estado por separado (en 3 requests)
            await setTareas({ tarea: tareas.tarea_1, espacio_id: espacioId, estado_id: estadoId });
            await setTareas({ tarea: tareas.tarea_2, espacio_id: espacioId, estado_id: estadoId });
            
            console.log("Tareas guardadas correctamente");
    
            navigate("/Panel");
        } catch (error) {
            console.error("Error al guardar las tareas:", error);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
            <Box className="col-md-6">
                <h3>¿Cual es el elemento base de tu espacio?:</h3>
                <h6 className="descripciones-h6" style={{textAlign: 'justify'}}>
                    Todas tus actividades, pendientes, en curso, en pausa o terminadas,
                    llamemoslas tareas. Puedes tambien administrarlas, asignales una fecha de 
                    vencimiento y una prioridad, y tendrás todo bajo control.
                    Nombra tus dos primeras tareas de tu estado: {localStorage.getItem("estadoNombre")}
                    <br/>
                </h6>
                <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="estado" className="form-label">
                        Nombre de la tarea 1:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="tarea_1"
                        name="tarea_1"
                        value={tareas.tarea_1}
                        onChange={(e) => setTarea({ ...tareas, tarea_1: e.target.value })}
                        placeholder="ej: Inicio de Requerimiento"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="estado" className="form-label">
                        Nombre de la tarea 2:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="tarea_2"
                        name="tarea_2"
                        value={tareas.tarea_2}
                        onChange={(e) => setTarea({ ...tareas, tarea_2: e.target.value })}
                        placeholder="ej: Reunión de Equipo"
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
                <img src={tareasImg} alt="Estados" className="img-fluid" style={{ borderRadius: '10px' }} />
            </Box>
        </Box>
    );
};

export default Tareas;