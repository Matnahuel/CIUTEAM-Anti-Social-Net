UnaHur Anti-Social Net
Trabajo Práctico: Construcción de Interfaces de Usuario
Alumnos:

Ivan Rojas

Alan Foa Rostirolla

Carolina Simoes

Matias Carabajal

Magali Orellana

Profesor/a: Lucas Figarola
Materia: Construcción de Interfaces de Usuario
Fecha de Entrega: 03/07/2025

🚀 Introducción
Este proyecto, "UnaHur Anti-Social Net", es una aplicación web desarrollada para el Trabajo Práctico de la materia Construcción de Interfaces de Usuario. Su objetivo principal es desarrollar el FrontEnd en React para una red social, integrándose con una API de BackEnd existente. La aplicación permite a los usuarios navegar por publicaciones, agregar comentarios, registrarse, iniciar sesión y crear sus propios posteos.

Hemos implementado una interfaz de usuario moderna y responsiva, buscando una experiencia de usuario intuitiva y un estilo que evoca un diseño tecnológico y moderno.

Funcionalidades Implementadas
La aplicación ofrece las siguientes funcionalidades clave:

Inicio de Sesión (Login simulado):

Permite iniciar sesión con un nickName y una contraseña fija "123456".

Verifica la existencia del usuario mediante un GET /users a la API. La contraseña se valida localmente.

Si las credenciales son válidas, el usuario se guarda en un contexto global (useContext) y su sesión se mantiene en localStorage.

Las rutas protegidas son accesibles solo si hay un usuario autenticado.

Registro de Usuario:

Formulario para crear un nuevo usuario.

Valida que el nickName y el email no existan previamente.

Si los datos son válidos, se envía un POST /users a la API.

Tras un registro exitoso, el usuario es logueado automáticamente y redirigido a la página de inicio.

Home (Página de Inicio):

Incluye un feed de publicaciones recientes que muestra la descripción, imágenes (si las hay), etiquetas y el conteo de comentarios.

Cada publicación tiene un botón "Ver más" que redirige a la vista de detalle (/posts/:id).

Incorpora una barra de búsqueda para filtrar publicaciones por etiquetas.

Implementa paginación para una mejor experiencia de navegación en el feed.

Presenta un banner de bienvenida y una sección "Sobre nosotros" para contextualizar la aplicación.

Detalle de Publicación:

Vista dedicada para cada publicación, accesible desde /posts/:id.

Muestra la descripción completa del post, todas sus imágenes (con una imagen principal y miniaturas), y sus etiquetas.

Presenta una lista de comentarios asociados a la publicación.

Dispone de un formulario para que los usuarios logueados puedan agregar nuevos comentarios, los cuales se envían mediante un POST /comments a la API.

Perfil de Usuario:

Vista protegida, solo accesible para el usuario logueado.

Muestra el nickName del usuario actual y permite la edición de la foto de perfil.

Lista las publicaciones creadas por el usuario logueado, mostrando su descripción, imágenes, etiquetas y el conteo de comentarios.

Incluye un botón para cerrar sesión (logout).

Crear Nueva Publicación:

Vista protegida, solo accesible si el usuario ha iniciado sesión.

Formulario que permite al usuario ingresar una descripción (obligatoria), añadir múltiples URLs de imágenes (opcional) y seleccionar etiquetas existentes o crear nuevas.

Al enviar, se realiza un POST /posts para crear la publicación. Si se agregaron imágenes, se envían POST /postimages adicionales para asociarlas al post.

Al finalizar, el usuario es redirigido a la página de su perfil o a la vista del post recién creado.

Requisitos Técnicos
El proyecto fue desarrollado aplicando los siguientes requisitos técnicos:

Tema

Aplicación

useState, useEffect

Manejo de estado de componentes y ciclo de vida, carga de datos asíncrona.

useContext

Gestión del estado global del usuario autenticado.

react-router-dom

Navegación entre vistas, rutas protegidas (PrivateRoute, PublicRoute).

Formularios controlados

Implementación de formularios para login, registro, comentarios y creación de publicaciones.

Fetch

Consumo de la API REST para interactuar con el backend.

CSS

Diseño y estilos de la interfaz de usuario, con enfoque en la responsividad.

localStorage

Persistencia de la sesión del usuario entre recargas de página.

Validaciones

Implementación de validaciones en formularios con feedback visual al usuario.

