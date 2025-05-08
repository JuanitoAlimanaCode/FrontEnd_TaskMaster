import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaArrowRight } from 'react-icons/fa';
import logo from '../../assets/logo.png';

function OffcanvasExample() {

  const expand = 'md';

  return (
    <>
        <Navbar key={expand} expand={expand} className="custom-navbar" >
          <Container fluid>
            <img src={logo} alt="TaskMaster Logo" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
            <Navbar.Brand href="/">TaskMaster</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="Login">Iniciar Sesión</Nav.Link>
                  <Button href="Registro" className="btn-registro ms-2">Registrarse Ahora <FaArrowRight /></Button>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      
    </>
  );
}

export default OffcanvasExample;
