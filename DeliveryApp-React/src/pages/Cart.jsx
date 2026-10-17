import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/Store';
import { money, priceOf, validEmail, regions } from '../utils/validation';
import { AddressFields, useForm } from './Account';
import Field from '../components/Field';
import Feedback from '../components/Feedback';
import Button from '../components/Button';
export function Cart() {
    const { state, act } = useStore(),
        [error, setError] = useState('');
    let total = 0;
    return (
        <div className="container py-5">
            <h1>Mi carrito</h1>
            <Feedback message={error} />
            {!state.cart.length ? (
                <>
                    <p>Tu carrito está vacío.</p>
                    <Link to="/productos">Ver productos</Link>
                </>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {state.cart.map((line) => {
                                    const p = state.products.find(
                                        (p) => p.id === line.id,
                                    );
                                    if (!p) return null;
                                    total += priceOf(p) * line.quantity;
                                    return (
                                        <tr key={p.id}>
                                            <td>
                                                <Link to={'/productos/' + p.id}>
                                                    {p.nombre}
                                                </Link>
                                            </td>
                                            <td>{money(priceOf(p))}</td>
                                            <td>
                                                <input
                                                    className="form-control quantity-input"
                                                    aria-label={
                                                        'Cantidad de ' +
                                                        p.nombre
                                                    }
                                                    type="number"
                                                    min="1"
                                                    max={p.stock}
                                                    value={line.quantity}
                                                    onChange={(e) => {
                                                        try {
                                                            act(
                                                                'cart',
                                                                p.id,
                                                                Number(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            );
                                                            setError('');
                                                        } catch (error) {
                                                            setError(
                                                                error.message,
                                                            );
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                {money(
                                                    priceOf(p) * line.quantity,
                                                )}
                                            </td>
                                            <td>
                                                <Button
                                                    className="btn-outline-danger btn-sm"
                                                    onClick={() =>
                                                        act('cart', p.id, 0)
                                                    }
                                                >
                                                    Quitar
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="h4 text-end">Subtotal: {money(total)}</p>
                    <p className="text-end text-muted">
                        El costo de envío se calcula en el checkout.
                    </p>
                    <div className="d-flex justify-content-between">
                        <Link to="/productos">Seguir comprando</Link>
                        <Link className="btn btn-success" to="/checkout">
                            Continuar al checkout
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
export function Checkout() {
    const { state, user, act } = useStore(),
        navigate = useNavigate(),
        { values, change } = useForm({
            nombre: user?.nombre || '',
            correo: user?.correo || '',
            telefono: user?.telefono || '',
            direccion: user?.direccion || '',
            region: user?.region || '',
            comuna: user?.comuna || '',
            entrega: 'estandar',
            resultado: 'aprobado',
        }),
        [errors, setErrors] = useState({}),
        [message, setMessage] = useState(''),
        [busy, setBusy] = useState(false);
    if (!state.cart.length && !busy) return <Navigate to="/carrito" replace />;
    const subtotal = state.cart.reduce((n, line) => {
            const p = state.products.find((p) => p.id === line.id);
            return n + (p ? priceOf(p) * line.quantity : 0);
        }, 0),
        envio = values.entrega === 'express' ? 2500 : 1500;
    function submit(e) {
        e.preventDefault();
        const err = {};
        if (!values.nombre.trim() || values.nombre.length > 150)
            err.nombre = 'Ingresa tu nombre (máximo 150 caracteres).';
        if (!validEmail(values.correo) || values.correo.length > 100)
            err.correo = 'Ingresa un correo permitido.';
        if (!/^[+0-9 ()-]{8,20}$/.test(values.telefono))
            err.telefono = 'Ingresa un teléfono de 8 a 20 caracteres.';
        if (values.direccion.trim().length < 5 || values.direccion.length > 300)
            err.direccion = 'Ingresa una dirección de 5 a 300 caracteres.';
        if (!regions[values.region]) err.region = 'Selecciona una región.';
        if (!regions[values.region]?.includes(values.comuna))
            err.comuna = 'Selecciona una comuna de tu región.';
        setErrors(err);
        setMessage('');
        if (Object.keys(err).length || busy) return;
        setBusy(true);
        try {
            const result = act('checkout', values);
            navigate(result.ok ? '/compra/exitosa' : '/compra/error', {
                state: result.ok ? { order: result.order } : null,
                replace: true,
            });
        } catch (error) {
            setMessage(error.message);
            setBusy(false);
        }
    }
    return (
        <div className="container py-5">
            <h1>Datos de entrega</h1>
            <p>
                {user
                    ? 'Tus datos disponibles se completaron desde tu perfil.'
                    : 'Puedes comprar como invitado o iniciar sesión para completar tus datos.'}
            </p>
            <div className="row g-4">
                <form className="col-lg-7" noValidate onSubmit={submit}>
                    <Field
                        name="nombre"
                        label="Nombre completo"
                        autoComplete="name"
                        value={values.nombre}
                        onChange={change}
                        error={errors.nombre}
                    />
                    <Field
                        name="correo"
                        label="Correo electrónico"
                        type="email"
                        autoComplete="email"
                        value={values.correo}
                        onChange={change}
                        error={errors.correo}
                    />
                    <AddressFields
                        values={values}
                        change={change}
                        errors={errors}
                    />
                    <Field
                        name="entrega"
                        label="Opción de entrega"
                        as="select"
                        value={values.entrega}
                        onChange={change}
                    >
                        <option value="estandar">
                            Estándar · 45–60 minutos · $1.500
                        </option>
                        <option value="express">
                            Express · 25–35 minutos · $2.500
                        </option>
                    </Field>
                    <Field
                        name="resultado"
                        label="Resultado del pago simulado"
                        as="select"
                        value={values.resultado}
                        onChange={change}
                    >
                        <option value="aprobado">Simular pago aprobado</option>
                        <option value="rechazado">
                            Simular pago rechazado
                        </option>
                    </Field>
                    <p className="small text-muted">
                        Demostración académica: no ingreses datos bancarios. No
                        se realiza ningún cobro.
                    </p>
                    <Feedback message={message} />
                    <Button type="submit" disabled={busy}>
                        {busy ? 'Confirmando…' : 'Confirmar compra simulada'}
                    </Button>
                </form>
                <aside className="col-lg-5">
                    <div className="card card-body">
                        <h2 className="h4">Resumen</h2>
                        {state.cart.map((line) => (
                            <p key={line.id}>
                                {
                                    state.products.find((p) => p.id === line.id)
                                        ?.nombre
                                }{' '}
                                × {line.quantity}
                            </p>
                        ))}
                        <p>Subtotal: {money(subtotal)}</p>
                        <p>Envío: {money(envio)}</p>
                        <p className="h4">Total: {money(subtotal + envio)}</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
