import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import './CrearPost.css';

const API_URL = "http://localhost:3001";

function CrearPost() {
  const { usuario, cargando } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const fileInputRef = React.useRef(null);
  
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
    // Limpieza de Object URLs para evitar memory leaks
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleTriggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Filtrar archivos que no son imágenes (seguridad adicional en el frontend)
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if(imageFiles.length !== files.length){
      setError('Solo se admiten archivos de imagen.');
    }

    const newFiles = [...selectedFiles, ...imageFiles];
    setSelectedFiles(newFiles);

    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
    event.target.value = null; 
  };
  
  const handleRemoveImage = (indexToRemove) => {
    // Revocar el Object URL para liberar memoria
    URL.revokeObjectURL(imagePreviews[indexToRemove]); 
    
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
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
    if (!description.trim()) {
      setError('La descripción del post no puede estar vacía.');
      return;
    }
    if (!usuario) {
      setError('Debes iniciar sesión para crear un post.');
      return;
    }
    
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      // 1. Subir todas las imágenes seleccionadas en paralelo
      const uploadPromises = selectedFiles.map(file => {
        const formData = new FormData();
        formData.append('image', file);
        return fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        }).then(res => {
          if (!res.ok) throw new Error('Error al subir una imagen.');
          return res.json();
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const imageUrls = uploadedImages.map(img => img.imageUrl);

      // 2. Crear el post con los datos y las URLs de las imágenes
      const postData = {
        description: description.trim(),
        userId: usuario.id,
        tagIds: selectedTagIds,
        imageUrls: imageUrls,
      };

      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al crear la publicación.');
      }

      const newPost = await res.json();

      // 3. Limpiar el formulario y mostrar mensaje de éxito
      setSuccessMessage('¡Publicación creada con éxito!');
      setDescription('');
      setSelectedFiles([]);
      setImagePreviews([]);
      setSelectedTagIds([]);
      setNewTagInput('');
      setShowTagsSection(false);

      // 4. Redirigir al nuevo post después de un momento
      setTimeout(() => {
        // Redirigir a la vista del post individual si existe, si no a home.
        // Asumiendo que la navegación a un post es `/posts/${newPost.id}`
        navigate(newPost.id ? `/posts/${newPost.id}` : '/');
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
            <label>Añadir Imágenes</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              multiple
              accept="image/png, image/jpeg, image/gif"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={handleTriggerFileInput}
              className="add-button"
            >
              + Agregar imagenes
            </button>
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={url} alt={`Preview ${index}`} className="image-thumbnail" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
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