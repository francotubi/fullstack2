document.addEventListener('DOMContentLoaded', () => {
    try {
        const id = Number(new URLSearchParams(location.search).get('id') || 1),
        p = Catalogo.listar().find(p => p.id === id);
        const btn = document.getElementById('agregar-detalle');
        if (!p) {
            document.querySelector('main').textContent = 'Producto no encontrado.';
            return;
        }
        const main = document.querySelector('main');
        main.querySelector('h1').textContent = p.nombre;
        main.querySelector('h2').textContent = '$' + p.precio.toLocaleString('es-CL');
        main.querySelector('p').textContent = p.descripcion;
        const img = main.querySelector('img');
        img.src = p.imagen || 'https://placehold.co/500x300?text=Producto';
        img.alt = p.nombre;
        document.getElementById('cantidad-prod').max = p.stock;
        btn.disabled = p.stock <= 0;
        if (p.stock <= 0) btn.textContent = 'Sin stock';
        btn.addEventListener('click', () => agregarAlCarrito(p.id, Number(document.getElementById('cantidad-prod').value)));
    } catch (error) {
        document.querySelector('main').textContent = error.message;
    }
});
