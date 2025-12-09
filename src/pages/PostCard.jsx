import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const API_URL = "http://localhost:3001";
const COMMENTS_PER_FETCH = 5; // Fetch 5 at a time for smoother scrolling

function PostCard({ post, usuario, handleReaction }) {
  const [currentImage, setCurrentImage] = useState(0);
  const commentsContainerRef = useRef(null);

  // State for comments
  const [comments, setComments] = useState([]);
  const [offset, setOffset] = useState(0);
  const [areCommentsVisible, setAreCommentsVisible] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  
  const totalComments = post.commentCount || 0;
  const [totalCommentsState, setTotalCommentsState] = useState(post.commentCount || 0);

  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [openCommentMenuId, setOpenCommentMenuId] = useState(null); // Nuevo estado para controlar el menú del comentario
  const [editingCommentId, setEditingCommentId] = useState(null); // Estado para el ID del comentario en edición
  const [editedCommentContent, setEditedCommentContent] = useState(''); // Estado para el contenido del comentario editado

  const handleToggleCommentMenu = (commentId) => {
    setOpenCommentMenuId(prevId => prevId === commentId ? null : commentId);
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
    setOpenCommentMenuId(null); // Cerrar el menú después de seleccionar editar
  };

  const handleDeleteClick = async (commentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        const response = await fetch(`${API_URL}/comments/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${usuario.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el comentario');
        }

        setComments(prev => prev.filter(c => c.id !== commentId));
        setTotalCommentsState(prev => prev - 1);
        setOpenCommentMenuId(null); // Cerrar el menú

      } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        alert('No se pudo eliminar el comentario.');
      }
    }
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usuario.token}`,
        },
        body: JSON.stringify({ content: editedCommentContent }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el comentario');
      }

      const updatedComment = await response.json();
      setComments(prev => prev.map(c => c.id === commentId ? updatedComment : c));
      setEditingCommentId(null); // Salir del modo edición

    } catch (error) {
      console.error('Error al guardar el comentario:', error);
      alert('No se pudo guardar el comentario.');
    }
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usuario.token}`, // Asumiendo que usuario.token contiene el token de auth
        },
        body: JSON.stringify({
          postId: post.id,
          content: newCommentText,
          userId: usuario.id, // Añadido el userId
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el comentario');
      }

      const newComment = await response.json();
      
      setComments(prev => [...prev, newComment]);
      setNewCommentText('');
      setTotalCommentsState(prev => prev + 1); // Incrementar el contador total de comentarios
      setOffset(prev => prev + 1); // Incrementar el offset para evitar recargar el mismo comentario

    } catch (error) {
      console.error('Error al enviar el comentario:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const fetchComments = async () => {
    // Prevent fetching if already loading, or if all comments are loaded
    if (isLoadingComments || (comments.length >= totalCommentsState && totalCommentsState > 0)) return;
    
    setIsLoadingComments(true);

    try {
      const res = await fetch(`${API_URL}/comments/post/${post.id}?limit=${COMMENTS_PER_FETCH}&offset=${offset}`);
      if (!res.ok) throw new Error('Error al cargar comentarios');
      const data = await res.json();
      
      // Using a function with setComments to get the latest state
      setComments(prev => [...prev, ...data.comments]);
      setOffset(prev => prev + data.comments.length);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    const container = commentsContainerRef.current;
    
    const handleScroll = () => {
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        // Fetch more when the user is 50px away from the bottom
        if (scrollTop + clientHeight >= scrollHeight - 50) {
          fetchComments();
        }
      }
    };

    if (areCommentsVisible && container) {
      container.addEventListener('scroll', handleScroll);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [areCommentsVisible, isLoadingComments, comments]); // Rerun effect if these change

  const handleShowComments = () => {
    const shouldShow = !areCommentsVisible;
    setAreCommentsVisible(shouldShow);
    // Fetch comments only if opening the section for the first time
    if (shouldShow && comments.length === 0 && totalCommentsState > 0) {
      fetchComments();
    }
  };

  const nextImage = (e) => { e.stopPropagation(); setCurrentImage((prev) => (prev + 1) % post.images.length); };
  const prevImage = (e) => { e.stopPropagation(); setCurrentImage((prev) => (prev - 1 + post.images.length) % post.images.length); };

  return (
    <div className="post-card">
      <p className="post-author-nickname">@{post.User?.nickName || 'Usuario Desconocido'}</p>
      <p className="post-description">{post.description}</p>

      {post.images && post.images.length > 0 && (
        <div className="post-card-carousel">
          {post.images.length > 1 && <button onClick={prevImage} className="carousel-button prev">‹</button>}
          <img src={post.images[currentImage]} alt={`Imagen ${currentImage + 1}`} className="post-image" />
          {post.images.length > 1 && <button onClick={nextImage} className="carousel-button next">›</button>}
        </div>
      )}

      <div className="post-meta">
        <div className="post-tags">{post.Tags && post.Tags.map((tag) => <span key={tag.id} className="post-tag">#{tag.name}</span>)}</div>
        <button onClick={handleShowComments} className="post-comments-toggle">
          {areCommentsVisible ? 'Ocultar' : 'Ver'} comentarios ({totalCommentsState})
        </button>
      </div>
      
      {areCommentsVisible && (
        <div ref={commentsContainerRef} className="post-card-comments-section">
          {usuario && ( // Solo mostrar si el usuario está logueado
            <div className="add-comment-section">
              <textarea
                className="comment-input"
                placeholder="Escribe un comentario..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                disabled={isSubmittingComment}
              />
              <button
                className="submit-comment-button"
                onClick={handleAddComment}
                disabled={!newCommentText.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          )}
          {comments.map(comment => (
            <div key={comment.id} className="post-card-comment">
              {editingCommentId === comment.id ? (
                <div className="comment-edit-mode">
                  <textarea
                    className="comment-edit-input"
                    value={editedCommentContent}
                    onChange={(e) => setEditedCommentContent(e.target.value)}
                  />
                  <div className="comment-edit-actions">
                    <button onClick={() => handleSaveEdit(comment.id)}>Guardar</button>
                    <button onClick={() => setEditingCommentId(null)}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="comment-header">
                    <strong>@{comment.User?.nickName || 'Anónimo'}:</strong>
                    {usuario && usuario.id === comment.UserId && (
                      <div className="comment-options-container">
                        <button className="comment-options-button" onClick={() => handleToggleCommentMenu(comment.id)}>
                          ...
                        </button>
                        {openCommentMenuId === comment.id && (
                          <div className="comment-dropdown-menu">
                            <button onClick={() => handleEditClick(comment)}>Editar</button>
                            <button onClick={() => handleDeleteClick(comment.id)}>Eliminar</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p>{comment.content}</p>
                </>
              )}
            </div>
          ))}
          {isLoadingComments && <p className="loading-message">Cargando...</p>}
          {comments.length > 0 && comments.length === totalCommentsState && (
            <p className="no-more-comments">No hay más comentarios.</p>
          )}
        </div>
      )}

      <div className="post-reactions">
        <button className={`reaction-button like-button ${post.myReaction === 'like' ? 'active' : ''}`} onClick={() => handleReaction(post.id, 'like')} disabled={!usuario}>
          👍 {post.likes || 0}
        </button>
        <button className={`reaction-button dislike-button ${post.myReaction === 'dislike' ? 'active' : ''}`} onClick={() => handleReaction(post.id, 'dislike')} disabled={!usuario}>
          👎 {post.dislikes || 0}
        </button>
      </div>


    </div>
  );
}

export default PostCard;