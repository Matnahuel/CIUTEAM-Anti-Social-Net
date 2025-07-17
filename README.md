# 🕸️ UnaHur Anti-Social Net  
**Trabajo Práctico - Construcción de Interfaces de Usuario**

## 👥 Alumnos
- Ivan Rojas  
- Alan Foa Rostirolla  
- Carolina Simoes  
- Matías Carabajal  
- Magalí Orellana  

**Profesor/a:** Lucas Figarola  
**Materia:** Construcción de Interfaces de Usuario  
**Fecha de Entrega:** 03/07/2025  

---

## 🚀 Introducción

**UnaHur Anti-Social Net** es una aplicación web desarrollada como trabajo práctico para la materia *Construcción de Interfaces de Usuario*. El objetivo principal fue desarrollar un **Frontend en React** que se integre con una API de Backend ya existente, simulando una red social.

La app permite a los usuarios registrarse, iniciar sesión, explorar publicaciones, agregar comentarios y crear nuevos posteos. Se priorizó un diseño moderno, responsivo e intuitivo.

---

## ⚙️ Funcionalidades Implementadas

### 🔐 Inicio de Sesión (Login simulado)
- Ingreso con `nickName` y contraseña fija: `"123456"`.
- Validación del usuario con un `GET /users` a la API.
- La sesión se guarda en `useContext` y `localStorage`.
- Las rutas protegidas solo son accesibles para usuarios autenticados.

### 📝 Registro de Usuario
- Formulario para nuevos usuarios.
- Verifica nickName y email únicos.
- Crea el usuario con `POST /users`.
- Redirige automáticamente tras registro exitoso.

### 🏠 Home (Página de Inicio)
- Feed de publicaciones recientes: descripción, imágenes, etiquetas, comentarios.
- Botón "Ver más" para acceder al detalle (`/posts/:id`).
- Búsqueda por etiquetas y paginación.
- Banner de bienvenida y sección "Sobre nosotros".

### 🔍 Detalle de Publicación
- Vista en `/posts/:id` con descripción completa, imágenes, etiquetas.
- Lista de comentarios.
- Formulario para comentar (requiere login, usa `POST /comments`).

### 👤 Perfil de Usuario
- Vista protegida para el usuario logueado.
- Muestra nickName, permite editar foto de perfil.
- Lista de publicaciones propias.
- Botón de logout.

### ➕ Crear Nueva Publicación
- Vista protegida.
- Formulario con descripción (obligatoria), imágenes (opcional), y etiquetas.
- Crea post con `POST /posts` y `POST /postimages`.
- Redirección al perfil o al nuevo post.

---

## 💻 Requisitos Técnicos

| Tema | Aplicación |
|------|------------|
| `useState`, `useEffect` | Estado local, ciclo de vida, carga de datos |
| `useContext` | Estado global del usuario |
| `react-router-dom` | Navegación, rutas protegidas |
| Formularios controlados | Login, registro, comentarios, creación de post |
| `fetch` | Consumo de API REST |
| CSS | Estilos modernos y responsivos |
| `localStorage` | Persistencia de sesión |
| Validaciones | Validación de formularios con feedback |

---

## 🛠️ Tecnologías y Dependencias

### Frontend
- **React.js**
- **Vite**
- **HTML5 / CSS3**
- **React Router DOM**
- **Bootstrap** (complementado con CSS propio)

### Backend (API)
- API REST con **Node.js** (proporcionada por la cátedra).

### Gestión de Paquetes
- **npm** para instalación y gestión de dependencias.

---

## 📁 Estructura del Proyecto

```
CIUTEAM-ANTI-SOCIAL-NET/
├── node_modules/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ │ ├── Footer.css
│ │ ├── Footer.jsx
│ │ ├── Header.css
│ │ ├── Header.jsx
│ │ ├── PrivateRoute.jsx
│ │ └── PublicRoute.jsx
│ ├── contexts/
│ │ └── authContext.jsx
│ ├── pages/
│ │ ├── CrearPost.css
│ │ ├── crearPost.jsx
│ │ ├── Home.css
│ │ ├── home.jsx
│ │ ├── login.css
│ │ ├── perfil.css
│ │ ├── perfil.jsx
│ │ ├── PostCard.jsx
│ │ ├── postDetail.css
│ │ ├── PostDetail.jsx
│ │ ├── Register.css
│ │ └── Register.jsx
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

---

## 🧪 Instalación y Ejecución Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Matnahuel/CIUTEAM-Anti-Social-Net
cd UnaHur-Anti-Social-Net
```

### 2. Instalar Dependencias

Asegurate de tener **Node.js** y **npm** instalados. Luego ejecutá:

```bash
npm install
```

### 3. Configurar y Ejecutar la API (Backend)

Este frontend depende de una API. Cloná y ejecutá el backend desde el siguiente repositorio:

📦 **Repositorio API Backend:**  
Es una carpeta dentro del repositorio que se llama "backend-api" es una modificación de una api del profesor de la materia

Pasos típicos:
```bash
Abrir la carpeta en una ventana del IDE
npm install
node seed.js
npm start
```

La API debe estar corriendo en `http://localhost:3001/` (o el puerto configurado en el frontend).

### 4. Ejecutar la Aplicación Frontend

Con la API en funcionamiento, ejecutá el frontend:

```bash
npm install
npm run dev
```

Abrí tu navegador en: [http://localhost:5173](http://localhost:5173) (u otra URL que se indique en la terminal).
