
import React from 'react';
import './Footer.css';

function Footer() { 
  return (
    <footer className="main-footer"> {}
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} UnaHur Anti-Social Net. Todos los derechos reservados.</p>
        <nav className="utility-links"> {}
          <a href="/privacidad">Privacidad</a>
          <a href="/terminos">Términos</a>
          <a href="/contacto">Contacto</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer; 