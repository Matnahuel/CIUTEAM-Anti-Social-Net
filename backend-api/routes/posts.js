const express = require('express');
const router = express.Router();
const { Post, User, Tag, Reaction, PostImage, sequelize } = require('../models');

router.get('/', async (req, res) => {
  try {
    const where = req.query.userId ? { UserId: req.query.userId } : {};
    const posts = await Post.findAll({
      where,
      include: [
        { model: User },
        { model: Tag },
        { model: Reaction }
      ],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Reactions WHERE Reactions.PostId = Post.id AND Reactions.type = "like")'), 'likes'],
          [sequelize.literal('(SELECT COUNT(*) FROM Reactions WHERE Reactions.PostId = Post.id AND Reactions.type = "dislike")'), 'dislikes']
        ]
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los posts.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User },
        { model: Tag },
        { model: Reaction }
      ],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Reactions WHERE Reactions.PostId = Post.id AND Reactions.type = "like")'), 'likes'],
          [sequelize.literal('(SELECT COUNT(*) FROM Reactions WHERE Reactions.PostId = Post.id AND Reactions.type = "dislike")'), 'dislikes']
        ]
      }
    });
    post ? res.json(post) : res.status(404).json({ error: 'Post no encontrado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el post.' });
  }
});

router.post('/', async (req, res) => {
  const { description, userId, tagIds, imageUrls } = req.body; // Se añade imageUrls
  if (!description || !userId) return res.status(400).json({ error: 'Faltan datos' });
  try {
    // 1. Crear el post
    const nuevo = await Post.create({ description, UserId: userId });

    // 2. Asociar etiquetas si existen
    if (tagIds && tagIds.length > 0) {
      await nuevo.setTags(tagIds);
    }

    // 3. Asociar imágenes si existen
    if (imageUrls && imageUrls.length > 0) {
      const imagesData = imageUrls.map(url => ({ url: url, PostId: nuevo.id }));
      await PostImage.bulkCreate(imagesData);
    }

    // 4. Devolver el post completo con sus asociaciones
    const creado = await Post.findByPk(nuevo.id, { 
      include: [Tag, PostImage, User] 
    });

    res.status(201).json(creado);
  } catch (e) {
    res.status(500).json({ error: 'Error al crear post', details: e.message });
  }
});

module.exports = router;