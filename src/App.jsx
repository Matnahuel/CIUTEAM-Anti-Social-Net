import LoginForm from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import { AuthProvider } from './contexts/authContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CrearPost from './pages/crearPost.jsx'; // ¡Esto es importante! ✔
import Profile from './pages/perfil.jsx'

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
            <Route path="/perfil" element={<Profile />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
