import React from 'react';
import './Footer.css';

function Footer() { 
  return (
    <footer className="main-footer"> {}
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} UnaHur Anti-Social Net. Todos los derechos reservados.</p>
        <nav className="utility-links"> {}
          <a href="https://github.com/IRojas99/CIUTEAM-Anti-Social-Net">Privacidad</a>
          <a href="https://github.com/IRojas99/CIUTEAM-Anti-Social-Net">Términos</a>
          <a href="https://github.com/IRojas99/CIUTEAM-Anti-Social-Net">Contacto</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer; 