import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('http://localhost:3001/posts')
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar publicaciones");
        return res.json();
      })
      .then(async (postsApi) => {
        // Para cada post, traer imágenes
        const postsConImagenes = await Promise.all(
          postsApi.map(async (post) => {
            const resImg = await fetch(`http://localhost:3001/postimages/post/${post.id}`);
            const images = await resImg.json();
            return {
              ...post,
              images: images.map((img) => img.url),
            };
          })
        );
        setPosts(postsConImagenes);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="home-general-container">
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
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <p className="post-description">{post.description}</p>

                {post.images && post.images.length > 0 && (
                  <div className="post-images">
                    {post.images.map((image, index) => (
                      <img key={index} src={image} alt={`Imagen ${index + 1}`} className="post-image" />
                    ))}
                  </div>
                )}

                <div className="post-meta">
                  <div className="post-tags">
                    {post.Tags && post.Tags.map((tag) => (
                      <span key={tag.id} className="post-tag">#{tag.name}</span>
                    ))}
                  </div>
                  <p className="post-comments">Comentarios: {/* Si querés mostrar contarlos en el futuro */}</p>
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
    </div>
  );
}

export default Home;
