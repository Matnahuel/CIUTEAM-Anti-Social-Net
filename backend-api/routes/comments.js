const express = require('express');
const router = express.Router();
const { Comment, User } = require('../models');
const { Op } = require('sequelize');

router.get('/post/:postId', async (req, res) => {
  const { limit = 5, offset = 0 } = req.query; // Default to 5 comments, starting from 0
  try {
    const { count, rows } = await Comment.findAndCountAll({
      where: {
        PostId: req.params.postId,
      },
      include: [User],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.json({ comments: rows, totalComments: count });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comentarios', details: error.message });
  }
});

router.post('/', async (req, res) => {
  const { content, userId, postId } = req.body;
  if (!content || !userId || !postId) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const nuevo = await Comment.create({ content, UserId: userId, PostId: postId });
    // Después de crear el comentario, búscalo de nuevo para incluir la información del usuario
    const comentarioConUsuario = await Comment.findByPk(nuevo.id, {
      include: [User]
    });
    res.status(201).json(comentarioConUsuario);
  } catch (e) {
    res.status(500).json({ error: 'Error al crear comentario', details: e.message });
  }
});

router.put('/:commentId', async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    comment.content = content;
    await comment.save();
    const comentarioConUsuario = await Comment.findByPk(comment.id, {
      include: [User]
    });
    res.json(comentarioConUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el comentario', details: error.message });
  }
});

router.delete('/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el comentario', details: error.message });
  }
});

module.exports = router;