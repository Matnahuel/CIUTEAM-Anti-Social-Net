import LoginForm from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import { AuthProvider } from './contexts/authContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CrearPost from './pages/crearPost.jsx'; // ¡Esto es importante! ✔

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginForm />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/crear-post" element={<CrearPost />} />
            {/* Cuando Alan haga perfil, agregar: <Route path="/perfil" element={<Perfil />} /> */}
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
