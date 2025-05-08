import axios from "axios";
import apiURL from "../componentes/UrlBackend";

export const loginUser = async (username, password) => {
    const respuesta = await axios.post(`${apiURL}api/token/`, {
      username: username,
      password: password
    });
    localStorage.setItem('token',respuesta.data.access);

    return respuesta.data;
};

export const logoutUser = async () => {
  localStorage.removeItem('token');
};

export const registro = async (datos) => {
    const respuesta = await axios.post(`${apiURL}api/registro/`, {
      datos,
    });
    return respuesta.data;
}

export const obtenerPerfil = async () => {
  const respuesta = await axios.get(`${apiURL}api/editarperfil/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    mode: 'no-cors'
  });
  console.log(respuesta.data);
  return respuesta.data;
}