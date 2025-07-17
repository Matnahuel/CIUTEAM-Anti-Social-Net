import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import './CrearPost.css';

const API_URL = "http://localhost:3001";

function CrearPost() {
  const { usuario, cargando } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTagsSection, setShowTagsSection] = useState(false);

  useEffect(() => {
    if (!cargando && !usuario) {
      navigate('/login');
    }
  }, [usuario, cargando, navigate]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${API_URL}/tags`);
        if (!res.ok) throw new Error('Error al cargar las etiquetas');
        const data = await res.json();
        setTags(data);
      } catch (err) {
        console.error('Error al cargar etiquetas:', err);
        setError('No se pudieron cargar las etiquetas existentes.');
      }
    };
    fetchTags();
  }, []);

  const handleAddImage = (e) => {
    e.preventDefault();
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (urlToRemove) => {
    setImages(images.filter(url => url !== urlToRemove));
  };

  const handleToggleTag = (tagId) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateTag = async () => {
    const name = newTagInput.trim();
    if (!name) {
      setError('El nombre de la etiqueta no puede estar vacío.');
      return;
    }

    const tagExists = tags.some(t => t.name.toLowerCase() === name.toLowerCase());
    if (tagExists) {
      setError('Esta etiqueta ya existe.');
      return;
    }

    setError('');

    try {
      const res = await fetch(`${API_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'No se pudo crear la etiqueta.');
      }

      const nuevaTag = await res.json();
      setNewTagInput('');
      setTags(prev => [...prev, nuevaTag]);
      setSelectedTagIds(prev => [...prev, nuevaTag.id]);
      setSuccessMessage('Etiqueta creada y seleccionada.');
    } catch (err) {
      console.error('Error al crear la etiqueta:', err);
      setError(err.message || 'Error al crear la etiqueta.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!usuario) {
      setError('Debes iniciar sesión para crear un post.');
      setIsSubmitting(false);
      return;
    }

    if (!description.trim()) {
      setError('La descripción del post no puede estar vacía.');
      setIsSubmitting(false);
      return;
    }

    try {
      const postData = {
        description: description.trim(),
        userId: usuario.id,
        tagIds: selectedTagIds,
      };

      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al crear la publicación.');
      }

      const newPost = await res.json();

      for (const url of images) {
        if (url.trim()) {
          await fetch(`${API_URL}/postimages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: url.trim(),
              postId: newPost.id,
            }),
          });
        }
      }

      setSuccessMessage('¡Publicación creada con éxito!');
      setDescription('');
      setImages([]);
      setNewImageUrl('');
      setSelectedTagIds([]);
      setNewTagInput('');
      setShowTagsSection(false);

      setTimeout(() => {
        navigate(`/posts/${newPost.id}`);
      }, 1500);

    } catch (err) {
      console.error('Error al crear post:', err);
      setError(err.message || 'Ocurrió un error inesperado al crear el post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cargando || !usuario) {
    return (
      <div className="crear-post-container">
        <p className="loading-message">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="crear-post-container">
      <div className="crear-post-card">
        <h2>Crear Nueva Publicación</h2>

        <form onSubmit={handleSubmit} className="crear-post-form">
          <div className="form-group">
            <label htmlFor="description">Descripción del Post *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escribe aquí tu publicación..."
              required
              rows="5"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Añadir Imágenes (URL)</label>
            <div className="image-input-group">
              <input
                type="url"
                id="imageUrl"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Pega la URL de la imagen aquí (ej: https://ejemplo.com/imagen.jpg)"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="add-button"
                disabled={!newImageUrl.trim()}
              >
                + Añadir
              </button>
            </div>
            {images.length > 0 && (
              <div className="image-previews">
                {images.map((url, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={url} alt={`Preview ${index}`} className="image-thumbnail" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="remove-image-button"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowTagsSection(!showTagsSection)}
            className="toggle-tags-button"
          >
            {showTagsSection ? "Ocultar Etiquetas" : "Gestionar Etiquetas"}
          </button>

          {showTagsSection && (
            <div className="form-group tags-section-content">
              <label>Seleccionar Etiquetas Existentes:</label>
              <div className="tag-checkboxes-container">
                {tags.length === 0 ? (
                  <p>No hay etiquetas disponibles. ¡Crea una nueva!</p>
                ) : (
                  tags.map(tag => (
                    <label key={tag.id} className="tag-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedTagIds.includes(tag.id)}
                        onChange={() => handleToggleTag(tag.id)}
                      />
                      {tag.name}
                    </label>
                  ))
                )}
              </div>

              <label htmlFor="newTagName">Crear Nueva Etiqueta:</label>
              <div className="tag-input-group">
                <input
                  type="text"
                  id="newTagName"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Nombre de la nueva etiqueta (ej: unahur, programación)"
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="add-button"
                  disabled={!newTagInput.trim()}
                >
                  Crear
                </button>
              </div>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !description.trim()}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Post'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                navigate('/');
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearPost;