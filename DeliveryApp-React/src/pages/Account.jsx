import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../context/Store';
import Field from '../components/Field';
import Feedback from '../components/Feedback';
import Button from '../components/Button';
import {
    regions,
    userErrors,
    validEmail,
    validPassword,
} from '../utils/validation';
export function AddressFields({ values, change, errors = {} }) {
    return (
        <>
            <Field
                name="telefono"
                label="Teléfono"
                type="tel"
                autoComplete="tel"
                value={values.telefono || ''}
                onChange={change}
                error={errors.telefono}
            />
            <Field
                name="direccion"
                label="Dirección de entrega"
                autoComplete="street-address"
                maxLength={300}
                value={values.direccion || ''}
                onChange={change}
                error={errors.direccion}
            />
            <Field
                name="region"
                label="Región"
                as="select"
                value={values.region || ''}
                onChange={change}
                error={errors.region}
            >
                <option value="">Selecciona una región</option>
                {Object.keys(regions).map((r) => (
                    <option key={r}>{r}</option>
                ))}
            </Field>
            <Field
                name="comuna"
                label="Comuna"
                as="select"
                value={values.comuna || ''}
                onChange={change}
                error={errors.comuna}
            >
                <option value="">Selecciona una comuna</option>
                {(regions[values.region] || []).map((c) => (
                    <option key={c}>{c}</option>
                ))}
            </Field>
        </>
    );
}
export function useForm(initial) {
    const [values, setValues] = useState(initial);
    function change(e) {
        const { name, value } = e.target;
        setValues((v) => ({
            ...v,
            [name]: value,
            ...(name === 'region' ? { comuna: '' } : {}),
        }));
    }
    return { values, setValues, change };
}
export function Login() {
    const { user, act } = useStore(),
        navigate = useNavigate(),
        { values, change } = useForm({ correo: '', password: '' }),
        [errors, setErrors] = useState({}),
        [message, setMessage] = useState('');
    if (user)
        return <Navigate replace to={user.rol === 'Admin' ? '/admin' : '/'} />;
    function submit(e) {
        e.preventDefault();
        const err = {};
        if (!validEmail(values.correo))
            err.correo = 'Ingresa un correo permitido.';
        if (!validPassword(values.password))
            err.password = 'Usa de 4 a 10 caracteres.';
        setErrors(err);
        setMessage('');
        if (Object.keys(err).length) return;
        try {
            const logged = act('login', values.correo, values.password);
            navigate(logged.rol === 'Admin' ? '/admin' : '/');
        } catch (error) {
            setMessage(error.message);
        }
    }
    return (
        <div className="container py-5">
            <section className="card shadow-sm p-4 auth-card mx-auto">
                <h1 className="h2">Iniciar sesión</h1>
                <form noValidate onSubmit={submit}>
                    <Field
                        name="correo"
                        label="Correo electrónico"
                        type="email"
                        autoComplete="email"
                        value={values.correo}
                        onChange={change}
                        error={errors.correo}
                    />
                    <Field
                        name="password"
                        label="Contraseña"
                        type="password"
                        autoComplete="current-password"
                        value={values.password}
                        onChange={change}
                        error={errors.password}
                    />
                    <Feedback message={message} />
                    <Button type="submit">Ingresar</Button>
                </form>
                <Link className="mt-3" to="/registro">
                    Crear una cuenta
                </Link>
            </section>
        </div>
    );
}
export function Register() {
    const { user, act } = useStore(),
        { values, change } = useForm({
            nombre: '',
            correo: '',
            password: '',
            confirmacion: '',
            telefono: '',
            direccion: '',
            region: '',
            comuna: '',
        }),
        [errors, setErrors] = useState({}),
        [message, setMessage] = useState(''),
        [done, setDone] = useState(false);
    if (user) return <Navigate to="/perfil" replace />;
    function submit(e) {
        e.preventDefault();
        const err = userErrors(values, { register: true });
        setErrors(err);
        setMessage('');
        if (Object.keys(err).length) return;
        try {
            act('register', values);
            setDone(true);
        } catch (error) {
            setMessage(error.message);
        }
    }
    return (
        <div className="container py-5">
            <section className="card shadow-sm p-4 auth-card mx-auto">
                <h1 className="h2">Crear cuenta</h1>
                {done ? (
                    <>
                        <Feedback
                            type="success"
                            message="Tu cuenta fue creada. Ya puedes iniciar sesión."
                        />
                        <Link to="/login">Ir a iniciar sesión</Link>
                    </>
                ) : (
                    <form noValidate onSubmit={submit}>
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
                        <p className="small text-muted">
                            Correos @duoc.cl, @profesor.duoc.cl o @gmail.com.
                            Contraseña de 4 a 10 caracteres.
                        </p>
                        <Field
                            name="password"
                            label="Contraseña"
                            type="password"
                            autoComplete="new-password"
                            value={values.password}
                            onChange={change}
                            error={errors.password}
                        />
                        <Field
                            name="confirmacion"
                            label="Confirmar contraseña"
                            type="password"
                            autoComplete="new-password"
                            value={values.confirmacion}
                            onChange={change}
                            error={errors.confirmacion}
                        />
                        <AddressFields values={values} change={change} />
                        <Feedback message={message} />
                        <Button type="submit">Crear cuenta</Button>
                    </form>
                )}
            </section>
        </div>
    );
}
export function Profile() {
    const { user, state, act } = useStore(),
        { values, change } = useForm(user || {}),
        [message, setMessage] = useState(null);
    if (!user) return <Navigate to="/login" replace />;
    return (
        <div className="container py-5">
            <h1>Mi perfil</h1>
            <div className="row g-4">
                <div className="col-lg-6">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            try {
                                act('profile', values);
                                setMessage({
                                    type: 'success',
                                    text: 'Perfil actualizado.',
                                });
                            } catch (error) {
                                setMessage({
                                    type: 'danger',
                                    text: error.message,
                                });
                            }
                        }}
                    >
                        <Field
                            name="nombre"
                            label="Nombre completo"
                            required
                            maxLength={150}
                            value={values.nombre}
                            onChange={change}
                        />
                        <p>Correo: {user.correo}</p>
                        <p>Rol: {user.rol}</p>
                        <AddressFields values={values} change={change} />
                        <Feedback
                            message={message?.text}
                            type={message?.type}
                        />
                        <Button type="submit">Guardar perfil</Button>
                    </form>
                </div>
                <div className="col-lg-6">
                    <h2 className="h4">Mis compras</h2>
                    {state.orders.filter((o) => o.usuarioId === user.id)
                        .length ? (
                        state.orders
                            .filter((o) => o.usuarioId === user.id)
                            .map((o) => (
                                <p key={o.id}>
                                    <Link to={'/pedidos/' + o.id}>
                                        Pedido #{o.id}
                                    </Link>{' '}
                                    · {o.estado}
                                </p>
                            ))
                    ) : (
                        <p>Aún no tienes compras.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
