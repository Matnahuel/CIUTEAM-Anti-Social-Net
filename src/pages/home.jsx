import { useAuth } from "../contexts/authContext";
export default function Home() {
 const {usuario, logout} = useAuth()
  return (
    <div>
    <h1>Cosas que se pueden usar con el context</h1>
    <h1>Email: {usuario.email}</h1>
    <h1>Nickname: {usuario.nickName}</h1>
     <h1>Id: {usuario.id}</h1>
     <h1>Creado: {usuario.createdAt}</h1>
     <h1>Modificado: {usuario.updatedAt}</h1>
     <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}