import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form } from "antd";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { editEspacios } from "../../servicios/taskmasterservicios";

const EditarEspacios = ({ open, onClose, espacioId, listaEspacios, onActualizar }) => {
    
    const [nombreEspacio, setNombreEspacio] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        console.log("espacioId en EditarEspacios:", espacioId);
        console.log("listaEspacios en EditarEspacios:", listaEspacios);
        if (espacioId && listaEspacios && listaEspacios.length > 0) {
          const espacio = listaEspacios.find(c => parseInt(c.id) === parseInt(espacioId));
          console.log("Espacio encontrado en EditarEspacios:", espacio);
          if (espacio && espacio.espacio) { 
            setNombreEspacio(espacio.espacio);
          } else {
            setNombreEspacio('');
          }
        } else {
          setNombreEspacio('');
        }
      }, [espacioId, listaEspacios]);
    
    useEffect(() => {
    if (!open) {
        setNombreEspacio('');
    }
    }, [open]);

    const guardarEspacios = async () => {
    try {
        const data = 
        {
        "id": parseInt(espacioId, 10),
        "espacio": nombreEspacio
        }
        

        await editEspacios(espacioId, data);
        await onActualizar();
        setOpenSnackbar({ open: true, message: 'Espacio actualizado correctamente', severity: 'success' });
        onClose();
    } catch (error) {
        console.error('Error al editar:', error);
        setOpenSnackbar({ open: true, message: 'Error al actualizar el Espacio', severity: 'error' });
    }
    };

    return (
    <>
        <Drawer
        title={<div style={{ fontSize: '1em', color: '#2D572C', fontFamily: "'Montserrat', sans-serif" }}>Editar Nombre del Espacio</div>}
        width={350}
        onClose={onClose}
        open={open}
        placement="left"
        >
        <Form layout="vertical" style={{ width: '100%' }}>
            <Form.Item label="Nuevo Nombre" required>
            <Input
                value={nombreEspacio}
                onChange={(e) => {setNombreEspacio(e.target.value);
                console.log(e.target.value);}
                }
                placeholder="Ingrese el nombre del espacio"
            />
            </Form.Item>
            <div style={{ textAlign: "right", display: 'flex', gap: 2,}}>
                <Button onClick={guardarEspacios} style={{ backgroundColor: '#2D572C', color: '#F3D301', "&:hover": { backgroundColor: '#F3D301', color: '#2D572C' },}}>Guardar</Button>
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

export default EditarEspacios;
