import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import "./perfil.css";

export default function Profile() {
  const { usuario, logout, cargando } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!cargando && usuario?.id) {
      fetch(`http://localhost:3001/posts?userId=${usuario.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar publicaciones");
          return res.json();
        })
        .then(async (posts) => {
          // 🔥 Para cada post, traer sus imágenes
          const postsConImagenes = await Promise.all(
            posts.map(async (post) => {
              const resImg = await fetch(`http://localhost:3001/postimages/post/${post.id}`);
              const images = await resImg.json();
              return { ...post, PostImages: images };
            })
          );
          setPublicaciones(postsConImagenes);
        })
        .catch((err) => setError(err.message));
    }
  }, [usuario, cargando]);

  if (cargando)
    return (
      <div className="profile-page">
        <main className="loading-section">
          <p>Cargando perfil...</p>
        </main>
      </div>
    );

  if (!usuario) return null;

  return (
    <div className="profile-page">
      <main>
        <section className="user-section">
          <h2>Hola, {usuario.nickName}!</h2>
          <button
            className="logout-button"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Cerrar sesión
          </button>
        </section>

        <section className="posts-section">
          <h3>Tus publicaciones</h3>
          {error && <p className="error">{error}</p>}

          {publicaciones.length === 0 ? (
            <p className="no-posts-message">No hay publicaciones aún.</p>
          ) : (
            <div className="posts-grid">
              {publicaciones.map((post) => (
                <div key={post.id} className="post-card">
                  <p className="post-description">{post.description}</p>

                  {post.PostImages && post.PostImages.length > 0 && (
                    <div className="post-images" style={{ marginBottom: "1rem" }}>
                      {post.PostImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt={`Imagen ${idx + 1}`}
                          style={{ width: "100%", borderRadius: "5px", marginBottom: "8px" }}
                        />
                      ))}
                    </div>
                  )}

                  <button
                    className="view-post-button"
                    onClick={() => navigate(`/posts/${post.id}`)} // Cambiado a plural "posts"
                  >
                    Ver más
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
