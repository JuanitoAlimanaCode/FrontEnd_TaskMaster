import React, { useState, useEffect } from "react";
import { obtenerPerfil } from "../../servicios/cuentaservicios";
import NavBar from "../index/navbar";
import { 
    TextField, 
    Button, 
    Container, 
    FormControlLabel,   
    Typography, 
    Box,
    Alert,
    Snackbar,
    Avatar,
    CircularProgress,
    Divider
} from "@mui/material";
import { Typography as AntTypography } from "antd"; // Evita conflictos con Typography de Material UI
import axios from "axios";
import apiURL from "../UrlBackend";



const Perfil = () => {
    
    const [perfil, setPerfil] = useState({
        username: '',
        first_name: '',
        last_name: '',
        telefono: '',
        email: '',
        descripcion: '',
        avatar: null,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState("/assets/avatar.png");
    const imageUrl = previewAvatar && previewAvatar.includes("/media") 
    ? `${apiURL}${previewAvatar}`
    : previewAvatar;

    const obtenerPerfilUsuario = async () => {
        setLoading(true);
    
        try {
            const response = await obtenerPerfil();
            console.log("Respuesta perfil:", response);
    
            setPerfil({
                username: response.username,
                first_name: response.first_name,
                last_name: response.last_name,
                telefono: response.telefono,
                email: response.email,
                descripcion: response.descripcion,
                avatar: null, 
            });
    
            const avatarPreview = response.avatar || "/assets/avatar.png";  // Default avatar
            setPreviewAvatar(avatarPreview);  // Asignamos la URL a previewAvatar
    
            console.log("Avatar cargado:", avatarPreview);  // Ver el avatar cargado
    
            setMensaje("Perfil cargado con éxito");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.mensaje) {
                setError(err.response.data.mensaje);
            } else {
                setError("Error al cargar el perfil");
            }
            setMensaje("Error al cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const cargarAvatar = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPerfil((prev) => ({ ...prev, avatar: file }));
            const avatarPreview = URL.createObjectURL(file);
            console.log(avatarPreview); // Aquí vemos la URL generada
            setPreviewAvatar(avatarPreview);
        }
    }
    const guardarCambios = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('first_name', perfil.first_name);
            formData.append('last_name', perfil.last_name);
            formData.append('telefono', perfil.telefono);
            formData.append('email', perfil.email);
            formData.append('descripcion', perfil.descripcion);

            if (perfil.avatar) {
                formData.append('avatar', perfil.avatar);
            }
            console.log(formData);
            const response = await axios.put(`${apiURL}api/editarperfil/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log(response.data);
            setMensaje("Cambios guardados con éxito");
            setError(''); // Limpiar cualquier error anterior
            setPerfil(response.data); // Actualizar el estado del perfil con los datos actualizados

        } catch (error) {
            console.error("Error al guardar cambios:", error);
            setError("Error al guardar cambios. Por favor, inténtalo de nuevo."); // Mostrar error al usuario
            setMensaje(''); // Limpiar mensaje de éxito
        }
    };

    useEffect(() => {
        obtenerPerfilUsuario();
    }, []);
    console.log("imageUrl:", imageUrl);
    
    useEffect(() => {
        if (mensaje) {
            setOpenSnackbar(true);
    
            // Cierra el Snackbar automáticamente después de 3 segundos
            const timer = setTimeout(() => {
                setOpenSnackbar(false);
                setMensaje(""); // Limpiar mensaje después de mostrarlo
            }, 3000);
    
            return () => clearTimeout(timer);
        }
    }, [mensaje]);

    return(
        <>
        <NavBar />
        <Box
            sx={{
                backgroundImage: 'url(/assets/background_6.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#F9EAC3',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box>
                <Typography
                variant="h4"
                align="center"
                sx={{
                    color: "#F9EAC3",
                    backgroundColor: "#2D572C",
                    fontWeight: "regular",
                    mt: 1,
                    mb: 1,
                    fontFamily: "Montserrat, sans-serif"
                }}
                >
                    Perfil de Usuario
                </Typography>

                <Snackbar
                    open={openSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="success" sx={{ width: '100%' }}>
                        {mensaje}
                    </Alert>
                </Snackbar>
                {error && <Alert severity="error">{error}</Alert>} {/* Muestra el mensaje de error */}

                <Box display="flex" flexDirection="row" alignItems="flex-start">
                    <Box flex={1} marginRight={2} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f2f2f2', borderRadius: '8px', padding: '16px', margin: '10px', }} >
                    <img 
                        src={imageUrl} 
                        alt="Avatar" 
                        style={{
                            width: "150px", 
                            height: "150px", 
                            borderRadius: "50%", 
                            marginBottom: "16px", 
                            border: "2px solid #2D572C"
                        }} 
                    />
                    
                        <Typography variant="h6"
                        sx={{
                            color: "#2D572C",
                            fontWeight: "bold",
                            mt: 1,
                            mb: 1,
                            fontFamily: "Montserrat, sans-serif",
                        }}>
                         {perfil.username}
                        </Typography>
                        <Divider sx={{ backgroundColor: 'black' }} />
                        <Button
                        variant="outlined"
                        sx={{
                            marginTop: 2,
                            borderColor: '#2D572C',
                            color: '#2D572C',
                            '&:hover': {
                            backgroundColor: '#2D572C',
                            color: '#fff',
                            },
                        }}
                        onClick={() => window.location.href = "/cambiar-password"} // o usa navigate si tienes react-router
                        >
                        Cambiar Contraseña
                        </Button>
                        <Divider sx={{ backgroundColor: 'black' }} />
                        <Typography variant="h6"
                        sx={{
                            color: "#2D572C",
                            fontWeight: "regular",
                            mt: 1,
                            mb: 1,
                            fontFamily: "Montserrat, sans-serif",
                            width: 300,
                        }}>
                         Nombre: {perfil.first_name} {perfil.last_name}
                        </Typography>
                        <Typography variant="h6"
                        sx={{
                            color: "#2D572C",
                            fontWeight: "regular",
                            mt: 1,
                            mb: 1,
                            fontFamily: "Montserrat, sans-serif",
                            width: 300,
                        }}>
                         Teléfono: {perfil.telefono}
                        </Typography>
                        <Typography variant="h6"
                        sx={{
                            color: "#2D572C",
                            fontWeight: "regular",
                            mt: 1,
                            mb: 1,
                            fontFamily: "Montserrat, sans-serif",
                            width: 300,
                        }}>
                         E-mail: {perfil.email}
                        </Typography>
                        <Typography variant="h6"
                        sx={{
                            color: "#2D572C",
                            fontWeight: "regular",
                            mt: 1,
                            mb: 1,
                            fontFamily: "Montserrat, sans-serif",
                            width: 300,
                        }}>
                         Descripción: {perfil.descripcion}
                        </Typography>
                    </Box>
                    
                    <Box>                        
                        <label htmlFor="avatar-upload">
                            <Button variant="text" component="span"
                            sx={{color: '#2D572C'}}>
                                Cambiar Avatar
                            </Button>
                            <input
                                id="avatar-upload"
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={cargarAvatar}
                                style={{ display: "none" }}
                            />
                        </label>

                        <TextField
                            label="Nombres"
                            name="first_name"
                            margin="normal"
                            fullWidth
                            value={perfil.first_name}
                            placeholder="Sin nombres"   
                            onChange={(e) => setPerfil({ ...perfil, first_name: e.target.value })}
                        />

                        <TextField
                            label="Apellidos"
                            name="last_name"
                            margin="normal"
                            fullWidth
                            value={perfil.last_name}
                            placeholder="Sin Apellidos"   
                            onChange={(e) => setPerfil({ ...perfil, last_name: e.target.value })}
                            
                        />

                        <TextField
                            label="Teléfono"
                            name="telefono"
                            margin="normal"
                            fullWidth
                            value={perfil.telefono}
                            placeholder="Sin teléfono"   
                            onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                            
                        />

                        <TextField
                            label="Correo Electronico"
                            name="email"
                            margin="normal"
                            fullWidth
                            value={perfil.email}
                            placeholder="Sin email"   
                            onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                            
                        />

                        <TextField
                            label="Descripción"
                            name="descripcion"
                            margin="normal"
                            fullWidth
                            value={perfil.descripcion}
                            placeholder="Sin descripción"   
                            onChange={(e) => setPerfil({ ...perfil, descripcion: e.target.value })}
                            rows={3}
                            multiline
                        />

                        <Button type="submit" onClick={guardarCambios}
                        sx={{
                            backgroundColor: '#2D572C', 
                            color: '#fff',              
                            marginTop: 2,
                            '&:hover': {
                            backgroundColor: '#FD5653', 
                            
                            }
                        }}>
                            Guardar Cambios
                        </Button>
                    </Box> 
                </Box>
            </Box>
        </Box>
        </>
    )
}
    
export default Perfil;