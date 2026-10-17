import { useState } from 'react';
import {
    Link,
    NavLink,
    Navigate,
    Outlet,
    useNavigate,
    useParams,
} from 'react-router-dom';
import { useStore } from '../context/Store';
import {
    money,
    validEmail,
    validPassword,
    validRun,
} from '../utils/validation';
import { useForm } from './Account';
import Field from '../components/Field';
import Button from '../components/Button';
import Feedback from '../components/Feedback';
export function AdminLayout() {
    const { user } = useStore();
    if (!user) return <Navigate to="/login" replace />;
    if (user.rol !== 'Admin')
        return (
            <div className="container py-5">
                <h1>Acceso restringido</h1>
                <p>Esta sección requiere una cuenta de administrador.</p>
            </div>
        );
    return (
        <div className="container-fluid py-4">
            <div className="row g-4">
                <aside className="col-lg-3 col-xl-2">
                    <nav
                        className="nav flex-column bg-dark p-3 rounded"
                        aria-label="Administración"
                    >
                        {[
                            ['/admin', 'Resumen'],
                            ['/admin/productos', 'Productos'],
                            ['/admin/criticos', 'Stock crítico'],
                            ['/admin/categorias', 'Categorías'],
                            ['/admin/usuarios', 'Usuarios'],
                            ['/admin/pedidos', 'Órdenes y comprobantes'],
                            ['/admin/reportes', 'Reportes'],
                            ['/perfil', 'Mi perfil'],
                        ].map(([to, label]) => (
                            <NavLink
                                end={to === '/admin'}
                                className="nav-link text-white"
                                key={to}
                                to={to}
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <section className="col-lg-9 col-xl-10">
                    <Outlet />
                </section>
            </div>
        </div>
    );
}
export function Dashboard() {
    const { state } = useStore();
    const cards = [
        ['Productos', state.products.length, '/admin/productos'],
        ['Usuarios', state.users.length, '/admin/usuarios'],
        ['Órdenes', state.orders.length, '/admin/pedidos'],
        [
            'Stock crítico',
            state.products.filter((p) => p.stock <= 5).length,
            '/admin/criticos',
        ],
    ];
    return (
        <>
            <h1>Panel de administración</h1>
            <div className="row g-3 mt-2">
                {cards.map(([label, value, to]) => (
                    <div className="col-md-6 col-xl-3" key={to}>
                        <Link
                            to={to}
                            className="card card-body text-decoration-none"
                        >
                            <h2 className="h6">{label}</h2>
                            <span className="display-5 text-danger">
                                {value}
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
            <p className="mt-4">
                Gestiona el catálogo, las cuentas y las compras simuladas desde
                el menú.
            </p>
        </>
    );
}
const settings = {
    products: {
        title: 'Productos',
        route: 'productos',
        columns: [
            ['codigo', 'Código'],
            ['nombre', 'Nombre'],
            ['categoria', 'Categoría'],
            ['precio', 'Precio base'],
            ['stock', 'Stock'],
            ['descuento', 'Descuento %'],
        ],
    },
    categories: {
        title: 'Categorías',
        route: 'categorias',
        columns: [['nombre', 'Nombre']],
    },
    users: {
        title: 'Usuarios',
        route: 'usuarios',
        columns: [
            ['nombre', 'Nombre'],
            ['correo', 'Correo'],
            ['rol', 'Rol'],
        ],
    },
};
export function CrudList({ collection, critical = false }) {
    const { state, act } = useStore(),
        [query, setQuery] = useState(''),
        [pending, setPending] = useState(null),
        [error, setError] = useState('');
    const config = settings[collection];
    const rows = state[collection].filter(
        (x) =>
            (!critical || x.stock <= 5) &&
            String(x.nombre || '')
                .toLocaleLowerCase('es')
                .includes(query.toLocaleLowerCase('es')),
    );
    return (
        <>
            <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
                <h1>
                    {critical ? 'Productos con stock crítico' : config.title}
                </h1>
                <Link
                    className="btn btn-danger"
                    to={'/admin/' + config.route + '/nuevo'}
                >
                    Crear{' '}
                    {collection === 'products'
                        ? 'producto'
                        : collection === 'users'
                          ? 'usuario'
                          : 'categoría'}
                </Link>
            </div>
            {critical && <p>Productos con 5 unidades o menos.</p>}
            <label className="form-label mt-3" htmlFor="admin-search">
                Buscar por nombre
            </label>
            <input
                id="admin-search"
                className="form-control mb-3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Feedback message={error} />
            {pending && (
                <div className="alert alert-warning" role="alert">
                    <p>
                        ¿Eliminar «{pending.nombre}»? Esta acción no se puede
                        deshacer.
                    </p>
                    <Button
                        onClick={() => {
                            try {
                                act('remove', collection, pending.id);
                                setPending(null);
                                setError('');
                            } catch (error) {
                                setError(error.message);
                                setPending(null);
                            }
                        }}
                    >
                        Confirmar eliminación
                    </Button>{' '}
                    <Button
                        className="btn-secondary"
                        onClick={() => setPending(null)}
                    >
                        Cancelar
                    </Button>
                </div>
            )}
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            {config.columns.map(([key, title]) => (
                                <th key={key}>{title}</th>
                            ))}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                {config.columns.map(([key]) => (
                                    <td key={key}>
                                        {key === 'precio'
                                            ? money(row[key])
                                            : row[key]}
                                    </td>
                                ))}
                                <td>
                                    <div className="d-flex flex-wrap gap-2">
                                        <Link
                                            className="btn btn-outline-primary btn-sm"
                                            to={
                                                '/admin/' +
                                                config.route +
                                                '/' +
                                                row.id +
                                                '/editar'
                                            }
                                        >
                                            Editar
                                        </Link>
                                        {collection === 'users' && (
                                            <Link
                                                className="btn btn-outline-secondary btn-sm"
                                                to={
                                                    '/admin/usuarios/' +
                                                    row.id +
                                                    '/compras'
                                                }
                                            >
                                                Historial de compras
                                            </Link>
                                        )}
                                        <Button
                                            className="btn-outline-danger btn-sm"
                                            onClick={() => setPending(row)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!rows.length && <p>No hay registros para mostrar.</p>}
            </div>
        </>
    );
}
export function CrudForm({ collection }) {
    const { id } = useParams(),
        { state, act } = useStore(),
        navigate = useNavigate(),
        config = settings[collection];
    const existing = id
        ? state[collection].find((x) => String(x.id) === id)
        : null;
    const defaults =
        collection === 'products'
            ? {
                  codigo: '',
                  nombre: '',
                  descripcion: '',
                  categoria: state.categories[0]?.nombre || '',
                  precio: '',
                  stock: '',
                  descuento: 0,
                  imagen: '',
              }
            : collection === 'users'
              ? {
                    nombre: '',
                    correo: '',
                    password: '',
                    run: '',
                    rol: 'Cliente',
                }
              : { nombre: '' };
    const { values, change } = useForm(
            existing ? { ...defaults, ...existing } : defaults,
        ),
        [errors, setErrors] = useState({}),
        [message, setMessage] = useState('');
    if (id && !existing)
        return (
            <>
                <h1>Registro no encontrado</h1>
                <Link to={'/admin/' + config.route}>Volver</Link>
            </>
        );
    function submit(e) {
        e.preventDefault();
        const err = {};
        let data = { ...values };
        if (
            !values.nombre?.trim() ||
            values.nombre.length >
                (collection === 'products'
                    ? 100
                    : collection === 'users'
                      ? 150
                      : 60)
        )
            err.nombre = 'Ingresa un nombre dentro del máximo permitido.';
        if (collection === 'products') {
            data = {
                ...data,
                precio: Number(values.precio),
                stock: Number(values.stock),
                descuento: Number(values.descuento),
            };
            if (
                !values.codigo?.trim() ||
                values.codigo.length < 3 ||
                values.codigo.length > 30
            )
                err.codigo = 'Usa de 3 a 30 caracteres.';
            if (!Number.isSafeInteger(data.precio) || data.precio <= 0)
                err.precio = 'Ingresa un precio entero mayor que cero.';
            if (
                values.stock === '' ||
                !Number.isSafeInteger(data.stock) ||
                data.stock < 0
            )
                err.stock = 'Ingresa un stock entero igual o mayor que cero.';
            if (
                !Number.isFinite(data.descuento) ||
                data.descuento < 0 ||
                data.descuento > 90
            )
                err.descuento = 'Usa un descuento de 0 a 90 %.';
            if (values.descripcion.length > 500)
                err.descripcion = 'Usa hasta 500 caracteres.';
            if (!state.categories.some((c) => c.nombre === values.categoria))
                err.categoria = 'Selecciona una categoría.';
        }
        if (collection === 'users') {
            if (!validEmail(values.correo) || values.correo.length > 100)
                err.correo = 'Ingresa un correo permitido.';
            if (!validPassword(values.password))
                err.password = 'Usa de 4 a 10 caracteres.';
            if (values.run && !validRun(values.run))
                err.run =
                    'RUN inválido. Escribe el dígito verificador sin puntos ni guion.';
            data.run = values.run.toUpperCase();
        }
        setErrors(err);
        setMessage('');
        if (Object.keys(err).length) return;
        try {
            if (existing) act('update', collection, existing.id, data);
            else act('create', collection, data);
            navigate('/admin/' + config.route);
        } catch (error) {
            setMessage(error.message);
        }
    }
    return (
        <div className="admin-form">
            <h1>
                {existing ? 'Editar' : 'Crear'}{' '}
                {collection === 'products'
                    ? 'producto'
                    : collection === 'users'
                      ? 'usuario'
                      : 'categoría'}
            </h1>
            <form noValidate onSubmit={submit}>
                <Field
                    name="nombre"
                    label="Nombre"
                    value={values.nombre}
                    onChange={change}
                    error={errors.nombre}
                />
                {collection === 'products' && (
                    <>
                        <Field
                            name="codigo"
                            label="Código"
                            value={values.codigo}
                            onChange={change}
                            error={errors.codigo}
                        />
                        <Field
                            name="descripcion"
                            label="Descripción"
                            as="textarea"
                            value={values.descripcion}
                            onChange={change}
                            error={errors.descripcion}
                        />
                        <div className="row">
                            <div className="col-sm-4">
                                <Field
                                    name="precio"
                                    label="Precio base ($ CLP)"
                                    type="number"
                                    value={values.precio}
                                    onChange={change}
                                    error={errors.precio}
                                />
                            </div>
                            <div className="col-sm-4">
                                <Field
                                    name="stock"
                                    label="Stock"
                                    type="number"
                                    value={values.stock}
                                    onChange={change}
                                    error={errors.stock}
                                />
                            </div>
                            <div className="col-sm-4">
                                <Field
                                    name="descuento"
                                    label="Descuento (%)"
                                    type="number"
                                    value={values.descuento}
                                    onChange={change}
                                    error={errors.descuento}
                                />
                            </div>
                        </div>
                        <Field
                            name="categoria"
                            label="Categoría"
                            as="select"
                            value={values.categoria}
                            onChange={change}
                            error={errors.categoria}
                        >
                            {!state.categories.length && (
                                <option value="">
                                    Primero crea una categoría
                                </option>
                            )}
                            {state.categories.map((c) => (
                                <option key={c.id}>{c.nombre}</option>
                            ))}
                        </Field>
                        <Field
                            name="imagen"
                            label="Ruta o URL de imagen (opcional)"
                            type="text"
                            value={values.imagen}
                            onChange={change}
                        />
                    </>
                )}
                {collection === 'users' && (
                    <>
                        <Field
                            name="run"
                            label="RUN (opcional, sin puntos ni guion)"
                            value={values.run}
                            onChange={change}
                            error={errors.run}
                        />
                        <Field
                            name="correo"
                            label="Correo electrónico"
                            type="email"
                            value={values.correo}
                            onChange={change}
                            error={errors.correo}
                        />
                        <Field
                            name="password"
                            label={
                                existing
                                    ? 'Contraseña de demostración'
                                    : 'Contraseña inicial'
                            }
                            type="password"
                            autoComplete="new-password"
                            value={values.password}
                            onChange={change}
                            error={errors.password}
                        />
                        <Field
                            name="rol"
                            label="Rol"
                            as="select"
                            value={values.rol}
                            onChange={change}
                        >
                            {['Cliente', 'Admin', 'Vendedor'].map((r) => (
                                <option key={r}>{r}</option>
                            ))}
                        </Field>
                    </>
                )}
                <Feedback message={message} />
                <div className="d-flex gap-2">
                    <Button type="submit">Guardar</Button>
                    <Link
                        className="btn btn-secondary"
                        to={'/admin/' + config.route}
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
export function Orders({ history = false }) {
    const { state } = useStore(),
        { id } = useParams(),
        [query, setQuery] = useState('');
    const user = state.users.find((u) => String(u.id) === id),
        orders = state.orders.filter(
            (o) =>
                (!history || String(o.usuarioId) === id) &&
                String(o.id + ' ' + o.cliente.nombre)
                    .toLowerCase()
                    .includes(query.toLowerCase()),
        );
    return (
        <>
            <h1>
                {history
                    ? 'Historial de compras: ' +
                      (user?.nombre || 'usuario no disponible')
                    : 'Órdenes y comprobantes'}
            </h1>
            <label htmlFor="order-search" className="form-label">
                Buscar por pedido o cliente
            </label>
            <input
                id="order-search"
                className="form-control mb-3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o.id}>
                                <td>#{o.id}</td>
                                <td>{o.cliente.nombre}</td>
                                <td>
                                    {new Date(o.fecha).toLocaleDateString(
                                        'es-CL',
                                    )}
                                </td>
                                <td>{money(o.total)}</td>
                                <td>
                                    <Link to={'/pedidos/' + o.id}>
                                        Ver comprobante
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!orders.length && <p>No hay compras registradas.</p>}
            </div>
        </>
    );
}
export function Reports() {
    const { state } = useStore();
    const total = state.orders.reduce((n, o) => n + o.total, 0),
        units = state.orders
            .flatMap((o) => o.items)
            .reduce((n, p) => n + p.cantidad, 0);
    const rankings = Object.values(
        state.orders
            .flatMap((o) => o.items)
            .reduce((map, p) => {
                map[p.id] ??= { nombre: p.nombre, cantidad: 0, total: 0 };
                map[p.id].cantidad += p.cantidad;
                map[p.id].total += p.cantidad * p.precio;
                return map;
            }, {}),
    ).sort((a, b) => b.cantidad - a.cantidad);
    return (
        <>
            <h1>Reportes</h1>
            <p>Resumen de las compras simuladas guardadas en este navegador.</p>
            <div className="row g-3 mb-4">
                {[
                    ['Total de órdenes', state.orders.length],
                    ['Ingresos con envío', money(total)],
                    ['Unidades vendidas', units],
                    ['Mensajes recibidos', state.messages.length],
                ].map(([label, value]) => (
                    <div className="col-md-6 col-xl-3" key={label}>
                        <div className="card card-body">
                            <h2 className="h6">{label}</h2>
                            <strong className="h3">{value}</strong>
                        </div>
                    </div>
                ))}
            </div>
            <h2 className="h4">Productos más vendidos</h2>
            {rankings.length ? (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Unidades</th>
                                <th>Ventas sin envío</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankings.map((p) => (
                                <tr key={p.nombre}>
                                    <td>{p.nombre}</td>
                                    <td>{p.cantidad}</td>
                                    <td>{money(p.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Aún no hay ventas.</p>
            )}
            <h2 className="h4 mt-4">Mensajes de contacto</h2>
            {state.messages.map((m) => (
                <article className="card card-body mb-2" key={m.id}>
                    <h3 className="h6">
                        {m.nombre} · {m.correo}
                    </h3>
                    <p className="mb-0">{m.comentario}</p>
                </article>
            ))}
        </>
    );
}
