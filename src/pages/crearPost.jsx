import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';

function CrearPost() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTags, setShowTags] = useState(false); // ✅ Estado para mostrar u ocultar

  useEffect(() => {
    fetch('http://localhost:3001/tags')
      .then(res => res.json())
      .then(data => setTags(data))
      .catch(err => console.error('Error al cargar etiquetas', err));
  }, []);

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageField = (index) => {
    const newUrls = [...imageUrls];
    newUrls.splice(index, 1);
    setImageUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert("La descripción es obligatoria");
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          userId: usuario.id,
          tagIds: selectedTags,
        }),
      });
      const post = await res.json();

      for (const url of imageUrls) {
        if (url.trim()) {
          await fetch('http://localhost:3001/postimages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url,
              postId: post.id,
            }),
          });
        }
      }

      alert("¡Publicación creada con éxito!");
      navigate('/perfil');
    } catch (err) {
      console.error("Error al crear publicación", err);
      alert("Error al crear la publicación");
    }
  };

  return (
    <div className="home-general-container">
      <main className="home-main-content">
        <h2>Crear nueva publicación</h2>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div>
            <label>Descripción *</label><br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿Qué estás pensando?"
              required
              style={{ width: '100%', minHeight: '100px', marginBottom: '10px' }}
            />
          </div>

          <div>
            <label>URLs de imágenes (opcional):</label>
            {imageUrls.map((url, index) => (
              <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://..."
                  style={{ flex: 1, marginRight: '5px' }}
                />
                <button type="button" onClick={() => removeImageField(index)}>❌</button>
              </div>
            ))}
            <button type="button" onClick={addImageField} className="create-post-link">
              Agregar otra URL
            </button>
          </div>

          {/* ✅ Botón para mostrar u ocultar selector */}
          <button
            type="button"
            onClick={() => setShowTags(!showTags)}
            className="create-post-link"
            style={{ marginTop: '15px' }}
          >
            {showTags ? "Ocultar etiquetas" : "Seleccionar etiquetas"}
          </button>

          {showTags && (
            <div style={{ marginTop: '15px' }}>
              <label>Seleccionar etiquetas:</label><br />
              <select
                multiple
                value={selectedTags}
                onChange={(e) =>
                  setSelectedTags(Array.from(e.target.selectedOptions, opt => Number(opt.value)))
                }
                style={{ width: '100%', height: '120px' }}
              >
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className="create-post-link" style={{ marginTop: '15px' }}>
            Publicar
          </button>
        </form>
      </main>
    </div>
  );
}

export default CrearPost;
