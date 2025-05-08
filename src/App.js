import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./componentes/index/index.js";
import Registro from "./componentes/cuenta/registro.js";
import Login from "./componentes/cuenta/login.js";
import Espacios from "./componentes/espacios/espacios.js";
import Seleccionador from "./componentes/espacios/sel_espacios.js";
import Estados from "./componentes/estados/estados.js";
import Tareas from "./componentes/tareas/tareas.js";
import Panel from "./componentes/panel/panel.js";
import Perfil from "./componentes/cuenta/perfil.js";
import CambiarPassword from "./componentes/cuenta/cambiarpassword.js";
import RecuperarPassword from "./componentes/cuenta/recuperarpassword.js";

import './App.css';
import ProtectedRoute from './servicios/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/espacios" element={<ProtectedRoute><Espacios /></ProtectedRoute>} />
        <Route path="/estados" element={<ProtectedRoute><Estados /></ProtectedRoute>} />
        <Route path="/tareas" element={<ProtectedRoute><Tareas /></ProtectedRoute>} />
        <Route path="/panel" element={<ProtectedRoute><Panel /></ProtectedRoute>} />
        <Route path="/sel_espacios" element={<ProtectedRoute><Seleccionador /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/cambiar-password" element={<ProtectedRoute><CambiarPassword /></ProtectedRoute>} />
        
      </Routes>
    </Router>
  );
}

export default App;
