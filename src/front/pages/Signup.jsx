import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (email === "" || password === "") {
            setError("Todos los campos son obligatorios");
            return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            const resp = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await resp.json();

            if (!resp.ok) {
                setError(data.msg || "Error al registrar el usuario");
                return;
            }

            setSuccessMsg("¡Usuario creado con éxito! Redirigiendo al login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            console.error("Error en signup:", err);
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Registro</h2>
            <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow-sm">
                {error && <div className="alert alert-danger">{error}</div>}
                {successMsg && <div className="alert alert-success">{successMsg}</div>}

                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="******"
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Registrarse</button>
            </form>
        </div>
    );
};