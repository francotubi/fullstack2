function renderizarCarrito() {
    const contenedor = document.getElementById('carrito-container'),
    totalElem = document.getElementById('total-precio'),
    btn = document.getElementById('pagar-ahora');
    const carrito = JSON.parse(localStorage.getItem('carritoDelivery') || '[]'),
    catalogo = Catalogo.listar();
    let total = 0;
    contenedor.replaceChildren();
    if (!carrito.length) {
        const p = document.createElement('p');
        p.textContent = 'Tu carrito está vacío.';
        p.className = 'text-center text-muted';
        contenedor.append(p);
    }
    carrito.forEach((guardado, index) => {
        const p = catalogo.find(p => p.id === guardado.id) || guardado;
        total += p.precio;
        const row = document.createElement('div');
        row.className = 'd-flex justify-content-between align-items-center border-bottom py-2';
        const nombre = document.createElement('span'),
        precio = document.createElement('span'),
        remove = document.createElement('button');
        nombre.textContent = p.nombre;
        precio.textContent = '$' + p.precio.toLocaleString('es-CL');
        remove.textContent = 'Quitar';
        remove.type = 'button';
        remove.className = 'btn btn-sm btn-outline-danger';
        remove.setAttribute('aria-label', 'Quitar ' + p.nombre);
        remove.addEventListener('click', () => {
            try {
                const items = JSON.parse(localStorage.getItem('carritoDelivery') || '[]');
                items.splice(index, 1);
                localStorage.setItem('carritoDelivery', JSON.stringify(items));
                document.getElementById('estado-compra').textContent = '';
                renderizarCarrito();
            } catch (error) {
                mostrarErrorCompra(error);
            }
        });
        row.append(nombre, precio, remove);
        contenedor.append(row);
    });
    totalElem.textContent = total.toLocaleString('es-CL');
    btn.disabled = !carrito.length;
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = carrito.length);
}
function mostrarErrorCompra(error) {
    const estado = document.getElementById('estado-compra');
    estado.className = 'alert alert-danger mt-3';
    estado.textContent = error.message;
}
document.addEventListener('DOMContentLoaded', () => {
    try {
        renderizarCarrito();
    } catch (error) {
        mostrarErrorCompra(error);
        document.getElementById('pagar-ahora').disabled = true;
    }
    document.getElementById('pagar-ahora').addEventListener('click', () => {
        try {
            const pedido = Compra.confirmar();
            renderizarCarrito();
            const estado = document.getElementById('estado-compra');
            estado.className = 'alert alert-success mt-3';
            estado.textContent = '¡Compra simulada confirmada! Pedido ' + pedido.id + '. Total: $' + pedido.total.toLocaleString('es-CL') + '. No se realizó ningún cobro.';
        } catch (error) {
            mostrarErrorCompra(error);
        }
    });
});
