import React, { useState, useEffect } from 'react';
import NavBar_start from "../index/navbar_start";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo200.png';
import Button from 'react-bootstrap/Button';
import { FaArrowRight } from 'react-icons/fa';

function Index() {
    
    return (
        <>
            <NavBar_start />
            <Box className="contenedor-main">
                <Box className="col-md-7">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <img src={logo} alt="TaskMaster Logo" style={{ width: '20px', height: '20px', marginRight: '10px' }} /><h4>TaskMaster</h4>
                    </Box>
                    <h1>Domina tus pendientes con TaskMaster</h1>
                    <h6>Tu aliado para una gestión eficiente, que te da la tranquilidad de tener todo bajo control, y una ejecución impecable, asegurando que cada tarea se complete a la perfección.</h6>
                    <Button href="Registro" className="btn-registro-main">Registrarse Ahora <FaArrowRight /></Button>

                </Box>
            </Box>
        </>
    );
}

export default Index;