import React, { useState } from "react";
import { Drawer, Button, Input, Form, message } from "antd";
import { setEspacios } from "../../servicios/taskmasterservicios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const AgregarEspacios = ({ open, onClose, onActualizar }) => {
    
    const [formulario] = Form.useForm();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const nombreUsuario = localStorage.getItem("nombreUsuario");

    const guardarEspacios = async (values) => {
        try {
          
            const datosParaEnviar = { ...values, usuario: nombreUsuario };
            const response = await setEspacios(datosParaEnviar);
    
            formulario.resetFields();
            await onActualizar();
            onClose();
            setOpenSnackbar(true);
            } catch (error) {
            console.error('Error', error.response?.data);
            if (error.response?.data?.grupocliente) {
                message.error("Ya existe un espacio con ese nombre");
            } else {
                message.error("Ocurrió un error al guardar el espacio");
            }  
        }
      };

    return (
    <>
        <Drawer
        title={<div style={{ fontSize: '1em', color: '#2D572C', fontFamily: "'Montserrat', sans-serif" }}>Crear Nuevo Espacio</div>}
        width={350}
        onClose={onClose}
        open={open}
        placement="left"
        >
        <Form style={{ width: '100%' }}
            form={formulario}
            layout="vertical"
            onFinish={guardarEspacios}
        >
            <Form.Item
            label="Nombre del Espacio"
            name="espacio"
            rules={[{ required: true, message: "El espacio es requerido" }]}
            >
            <Input placeholder="Ingrese el nombre del espacio" />
            </Form.Item>
            <div style={{ textAlign: "right", display: 'flex', gap: 2,}}>
                <Button onClick={() => formulario.submit()} style={{ backgroundColor: '#2D572C', color: '#F3D301', "&:hover": { backgroundColor: '#F3D301', color: '#2D572C' },}}>Guardar</Button>
                <Button onClick={onClose} style={{ backgroundColor: '#FD5653', color: '#FFF', width:'25%', "&:hover": { backgroundColor: '#FFFFFF', color: '#FD5653' },}}>X</Button>
            </div>            
        </Form>
        </Drawer>

        <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
        <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            Espacio Creado Correctamente
        </MuiAlert>
        </Snackbar>
    </>
    );

};
export default AgregarEspacios;