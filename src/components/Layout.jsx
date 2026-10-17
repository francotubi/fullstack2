import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../context/Store';
export default function Layout() {
    const { state, user, act } = useStore(),
        [open, setOpen] = useState(false),
        navigate = useNavigate();
    return (
        <div className="app-shell">
            <nav
                className="navbar navbar-expand-xl navbar-dark bg-danger"
                aria-label="Navegación principal"
            >
                <div className="container">
                    <Link
                        className="navbar-brand fw-bold"
                        to="/"
                        onClick={() => setOpen(false)}
                    >
                        🍔 DeliveryApp
                    </Link>
                    <button
                        className="navbar-toggler"
                        aria-label="Abrir menú"
                        aria-controls="main-nav"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div
                        id="main-nav"
                        className={
                            'collapse navbar-collapse' + (open ? ' show' : '')
                        }
                    >
                        <div className="navbar-nav me-auto">
                            {[
                                ['/', 'Inicio'],
                                ['/productos', 'Productos'],
                                ['/categorias', 'Categorías'],
                                ['/ofertas', 'Ofertas'],
                                ['/nosotros', 'Nosotros'],
                                ['/blog', 'Blog'],
                                ['/contacto', 'Contacto'],
                            ].map(([to, label]) => (
                                <NavLink
                                    end={to === '/'}
                                    className="nav-link"
                                    key={to}
                                    to={to}
                                    onClick={() => setOpen(false)}
                                >
                                    {label}
                                </NavLink>
                            ))}
                        </div>
                        <div className="d-flex gap-2 flex-wrap py-2 align-items-center">
                            {user ? (
                                <>
                                    <Link
                                        className="btn btn-outline-light"
                                        to="/perfil"
                                    >
                                        Mi perfil
                                    </Link>
                                    {user.rol === 'Admin' && (
                                        <Link
                                            className="btn btn-light"
                                            to="/admin"
                                        >
                                            Administración
                                        </Link>
                                    )}
                                    <button
                                        className="btn btn-outline-light"
                                        onClick={() => {
                                            act('logout');
                                            navigate('/');
                                            setOpen(false);
                                        }}
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        className="btn btn-outline-light"
                                        to="/login"
                                    >
                                        Ingresar
                                    </Link>
                                    <Link
                                        className="btn btn-outline-light"
                                        to="/registro"
                                    >
                                        Crear cuenta
                                    </Link>
                                </>
                            )}
                            <Link
                                className="btn btn-light text-danger fw-bold"
                                aria-label="Ver carrito"
                                to="/carrito"
                            >
                                🛒 (
                                {state.cart.reduce((n, p) => n + p.quantity, 0)}
                                )
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <footer className="bg-dark text-white py-4 mt-5">
                <div className="container d-flex flex-wrap gap-3 justify-content-between">
                    <span>© {new Date().getFullYear()} DeliveryApp</span>
                    <Link className="text-white" to="/contacto">
                        Contacto
                    </Link>
                    <span className="small">
                        Tienda académica · Compras simuladas
                    </span>
                </div>
            </footer>
        </div>
    );
}
