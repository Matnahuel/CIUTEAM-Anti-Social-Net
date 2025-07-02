import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/authContext';

export default function PrivateRoute() {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) return <p>Cargando...</p>; 

  if (!usuario) return <Navigate to="/" state={{ from: location }} replace />;

  return <Outlet />;
}
