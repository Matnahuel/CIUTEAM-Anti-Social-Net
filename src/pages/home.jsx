
import React from 'react';
import { Link } from 'react-router-dom'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css';


const examplePosts = [
  {
    id: 1,
    description: "Qué día increíble! #UnaHur",
    images: ["https://picsum.photos/id/237/400/250", "https://picsum.photos/id/238/400/250"], 
    tags: ["React", "Programación", "Universidad"],
    commentsCount: 15,
  },
  {
    id: 2,
    description: "Diseñando la interfaz #DiseñoWeb",
    images: ["https://picsum.photos/id/239/400/250"],
    tags: ["Diseño", "UI/UX"],
    commentsCount: 8,
  },
  {
    id: 3,
    description: "Recordando ",
    images: ["https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU"],
    tags: ["Python", "Desarrollo"],
    commentsCount: 20,
  },
  {
    id: 4,
    description: "Explorando nuevas librerías de CSS para hacer animaciones más fluidas.",
    images: ["https://picsum.photos/id/240/400/250", "https://picsum.photos/id/241/400/250", "https://picsum.photos/id/242/400/250"],
    tags: ["CSS", "Frontend"],
    commentsCount: 5,
  },
];

function Home() {
  return (
    <div className="home-general-container">
      <Header />

      <main className="home-main-content">
        {/* Banner de bienvenida */}
        <section className="welcome-section">
          <h1>¡Bienvenido a UnaHur Anti-Social Net!</h1>
          <p>Tu espacio para conectar y compartir en la comunidad Unahur.</p>
          <p>Explora las últimas publicaciones o <Link to="/crear-post" className="create-post-link">crea la tuya</Link>.</p>
        </section>

        {/* Feed de publicaciones recientes */}
        <section className="posts-feed-section">
          <h2>Últimas Publicaciones</h2>
          <div className="posts-grid">
            {examplePosts.map(post => (
              <div key={post.id} className="post-card">
                <p className="post-description">{post.description}</p>
                {post.images && post.images.length > 0 && (
                  <div className="post-images">
                    {post.images.map((image, index) => (
                      <img key={index} src={image} alt={`Post image ${index + 1}`} className="post-image" />
                    ))}
                  </div>
                )}
                <div className="post-meta">
                  <div className="post-tags">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="post-tag">#{tag}</span>
                    ))}
                  </div>
                  <p className="post-comments">Comentarios: {post.commentsCount}</p>
                </div>
                <Link to={`/post/${post.id}`} className="view-more-button">Ver Más</Link>
              </div>
            ))}
          </div>
        </section>

        {/* Sección Sobre nosotros */}
        <section className="about-us-section">
          <h2>Sobre Nuestra Red</h2>
          <p>UnaHur Anti-Social Net es una plataforma creada por y para la comunidad de la Universidad Nacional de Hurlingham. Nuestro objetivo es fomentar la conexión, el intercambio de ideas y la colaboración entre estudiantes, profesores y egresados.</p>
          <blockquote>"Conectando mentes, construyendo comunidad."</blockquote>
        </section>
      </main>

      <Footer />
       </div>
  );
}

export default Home;