Extras Opcionales (Bonus)
Hemos considerado e implementado los siguientes extras opcionales para mejorar la experiencia de usuario:

Paginación en la Home: Mejora la navegación en el feed de publicaciones.

Animaciones suaves y transiciones en la interfaz: Proporcionan una experiencia de usuario más fluida y atractiva.

Tecnologías y Dependencias
Frontend:

React.js: Biblioteca de JavaScript para construir interfaces de usuario.

Vite: Herramienta de construcción rápida para proyectos frontend.

HTML5 / CSS3: Lenguajes base para la estructura y estilos de la aplicación, con un diseño moderno y futurista.

React Router DOM: Biblioteca estándar para el enrutamiento declarativo en React.

Bootstrap: Framework CSS para estilos y componentes básicos (aunque se complementa con CSS personalizado).

Backend (API):

Se utiliza una API de Node.js proporcionada para el Trabajo Práctico de BackEnd. No es necesario modificarla ni entender cómo funciona internamente, solo realizar las peticiones fetch necesarias desde React.

Gestión de Dependencias:

npm: Gestor de paquetes de Node.js, utilizado para instalar y gestionar las dependencias del proyecto.

Estructura del Proyecto
La organización del proyecto sigue una estructura modular y clara:

UnaHur-Anti-Social-Net/
├── public/                     # Archivos estáticos públicos (ej: index.html)
├── src/
│   ├── assets/                 # Contiene imágenes y otros recursos estáticos de la aplicación
│   ├── components/             # Componentes React reutilizables (ej: Header, Footer, PostCard, PrivateRoute, PublicRoute)
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── PostCard.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── contexts/               # Contextos de React para gestión de estado global (ej: AuthContext)
│   │   └── authContext.jsx
│   ├── pages/                  # Componentes que representan páginas completas de la aplicación
│   │   ├── CrearPost.css
│   │   ├── CrearPost.jsx
│   │   ├── Home.css
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── PostDetail.css
│   │   ├── PostDetail.jsx
│   │   ├── Register.css
│   │   ├── Register.jsx
│   │   ├── login.css           # (Nota: 'login.css' y 'Register.css' están en 'pages' pero podrían ser globales o en 'components/forms')
│   │   └── perfil.css
│   │   └── perfil.jsx
│   ├── App.jsx                 # Componente principal de la aplicación y configuración de rutas
│   ├── main.jsx                # Punto de entrada de la aplicación React (renderizado inicial)
│   └── index.css               # Estilos globales y variables CSS de la aplicación
├── .gitignore                  # Archivos y carpetas a ignorar por Git
├── package.json                # Metadatos del proyecto y lista de dependencias
├── package-lock.json           # Registro exacto de las dependencias instaladas
└── README.md                   # Este archivo de documentación

Instalación y Ejecución Local
Para poner en marcha el proyecto en tu máquina local, sigue los siguientes pasos:

Clonar el Repositorio:
Abre tu terminal o línea de comandos y ejecuta:

git clone https://github.com/IRojas99/CIUTEAM-Anti-Social-Net
cd UnaHur-Anti-Social-Net

Instalar Dependencias del Frontend:
Asegúrate de tener Node.js y npm instalados en tu sistema. Luego, desde el directorio raíz del proyecto (UnaHur-Anti-Social-Net), instala las dependencias:

npm install

Configurar y Ejecutar la API (Backend):
Este proyecto frontend requiere una API de backend para funcionar. Debes configurar y ejecutar la API por separado. Sigue las instrucciones detalladas en el repositorio de la API:
URL del Repositorio de la API: https://github.com/lucasfigarola/backend-api
(Generalmente, los pasos incluyen clonar ese repositorio, instalar sus dependencias (npm install), iniciar el servidor (npm start) y, si es necesario, cargar los datos iniciales (ej. un seed.js o script similar). Asegúrate de que el backend esté corriendo en el puerto 3001 o el puerto que hayas configurado para la API, ya que el frontend espera comunicarse con él en esa dirección.)

Ejecutar la Aplicación Frontend:
Una vez que el backend esté en funcionamiento, inicia el servidor de desarrollo del frontend desde el directorio UnaHur-Anti-Social-Net:

npm run dev

La aplicación estará disponible en tu navegador, generalmente en http://localhost:5173/ (la URL exacta se mostrará en tu terminal).
