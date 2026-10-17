const form = document.getElementById('form-producto'), estado = document.getElementById('estado-producto');
const query = new URLSearchParams(location.search), id = query.has('id') ? Number(query.get('id')) : null;
try {
    if (Auth.actual()?.rol !== 'Admin') throw new Error('Ingresa como administrador.');
    if (id !== null) {
        const product = Catalogo.listar().find(p => p.id === id);
        if (!product) throw new Error('Producto no encontrado. Vuelve a la lista.');
        document.querySelector('h1').textContent = 'Editar producto';
        ['codigo', 'nombre', 'descripcion', 'precio', 'stock', 'imagen', 'categoria'].forEach(key => {
            const input = document.getElementById(key);
            if (key === 'categoria' && !Array.from(input.options).some(o => o.value === product[key])) {
                const option = document.createElement('option');
                option.textContent = product[key];
                input.append(option);
            }
            input.value = product[key] ?? '';
        });
    }
    form.addEventListener('submit', e => {
        e.preventDefault();
        const val = key => document.getElementById(key).value.trim();
        try {
            Catalogo.guardar({
                codigo: val('codigo'),
                nombre: val('nombre'),
                descripcion: val('descripcion'),
                precio: Number(val('precio')),
                stock: Number(val('stock')),
                imagen: val('imagen'),
                categoria: val('categoria')
            }, id);
            location.href = 'admin-productos.html';
        } catch (error) {
            estado.textContent = error.message;
        }
    });
} catch (error) {
    estado.textContent = error.message;
    document.getElementById('guardar-producto').disabled = true;
}
