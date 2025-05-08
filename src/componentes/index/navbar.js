import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaSearch } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import React, { useState, useEffect } from "react";
import { logoutUser } from "../../servicios/cuentaservicios";
import { getEspacios } from "../../servicios/taskmasterservicios";
import { Divider } from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function NavBar() {

  const [espacios, setEspaciosState] = useState([]);
  const navigate = useNavigate();

  const username = localStorage.getItem("nombreUsuario");
  const avatarUrl = localStorage.getItem("avatarUrl");

  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);

  const expand = 'md';

  useEffect(() => {
    obtenerEspacios();
  }, []);

  const obtenerEspacios = async () => {
    try {
      const response = await getEspacios();
      setEspaciosState(response);
    } catch (error) {
      console.error("Error al obtener los espacios:", error);
    }
  };

  const handleEspacioClick = (espacioId, espacioNombre) => {
    localStorage.setItem('espacioId', espacioId);
    localStorage.setItem('espacioNombre', espacioNombre);
    console.log(`Espacio seleccionado (card): ${espacioNombre} (ID: ${espacioId}) - Navegando a /panel`);
    navigate('/panel');
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleSeleccion = () => {
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <>
      <Navbar key={expand} expand={expand} className="custom-navbar">
        <Container fluid>
          <img src={logo} alt="TaskMaster Logo" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
          <Navbar.Brand href="/">Espacios de Trabajo</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Menú
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="navbar_general">
                <NavDropdown title="Espacios" id="basic-nav-dropdown" href="/sel_espacios">
                  {espacios.map((espacio) => (
                    <NavDropdown.Item
                      key={espacio.id}
                      onClick={() => handleEspacioClick(espacio.id, espacio.espacio)}
                      sx={{ cursor: 'pointer', fontFamily: "'Montserrat', sans-serif'", color: '#2D572C' }}
                    >
                      {espacio.espacio}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              </Nav>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                
              {/* Usuario */}
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '15px' }}>
                <Button
                  variant="light"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    fontWeight: 'bold',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '14px',
                    backgroundColor: '#70AD47',
                    border: 'none',
                    color: '#fff',
                  }}
                  onClick={handleClick2}
                >
                  {avatarUrl ? (
                    <Avatar src={avatarUrl} alt={username} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: 14 }}>
                      {username?.[0] || 'U'}
                    </Avatar>
                  )}
                  {username}
                </Button>

                <Menu
                  anchorEl={anchorEl2}
                  open={open2}
                  onClose={handleClose2}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem component={NavLink} to="/sel_espacios" onClick={handleSeleccion}>Seleccionar espacio</MenuItem>
                  <Divider borderWidth={1} />
                  <MenuItem component={NavLink} to="/Perfil" onClick={handleClose2}>Perfil</MenuItem>
                  <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                </Menu>
              </div>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
