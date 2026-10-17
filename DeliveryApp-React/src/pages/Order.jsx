import { Link, useLocation, useParams } from 'react-router-dom';
import { useStore } from '../context/Store';
import { money } from '../utils/validation';
export function OrderSummary({ order }) {
    return (
        <section className="card card-body shadow-sm">
            <h2 className="h4">Pedido #{order.id}</h2>
            <p>
                {new Date(order.fecha).toLocaleString('es-CL')} · {order.estado}
            </p>
            <p>
                <strong>Cliente:</strong> {order.cliente?.nombre || 'Cliente'}
            </p>
            <p>
                <strong>Entrega:</strong> {order.cliente?.direccion},{' '}
                {order.cliente?.comuna} · {order.entrega}
            </p>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nombre}</td>
                                <td>{p.cantidad}</td>
                                <td>{money(p.precio * p.cantidad)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p>Productos: {money(order.subtotal)}</p>
            <p>Envío: {money(order.envio)}</p>
            <p className="h4">Total: {money(order.total)}</p>
            <p className="small text-muted">
                Comprobante académico. No es una boleta tributaria.
            </p>
        </section>
    );
}
export default function Order({ success = false, failure = false }) {
    const location = useLocation(),
        { id } = useParams(),
        { state, user } = useStore();
    const order = success
        ? location.state?.order
        : state.orders.find((o) => String(o.id) === id);
    if (failure)
        return (
            <div className="container py-5">
                <h1>No se pudo completar el pago</h1>
                <p>
                    El pago simulado fue rechazado. Tu carrito y el stock se
                    conservaron.
                </p>
                <Link className="btn btn-danger" to="/checkout">
                    Volver a intentar
                </Link>
            </div>
        );
    const allowed = success
        ? !!order
        : user && (user.rol === 'Admin' || order?.usuarioId === user.id);
    return (
        <div className="container py-5">
            <h1>{success ? '¡Compra exitosa!' : 'Detalle del pedido'}</h1>
            {order && allowed ? (
                <OrderSummary order={order} />
            ) : (
                <p role="alert">No hay un pedido disponible para mostrar.</p>
            )}
            <Link className="btn btn-danger mt-4" to="/productos">
                Volver al catálogo
            </Link>
        </div>
    );
}
