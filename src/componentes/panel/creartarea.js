import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, DatePicker, Select, Typography, Radio, Checkbox } from "antd";
//import { Drawer, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Form } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import moment from 'moment';
import { setTareas } from "../../servicios/taskmasterservicios";

const CrearTareas = ({ open, onClose, espacioId, onTareaCreada, listaEstados, estadoInicial }) => {
    const [nombreTarea, setNombreTarea] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaVencimiento, setFechaVencimiento] = useState('');
    const [prioridad, setPrioridad] = useState(1);
    const [estadoSeleccionadoId, setEstadoSeleccionadoId] = useState('');
    const [nombreEstadoInicial, setNombreEstadoInicial] = useState(''); // Para mostrar el nombre
    const [estadosDisponibles, setEstadosDisponibles] = useState(listaEstados || []); // Usar la prop directamente
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [form] = Form.useForm();

    useEffect(() => {
        if (estadoInicial) {
            setEstadoSeleccionadoId(estadoInicial);
            const estadoEncontrado = listaEstados.find(estado => estado.id === estadoInicial);
            if (estadoEncontrado) {
                setNombreEstadoInicial(estadoEncontrado.estado);
                form.setFieldsValue({ estado: estadoEncontrado.estado });
            } else {
                setNombreEstadoInicial('');
                form.setFieldsValue({ estado: '' });
            }
        } else {
            setEstadoSeleccionadoId('');
            setNombreEstadoInicial('');
            form.setFieldsValue({ estado: '' });
        }
    }, [estadoInicial, listaEstados, form]);

    const handleEstadoChange = (event) => {
        setEstadoSeleccionadoId(event.target.value);
    };

    const handleCrearNuevaTarea = async () => {
        const nuevaTarea = {
            espacio_id: espacioId, // Obtienes el ID del espacio del localStorage o de donde lo tengas disponible
            estado_id: estadoSeleccionadoId, // El estado seleccionado por el usuario
            tarea: nombreTarea, // El nombre de la tarea ingresado
            descripcion: descripcion, // La descripción de la tarea ingresada
            fecha_vencimiento: fechaVencimiento ? fechaVencimiento : undefined, // La fecha de vencimiento ingresada (puede ser null)
            prioridad: prioridad, // La prioridad seleccionada
        };
        console.log("Datos que se envían al backend:", nuevaTarea);
        try {
            const respuesta = await setTareas(nuevaTarea); // Llama a tu servicio para crear la tarea
    
            if (respuesta && respuesta.id) {
                
                console.log("Tarea creada con ID:", respuesta.id);
                onTareaCreada(); 
                setOpenSnackbar({ open: true, message: 'Tarea creada correctamente', severity: 'success' });
                onClose(); 

            } else {
                
                console.error("Error al crear la tarea:", respuesta);
                setOpenSnackbar({ open: true, message: 'Error al crear la Tarea', severity: 'error' });

            }
        } catch (error) {
            console.error("Error de conexión al crear la tarea:", error);
            setOpenSnackbar({ open: true, message: 'Error de conexión al crear la Tarea', severity: 'error' });
        }
    };

    return (
        <>
            <Drawer
                title={<div style={{ fontSize: '1em', fontFamily: "'Montserrat', sans-serif" }}>Crear una Tarea</div>}
                width={500}
                onClose={onClose}
                open={open}
                placement="left"
                style={{ backgroundColor: '#F9EAC3' }} 
                headerStyle={{ backgroundColor: '#2D572C', color: '#F9EAC3' }} 
            >
                <Form form={form} layout="vertical" sx={{ background: '#2D572C' }}>
                    <Form.Item
                        label="Nombre de la Tarea:"
                        name="tarea"
                        value={nombreTarea}
                        onChange={(e) => setNombreTarea(e.target.value)}
                        rules={[{ required: true, message: "El nombre es requerido" }]}   
                    >
                        <Input placeholder="Ingrese el nombre de la tarea" />
                    </Form.Item>
                    <Form.Item
                        label="Estado:"
                        name="estado"
                        InputProps={{
                            readOnly: true,
                        }}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Fecha de Vencimiento"
                        name="fecha"
                        rules={[{ required: true, message: 'La fecha es requerida' }]}
                        value={fechaVencimiento}
                        onChange={(e) => setFechaVencimiento(e.target.value)}
                    >
                        <DatePicker style={{ width: '100%' }} placeholder="Seleccione la fecha" />
                    </Form.Item>
                    <Form.Item
                        label="Prioridad"
                        name="opcionSeleccionada"
                        rules={[{ required: true, message: 'Por favor, seleccione una opción' }]}
                        value={prioridad}
                        onChange={(e) => setPrioridad(parseInt(e.target.value))}
                    >
                        <Radio.Group>
                            <Radio value={1}>1</Radio>
                            <Radio value={2}>2</Radio>
                            <Radio value={3}>3</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="Descripción"
                        name="descripcion"
                        rules={[{ required: false, message: 'Por favor, ingrese una descripción' }]}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    >
                        <Input.TextArea rows={4} placeholder="Ingrese la descripción aquí" />
                    </Form.Item>
                    <div style={{ textAlign: "right", display: 'flex', gap: 2,}}>
                        <Button onClick={handleCrearNuevaTarea} style={{ backgroundColor: '#2D572C', color: '#F3D301', "&:hover": { backgroundColor: '#F3D301', color: '#2D572C' },}}>Guardar</Button>
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
export default CrearTareas;