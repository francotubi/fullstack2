import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/Store';
import { money, priceOf } from '../utils/validation';
import Field from '../components/Field';
import Button from '../components/Button';
import Feedback from '../components/Feedback';
export default function ProductDetail() {
    const { id } = useParams(),
        { state, act } = useStore(),
        [quantity, setQuantity] = useState(1),
        [notice, setNotice] = useState(null);
    const p = state.products.find((x) => String(x.id) === id);
    if (!p)
        return (
            <div className="container py-5">
                <h1>Producto no encontrado</h1>
                <Link to="/productos">Volver al catálogo</Link>
            </div>
        );
    return (
        <div className="container py-5">
            <Link to="/productos">← Volver al catálogo</Link>
            <div className="row g-4 mt-2">
                <div className="col-md-6">
                    <img
                        className="img-fluid rounded detail-image"
                        src={
                            p.imagen ||
                            import.meta.env.BASE_URL + 'placeholder.svg'
                        }
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                                import.meta.env.BASE_URL + 'placeholder.svg';
                        }}
                        alt={p.nombre}
                    />
                </div>
                <div className="col-md-6">
                    <p>{p.categoria}</p>
                    <h1>{p.nombre}</h1>
                    <p className="h3 text-success">{money(priceOf(p))}</p>
                    <p>
                        {p.descripcion ||
                            'Preparado con ingredientes seleccionados.'}
                    </p>
                    <p>Stock disponible: {p.stock}</p>
                    <Field
                        name="cantidad"
                        label="Cantidad"
                        type="number"
                        min="1"
                        max={p.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <Feedback message={notice?.text} type={notice?.type} />
                    <Button
                        disabled={!p.stock}
                        onClick={() => {
                            try {
                                act(
                                    'cart',
                                    p.id,
                                    (state.cart.find((x) => x.id === p.id)
                                        ?.quantity || 0) + quantity,
                                );
                                setNotice({
                                    text: 'Producto añadido al carrito.',
                                    type: 'success',
                                });
                            } catch (e) {
                                setNotice({ text: e.message, type: 'danger' });
                            }
                        }}
                    >
                        Añadir al carrito
                    </Button>
                </div>
            </div>
        </div>
    );
}
