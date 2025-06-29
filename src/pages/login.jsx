import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
function LoginForm() {
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [users, setUsers]= useState([])
    const navigate = useNavigate()
    const { login } = useAuth();

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

   function validate() {
    const newErrors = {};
    if (!nickname.trim()) newErrors.nickname = "El nickname es obligatorio";
        if (nickname.trim() && users.length > 0) {
      const exists = users.some((u) => u.nickName === nickname.trim());
      if (!exists) newErrors.nickname = "El usuario no existe";
      console.log
    }
    if (!password) newErrors.password = "La contraseña es obligatoria";
    else if (password !== "123456") newErrors.password = "Contraseña incorrecta";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (validate()) {
       
        const userSesion = users.find(
      (u) => u.nickName === nickname.trim()
      ); 
      login(userSesion)
      navigate('/home')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nickname</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          autoComplete="username"
        />
        {errors.nickname && <small>{errors.nickname}</small>}
      </div>

      <div>
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {errors.password && <small>{errors.password}</small>}
      </div>

      <button type="submit">Ingresar</button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default LoginForm;
