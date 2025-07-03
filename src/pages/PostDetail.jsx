import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const API_URL = "http://localhost:3001";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [usuarios, setUsuarios] = useState([])
  const {usuario} = useAuth()
  useEffect(() => {
    // Obtener el post
    fetch(`${API_URL}/posts/${id}`)
      .then((res) => res.json())
      .then(setPost);

    // Obtener imágenes
    fetch(`${API_URL}/postimages/post/${id}`)
      .then((res) => res.json())
      .then(setImages);

      fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then(setUsuarios);

    // Obtener comentarios
  fetch(`${API_URL}/comments/post/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${r.status}`);
      return res.json();
    })
    .then(setComments)
    .catch(err => {
      console.error("No se pudieron cargar comentarios:", err);
      setComments([]);                     
    });


  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const res = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: usuario.id,
        postId: id,
        content: newComment
      })
    });

    if (res.ok) {
      const created = await res.json();
      setComments((prev) => [...prev, created]);
      setNewComment("");
    }
  };

  if (!post) return <p>Cargando publicación...</p>;

  return (
    <div className="container">
      <h2>{post.description}</h2>

      <div>
        <h4>Etiquetas:</h4>
        {post.Tags?.map((tag) => (
          <span key={tag.id}>#{tag.name} </span>
        ))}
      </div>

      <div>
        <h4>Imágenes:</h4>
        {images.map((img) => (
          <img key={img.id} src={img.url} alt="img" style={{ maxWidth: 300, margin: 10 }} />
        ))}
      </div>

      <div>
        <h4>Comentarios:</h4>
        <ul>
          {comments.map((c) => (
            <li key={c.id}> 
            {usuarios
            .find(u => u.id === c.UserId).nickName 
            } : {c.content}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe tu comentario..."
          required
        />
        <br />
        <button type="submit">Comentar</button>
      </form>
    </div>
  );
}
