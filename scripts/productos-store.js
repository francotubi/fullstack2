const Catalogo = {
    key: 'productosDelivery',
    iniciales: [{
        id: 1,
        nombre: "Hamburguesa Doble Queso",
        categoria: "Comida Rápida",
        precio: 6500,
        imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    }, {
        id: 2,
        nombre: "Pizza Pepperoni",
        categoria: "Pizzas",
        precio: 12000,
        imagen: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500"
    }, {
        id: 3,
        nombre: "Sushi Roll Avocado",
        categoria: "Sushi",
        precio: 5500,
        imagen: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500"
    }, {
        id: 4,
        nombre: "Ensalada César",
        categoria: "Saludable",
        precio: 4500,
        imagen: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500"
    }].map(p => ({
        ...p,
        codigo: String(p.id).padStart(3, '0'),
        stock: 50,
        descripcion: ''
    })),
    listar() {
        const raw = localStorage.getItem(this.key);
        if (raw === null) {
            localStorage.setItem(this.key, JSON.stringify(this.iniciales));
            return this.iniciales.map(p => ({
                ...p
            }));
        }
        const list = JSON.parse(raw);
        if (!Array.isArray(list)) throw new Error('No se pudo leer el catálogo.');
        return list;
    },
    guardar(datos, id = null) {
        if (Auth.actual()?.rol !== 'Admin') throw new Error('Solo el administrador puede guardar productos.');
        const list = this.listar();
        const nombre = datos.nombre.trim(),
        codigo = datos.codigo.trim();
        if (codigo.length < 3 || codigo.length > 30) throw new Error('El código debe tener entre 3 y 30 caracteres.');
        if (!nombre || nombre.length > 100) throw new Error('El nombre debe tener entre 1 y 100 caracteres.');
        if (datos.descripcion.length > 500) throw new Error('La descripción admite hasta 500 caracteres.');
        if (!Number.isSafeInteger(datos.precio) || datos.precio <= 0) throw new Error('Ingresa un precio entero mayor que cero.');
        if (!Number.isSafeInteger(datos.stock) || datos.stock < 0) throw new Error('El stock debe ser un entero igual o mayor que cero.');
        if (!datos.categoria.trim()) throw new Error('Selecciona una categoría.');
        if (datos.imagen && !/^https?:$/.test(new URL(datos.imagen).protocol)) throw new Error('La imagen debe usar una URL http o https.');
        if (list.some(p => p.codigo.toLowerCase() === codigo.toLowerCase() && p.id !== id)) throw new Error('Ese código ya pertenece a otro producto.');
        const index = list.findIndex(p => p.id === id);
        if (id !== null && index < 0) throw new Error('El producto ya no existe.');
        const product = {
            ...datos,
            nombre,
            codigo,
            id: id === null ? Math.max(0, ...list.map(p => p.id)) + 1 : id
        };
        if (index < 0) list.push(product);
        else list[index] = product;
        localStorage.setItem(this.key, JSON.stringify(list));
        return product;
    }
};
