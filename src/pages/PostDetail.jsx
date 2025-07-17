import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import './PostDetail.css';

const API_URL = "http://localhost:3001";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useAuth();

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resPost = await fetch(`${API_URL}/posts/${id}`);
        if (!resPost.ok) {
          throw new Error(`Error al cargar la publicación: ${resPost.statusText}`);
        }
        const postData = await resPost.json();

        const resImages = await fetch(`${API_URL}/postimages/post/${id}`);
        let postImages = [];
        if (resImages.ok) {
          const imagesData = await resImages.json();
          postImages = imagesData.map(img => img.url);
        } else {
          console.warn(`No se pudieron cargar imágenes para el post ${id}`);
        }

        const resUsers = await fetch(`${API_URL}/users`);
        if (!resUsers.ok) {
          throw new Error(`Error al cargar usuarios: ${resUsers.statusText}`);
        }
        const usersData = await resUsers.json();
        setUsers(usersData);

        const resComments = await fetch(`${API_URL}/comments/post/${id}`);
        let postComments = [];
        if (resComments.ok) {
          postComments = await resComments.json();
        } else {
          console.warn(`No se pudieron cargar comentarios para el post ${id}`);
        }

        setPost({
          ...postData,
          images: postImages,
          Comments: postComments
        });
        
        setComments(postComments);

      } catch (err) {
        console.error("Error al cargar detalles del post:", err);
        setError(err.message || "Ocurrió un error al cargar la publicación.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("El comentario no puede estar vacío.");
      return;
    }
    if (!usuario) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: usuario.id,
          postId: id,
          content: newComment,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al enviar el comentario.");
      }

      const createdComment = await res.json();
      setComments((prev) => [...prev, { ...createdComment, UserId: usuario.id }]); 
      setNewComment("");
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      alert(`No se pudo enviar el comentario: ${err.message}`);
    }
  };

  if (loading) {
    return <p className="loading-message">Cargando publicación...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  if (!post) {
    return <p className="no-content-message">Publicación no encontrada.</p>;
  }

  return (
    <div className="post-detail-container">
      <h1 className="post-detail-title">{post.description}</h1>

      {post.images && post.images.length > 0 && (
        <div className="post-detail-images">
          <img 
            src={post.images[0]} 
            alt={post.description} 
            className="post-detail-main-image" 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400/555555/FFFFFF?text=Imagen+no+disponible'; }}
          />
          {post.images.length > 1 && (
            <div className="post-detail-thumbnails">
              {post.images.slice(1).map((imgUrl, index) => (
                <img 
                  key={index} 
                  src={imgUrl} 
                  alt={`Imagen ${index + 2}`} 
                  className="post-detail-thumbnail-image" 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100x75/555555/FFFFFF?text=Miniatura'; }}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="post-detail-meta">
        <p className="post-detail-author">Publicado por: @{post.User?.nickName || 'Usuario Desconocido'}</p>
      </div>

      {post.Tags && post.Tags.length > 0 && (
        <div className="post-detail-tags">
          <h4>Etiquetas:</h4>
          {post.Tags.map((tag) => (
            <span key={tag.id} className="post-detail-tag">#{tag.name} </span>
          ))}
        </div>
      )}

      <div className="post-detail-comments-section">
        <h4>Comentarios:</h4>
        <ul className="comment-list">
          {comments && comments.length > 0 ? (
            comments.map((c) => {
              const commentUser = users.find((u) => u.id === c.UserId);
              return (
                <li key={c.id} className="comment-item">
                  <span className="comment-author">@{commentUser ? commentUser.nickName : 'Usuario Desconocido'}:</span>{" "}
                  <span className="comment-content">{c.content}</span>
                </li>
              );
            })
          ) : (
            <li className="no-comments-message">No hay comentarios aún.</li>
          )}
        </ul>

        {usuario ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              required
              className="comment-textarea"
            />
            <button type="submit" className="submit-comment-button">Comentar</button>
          </form>
        ) : (
          <p className="login-to-comment-message">Debes iniciar sesión para comentar.</p>
        )}
      </div>
    </div>
  );
}