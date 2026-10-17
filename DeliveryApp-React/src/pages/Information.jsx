import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { posts } from '../data/seed';
import { useStore } from '../context/Store';
import { useForm } from './Account';
import Field from '../components/Field';
import Feedback from '../components/Feedback';
import Button from '../components/Button';
import { validEmail } from '../utils/validation';
export function About() {
    return (
        <div className="container py-5 text-center narrow">
            <h1>Sobre nosotros</h1>
            <p className="lead mt-4">
                Somos DeliveryApp: conectamos tus antojos con sabores para todos
                los días.
            </p>
            <h2 className="h3 mt-5">Nuestra propuesta</h2>
            <p>
                Comida rápida, pizzas, sushi y opciones saludables en una sola
                tienda.
            </p>
            <Link className="btn btn-danger" to="/productos">
                Explorar el menú
            </Link>
        </div>
    );
}
export function Blog() {
    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">Noticias y curiosidades</h1>
            <div className="row g-4">
                {posts.map((post) => (
                    <article className="col-md-6" key={post.id}>
                        <div className="card h-100">
                            <img
                                src={post.imagen}
                                className="blog-image"
                                alt={post.titulo}
                            />
                            <div className="card-body">
                                <h2 className="h4">{post.titulo}</h2>
                                <p>{post.resumen}</p>
                                <Link
                                    className="btn btn-danger"
                                    to={'/blog/' + post.id}
                                >
                                    Leer más
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
export function BlogDetail() {
    const { id } = useParams();
    const post = posts.find((p) => String(p.id) === id);
    return (
        <article className="container py-5 narrow">
            <Link to="/blog">← Volver al blog</Link>
            {post ? (
                <>
                    <h1 className="mt-4">{post.titulo}</h1>
                    <img
                        className="img-fluid rounded my-4"
                        src={post.imagen}
                        alt={post.titulo}
                    />
                    <p className="lead">{post.contenido}</p>
                </>
            ) : (
                <h1>Artículo no encontrado</h1>
            )}
        </article>
    );
}
export function Contact() {
    const { act, user } = useStore(),
        { values, change, setValues } = useForm({
            nombre: user?.nombre || '',
            correo: user?.correo || '',
            comentario: '',
        }),
        [errors, setErrors] = useState({}),
        [notice, setNotice] = useState(null);
    return (
        <div className="container py-5">
            <section className="card card-body shadow-sm auth-card mx-auto">
                <h1>Contáctanos</h1>
                <form
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        const err = {};
                        if (!values.nombre.trim() || values.nombre.length > 100)
                            err.nombre =
                                'Ingresa un nombre de hasta 100 caracteres.';
                        if (
                            !validEmail(values.correo) ||
                            values.correo.length > 100
                        )
                            err.correo = 'Ingresa un correo permitido.';
                        if (
                            !values.comentario.trim() ||
                            values.comentario.length > 500
                        )
                            err.comentario =
                                'Escribe un mensaje de 1 a 500 caracteres.';
                        setErrors(err);
                        setNotice(null);
                        if (Object.keys(err).length) return;
                        try {
                            act('message', values);
                            setValues((v) => ({ ...v, comentario: '' }));
                            setNotice({
                                type: 'success',
                                text: 'Mensaje guardado localmente. No se envía por correo en esta demostración.',
                            });
                        } catch (error) {
                            setNotice({ type: 'danger', text: error.message });
                        }
                    }}
                >
                    <Field
                        name="nombre"
                        label="Nombre"
                        value={values.nombre}
                        onChange={change}
                        error={errors.nombre}
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
                        name="comentario"
                        label="Mensaje"
                        as="textarea"
                        rows="5"
                        value={values.comentario}
                        onChange={change}
                        error={errors.comentario}
                    />
                    <Feedback message={notice?.text} type={notice?.type} />
                    <Button type="submit">Guardar mensaje</Button>
                </form>
            </section>
        </div>
    );
}
