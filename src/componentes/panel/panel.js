import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, List, ListItem, ListItemText, Divider, Card, CardActionArea, CardContent, Typography, IconButton, MenuItem, Button, FormControl, InputLabel, Select, Toolbar, Popover } from "@mui/material";
import { getEspacios, getEstadosPorEspacio, getTareas, deleteEspacios } from "../../servicios/taskmasterservicios";
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import NavBar from "../index/navbar";
import DashboardIcon from '@mui/icons-material/Dashboard';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import EditarTareas from "./editartarea";
import CrearTareas from "./creartarea";
import CrearEstados from "./crearestado";
import EditarEstados from "./editarestado";
import EditarEspacios from "./editarespacio";

const categoriasConColor = [
    { label: 'Urgente', value: 'urgente', color: '#FD5653' },
    { label: 'Importante', value: 'importante', color: '#F3D301' },
    { label: 'Opcional', value: 'opcional', color: '#2DB7F5' },
    { label: 'Delegable', value: 'delegable', color: '#722ED1' },
    { label: 'Rutina', value: 'rutina', color: '#70AD47' },
    { label: 'Creativa', value: 'creativa', color: '#EB2F96' },
    { label: 'Estratégica', value: 'estrategica', color: '#1890FF' },
    { label: 'De mantenimiento', value: 'mantenimiento', color: '#A6A6A6' },
    { label: 'Personal', value: 'personal', color: '#FFA39E' },
    ];

const obtenerColorPrioridad = (prioridad) => {
    switch (prioridad) {
    case 1: return '#70AD47'; // Verde
    case 2: return '#F3D301'; // Amarillo
    case 3: return '#FD5653'; // Rojo
    default: return 'grey';
    }

    };

