# UnaHur Anti-Social Net

## Trabajo Práctico: Construcción de Interfaces de Usuario

**Alumnos:**
* Ivan Rojas
* Alan Foa Rostirolla
* Carolina Simoes
* Matias Carabajal
* Magali Orellana

**Profesor/a:** Lucas Figarola
**Materia:** Construcción de Interfaces de Usuario
**Fecha de Entrega:** 03/07/2025

---

## 🚀 Introducción

Este proyecto, "UnaHur Anti-Social Net", es una aplicación web desarrollada para el Trabajo Práctico de la materia Construcción de Interfaces de Usuario. Su objetivo principal es desarrollar el FrontEnd en React para la red social "UnaHur Anti-Social Net", utilizando la API proporcionada por el TP de BackEnd. La aplicación debe permitir que las personas usuarias puedan navegar publicaciones, agregar comentarios, registrarse, iniciar sesión y crear sus propios posteos.

Hemos implementado una interfaz de usuario moderna y responsiva, buscando una experiencia de usuario intuitiva y un estilo que evoca un diseño tecnológico y moderno.

---

## Funcionalidades Requeridas

La aplicación implementa las siguientes funcionalidades clave, según lo solicitado en el trabajo práctico:

* **Inicio de Sesión (Login simulado):**
    * Permite iniciar sesión con un `nickName` y una contraseña fija "123456".
    * Se realiza un `GET /users` a la API para verificar si el usuario existe y la contraseña se valida localmente.
    * Si es válido, el usuario se guarda en un contexto global (`useContext`) y se mantiene en `localStorage`.
    * Las rutas protegidas solo son accesibles si hay un usuario logueado.

* **Registro de Usuario:**
    * Formulario para crear un nuevo usuario.
    * Se valida previamente que el `nickName` no exista.
    * Si es válido, se envía un `POST /users` a la API.
    * Tras el registro, se puede redirigir al login o loguear directamente al usuario.

* **Home (Página de Inicio):**
    * Incluye un feed de publicaciones recientes que muestra:
        * Descripción
        * Imágenes (si las hay)
        * Etiquetas
        * Cantidad de comentarios visibles
        * Botón "Ver más" que lleva a `/post/:id`.
    * Además del feed, el contenido de la página es libre y puede incluir un Banner de bienvenida y/o una sección "Sobre nosotros" o slogans.

* **Detalle de Publicación:**
    * Vista accesible desde `/post/:id`.
    * Muestra la descripción completa, imágenes, etiquetas y una lista de comentarios visibles (filtrados por la API).
    * Dispone de un formulario para agregar un comentario nuevo (campo obligatorio), con envío mediante `POST /comments` y componente controlado (`useState`).

* **Perfil de Usuario:**
    * Vista protegida, solo visible si el usuario está logueado.
    * Muestra el `nickName` del usuario actual.
    * Lista de publicaciones realizadas por ese usuario (consultadas a la API con su `userId`), mostrando descripción, cantidad de comentarios visibles y un botón "Ver más".
    * También incluye un botón para cerrar sesión (`logout`).

* **Crear Nueva Publicación:**
    * Vista protegida, solo accesible si el usuario ha iniciado sesión.
    * Formulario con los siguientes campos: Descripción (obligatoria), URLs de imágenes (opcional - uno o más campos), y Selección de etiquetas (lista obtenida desde la API).
    * Al enviar, se hace un `POST /posts` con `description`, `userId` y `tags`. Si se ingresaron URLs de imágenes, por cada una se hace un `POST /postimages` con `url` y `postId`.
    * Al finalizar, redirige al perfil o muestra confirmación.

---

## Requisitos Técnicos

El proyecto fue desarrollado aplicando los siguientes requisitos técnicos:

| Tema                | Aplicación                                   |
| :------------------ | :------------------------------------------- |
| `useState`, `useEffect` | Manejo de estado y carga de datos            |
| `useContext`        | Gestión de usuario logueado                  |
| `react-router-dom`  | Navegación entre vistas y rutas protegidas   |
| Formularios controlados | Login, registro, comentarios, publicaciones  |
| `Fetch` o `axios`   | Consumo de API REST                          |
| `CSS` o framework   | Diseño responsive libre (se utilizó CSS puro) |
| `localStorage`      | Persistencia de sesión                       |
| Validaciones        | Formularios con campos requeridos y feedback visual |

---

## Extras Opcionales (Bonus)

Hemos considerado o implementado los siguientes extras opcionales:
* Paginación en la Home.
* Animaciones suaves y transiciones en la interfaz.


## Tecnologías y Dependencias

* **Frontend:**
    * **React.js:** Biblioteca de JavaScript para construir interfaces de usuario.
    * **Vite:** Herramienta de construcción rápida.
    * **HTML5 / CSS3:** Estructura y estilos de la aplicación, con un enfoque en un diseño futurista.
    * **React Router DOM:** Para el enrutamiento.
* **Backend (API):**
    * Se utiliza una API de Node.js proporcionada para el TP de BackEnd. No es necesario modificarla ni entender cómo funciona internamente, solo realizar los `fetch` necesarios desde React.
* **Gestión de Dependencias:**
    * **npm:** Gestor de paquetes de Node.js.

## Estructura del Proyecto

La organización del proyecto sigue una estructura modular:
UnaHur-Anti-Social-Net/
├── public/
├── src/
│   ├── assets/              # Contiene imágenes y otros recursos estáticos
│   ├── components/          # Componentes reutilizables (ej: Header, Footer, PostCard)
│   ├── contexts/            # Contextos de React para gestión de estado global (ej: AuthContext)
│   ├── pages/               # Componentes que representan páginas completas (ej: Home, Perfil, Login, Register, CrearPost)
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── Perfil.jsx
│   │   ├── Perfil.css
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── CrearPost.jsx
│   │   └── ...
│   ├── App.jsx              # Componente principal de la aplicación y configuración de rutas
│   ├── main.jsx             # Punto de entrada de la aplicación React
│   └── index.css            # Estilos globales y variables CSS
├── .gitignore               # Archivos y carpetas a ignorar por Git
├── package.json             # Metadatos del proyecto y dependencias
├── package-lock.json        # Registro exacto de las dependencias
└── README.md                # Este archivo

## Instalación y Ejecución Local

Para poner en marcha el proyecto en tu máquina local, sigue los siguientes pasos:

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/IRojas99/CIUTEAM-Anti-Social-Net
    cd UnaHur-Anti-Social-Net
    ```


2.  **Instalar Dependencias:**
    Asegúrate de tener Node.js y npm instalados en tu sistema. Luego, instala las dependencias del proyecto:
    ```bash
    npm install
    ```

3.  **Configurar y Ejecutar la API (Backend):**
    Este trabajo práctico utiliza una API ya preparada. Para correrla localmente, sigue las instrucciones del repositorio de la API:
    **URL de la API:** [https://github.com/lucasfigarola/backend-api](https://github.com/lucasfigarola/backend-api)
    *Generalmente, los pasos incluyen clonar ese repositorio, iniciar el servidor y cargar el seed.js (ej: `npm install` y `npm start` en el directorio de la API). Asegúrate de que el backend esté corriendo en el puerto `3000` (o el puerto configurado para la API).*

4.  **Ejecutar la Aplicación Frontend:**
    Inicia el servidor de desarrollo del Frontend. La aplicación estará disponible en `http://localhost:5173/` (o un puerto similar).
    ```bash
    npm run dev
    ```

