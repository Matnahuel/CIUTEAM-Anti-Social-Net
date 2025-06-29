
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

function Header() { 
  return (
    <header className="main-header"> {}
      <div className="header-container">
        <Link to="/home" className="app-logo"> {}
          UnaHur Anti-Social Net
        </Link>
        <nav className="main-nav"> {}
          <Link to="/home">Inicio</Link>
          <Link to="/perfil">Perfil</Link> {}
          <Link to="/crear-post">Crear Post</Link> {}
        </nav>
      </div>
    </header>
  );
}

export default Header; 