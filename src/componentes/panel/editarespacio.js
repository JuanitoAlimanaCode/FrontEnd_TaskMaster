import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, Typography } from "antd";
import { Divider } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { editEspacios, deleteEspacios } from "../../servicios/taskmasterservicios"; // Asegúrate de crear estos servicios
import { useNavigate  } from "react-router-dom";

const EditarEspacios = ({ open, onClose, espacioId, onEspacioActualizado, nombreEspacioInicial }) => {
  const [form] = Form.useForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [nombreEspacio, setNombreEspacio] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const nombreDesdeLocalStorage = localStorage.getItem("espacioNombre");

  useEffect(() => {
    console.log("Open:", open, "Espacio ID:", espacioId, "Nombre Inicial:", nombreEspacioInicial);
    const cargarEspacioParaEditar = async () => {
      if (open && espacioId) {
        setLoading(true);
        try {
          setNombreEspacio(nombreEspacioInicial || '');
          form.setFieldsValue({nombre: nombreDesdeLocalStorage || '' });
          setLoading(false);
        } catch (error) {
          console.error("Error al cargar el espacio:", error);
          setSnackbarMessage('Error al cargar la información del espacio.');
          setSeverity('error');
          setOpenSnackbar(true);
          onClose();
          setLoading(false);
        }
      } else if (!open) {
        form.resetFields();
        setNombreEspacio('');
      }
    };
    cargarEspacioParaEditar();
  }, [open, form, nombreDesdeLocalStorage]);

  const handleEditarEspacio = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const nombreUsuario = localStorage.getItem("nombreUsuario");
      const dataToSend = {
        espacio: values.nombre,
        //usuario: nombreUsuario // Enviamos el nombre del usuario
      };
  
      console.log("Datos a enviar para editar el espacio:", dataToSend); // 
  
      const respuesta = await editEspacios(espacioId, dataToSend); 
  
      if (respuesta && respuesta.id) {
        localStorage.setItem("espacioNombre", values.espacio);
        onEspacioActualizado();
        setOpenSnackbar({ open: true, message: 'Espacio editado correctamente', severity: 'success' });
        onClose();
        navigate('/sel_espacios/');
      } else {
        setOpenSnackbar({ open: true, message: 'Error al editar el espacio', severity: 'error' });
      }
    } catch (error) {
      console.error("Error:", error);
      setOpenSnackbar({ open: true, message: 'Error de conexión o validación', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && open) {
    return (
      <Drawer
        title={<div style={{ fontSize: '1em', fontFamily: "'Montserrat', sans-serif" }}>Editar Espacio</div>}
        width={500}
        onClose={onClose}
        open={open}
        style={{ backgroundColor: '#F9EAC3' }}
        headerStyle={{ backgroundColor: '#2D572C', color: '#F9EAC3' }}
      >
        <Typography.Paragraph>Cargando información del espacio...</Typography.Paragraph>
      </Drawer>
    );
  }

  return (
    <>
      <Drawer
        title={<div style={{ fontSize: '1em', fontFamily: "'Montserrat', sans-serif" }}>Editar Espacio</div>}
        width={500}
        onClose={onClose}
        open={open}
        style={{ backgroundColor: '#F9EAC3' }}
        headerStyle={{ backgroundColor: '#2D572C', color: '#F9EAC3' }}
      >
        <Form form={form} layout="vertical" sx={{ background: '#2D572C' }}>
          <Form.Item
            label="Nombre del Espacio:"
            name="nombre"
            rules={[{ required: true, message: "El nombre es requerido" }]}
          >
            <Input />
          </Form.Item>
          <div style={{ textAlign: "right", display: 'flex', gap: 2 }}>
            <Button onClick={handleEditarEspacio} style={{ backgroundColor: '#2D572C', color: '#F3D301', "&:hover": { backgroundColor: '#F3D301', color: '#2D572C' }, }}>Guardar</Button>
            <Button onClick={onClose} style={{ backgroundColor: '#FD5653', color: '#FFF', width: '25%', "&:hover": { backgroundColor: '#FFFFFF', color: '#FD5653' }, }}>X</Button>
          </div>
          <Divider sx={{ border: '1px solid #808080', my: '10px' }} />
          
        </Form>
      </Drawer>
      <Snackbar
        open={openSnackbar.open}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })} severity={severity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default EditarEspacios;