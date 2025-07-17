import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function PublicRoute() {
  const { usuario, isLoading } = useAuth();

  if (isLoading) return <p>Cargando...</p>;

  if (usuario) return <Navigate to="/home" replace />;

  return <Outlet />;
}