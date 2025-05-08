import React, { useState } from "react";
import { Drawer, Button, Input, Form, DatePicker, Select, Typography, Radio, Checkbox } from "antd";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { setEstados } from "../../servicios/taskmasterservicios";

const CrearEstados = ({ open, onClose, listaEstados, espacioId, onEstadoCreado }) => {
    const [form] = Form.useForm();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [nombreEstado, setNombreEstado] = useState('');

    const handleCrearNuevoEstado = async () => {

        const nuevoEstado = {
                    espacio_id: espacioId, 
                    estado: nombreEstado,
                };
                
                try {
                    console.log("Datos a enviar para crear estado:", nuevoEstado);
                    const respuesta = await setEstados(nuevoEstado); 
            
                    if (respuesta && respuesta.id) {
                        
                        console.log("Estado creado con ID:", respuesta.id);
                        onEstadoCreado(); 
                        setOpenSnackbar({ open: true, message: 'Estado creado correctamente', severity: 'success' });
                        onClose(); 
        
                    } else {
                        
                        console.error("Error al crear el estado:", respuesta);
                        setOpenSnackbar({ open: true, message: 'Error al crear el estado', severity: 'error' });
        
                    }
                } catch (error) {
                    console.error("Error de conexión al crear el estado:", error);
                    setOpenSnackbar({ open: true, message: 'Error de conexión al crear el estado', severity: 'error' });
                }
            };
        

    return (
        <>
            <Drawer
                title={<div style={{ fontSize: '1em', fontFamily: "'Montserrat', sans-serif" }}>Crear Nuevo Estado</div>}
                width={500}
                onClose={onClose}
                open={open}
                style={{ backgroundColor: '#F9EAC3' }} 
                headerStyle={{ backgroundColor: '#2D572C', color: '#F9EAC3' }} 
            >
                <Form form={form} layout="vertical" sx={{ background: '#2D572C' }}>
                    <Form.Item
                        label="Nombre del Estado:"
                        name="estado"
                        value={nombreEstado}
                        onChange={(e) => setNombreEstado(e.target.value)}
                        rules={[{ required: true, message: "El nombre es requerido" }]}   
                    >
                        <Input placeholder="Ingrese el nombre del estado" />
                    </Form.Item>
                    <div style={{ textAlign: "right", display: 'flex', gap: 2,}}>
                        <Button onClick={handleCrearNuevoEstado} style={{ backgroundColor: '#2D572C', color: '#F3D301', "&:hover": { backgroundColor: '#F3D301', color: '#2D572C' },}}>Guardar</Button>
                        <Button onClick={onClose} style={{ backgroundColor: '#FD5653', color: '#FFF', width:'25%', "&:hover": { backgroundColor: '#FFFFFF', color: '#FD5653' },}}>X</Button>
                    </div>
                </Form>
            </Drawer>
            <Snackbar
                open={openSnackbar.open}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })} severity={openSnackbar.severity} sx={{ width: '100%' }}>
                    {openSnackbar.message}
                </MuiAlert>
            </Snackbar>            
        </>        

    );
};

export default CrearEstados;