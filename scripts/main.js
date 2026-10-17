let carrito = JSON.parse(localStorage.getItem('carritoDelivery') || '[]');
function renderizarProductos() {
    const contenedor = document.getElementById('product-container');
    if (!contenedor) return;
    contenedor.replaceChildren();
    Catalogo.listar().forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-md-3';
        col.innerHTML = '<div class="card h-100 shadow-sm border-0"><img class="card-img-top" style="height:150px;object-fit:cover"><div class="card-body d-flex flex-column"><h5 class="card-title fw-bold"></h5><p class="text-muted small mb-2"></p><h6 class="text-success fw-bold mb-3"></h6><a class="mb-2">Ver detalle</a><button class="btn btn-danger mt-auto" type="button"></button></div></div>';
        const img = col.querySelector('img');
        img.src = p.imagen || 'https://placehold.co/500x300?text=Producto';
        img.alt = p.nombre;
        col.querySelector('h5').textContent = p.nombre;
        col.querySelector('p').textContent = p.categoria;
        col.querySelector('h6').textContent = '$' + p.precio.toLocaleString('es-CL');
        col.querySelector('a').href = 'detalle-producto.html?id=' + p.id;
        const btn = col.querySelector('button');
        btn.textContent = p.stock > 0 ? 'Añadir' : 'Sin stock';
        btn.disabled = p.stock <= 0;
        btn.addEventListener('click', () => agregarAlCarrito(p.id));
        contenedor.append(col);
    });
}
function agregarAlCarrito(id, cantidad = 1) {
    const prod = Catalogo.listar().find(p => p.id === id);
    carrito = JSON.parse(localStorage.getItem('carritoDelivery') || '[]');
    if (!prod || !Number.isInteger(cantidad) || cantidad < 1 || carrito.filter(p => p.id === id).length + cantidad > prod.stock) {
        alert('Cantidad no disponible en stock.');
        return;
    }
    for (let i = 0; i < cantidad; i++) carrito.push({
        ...prod
    });
    localStorage.setItem('carritoDelivery', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert('Producto añadido al carrito.');
}
function actualizarContadorCarrito() {
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = carrito.length);
}
document.addEventListener('DOMContentLoaded', () => {
    try {
        renderizarProductos();
        actualizarContadorCarrito();
    } catch (error) {
        const box = document.createElement('p');
        box.textContent = error.message;
        box.className = 'alert alert-danger';
        document.querySelector('main').prepend(box);
    }
});
