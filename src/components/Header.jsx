import { useAuth } from "../contexts/authContext";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './Header.css'; 

function Header() { 
  const { usuario } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
   const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[isOpen])


   return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/home" className="app-logo">
          UnaHur Anti‑Social Net
        </Link>

        <nav className="main-nav">
          {usuario ? (
            <>
              <Link to="/home">Inicio</Link>
              <Link to={`/perfil`}>Perfil</Link>
              <Link to="/crear-post">Crear Post</Link>
            </>
          ) : (
            <></>
          )}
        </nav>

        
        {usuario && (
          <div
            className={`hamburger-menu ${isOpen ? 'open' : ''}`}
            onClick={toggleMenu}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        )}
      </div>
      <nav className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        {usuario ? (
          <>
            <Link to="/home" onClick={toggleMenu}>
              Inicio
            </Link>
            <Link to={`/perfil`} onClick={toggleMenu}>
              Perfil
            </Link>
            <Link to="/crear-post" onClick={toggleMenu}>
              Crear Post
            </Link>
          </>
        ) : (
          <></>
        )}
      </nav>
    </header>
  );
}

export default Header; 