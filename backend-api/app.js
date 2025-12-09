require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize } = require('./models');

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const tagRoutes = require('./routes/tags');
const postImageRoutes = require('./routes/postimages');
const reactionRoutes = require('./routes/reactions');

app.use(cors());
app.use(express.json());

// --- Configuración de Multer para Subida de Archivos ---
const path = require('path');
const multer = require('multer');

// Servir imágenes estáticamente desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    // Generar un nombre de archivo único para evitar colisiones
    cb(null, 'image-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('¡Solo se permiten archivos de imagen!'), false);
    }
  }
});

// Ruta para subir una imagen
app.post('/api/upload', upload.single('image'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Por favor, sube un archivo.' });
  }
  // Devolver la URL relativa de la imagen subida
  res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
}, (error, req, res, next) => {
  // Middleware para manejar errores de Multer (ej. tipo de archivo incorrecto)
  res.status(400).json({ error: error.message });
});
// --- Fin de la Configuración de Multer ---


app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/tags', tagRoutes);
app.use('/postimages', postImageRoutes);
app.use('/reactions', reactionRoutes);

const PORT = process.env.PORT || 3001;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});