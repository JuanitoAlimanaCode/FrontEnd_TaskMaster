import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEspacios, getEstadosPorEspacio } from "../../servicios/taskmasterservicios";
import { Box, List, ListItem, ListItemText, Divider, Card, CardActionArea, CardContent, Typography, IconButton, Drawer, Button, TextField, Snackbar, Alert } from "@mui/material";
import NavBar from "../index/navbar";
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import AgregarEspacios from "./crear";
import EditarEspacios from "./editar";

const Seleccionador = () => {
    const [espacios, setEspaciosState] = useState([]);
    const [estados, setEstadosState] = useState([]);
    const [selectedEspacioId, setSelectedEspacioId] = useState(null);
    const [isLeftBoxOpen, setIsLeftBoxOpen] = useState(true);
    const [espacioParaEditar, setEspacioParaEditar] = useState(null);
    const [drawerCrearEspacios, setdrawerCrearEspacios] = useState(false);
    const [drawerEditarEspacio, setdrawerEditarEspacio] = useState(false); 
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para el Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(""); // Mensaje del Snackbar
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severidad del Snackbar ("success", "error", "warning", "info")
    const navigate = useNavigate();

    const obtenerEspacios = async () => {
        try {
            const response = await getEspacios();
            setEspaciosState(response);
        } catch (error) {
            console.error("Error al obtener los espacios:", error);
            setSnackbarMessage("Error al cargar los espacios.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        console.log("drawerEditarEspacio cambió a:", drawerEditarEspacio);
      }, [drawerEditarEspacio]);

    useEffect(() => {
        obtenerEspacios();
    }, []);

    const cargarEstadosPorEspacio = async (espacioId) => {
        try {
            const response = await getEstadosPorEspacio(espacioId);
            console.log("Respuesta de getEstadosPorEspacio:", response);
            setEstadosState(response);
        } catch (error) {
            console.error(`Error al obtener los estados del espacio ${espacioId}:`, error);
            setEstadosState([]);
            setSnackbarMessage(`Error al cargar los estados del espacio ${espacioId}.`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleEspacioClickLista = (espacioId, espacioNombre) => {
        setSelectedEspacioId(espacioId);
        console.log(`Espacio seleccionado (lista): ${espacioNombre} (ID: ${espacioId}) - Cargando estados`);
        cargarEstadosPorEspacio(espacioId);
    };

    const handleEspacioClickCard = (espacioId, espacioNombre) => {
        localStorage.setItem('espacioId', espacioId);
        localStorage.setItem('espacioNombre', espacioNombre);
        console.log(`Espacio seleccionado (card): ${espacioNombre} (ID: ${espacioId}) - Navegando a /panel`);
        navigate('/panel');
    };

    const toggleLeftBox = () => {
        setIsLeftBoxOpen(!isLeftBoxOpen);
    };

    const handleCrearClick = () => {
        setdrawerCrearEspacios(true);
      };

    const handleEditarClick = (espacio) => {
        setEspacioParaEditar(espacio);
        setdrawerEditarEspacio(true);
      };

    const generarColorAleatorio = () => {
        const letras = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letras[Math.floor(Math.random() * 16)];
        }
        return color;
        };

    return (
        <>
            <NavBar />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', minHeight: '90vh' }}>
                <Box
                    sx={{
                        background: 'linear-gradient(178deg,rgba(249, 234, 195, 1) 0%, rgba(237, 221, 83, 1) 100%)',
                        width: isLeftBoxOpen ? '25%' : 'auto',
                        minHeight: 'inherit',
                        padding: isLeftBoxOpen ? '20px' : '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        boxShadow: '20px 0px 30px #808080',
                        transition: 'width 0.3s ease-in-out, padding 0.3s ease-in-out',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '100%', }}>
                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'left', display: isLeftBoxOpen ? 'block' : 'none' }}><h8>Espacios de Trabajo</h8></Typography>
                        <IconButton onClick={toggleLeftBox} size="small" sx={{ width: 'auto', height: 'auto', padding: 0, marginLeft: isLeftBoxOpen ? '10px' : 0 }}>
                            {isLeftBoxOpen ? <ChevronLeft /> : <ChevronRight />}
                        </IconButton>
                    </Box>
                    
                    {isLeftBoxOpen && (
                        <>
                            <List sx={{ width: '100%' }}>
                                {espacios.map((espacio, index) => (
                                    <React.Fragment key={espacio.id}>
                                        <ListItem
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="editar" onClick={() => handleEditarClick(espacio)}>
                                                    <EditIcon sx={{ color: '#2D572C' }} />
                                                </IconButton>
                                            }
                                            onClick={() => handleEspacioClickLista(espacio.id, espacio.espacio)} 
                                            button sx={{cursor: 'pointer'}}
                                        >
                                            <ListItemText primary={espacio.espacio} />
                                        </ListItem>
                                        {index !== espacios.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                                <ListItem>
                                    <Button
                                    sx={{
                                        color: '#70AD47',
                                        justifyContent: 'left',
                                        textTransform: 'capitalize',
                                        "&:hover": {
                                        color: '#F3D301',
                                        }
                                    }}
                                    onClick={handleCrearClick} 
                                    >+ Agregar Nuevo Espacio
                                    </Button>
                                </ListItem>
                            </List>
                            <Divider sx={{ marginBottom: '10px', width: '100%', display: isLeftBoxOpen ? 'block' : 'none' }} />
                            <Typography variant="h6"><h8>Estados Disponibles</h8></Typography>
                            
                            <List sx={{ width: '100%' }}>
                                {estados.map((estado, index) => (
                                    <React.Fragment key={estado.id}>
                                        <ListItem>
                                            <ListItemText primary={estado.estado} />
                                        </ListItem>
                                        {index !== estados.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </>
                    )}
                </Box>
                <Box sx={{ width: isLeftBoxOpen ? '70%' : '100%', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', transition: 'width 0.3s ease-in-out' }}>
                    {espacios.map((espacio) => {
                        const colorAleatorio = generarColorAleatorio();
                        return(
                            <Card
                                key={espacio.id}
                                sx={{
                                    backgroundColor: colorAleatorio,
                                    color: 'white',
                                    width: 'calc(33% - 20px)',
                                    height: '150px',
                                    fontFamily: "'Montserrat', sans-serif",
                                    minWidth: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    boxShadow: '0px 3px 5px rgba(0,0,0,0.2)',
                                    '&:hover': {
                                        boxShadow: '0px 5px 8px rgba(0,0,0,0.3)',
                                        cursor: 'pointer',
                                        backgroundColor: '#70AD47'
                                    },
                                }}
                                onClick={() => handleEspacioClickCard(espacio.id, espacio.espacio)}
                            >
                                <CardActionArea>
                                    <CardContent>
                                        <Typography variant="h6" component="div" sx={{fontFamily: "'Montserrat', sans-serif"}}>
                                            {espacio.espacio}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        );
                    })}
                    <Card
                        sx={{
                        backgroundColor: '#f2f2f2',
                        color: '#777',
                        width: 'calc(33% - 20px)',
                        fontFamily: "'Montserrat', sans-serif",
                        height: '150px',
                        minWidth: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0px 3px 5px rgba(0,0,0,0.2)',
                        '&:hover': {
                            backgroundColor: '#e0e0e0',
                            boxShadow: '0px 5px 8px rgba(0,0,0,0.3)',
                            color: 'white',
                            '& .agregar-espacio-texto': { 
                                color: 'white',
                            },
                        },
                        }}
                        onClick={handleCrearClick}
                    >
                        <CardActionArea sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>+</Typography>
                        <Typography variant="subtitle1" className="agregar-espacio-texto" sx={{fontFamily: "'Montserrat', sans-serif"}}>Agregar Espacio</Typography>
                        </CardActionArea>
                    </Card>
                </Box>
            </Box>
            {console.log("Renderizando EditarEspacios con espacioId:", espacioParaEditar ? espacioParaEditar.id : null)}
            
            <AgregarEspacios 
                open={drawerCrearEspacios} 
                onClose={() => setdrawerCrearEspacios(false)} 
                listaEspacios={espacios || []}
                onActualizar={obtenerEspacios} 
            />
            
            <EditarEspacios
                open={drawerEditarEspacio}
                espacioId={espacioParaEditar ? espacioParaEditar.id : null}
                onClose={() => {setdrawerEditarEspacio(false); setEspacioParaEditar(null);}} 
                listaEspacios = {espacios}
                onActualizar={obtenerEspacios}
            />
        </>
    );
};

export default Seleccionador;