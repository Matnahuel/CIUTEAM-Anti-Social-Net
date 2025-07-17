import React from 'react';
import { Link } from 'react-router-dom';

function PostCard({ post, usuario, handleReaction }) {
  return (
    <div className="post-card">
      <p className="post-author-nickname">@{post.User?.nickName || 'Usuario Desconocido'}</p>

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
        <p className="post-comments">Comentarios: {post.Comments ? post.Comments.length : 0}</p>
      </div>

      <div className="post-reactions">
        <button
          className={`reaction-button like-button ${post.myReaction === 'like' ? 'active' : ''}`}
          onClick={() => handleReaction(post.id, 'like')}
          disabled={!usuario}
        >
          👍 {post.likes || 0}
        </button>
        <button
          className={`reaction-button dislike-button ${post.myReaction === 'dislike' ? 'active' : ''}`}
          onClick={() => handleReaction(post.id, 'dislike')}
          disabled={!usuario}
        >
          👎 {post.dislikes || 0}
        </button>
      </div>

      <Link to={`/posts/${post.id}`} className="view-more-button">Ver Más</Link>
    </div>
  );
}

export default PostCard;