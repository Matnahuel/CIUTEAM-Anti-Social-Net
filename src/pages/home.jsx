import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import './Home.css';
import PostCard from './PostCard';

const API_URL = "http://localhost:3001";

function Home() {
  const { usuario } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingPosts, setLoadingPosts] = useState(true);

  const POSTS_PER_PAGE = 9;

  const filteredPosts = posts.filter(post => {
    if (searchTerm === "") {
      return true;
    }
    return post.Tags && Array.isArray(post.Tags) && post.Tags.some(tag =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const postsPaginated = filteredPosts.slice(startIndex, endIndex);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const navigate = useNavigate();

  const handleReaction = async (postId, type) => {
    if (!usuario) {
      alert('Debes iniciar sesión para reaccionar a una publicación.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: usuario.id, postId, type }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al procesar la reacción.');
      }

      const responseData = await res.json();
      console.log('Reacción procesada:', responseData);

      setPosts(prevPosts =>
        prevPosts.map(p => {
          if (p.id === postId) {
            let newMyReaction = p.myReaction;

            if (responseData.action === 'created') {
              newMyReaction = type;
            } else if (responseData.action === 'updated') {
              newMyReaction = type;
            } else if (responseData.action === 'deleted') {
              newMyReaction = null;
            }

            return {
              ...p,
              likes: responseData.newLikes,
              dislikes: responseData.newDislikes,
              myReaction: newMyReaction
            };
          }
          return p;
        })
      );

    } catch (err) {
      console.error('Error al reaccionar:', err);
      setError(err.message || 'No se pudo procesar la reacción.');
    }
  };

  useEffect(() => {
    const fetchAllPostsData = async () => {
      setLoadingPosts(true);
      setError("");
      try {
        const resPosts = await fetch(`${API_URL}/posts`);
        if (!resPosts.ok) {
          throw new Error(`Error al cargar publicaciones: ${resPosts.statusText}`);
        }
        const postsApi = await resPosts.json();

        const postsConDataAdicional = await Promise.all(
          postsApi.map(async (post) => {
            const resImg = await fetch(`${API_URL}/postimages/post/${post.id}`);
            const images = resImg.ok ? await resImg.json() : [];

            const resComments = await fetch(`${API_URL}/comments/post/${post.id}`);
            const comments = resComments.ok ? await resComments.json() : [];

            const resReactions = await fetch(`${API_URL}/reactions/post/${post.id}`);
            let reactionData = { likes: 0, dislikes: 0, reactions: [] };
            if (resReactions.ok) {
                reactionData = await resReactions.json();
            } else {
                console.warn(`No se pudieron cargar reacciones para el post ${post.id}`);
            }

            const myReaction = usuario
              ? reactionData.reactions.find(r => r.UserId === usuario.id)?.type || null
              : null;

            return {
              ...post,
              images: images.map((img) => img.url),
              Comments: comments,
              likes: reactionData.likes,
              dislikes: reactionData.dislikes,
              myReaction: myReaction
            };
          })
        );
        setPosts(postsConDataAdicional);
      } catch (err) {
        console.error("Error en Home.jsx useEffect:", err);
        setError(err.message || "Ocurrió un error al cargar los datos.");
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchAllPostsData();
  }, [usuario]);

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

          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar publicaciones por tag..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="tag-search-input"
            />
          </div>

          {loadingPosts && <p className="loading-message">Cargando publicaciones...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loadingPosts && !error && filteredPosts.length === 0 && searchTerm === "" && (
            <p className="no-posts-message">No hay publicaciones para mostrar.</p>
          )}
          {!loadingPosts && !error && filteredPosts.length === 0 && searchTerm !== "" && (
            <p className="no-posts-message">No se encontraron publicaciones con el tag "{searchTerm}".</p>
          )}

          {!loadingPosts && filteredPosts.length > 0 && (
            <div className="posts-grid">
              {postsPaginated.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  usuario={usuario}
                  handleReaction={handleReaction}
                />
              ))}
            </div>
          )}
        </section>

        {!loadingPosts && filteredPosts.length > 0 && (
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
        )}

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