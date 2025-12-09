import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import Register from './pages/Register.jsx';
import { AuthProvider } from './contexts/authContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CrearPost from './pages/crearPost.jsx';
import Profile from './pages/perfil.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <AuthProvider>

      <BrowserRouter basename="/CIUTEAM-Anti-Social-Net">
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 d-flex flex-column align-items-center">
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

              </Route>

              <Route element={<PrivateRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/crear-post" element={<CrearPost />} />
                <Route path="/perfil" element={<Profile />} />

              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;
