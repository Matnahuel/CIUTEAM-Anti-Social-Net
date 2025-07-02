import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
        .then(setPublicaciones)
        .catch((err) => setError(err.message));
    }
  }, [usuario, cargando]);

  if (cargando) return (
    <div className="profile-page">
      <Header />
      <main className="loading-section">
        <p>Cargando perfil...</p>
      </main>
      <Footer />
    </div>
  );

  if (!usuario) return null;

  return (
    <div className="profile-page">
      <Header />
      <main>
        <section className="user-section">
          <h2>Hola, {usuario.nickName}!</h2>
          <button 
            className="logout-button"
            onClick={() => { logout(); navigate("/"); }}
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

                  {post.Tags && post.Tags.length > 0 && (
                    <div className="post-tags" style={{ marginTop: "0.5rem" }}>
                      {post.Tags.map((tag, idx) => (
                        <span key={idx} className="post-tag">#{tag.name}</span>
                      ))}
                    </div>
                  )}

                  <button 
                    className="view-post-button"
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    Ver más
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
