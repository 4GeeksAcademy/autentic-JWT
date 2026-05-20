import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="container mt-5 text-center">
            <div className="card p-5 shadow-lg bg-dark text-white border-0">
                <h1 className="display-4 text-warning">🔒 Vista Privada</h1>
                <p className="lead mt-3">
                    ¡Acceso concedido! Estás viendo este contenido exclusivo porque tienes un token JWT válido
                </p>
                <hr className="bg-light" />
                <p className="text-muted">Si intentas borrar el token e inspeccionar la ruta, el sistema te expulsará automáticamente.</p>
                <div className="mt-4">
                    <img
                        src="https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=600"
                        alt="Acceso Autorizado"
                        className="rounded img-fluid"
                        style={{ maxWidth: "350px" }}
                    />
                </div>
            </div>
        </div>
    );
};