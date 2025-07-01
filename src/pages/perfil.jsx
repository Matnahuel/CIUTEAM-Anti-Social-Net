import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Profile() {
  const { usuario, logout, cargando } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Obtener publicaciones del usuario
  useEffect(() => {
    if (!cargando && usuario?.id) {
      fetch(`http://localhost:3000/posts?userId=${usuario.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar publicaciones");
          return res.json();
        })
        .then(setPublicaciones)
        .catch((err) => setError(err.message));
    }
  }, [usuario, cargando]);

  if (cargando) return <div>Cargando perfil...</div>;
  if (!usuario) return null; // PrivateRoute ya redirige, esto es por si acaso

  return (
    <div className="profile-page">
      <Header />
      <main>
        <section className="user-section">
          <h2>Hola, {usuario.nickName}!</h2>
          <button onClick={() => { logout(); navigate("/"); }}>
            Cerrar sesión {/* Corregido el typo "sesión" → "sesión" */}
          </button>
        </section>

        <section className="posts-section">
          <h3>Tus publicaciones</h3>
          {error && <p className="error">{error}</p>}
          {publicaciones.length === 0 ? (
            <p>No hay publicaciones aún.</p>
          ) : (
            <div className="posts-grid">
              {publicaciones.map((post) => (
                <div key={post.id} className="post-card">
                  <p>{post.description}</p>
                  <button onClick={() => navigate(`/post/${post.id}`)}>
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