const express = require('express');
const router = express.Router();
const { Reaction } = require('../models');

// Función auxiliar para obtener nuevos recuentos y enviar respuesta
const respondWithUpdatedReactions = async (res, postId, userId) => {
  try {
    // 1. Contar likes y dislikes actualizados
    const likes = await Reaction.count({ where: { PostId: postId, type: 'like' } });
    const dislikes = await Reaction.count({ where: { PostId: postId, type: 'dislike' } });

    // 2. Encontrar la reacción actual del usuario
    const myReaction = await Reaction.findOne({ where: { PostId: postId, UserId: userId } });

    // 3. Enviar la respuesta
    res.json({
      newLikes: likes,
      newDislikes: dislikes,
      myReaction: myReaction ? myReaction.type : null
    });
  } catch (error) {
    console.error('Error al responder con reacciones actualizadas:', error);
    res.status(500).json({ message: 'Error al obtener los recuentos de reacciones.' });
  }
};

// Obtener reacciones de un post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const reactions = await Reaction.findAll({ where: { PostId: postId } });
    
    const likes = reactions.filter(r => r.type === 'like').length;
    const dislikes = reactions.filter(r => r.type === 'dislike').length;

    res.json({
      reactions,
      likes,
      dislikes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener reacciones.' });
  }
});

// Crear o actualizar una reacción
router.post('/', async (req, res) => {
  try {
    const { userId, postId, type } = req.body;

    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ message: 'Tipo de reacción no válido.' });
    }

    const existingReaction = await Reaction.findOne({
      where: { UserId: userId, PostId: postId }
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Si el usuario hace clic en la misma reacción, se elimina
        await existingReaction.destroy();
      } else {
        // Si el usuario cambia su reacción (like -> dislike o viceversa)
        existingReaction.type = type;
        await existingReaction.save();
      }
    } else {
      // Si no existe reacción, se crea una nueva
      await Reaction.create({ UserId: userId, PostId: postId, type });
    }
    
    // Después de cualquier cambio, responde con los totales actualizados
    await respondWithUpdatedReactions(res, postId, userId);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar la reacción.' });
  }
});

module.exports = router;
