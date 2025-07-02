import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Footer from "../components/Footer";
import "./Register.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from "react-router-dom";

export default function Register() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors]     = useState({});
  const [message, setMessage]   = useState("");
  const [users, setUsers]= useState([])  
  const navigate = useNavigate();
  const { login } = useAuth();              
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;
    useEffect(()=>{
            async function obtenerUsuarios(params){
                try {
                    const res = await fetch('http://localhost:3001/users')
                    const data = await res.json()
                    setUsers(data)
                    
                } catch (error) {
                    console.log(error.message)
                }
            }
            obtenerUsuarios()
        }, [])

  const validate = () => {
    const newErrors = {};
    if (!nickname.trim()) newErrors.nickname = "El nickname es obligatorio";
    if (nickname.trim()) {
      const exists = users.some((u) => u.nickName === nickname.trim());
      if (exists) newErrors.nickname = "El Nickname ya se encuentra registrado, por favor elija otro";
    }
        
    if (!email.trim()) return "El email es obligatorio";
    if (!emailRegex.test(email)) return "Formato de email inválido";
     if (email.trim() && emailRegex.test(email)) {
      const exists = users.some((u) => u.email === email.trim());
      if (exists) newErrors.email = "El email ya se encuentra registrado";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickName: nickname, email:email }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setMessage(error || "Error al registrar");
        return;
      }

      const nuevoUsuario = await res.json(); 

      login(nuevoUsuario);                     
      navigate("/home");                       
    } catch (err) {
      console.error(err);
      setMessage("No se pudo conectar con el servidor");
    }
  };


  
   return (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
    <div className="card shadow p-4 w-100" style={{ maxWidth: 480 }}>
      <h1 className="h4 text-center mb-4 text-secondary fw-semibold">
        Bienvenidos a unahur anti social
      </h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Nickname</label>
          <input
            className={`form-control ${errors.nickname && "is-invalid"}`}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Tu nick"
          />
          {errors.nickname && (
            <div className="invalid-feedback">{errors.nickname}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input
            type="email"
            className={`form-control ${errors.email && "is-invalid"}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@unahur.edu.ar"
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Registrarse
        </button>

        {message && (
          <div className="alert alert-warning mt-3 py-2">{message}</div>
        )}
      </form>


      <p className="mt-3 text-center">
        ¿Ya tienes cuenta?{" "}
        <Link to="/" className="text-decoration-none fw-semibold">Iniciá sesión</Link>
      </p>
    </div>
  </div>
);
 } 
