import axios from "axios";  
import apiURL from "../componentes/UrlBackend";

// Crear instancia de axios:
const api = axios.create({
  baseURL: `${apiURL}api/`
});

// Interceptor para agregar token automáticamente:
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------------
// ESPACIOS
// ----------------------

export const getEspacios = async () => {
  const response = await api.get('espacios/');
  return response.data;
};

export const setEspacios = async (datos) => {
  console.log("Enviando datos a la API:", datos);
  try {
    console.log("Enviando datos a la API:", datos); // Verifica que los datos sean correctos
    const response = await api.post(`espacios/`, datos);
    console.log("Respuesta completa de la API:", response);  // Verifica toda la respuesta
    return response; // Asegúrate de que la respuesta sea devuelta
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    return null; // Devuelve null si ocurre un error, para manejarlo en el `handleSubmit`
  }
};

export const editEspacios = async (id, datos) => {
  const response = await api.put(`espacios/${id}/`, datos, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteEspacios = async (id) => {
  const response = await api.delete(`espacios/${id}/`);
  return response.data;
};

// ----------------------
// ESTADOS POR SERVICIO
// ----------------------

export const getEstadosPorEspacio = async (espacioId) => {
  const token = localStorage.getItem('access_token');
  try {
      const response = await api.get(`estadosxespacio/?espacioId=${espacioId}`, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });
      console.log("Data recibida del backend:", response.data); 
      return response.data;
  } catch (error) {
      console.error(`Error al obtener estados del espacio ${espacioId}:`, error);
      return [];
  }
};




// ----------------------
// ESTADOS
// ----------------------

export const getEstados = async () => {
  const response = await api.get('estados/');
  return response.data;
};

export const setEstados = async (datos) => {
  const response = await api.post('estados/', datos, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const editEstados = async (id, datos) => {
  const response = await api.put(`estados/${id}/`, datos, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteEstados = async (id) => {
  const response = await api.delete(`estados/${id}/`);
  return response.data;
};

// ----------------------
// TAREA
// ----------------------

export const getTareas = async (espacioId, estadoId) => {
  try {
      const response = await api.get(`/tareas/${espacioId}/${estadoId}/`);
      return response.data;
  } catch (error) {
      throw error;
  }
};

export const setTareas = async (datos) => {
  const response = await api.post('tareas/', datos, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const editTareas = async (id, datos) => {
  const response = await api.put(`tareas/${id}/`, datos, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteTareas = async (id) => {
  const response = await api.delete(`tareas/${id}/`);
  return response.data;
};