import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./login.css";

export default function Login() {
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        async function obtenerUsuarios() {
            try {
                const res = await fetch('http://localhost:3001/users');
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Error al cargar usuarios:", error.message);
                setMessage("Error al cargar usuarios. Inténtalo de nuevo más tarde.");
            }
        }
        obtenerUsuarios();
    }, []);

    function validate() {
        const newErrors = {};
        if (!nickname.trim()) newErrors.nickname = "El nickname es obligatorio";
        if (nickname.trim() && users.length > 0) {
            const exists = users.some((u) => u.nickName === nickname.trim());
            if (!exists) newErrors.nickname = "El usuario no existe";
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
            const foundUser = users.find(
                (u) => u.nickName === nickname.trim()
            );

            if (foundUser) {
                const userForAuthContext = {
                    ...foundUser,
                    displayName: foundUser.nickName,
                    photoURL: foundUser.photoURL || 'https://via.placeholder.com/150/0f3460/e0e0e0?text=Avatar'
                };

                login(userForAuthContext);
                navigate('/home');
            } else {
                setMessage("Error: Usuario no encontrado después de validación.");
            }
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow p-4 w-100" style={{ maxWidth: 480 }}>
                <h1 className="h4 text-center mb-4 text-secondary fw-semibold">
                    UNAHUR ANTI-SOCIAL NET
                </h1>
                <br />
                <h1 className="h4 text-center mb-4 text-secondary fw-semibold">
                    Iniciar Sesión
                </h1>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label className="form-label">Nickname</label>
                        <input
                            className={`form-control ${errors.nickname && "is-invalid"}`}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            autoComplete="username"
                            placeholder="Tu nick"
                            required
                        />
                        {errors.nickname && (
                            <div className="invalid-feedback">{errors.nickname}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password && "is-invalid"}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            required
                        />
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-dark w-100">
                        Ingresar
                    </button>

                    {message && (
                        <div className="alert alert-warning mt-3 py-2">{message}</div>
                    )}
                </form>

                <p className="mt-3 text-center">
                    ¿No tenés cuenta?{" "}
                    <Link to="/register" className="text-decoration-none fw-semibold">Registrate</Link>
                </p>
            </div>
        </div>
    );
}