import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		dispatch({ type: "clear_token" });
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto d-flex align-items-center">
					<Link to="/demo" className="me-2">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>


					{!store.token ? (
						<>
							{/* Si NO hay token se ve Registro e Iniciar Sesion */}
							<Link to="/signup" className="btn btn-outline-secondary me-2">
								Registro
							</Link>
							<Link to="/login" className="btn btn-success">
								Iniciar Sesión
							</Link>
						</>
					) : (
						/* Si hay token se muestra cerrar sesion */
						<button onClick={handleLogout} className="btn btn-danger">
							Cerrar Sesión
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};