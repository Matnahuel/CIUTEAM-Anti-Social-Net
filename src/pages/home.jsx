import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const POSTS_PER_PAGE = 10;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const postsPaginated = posts.slice(startIndex, endIndex);

  useEffect(() => {
    fetch('http://localhost:3001/posts')
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar publicaciones");
        return res.json();
      })
      .then(async (postsApi) => {
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
        <section className="welcome-section">
          <h1>¡Bienvenido a UnaHur Anti-Social Net!</h1>
          <p>Tu espacio para conectar y compartir en la comunidad Unahur.</p>
          <p>Explora las últimas publicaciones o <Link to="/crear-post" className="create-post-link">Crea la tuya</Link></p>
        </section>

        <section className="posts-feed-section">
          <h2>Últimas Publicaciones</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="posts-grid">
            {postsPaginated.map((post) => (
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

                <Link to={`/posts/${post.id}`} className="view-more-button">Ver Más</Link>
              </div>
            ))}
          </div>
        </section>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅ Anterior
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                className={`pagination-btn page-number-btn ${currentPage === pageNum ? "active" : ""}`}
                onClick={() => setCurrentPage(pageNum)}
                disabled={currentPage === pageNum}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente ➡
          </button>
        </div>

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
