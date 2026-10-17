import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../context/Store';
import ProductList from '../components/ProductList';
import Feedback from '../components/Feedback';
export default function Catalog({ home = false, offers = false }) {
    const { state, act } = useStore(),
        { categoryId } = useParams();
    const [query, setQuery] = useState(''),
        [category, setCategory] = useState(''),
        [sort, setSort] = useState('nombre'),
        [notice, setNotice] = useState(null);
    const routeCategory = state.categories.find(
        (c) => String(c.id) === categoryId,
    );
    const filterCategory = routeCategory?.nombre || category;
    let products = state.products.filter(
        (p) =>
            (!offers || p.descuento > 0) &&
            (!filterCategory || p.categoria === filterCategory) &&
            p.nombre
                .toLocaleLowerCase('es')
                .includes(query.toLocaleLowerCase('es')),
    );
    products = [...products].sort((a, b) =>
        sort === 'precio'
            ? a.precio * (1 - a.descuento / 100) -
              b.precio * (1 - b.descuento / 100)
            : a.nombre.localeCompare(b.nombre),
    );
    function add(product) {
        try {
            const old =
                state.cart.find((p) => p.id === product.id)?.quantity || 0;
            act('cart', product.id, old + 1);
            setNotice({
                type: 'success',
                text: product.nombre + ' añadido al carrito.',
            });
        } catch (e) {
            setNotice({ type: 'danger', text: e.message });
        }
    }
    return (
        <>
            {home && (
                <header className="hero text-center text-white">
                    <div className="container">
                        <h1 className="display-4 fw-bold">
                            Pide lo que se te ocurra
                        </h1>
                        <p className="lead">
                            Tus sabores favoritos, ahora más cerca.
                        </p>
                        <Link className="btn btn-danger btn-lg" to="/productos">
                            Ver menú
                        </Link>
                    </div>
                </header>
            )}
            <section className="container py-5">
                <h1 className={home ? 'h2 mb-4' : 'mb-4'}>
                    {home
                        ? 'Productos destacados'
                        : offers
                          ? 'Ofertas'
                          : routeCategory
                            ? routeCategory.nombre
                            : 'Nuestros productos'}
                </h1>
                {categoryId && !routeCategory ? (
                    <Feedback message="La categoría no existe." />
                ) : (
                    <>
                        <div className="row g-3 mb-4">
                            <div className="col-md-5">
                                <label htmlFor="search" className="form-label">
                                    Buscar productos
                                </label>
                                <input
                                    id="search"
                                    type="search"
                                    className="form-control"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Nombre del producto"
                                />
                            </div>
                            {!categoryId && (
                                <div className="col-md-4">
                                    <label
                                        htmlFor="category"
                                        className="form-label"
                                    >
                                        Categoría
                                    </label>
                                    <select
                                        id="category"
                                        className="form-select"
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                    >
                                        <option value="">Todas</option>
                                        {state.categories.map((c) => (
                                            <option key={c.id}>
                                                {c.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="col-md-3">
                                <label htmlFor="sort" className="form-label">
                                    Ordenar por
                                </label>
                                <select
                                    id="sort"
                                    className="form-select"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <option value="nombre">Nombre</option>
                                    <option value="precio">Menor precio</option>
                                </select>
                            </div>
                        </div>
                        <Feedback message={notice?.text} type={notice?.type} />
                        <ProductList products={products} onAdd={add} />
                    </>
                )}
            </section>
        </>
    );
}
export function Categories() {
    const { state } = useStore();
    return (
        <div className="container py-5">
            <h1>Categorías</h1>
            <div className="row g-4 mt-1">
                {state.categories.map((c) => (
                    <div className="col-md-4" key={c.id}>
                        <Link
                            className="card card-body shadow-sm text-decoration-none"
                            to={'/categorias/' + c.id}
                        >
                            <h2 className="h4">{c.nombre}</h2>
                            <span>
                                {
                                    state.products.filter(
                                        (p) => p.categoria === c.nombre,
                                    ).length
                                }{' '}
                                productos
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
