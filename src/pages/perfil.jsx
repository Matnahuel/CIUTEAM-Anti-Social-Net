import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import './perfil.css';

const API_URL = "http://localhost:3001";

function Perfil() {
    const { logout, usuario, isLoading, updateCurrentUserProfile } = useAuth();
    const navigate = useNavigate();

    const [isEditingPicture, setIsEditingPicture] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [previewImageUrl, setPreviewImageUrl] = useState(usuario?.photoURL || 'https://via.placeholder.com/150/0f3460/e0e0e0?text=Avatar');
    const fileInputRef = useRef(null);

    const [userPosts, setUserPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [errorPosts, setErrorPosts] = useState(null);

    useEffect(() => {
        if (!isLoading && !usuario) {
            navigate('/');
        }
    }, [usuario, isLoading, navigate]);

    useEffect(() => {
        if (usuario?.photoURL) {
            setPreviewImageUrl(usuario.photoURL);
        } else {
            setPreviewImageUrl('https://via.placeholder.com/150/0f3460/e0e0e0?text=Avatar');
        }
        setIsEditingPicture(false);
        setSelectedImageFile(null);
    }, [usuario?.photoURL, usuario]);

    const fetchUserPosts = useCallback(async () => {
        if (!usuario || !usuario.id) {
            console.warn("No hay usuario logueado o ID de usuario disponible para buscar posts.");
            setUserPosts([]);
            setLoadingPosts(false);
            return;
        }

        setLoadingPosts(true);
        setErrorPosts(null);

        try {
            const resAllPosts = await fetch(`${API_URL}/posts`);
            if (!resAllPosts.ok) {
                throw new Error(`Error al cargar publicaciones: ${resAllPosts.statusText}`);
            }
            const allPosts = await resAllPosts.json();

            const filteredPosts = allPosts.filter(post => post.UserId === usuario.id);

            const postsWithAdditionalData = await Promise.all(
                filteredPosts.map(async (post) => {
                    const resImg = await fetch(`${API_URL}/postimages/post/${post.id}`);
                    const images = resImg.ok ? await resImg.json() : [];

                    const resComments = await fetch(`${API_URL}/comments/post/${post.id}`);
                    const comments = resComments.ok ? await resComments.json() : [];

                    const resReactions = await fetch(`${API_URL}/reactions/post/${post.id}`);
                    let reactionData = { likes: 0, dislikes: 0, reactions: [] };
                    if (resReactions.ok) {
                        reactionData = await resReactions.json();
                    } else {
                        console.warn(`No se pudieron cargar reacciones para el post ${post.id}`);
                    }

                    const myReaction = usuario
                        ? reactionData.reactions.find(r => r.UserId === usuario.id)?.type || null
                        : null;

                    return {
                        ...post,
                        images: images.map((img) => img.url),
                        Comments: comments,
                        likes: reactionData.likes,
                        dislikes: reactionData.dislikes,
                        myReaction: myReaction
                    };
                })
            );
            setUserPosts(postsWithAdditionalData);

        } catch (err) {
            console.error("Error al cargar los posts del usuario:", err);
            setErrorPosts(err.message || "No se pudieron cargar tus publicaciones.");
            setUserPosts([]);
        } finally {
            setLoadingPosts(false);
        }
    }, [usuario]);

    useEffect(() => {
        if (!isLoading) {
            fetchUserPosts();
        }
    }, [fetchUserPosts, isLoading]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("Error al cerrar sesión. Por favor, inténtalo de nuevo.");
        }
    };

    const handleEditPictureClick = () => {
        setIsEditingPicture(prev => !prev);
        if (!isEditingPicture) {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setSelectedImageFile(null);
            setPreviewImageUrl(usuario?.photoURL || 'https://via.placeholder.com/150/0f3460/e0e0e0?text=Avatar');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImageFile(null);
            setPreviewImageUrl(usuario?.photoURL || 'https://via.placeholder.com/150/0f3460/e0e0e0?text=Avatar');
        }
    };

    const handleSaveProfilePicture = async () => {
        if (!selectedImageFile) {
            alert("Por favor, selecciona una imagen para subir.");
            return;
        }

        console.log("Simulando subida de archivo:", selectedImageFile.name);
        try {
            const newPhotoURL = previewImageUrl;

            if (updateCurrentUserProfile) {
                await updateCurrentUserProfile({ photoURL: newPhotoURL });
            } else {
                console.error("updateCurrentUserProfile no está disponible en el contexto de autenticación.");
                alert("No se pudo actualizar el perfil. Contacta al soporte.");
            }
            
            alert("Foto de perfil actualizada (simulado).");

            setIsEditingPicture(false);
            setSelectedImageFile(null);

        } catch (error) {
            console.error("Error al subir o guardar la imagen de perfil:", error);
            alert("Hubo un error al guardar la imagen. Por favor, inténtalo de nuevo.");
        }
    };

    const handleReaction = async (postId, type) => {
        if (!usuario) {
            alert('Debes iniciar sesión para reaccionar a una publicación.');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/reactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: usuario.id, postId, type }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al procesar la reacción.');
            }

            const responseData = await res.json();
            console.log('Reacción procesada:', responseData);

            setUserPosts(prevPosts =>
                prevPosts.map(p => {
                    if (p.id === postId) {
                        let newMyReaction = p.myReaction;

                        if (responseData.action === 'created') {
                            newMyReaction = type;
                        } else if (responseData.action === 'updated') {
                            newMyReaction = type;
                        } else if (responseData.action === 'deleted') {
                            newMyReaction = null;
                        }

                        return {
                            ...p,
                            likes: responseData.newLikes,
                            dislikes: responseData.newDislikes,
                            myReaction: newMyReaction
                        };
                    }
                    return p;
                })
            );

        } catch (err) {
            console.error('Error al reaccionar:', err);
            alert(err.message || 'No se pudo procesar la reacción.');
        }
    };

    if (isLoading) {
        return <div className="loading-screen">Cargando perfil...</div>;
    }

    if (!usuario) {
        return null;
    }

    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <div className="profile-header">
                    <div className="profile-picture-container">
                        <img
                            src={previewImageUrl}
                            alt="Foto de perfil"
                            className="profile-picture"
                        />
                        <button className="edit-profile-picture-button" onClick={handleEditPictureClick}>
                            ⚙️
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                    <h2 className="perfil-username">
                        ¡Hola, {usuario?.displayName || usuario?.nickName || 'Usuario'}!
                    </h2>
                    <p className="perfil-bio">
                        Bienvenido a mi perfil. ¡Me alegra que estés aquí!
                    </p>
                </div>

                {isEditingPicture && (
                    <div className="edit-profile-section">
                        {selectedImageFile && (
                            <p className="file-name-display">Archivo seleccionado: {selectedImageFile.name}</p>
                        )}
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="profile-picture-input"
                        >
                            {selectedImageFile ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                        </button>
                        <button
                            onClick={handleSaveProfilePicture}
                            className="save-profile-picture-button"
                            disabled={!selectedImageFile}
                        >
                            Guardar Foto
                        </button>
                    </div>
                )}

                <div className="perfil-stats">
                    <div className="stat-item">
                        <span>{userPosts.length}</span>
                        <span>Posts</span>
                    </div>
                    <div className="stat-item">
                        <span>123</span>
                        <span>Seguidores</span>
                    </div>
                    <div className="stat-item">
                        <span>45</span>
                        <span>Siguiendo</span>
                    </div>
                </div>

                <button onClick={handleLogout} className="logout-button">
                    Cerrar Sesión
                </button>
            </div>

            <div className="perfil-posts-section">
                <h3>Tus Publicaciones</h3>
                <div className="perfil-posts">
                    {loadingPosts ? (
                        <p className="loading-message">Cargando tus publicaciones...</p>
                    ) : errorPosts ? (
                        <p className="error-message">{errorPosts}</p>
                    ) : userPosts.length > 0 ? (
                        userPosts.map(post => (
                            <div key={post.id} className="perfil-post-item">
                                <h3>{post.title || post.description}</h3> 
                                {post.images && post.images.length > 0 && (
                                    <img 
                                        src={post.images[0]}
                                        alt={post.title || post.description} 
                                        className="perfil-post-image-full" 
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200/555555/FFFFFF?text=Imagen+no+disponible'; }}
                                    />
                                )}
                                <p>{post.content || post.description}</p> 
                                <div className="perfil-post-tags">
                                    {post.Tags && post.Tags.map((tag) => (
                                        <span key={tag.id} className="perfil-post-tag">#{tag.name}</span>
                                    ))}
                                </div>
                                <p className="perfil-post-comments">Comentarios: {post.Comments ? post.Comments.length : 0}</p>
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
                                <Link
                                    to={`/posts/${post.id}`}
                                    className="ver-mas-button"
                                >
                                    Ver más
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="no-posts-message">No tienes publicaciones aún.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Perfil;