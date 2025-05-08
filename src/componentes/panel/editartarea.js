import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, DatePicker, Select, Typography, Radio, Checkbox } from "antd";
import { Box, Divider } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import moment from 'moment';
import { editTareas, deleteTareas } from "../../servicios/taskmasterservicios";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const EditarTareas = ({ tareaId, open, onClose, listaTareas, onActualizar, listaEstados, onTareaEliminada }) => {
    const [nombreTarea, setNombreTarea] = useState('');
    const [estadoId, setEstadoId] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [form] = Form.useForm();

    const categoriasConColor = [
        { label: 'Urgente', value: 'urgente', color: '#FD5653' },       // Rojo
        { label: 'Importante', value: 'importante', color: '#F3D301' },   // Amarillo
        { label: 'Opcional', value: 'opcional', color: '#2DB7F5' },     // Azul claro
        { label: 'Delegable', value: 'delegable', color: '#722ED1' },    // Morado
        { label: 'Rutina', value: 'rutina', color: '#70AD47' },        // Verde
        { label: 'Creativa', value: 'creativa', color: '#EB2F96' },     // Rosa
        { label: 'Estratégica', value: 'estrategica', color: '#1890FF' }, // Azul oscuro
        { label: 'De mantenimiento', value: 'mantenimiento', color: '#A6A6A6' }, // Gris
        { label: 'Personal', value: 'personal', color: '#FFA39E' },     // Salmón (adicional)
    ];


    useEffect(() => {
        if (tareaId && Object.keys(listaTareas).length > 0) {
            let tareaEncontrada = null;
            for (const estadoId in listaTareas) {
                const tarea = listaTareas[estadoId].find(t => parseInt(t.id) === parseInt(tareaId));
                if (tarea) {
                    tareaEncontrada = tarea;
                    break;
                }
            }
    
            console.log("tareaId recibido:", tareaId);
            console.log("Tarea encontrada:", tareaEncontrada);
    
            if (tareaEncontrada) {
                setNombreTarea(tareaEncontrada.tarea);
                setEstadoId(tareaEncontrada.estado.id);
    
                let initialValues = {
                    tarea: tareaEncontrada.tarea,
                    estado: tareaEncontrada.estado.id,
                    descripcion: tareaEncontrada.descripcion,
                    fecha: tareaEncontrada.fecha_vencimiento ? moment(tareaEncontrada.fecha_vencimiento) : null,
                    opcionSeleccionada: tareaEncontrada.prioridad,
                };
    
                if (tareaEncontrada.categoría) {
                    const categoriasArray = tareaEncontrada.categoría.split(',').map(cat => cat.trim().toLowerCase()); // Convertir a minúsculas
                    console.log("Categorias del backend (en minúsculas):", categoriasArray);
                    const categoriasSeleccionadas = categoriasArray.filter(cat => {
                        const match = categoriasConColor.some(c => c.label.toLowerCase() === cat); // Comparar en minúsculas
                        console.log(`Comparando "${cat}" con etiquetas (en minúsculas):`, categoriasConColor.map(c => c.label.toLowerCase()), "Resultado:", match);
                        return match;
                    }).map(catLabel => {
                        const found = categoriasConColor.find(c => c.label.toLowerCase() === catLabel); // Buscar por etiqueta en minúsculas
                        console.log(`Buscando valor para "${catLabel}":`, found);
                        return found?.value;
                    }).filter(Boolean);
                    initialValues = { ...initialValues, categoriasSeleccionadas: categoriasSeleccionadas };
                } else {
                    initialValues = { ...initialValues, categoriasSeleccionadas: [] };
                }
    
                console.log("Valores iniciales a establecer:", initialValues);
                form.setFieldsValue(initialValues);
            } else {
                setNombreTarea('');
                setEstadoId(null);
                form.resetFields();
            }
        } else {
            setNombreTarea('');
            setEstadoId(null);
            form.resetFields();
        }
    }, [tareaId, listaTareas, form, categoriasConColor]);

    useEffect(() => {
        if (!open) {
            setNombreTarea('');
            setEstadoId(null);
            form.resetFields();
        }
    }, [open, form]);

    const guardarTarea = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                "id": parseInt(tareaId, 10),
                "tarea": values.tarea,
                "estado": parseInt(values.estado, 10),
                "descripcion": values.descripcion,
                "fecha_vencimiento": values.fecha ? values.fecha.format('YYYY-MM-DD') : null, // Formatea la fecha al formato de Django
                "prioridad": parseInt(values.opcionSeleccionada, 10),
                "categoría": values.categoriasSeleccionadas ? values.categoriasSeleccionadas.join(', ') : '', // Convierte el array de categorías a una cadena separada por comas
                "espacio": localStorage.getItem("espacioId"),
            };
            console.log("Datos enviados para editar:", data);
    
            await editTareas(tareaId, data);
            await onActualizar();
            setOpenSnackbar({ open: true, message: 'Tarea actualizada correctamente', severity: 'success' });
            onClose();
        } catch (error) {
            console.error('Error al editar la tarea:', error);
            setOpenSnackbar({ open: true, message: 'Error al actualizar la Tarea', severity: 'error' });
        }
    };

    const handleEliminarClick = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            try {
                // Opcional: desactivar el botón de eliminar o mostrar un loading mientras se procesa
                setOpenSnackbar({ open: true, message: 'Eliminando tarea...', severity: 'info' });
    
                // Intentar eliminar la tarea
                await deleteTareas(id);
                
                // Recargar la lista de tareas
                await onTareaEliminada();
                onClose();
                
                // Mostrar mensaje de éxito
                setOpenSnackbar({ open: true, message: 'Tarea eliminada correctamente.', severity: 'success' });
    
            } catch (error) {
                // Mostrar error en consola y también al usuario
                console.error('Error al eliminar:', error);
                setOpenSnackbar({ open: true, message: 'Error al eliminar la tarea.', severity: 'error' });
            }
        }
    };

    return (
        <>
            <Drawer
                title={<div style={{ fontSize: '1em', fontFamily: "'Montserrat', sans-serif" }}>Editar Tarea: {setNombreTarea}</div>}
                width={600}
                onClose={onClose}
                open={open}
                placement="left"
                style={{ backgroundColor: '#F9EAC3' }} 
                headerStyle={{ backgroundColor: '#2D572C', color: '#F9EAC3' }} 
            >
                <Form form={form} layout="vertical" sx={{ background: '#2D572C' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{color:'#2D572C', fontFamily: "'Montserrat', sans-serif" }}>
                            <Form.Item
                                label="Nombre de la Tarea:"
                                name="tarea"
                                rules={[{ required: true, message: "El nombre es requerido" }]}   
                            >
                                <Input placeholder="Ingrese el nombre de la tarea" />
                            </Form.Item>
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                                <Typography style={{ fontSize: '1em', color: '#2D572C', fontFamily: "'Montserrat', sans-serif", mt: 2 }}>
                                    en el estado:
                                </Typography>
                                <Form.Item label="" name="estado" rules={[{ required: true, message: "El estado es requerido" }]}>
                                    <Select
                                        placeholder="Seleccione el estado"
                                        style={{
                                            width: '150px',
                                            border: 'none',
                                            borderRadius: '4px',
                                        }}
                                        dropdownStyle={{
                                            border: 'none',
                                            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        {listaEstados.map(estado => (
                                            <Select.Option key={estado.id} value={estado.id} label={estado.estado}>
                                                {estado.estado}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Form.Item
                                    label="Fecha de Vencimiento"
                                    name="fecha"
                                    rules={[{ required: true, message: 'La fecha es requerida' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} placeholder="Seleccione la fecha" />
                                </Form.Item>
                                <Form.Item
                                    label="Prioridad"
                                    name="opcionSeleccionada"
                                    rules={[{ required: true, message: 'Por favor, seleccione una opción' }]}
                                >
                                    <Radio.Group>
                                        <Radio value={1}>1</Radio>
                                        <Radio value={2}>2</Radio>
                                        <Radio value={3}>3</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Box>
                            <Form.Item
                                label="Descripción"
                                name="descripcion"
                                rules={[{ required: false, message: 'Por favor, ingrese una descripción' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Ingrese la descripción aquí" />
                            </Form.Item>
                        </Box>
                        <Divider orientation="vertical" sx={{border: '1px solid #808080', height: '70vh', mx: '10px'}}/>
                        <Box>
                            <Form.Item
                                label="Categorías"
                                name="categoriasSeleccionadas"
                                rules={[{ required: false, message: 'Por favor, seleccione al menos una categoría' }]}
                            >
                                <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                                    {categoriasConColor.map(categoria => (
                                        <Checkbox
                                            key={categoria.value}
                                            value={categoria.value}
                                            style={{
                                                color: categoria.color,
                                                marginBottom: 8,
                                            }}
                                        >
                                            {categoria.label}
                                        </Checkbox>
                                    ))}
                                </Checkbox.Group>
                            </Form.Item>
                        </Box>
                    </Box>
                    <div style={{ textAlign: "right", display: 'flex', gap: 2,}}>
                        <Button onClick={guardarTarea} style={{ backgroundColor: '#2D572C', color: '#F3D301', "&:hover": { backgroundColor: '#F3D301', color: '#2D572C' },}}>Guardar</Button>
                        <Button onClick={onClose} style={{ backgroundColor: '#FD5653', color: '#FFF', width:'25%', "&:hover": { backgroundColor: '#FFFFFF', color: '#FD5653' },}}>X</Button>
                    </div>
                    <Divider sx={{border: '1px solid #808080', my: '10px'}}/>
                    <Button startIcon={<DeleteOutlineIcon />} onClick={() => handleEliminarClick(tareaId)} style={{ backgroundColor: '#000', color: '#fff', "&:hover": { backgroundColor: '#FD5653', color: '#fff' },}}>Eliminar Tarea</Button>
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

export default EditarTareas;