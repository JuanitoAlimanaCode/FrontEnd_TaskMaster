import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, Typography } from "antd";
import { Divider } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { editEstados, deleteEstados } from "../../servicios/taskmasterservicios";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const EditarEstados = ({ open, onClose, estadoId, onEstadoCreado, nombreEstadoInicial }) => {
    const [form] = Form.useForm();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [nombreEstado, setNombreEstado] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Open:", open, "Estado ID:", estadoId, "Nombre Inicial:", nombreEstadoInicial);
        const cargarEstadoParaEditar = async () => {
            if (open && estadoId) {
                setLoading(true);
                try {
                    setNombreEstado(nombreEstadoInicial || '');
                    form.setFieldsValue({ estado: nombreEstadoInicial || '' });
                    setLoading(false);
                } catch (error) {
                    console.error("Error al cargar el estado:", error);
                    setSnackbarMessage('Error al cargar la información del estado.');
                    setSeverity('error');
                    setOpenSnackbar(true);
                    onClose();
                    setLoading(false);
                }
            } else if (!open) {
                form.resetFields();
                setNombreEstado('');
            }
        };
        cargarEstadoParaEditar();
    }, [open, estadoId, form, onClose, nombreEstadoInicial]);


    const handleEditarEstado = async () => {
        try {
            const values = await form.validateFields();
            const dataToSend = {
                estado: values.estado,
                espacio: localStorage.getItem("espacioId")
            };
            const respuesta = await editEstados(estadoId, dataToSend);
    
            if (respuesta && respuesta.id) {
                onEstadoCreado();
                setOpenSnackbar({ open: true, message: 'Estado editado correctamente', severity: 'success' });
                onClose();
            } else {
                setOpenSnackbar({ open: true, message: 'Error al editar el estado', severity: 'error' });
            }
        } catch (error) {
            console.error("Error:", error);
            setOpenSnackbar({ open: true, message: 'Error de conexión o validación', severity: 'error' });
        }
    };

    const handleEliminarClick = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este estado?')) {
            try {
                // Opcional: desactivar el botón de eliminar o mostrar un loading mientras se procesa
                setOpenSnackbar({ open: true, message: 'Eliminando estado...', severity: 'info' });
    
                // Intentar eliminar la tarea
                await deleteEstados(id);
                
                // Recargar la lista de tareas
                await onEstadoCreado();
                onClose();
                
                // Mostrar mensaje de éxito
                setOpenSnackbar({ open: true, message: 'Estado eliminado correctamente.', severity: 'success' });
    
            } catch (error) {
                // Mostrar error en consola y también al usuario
                console.error('Error al eliminar:', error);
                setOpenSnackbar({ open: true, message: 'Error al eliminar el estado.', severity: 'error' });
            }
        }
    };
    

    if (loading && open) {
        return (
            <Drawer
                title={<div style={{ fontSize: '1em', fontFamily: "'Montserrat', sans-serif" }}>Editar Estado</div>}
                width={500}
                onClose={onClose}
                open={open}
                style={{ backgroundColor: '#F9EAC3' }}
                headerStyle={{ backgroundColor: '#2D572C', color: '#F9EAC3' }}
            >
                <Typography.Paragraph>Cargando información del estado...</Typography.Paragraph>
            </Drawer>
        );
    }

    return (
        <>
            <Drawer
                title={<div style={{ fontSize: '1em', fontFamily: "'Montserrat', sans-serif" }}>Editar Estado</div>}
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
                        rules={[{ required: true, message: "El nombre es requerido" }]}
                    >
                        <Input/>
                    </Form.Item>
                    <div style={{ textAlign: "right", display: 'flex', gap: 2 }}>
                        <Button onClick={handleEditarEstado} style={{ backgroundColor: '#2D572C', color: '#F3D301', "&:hover": { backgroundColor: '#F3D301', color: '#2D572C' }, }}>Guardar</Button>
                        <Button onClick={onClose} style={{ backgroundColor: '#FD5653', color: '#FFF', width: '25%', "&:hover": { backgroundColor: '#FFFFFF', color: '#FD5653' }, }}>X</Button>
                    </div>
                    <Divider sx={{border: '1px solid #808080', my: '10px'}}/>
                    <Button startIcon={<DeleteOutlineIcon />} onClick={() => handleEliminarClick(estadoId)} style={{ backgroundColor: '#000', color: '#fff', "&:hover": { backgroundColor: '#FD5653', color: '#fff' },}}>Eliminar Estado</Button>
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

export default EditarEstados;