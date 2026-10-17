import { Link } from 'react-router-dom';
import { money, priceOf } from '../utils/validation';
import Button from './Button';
export default function ProductCard({ product, onAdd }) {
    return (
        <article className="card h-100 shadow-sm product-card">
            <img
                src={product.imagen || '/placeholder.svg'}
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                        import.meta.env.BASE_URL + 'placeholder.svg';
                }}
                className="card-img-top"
                alt={product.nombre}
            />
            <div className="card-body d-flex flex-column">
                <p className="text-muted small">{product.categoria}</p>
                <h2 className="h5">{product.nombre}</h2>
                {product.descuento > 0 && (
                    <span className="badge text-bg-success align-self-start mb-2">
                        -{product.descuento}%
                    </span>
                )}
                <p className="text-success fw-bold">
                    {money(priceOf(product))}{' '}
                    {product.descuento > 0 && (
                        <del className="small text-muted ms-2">
                            {money(product.precio)}
                        </del>
                    )}
                </p>
                <Link className="mb-3" to={'/productos/' + product.id}>
                    Ver detalle
                </Link>
                <Button
                    className="btn-danger mt-auto"
                    disabled={!product.stock}
                    onClick={() => onAdd(product)}
                >
                    {product.stock ? 'Añadir' : 'Sin stock'}
                </Button>
            </div>
        </article>
    );
}