const Panel = () => {
    const [espacios, setEspaciosState] = useState([]);
    const [estados, setEstadosState] = useState([]);
    const [tareaId, setTareaId] = useState(null);
    const [selectEstadoId, setSelectedEstadoId] = useState(null);
    const [tareasPorEstado, setTareasPorEstado] = useState({});
    const navigate = useNavigate();
    const [isLeftBoxOpen, setIsLeftBoxOpen] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false); 
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(""); 
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [drawerEditarTarea, setdrawerEditarTarea] = useState(false);
    const [drawerCrearTarea, setdrawerCrearTarea] = useState(false); 
    const [estadoParaNuevaTarea, setEstadoParaNuevaTarea] = useState(null);
    const [drawerCrearEstado, setdrawerCrearEstado] = useState(false);
    const [drawerEditarEstado, setdrawerEditarEstado] = useState(false);
    const [nombreEstadoAEditar, setNombreEstadoAEditar] = useState('');
    const [drawerEditarEspacio, setdrawerEditarEspacio] = useState(false); 
    const [nombreEspacioAEditar, setNombreEspacioAEditar] = useState('');
    const [refreshPanel, setRefreshPanel] = useState(false);
    const [espacioNombreLocal, setEspacioNombreLocal] = useState(localStorage.getItem("espacioNombre") || "");
    const [todasLasTareas, setTodasLasTareas] = useState({});

    const [anchorEl, setAnchorEl] = useState(null);
    const [filterPriority, setFilterPriority] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const espacioId = localStorage.getItem("espacioId");
    const espacioNombre = localStorage.getItem("espacioNombre");


    const obtenerEspacios = async () => {
        try {
            const response = await getEspacios();
            setEspaciosState(response);
            setEspacioNombreLocal(localStorage.getItem("espacioNombre") || "");
        } catch (error) {
            console.error("Error al obtener los espacios:", error);
            setSnackbarMessage("Error al cargar los espacios.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleEspacioActualizadoLocal = () => {
        setEspacioNombreLocal(localStorage.getItem("espacioNombre") || "");
        obtenerEspacios();
      };

    useEffect(() => {
        }, [drawerEditarTarea]);

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

    useEffect(() => {
        if (espacioId) { 
            cargarEstadosPorEspacio(espacioId);
        }
    }, [espacioId]);

    const cargarTareasPorEstado = async () => {
        if (espacioId && estados.length > 0) {
          const tareasAgrupadas = {};
          for (const estado of estados) {
            try {
              const response = await getTareas(espacioId, estado.id);
              tareasAgrupadas[estado.id] = response.map(tarea => ({
                ...tarea,
                prioridad: parseInt(tarea.prioridad, 10), // Asegúrate de que sea número
              }));
            } catch (error) {
              console.error(`Error al obtener las tareas...`, error);
              tareasAgrupadas[estado.id] = [];
            }
          }
          setTodasLasTareas(tareasAgrupadas); 
          aplicarFiltrosYOrdenar(tareasAgrupadas); 
        } else {
          setTodasLasTareas({});
          setTareasPorEstado({});
        }
      };

    useEffect(() => {
        cargarTareasPorEstado();
    }, [espacioId, estados]); 

    const aplicarFiltrosYOrdenar = (tareasParaFiltrar) => {
        const nuevasTareasPorEstado = {};
      
        estados.forEach(estado => {
          const tareasOriginalesDelEstado = tareasParaFiltrar[estado.id] || [];
          let filteredAndSortedTareasDelEstado = [...tareasOriginalesDelEstado];
      
          // Filtrado por prioridad
          if (filterPriority) {
            filteredAndSortedTareasDelEstado = filteredAndSortedTareasDelEstado.filter(
              tarea => tarea.prioridad === parseInt(filterPriority)
            );
          }
      
          // Filtrado por categoría
          if (filterCategory) {
            filteredAndSortedTareasDelEstado = filteredAndSortedTareasDelEstado.filter(tarea =>
              tarea.categoría && tarea.categoría.toLowerCase().includes(filterCategory.toLowerCase())
            );
          }
      
          // Ordenamiento
          if (sortOrder === 'dueDateAsc') {
            filteredAndSortedTareasDelEstado.sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento));
          } else if (sortOrder === 'dueDateDesc') {
            filteredAndSortedTareasDelEstado.sort((a, b) => new Date(b.fecha_vencimiento) - new Date(a.fecha_vencimiento));
          } else if (sortOrder === 'priorityAsc') {
            filteredAndSortedTareasDelEstado.sort((a, b) => a.prioridad - b.prioridad);
          } else if (sortOrder === 'priorityDesc') {
            filteredAndSortedTareasDelEstado.sort((a, b) => b.prioridad - a.prioridad);
          }
      
          nuevasTareasPorEstado[estado.id] = filteredAndSortedTareasDelEstado;
        });
      
        setTareasPorEstado(nuevasTareasPorEstado);
      };

    const toggleLeftBox = () => {
        setIsLeftBoxOpen(!isLeftBoxOpen);
    };

    const handleEditarClick = (tarea) => {
        setTareaId(tarea.id);
        setdrawerEditarTarea(true);
      }; 

    const handleCrearClick = (estadoId) => {
        setEstadoParaNuevaTarea(estadoId);
        setdrawerCrearTarea(true);
    };

    const handleCrearEstado = () => {
        setdrawerCrearEstado(true);
    };

    const handleEstadoCreado = () => {
        cargarEstadosPorEspacio(espacioId); 
        cargarTareasPorEstado();       
      };
    
    const handleEditarEstado = (estado) => {
        setSelectedEstadoId(estado.id);
        setNombreEstadoAEditar(estado.estado);
        setdrawerEditarEstado(true);
      }; 

    const handleEditarEspacio = () => {
        const currentEspacioId = localStorage.getItem("espacioId");
        console.log("ID del espacio desde localStorage:", currentEspacioId, typeof currentEspacioId);
        console.log("Array de espacios:", espacios.map(espacio => ({ id: espacio.id, tipoId: typeof espacio.id, espacio: espacio.espacio })));
        const currentEspacioIdNumber = parseInt(currentEspacioId, 10);
        const espacioSeleccionado = espacios.find(espacio => espacio.id === currentEspacioIdNumber);
        if (espacioSeleccionado) {
            setNombreEspacioAEditar(espacioSeleccionado.nombre);
            setdrawerEditarEspacio(true);
        } else {
            console.error("Espacio actual no encontrado para editar.");
        }
    };

    const [isDeleting, setIsDeleting] = useState(false);

    const handleEliminarEspacio = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este espacio?')) {
            setIsDeleting(true);
            try {
            setOpenSnackbar({ open: true, message: 'Eliminando espacio...', severity: 'info' });
            await deleteEspacios(id);
            setOpenSnackbar({ open: true, message: 'Espacio eliminado correctamente.', severity: 'success' });
            localStorage.removeItem("espacioId");
            localStorage.removeItem("espacioNombre");
            navigate('/sel_espacios/'); // Redirige a la página de selección
            } catch (error) {
            console.error('Error al eliminar el espacio:', error);
            setOpenSnackbar({ open: true, message: 'Error al eliminar el espacio.', severity: 'error' });
            } finally {
            setIsDeleting(false);
            }
        }
        };
        
    const handleFilterButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
        };
    
        const handleFilterPopoverClose = () => {
        setAnchorEl(null);
        };
    
        const openFilterPopover = Boolean(anchorEl);
        const filterPopoverId = openFilterPopover ? 'filter-popover' : undefined;
    
        const handlePriorityChange = (event) => {
            setFilterPriority(event.target.value);
            aplicarFiltrosYOrdenar(todasLasTareas); // Llama a la función local
          };
          
          const handleCategoryChange = (event) => {
            setFilterCategory(event.target.value);
            aplicarFiltrosYOrdenar(todasLasTareas); // Llama a la función local
          };
          
          const handleSortOrderChange = (event) => {
            setSortOrder(event.target.value);
            aplicarFiltrosYOrdenar(todasLasTareas); // Llama a la función local
          };
    
        const handleApplyFilters = () => {
            aplicarFiltrosYOrdenar(todasLasTareas);
            handleFilterPopoverClose();
          };

    return (
        <>
            <NavBar key={refreshPanel}/>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', minHeight: '90vh', width: '100%'}}>
                <Box
                    sx={{
                        background: 'linear-gradient(178deg,rgba(189, 236, 182, 1) 0%, rgba(122, 255, 121, 1) 100%)',
                        width: isLeftBoxOpen ? '25%' : 'auto',
                        minWidth: isLeftBoxOpen ? '250px' : 'auto',
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
                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'left', display: isLeftBoxOpen ? 'block' : 'none' }}><h8>Espacio de Trabajo:<br/>{localStorage.getItem("espacioNombre")}</h8></Typography>
                        <IconButton onClick={toggleLeftBox} size="small" sx={{ width: 'auto', height: 'auto', padding: 0, marginLeft: isLeftBoxOpen ? '10px' : 0 }}>
                            {isLeftBoxOpen ? <ChevronLeft /> : <ChevronRight />}
                        </IconButton>
                    </Box>
                    {isLeftBoxOpen && (
                        <>
                           <Divider style={{ width: '100%', border: '1px solid #808080', mb: '10px' }} />
                            <Button 
                                sx={{
                                    color: '#2D572C',
                                    justifyContent: 'left',
                                    textTransform: 'capitalize',
                                    "&:hover": {
                                    color: '#F3D301',
                                    }
                                }}
                                startIcon={<DashboardIcon />}
                                onClick={() => navigate(`/sel_espacios/`)}>
                                Espacios
                            </Button> 
                        </>
                    )}
                    
                </Box>
                <Box sx={{  display: 'flex', flexDirection: 'column', width: '100%', transition: 'width 0.3s ease-in-out', }}>
                    <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',                        
                        maxHeight: '30px',
                        width: '100%',
                        borderBottom: '1px solid #e0e0e0',
                        overflow: 'hidden',
                        px: 1,
                        backgroundColor: '#2D572C',
                    }}
                    >
                        <Typography
                        variant="h7"
                        sx={{
                            color: 'white',
                            whiteSpace: 'nowrap',
                            fontFamily: "'Montserrat', sans-serif",
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '60%', // o ajusta según el diseño
                        }}
                        >{localStorage.getItem("espacioNombre")}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '0px' }}>
                            {/* Botón de Filtrar Tareas */}
                            <IconButton aria-label="filtrar tareas" sx={{ color: 'white', padding: '5px', width: '100px', "&:hover": { color: '#F3D301'  }} } onClick={handleFilterButtonClick}>
                            <FilterListIcon />
                            </IconButton>
                            <Divider orientation="vertical" sx={{border: '1px solid #808080', height: '30px', mx: '10px'}}/>
                            {/* Botón de Editar Nombre del Espacio */}
                            <IconButton aria-label="editar nombre del espacio" onClick={handleEditarEspacio} sx={{ color: 'white', padding: '1px', width: '40px', "&:hover": { color: '#70AD47'  }}  }>
                            <EditIcon />
                            </IconButton>

                            {/* Botón de Eliminar Espacio */}
                            <IconButton aria-label="eliminar espacio"  onClick={() => handleEliminarEspacio(localStorage.getItem("espacioId"))} sx={{ color: 'white', padding: '1px', width: '40px', "&:hover": { color: '#FD5653'  }}  }>
                            <DeleteIcon />
                            </IconButton>
                        </Box>    
                    </Toolbar>
                    <Popover
                        id={filterPopoverId}
                        open={openFilterPopover}
                        anchorEl={anchorEl}
                        onClose={handleFilterPopoverClose}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Filtrar Tareas</Typography>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="priority-select-label">Prioridad</InputLabel>
                            <Select
                            labelId="priority-select-label"
                            id="priority-select"
                            value={filterPriority}
                            label="Prioridad"
                            onChange={handlePriorityChange}
                            >
                            <MenuItem value="">Todas</MenuItem>
                            <MenuItem value={1}>Alta</MenuItem>
                            <MenuItem value={2}>Media</MenuItem>
                            <MenuItem value={3}>Baja</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="category-select-label">Categoría</InputLabel>
                            <Select
                            labelId="category-select-label"
                            id="category-select"
                            value={filterCategory}
                            label="Categoría"
                            onChange={handleCategoryChange}
                            >
                            <MenuItem value="">Todas</MenuItem>
                            <MenuItem value="Urgente">Urgente</MenuItem>
                            <MenuItem value="Importante">Importante</MenuItem>
                            <MenuItem value="Opcional">Opcional</MenuItem>
                            <MenuItem value="Delegable">Delegable</MenuItem>
                            <MenuItem value="Rutina">Rutina</MenuItem>
                            <MenuItem value="Creativa">Creativa</MenuItem>
                            <MenuItem value="Estratégica">Estratégica</MenuItem>
                            <MenuItem value="De mantenimiento">De mantenimiento</MenuItem>
                            <MenuItem value="Personal">Personal</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="sort-select-label">Ordenar por</InputLabel>
                            <Select
                            labelId="sort-select-label"
                            id="sort-select"
                            value={sortOrder}
                            label="Ordenar por"
                            onChange={handleSortOrderChange}
                            >
                            <MenuItem value="">Sin ordenar</MenuItem>
                            <MenuItem value="dueDateAsc">Fecha de vencimiento (Asc)</MenuItem>
                            <MenuItem value="dueDateDesc">Fecha de vencimiento (Desc)</MenuItem>
                            <MenuItem value="priorityAsc">Prioridad (Asc)</MenuItem>
                            <MenuItem value="priorityDesc">Prioridad (Desc)</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={handleApplyFilters} sx={{ mt: 2 }}>
                            Aplicar Filtros
                        </Button>
                        </Box>
                    </Popover>
                    <Box sx={{
                        flexGrow: 1,
                        padding: (theme) => theme.spacing(2),
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2, 
                        overflowX: 'auto',
                        alignItems: 'flex-start', 
                        backgroundColor: '#F9EAC3',
                        minHeight: '74vh',
                    }}>
                        {estados.map((estado) => (
                            <Card key={estado.id} sx={{ width: 300, minWidth: 275, boxShadow: '0px 3px 5px rgba(0,0,0,0.2)', background: '#f2f2f2' }}>
                                <CardContent>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1}}>
                                        <Typography variant="h6" gutterBottom sx={{fontFamily: "'Montserrat', sans-serif", color: '#2D572C'}}>
                                            {estado.estado}
                                        </Typography>
                                        <IconButton onClick={() => handleEditarEstado(estado)} aria-label="editar nombre del estado" sx={{ color: '#2D572C', padding: '1px', width: '40px', "&:hover": { color: '#F9EAC3'  }}  }>
                                            <EditIcon />
                                        </IconButton>
                                    </Box>   
                                    <Divider sx={{ border: '1px solid #808080', mb: '10px' }} />
                                    <List>
                                    {tareasPorEstado[estado.id] && tareasPorEstado[estado.id].map((tarea) => {
                                        const categoriasTarea = tarea.categoría ? tarea.categoría.split(',').map(cat => cat.trim().toLowerCase()) : [];
                                        const categoriasColores = categoriasTarea.map(cat => categoriasConColor.find(c => c.value === cat)?.color).filter(Boolean);
                                        const prioridadColor = obtenerColorPrioridad(tarea.prioridad);
                                        const hoy = moment().startOf('day');
                                        const fechaVencimiento = tarea.fecha_vencimiento ? moment(tarea.fecha_vencimiento) : null;
                                        const isVencida = fechaVencimiento && fechaVencimiento.isBefore(hoy);
                                        const venceHoy = fechaVencimiento && fechaVencimiento.isSame(hoy, 'day');

                                        return (
                                            <ListItem
                                                key={tarea.id}
                                                button
                                                onClick={() => handleEditarClick(tarea)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    backgroundColor: venceHoy ? '#FFFACD' : (isVencida ? '#FFE4E1' : 'inherit'), // Amarillo pastel si vence hoy, rosa pastel si vencida
                                                    marginBottom: '5px',
                                                    padding: '10px',
                                                    borderLeft: `5px solid ${prioridadColor}`, // Indicador de prioridad a la izquierda
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography sx={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                        {tarea.tarea}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: '5px', mt: '5px' }}>
                                                        {categoriasColores.map((color, index) => (
                                                            <span key={index} style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
                                                        ))}
                                                    </Box>
                                                </Box>
                                                {fechaVencimiento && (
                                                    <Typography variant="caption" color={isVencida ? 'error' : 'textSecondary'} sx={{ ml: 1 }}>
                                                        
                                                    </Typography>
                                                )}
                                            </ListItem>
                                        );
                                    })}
                                        {!tareasPorEstado[estado.id] && (
                                            <ListItem>
                                                <ListItemText primary="No hay tareas" secondary="para este estado" />
                                            </ListItem>
                                        )}
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
                                            onClick={() => handleCrearClick(estado.id)}
                                            >+ Agregar Nueva Tarea
                                            </Button>
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        ))}
                        <Card
                            sx={{
                            backgroundColor: '#f2f2f2',
                            color: '#777',
                            width: 'calc(20% - 20px)',
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
                            onClick={handleCrearEstado}
                        >
                            <CardActionArea sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>+</Typography>
                            <Typography variant="subtitle1" className="agregar-espacio-texto" sx={{fontFamily: "'Montserrat', sans-serif"}}>Agregar Estado</Typography>
                            </CardActionArea>
                        </Card>
                    </Box>
                </Box>
            </Box>
            <CrearTareas
                open={drawerCrearTarea}
                onClose={() => {setdrawerCrearTarea(false);}} 
                espacioId={espacioId}
                onTareaCreada={cargarTareasPorEstado}
                listaEstados={estados}
                estadoInicial={estadoParaNuevaTarea}
            />
            <EditarTareas
                open={drawerEditarTarea}
                tareaId={tareaId}
                onClose={() => {setdrawerEditarTarea(false);}} 
                listaTareas = {tareasPorEstado}
                onTareaEliminada={cargarTareasPorEstado}
                onActualizar={cargarTareasPorEstado}
                listaEstados={estados}
            />
            <CrearEstados
                open={drawerCrearEstado}
                onClose={() => {setdrawerCrearEstado(false);}} 
                onEstadoCreado={handleEstadoCreado}
                espacioId={espacioId}
            />
            <EditarEstados
                open={drawerEditarEstado}
                estadoId={selectEstadoId}
                onClose={() => {setdrawerEditarEstado(false);}} 
                onEstadoCreado={handleEstadoCreado}
                nombreEstadoInicial={nombreEstadoAEditar}
            />
            <EditarEspacios
                open={drawerEditarEspacio}
                espacioId={espacioId}
                onClose={() => {setdrawerEditarEspacio(false);}} 
                onEspacioActualizado={handleEspacioActualizadoLocal}
                nombreEspacioInicial={drawerEditarEspacio.nombre}
            />
        </>
    );

};
export default Panel;