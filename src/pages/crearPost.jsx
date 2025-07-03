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
  const [newTagName, setNewTagName] = useState('');

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

  const handleCreateTag = async () => {
    const name = newTagName.trim();
    if (!name) return;

    try {
      const res = await fetch('http://localhost:3001/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error('No se pudo crear la etiqueta');

      const nueva = await res.json();
      setNewTagName('');
      setTags(prev => [...prev, nueva]);
      setSelectedTags(prev => [...prev, nueva.id]);
    } catch (err) {
      console.error(err);
      alert('Error al crear la etiqueta');
    }
  };
  const tagDuplicado = tags.some(
  t => t.name.toLowerCase() === newTagName.trim().toLowerCase()
);

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
             <div
      style={{
        maxHeight: '120px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '5px'
      }}
    >
      {tags.map(tag => (
        <label
          key={tag.id}
          style={{ display: 'block', marginBottom: '4px', cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            checked={selectedTags.includes(tag.id)}
            onChange={e => {
              if (e.target.checked) {
                setSelectedTags(prev => [...prev, tag.id]);
              } else {
                setSelectedTags(prev => prev.filter(id => id !== tag.id));
              }
            }}
            style={{ marginRight: '6px' }}
          />
          {tag.name}
        </label>
      ))}
    </div>

            <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
              <input
                type="text"
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                placeholder="Nueva etiqueta"
                style={{ flex: 1 }}
              />
             <button
                      type="button"
                      onClick={handleCreateTag}
                      disabled={!newTagName.trim() || tagDuplicado} 
                    >
                      {tagDuplicado ? 'Ya existe' : 'Crear'}
                    </button>
            </div>
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
