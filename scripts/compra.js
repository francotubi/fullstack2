const Compra = {
    confirmar() {
        const carrito = JSON.parse(localStorage.getItem('carritoDelivery') || '[]');
        if (!carrito.length) throw new Error('Tu carrito está vacío.');
        const catalogo = Catalogo.listar(),
        cantidades = new Map();
        carrito.forEach(p => cantidades.set(p.id, (cantidades.get(p.id) || 0) + 1));
        const items = Array.from(cantidades, ([id, cantidad]) => {
            const p = catalogo.find(p => p.id === id);
            if (!p) throw new Error('Un producto ya no está disponible.');
            if (cantidad > p.stock) throw new Error('Stock insuficiente para ' + p.nombre + '. Ajusta el carrito.');
            return {
                id: p.id,
                nombre: p.nombre,
                precio: p.precio,
                cantidad
            };
        });
        const pedido = {
            id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
            fecha: new Date().toISOString(),
            usuarioId: Auth.actual()?.id || null,
            items,
            total: items.reduce((sum, p) => sum + p.precio * p.cantidad, 0),
            estado: 'Compra simulada'
        };
        // Pedido y carrito se guardan por separado; revertir el pedido si falla el vaciado.
        const anteriores = localStorage.getItem('pedidosDelivery'),
        pedidos = JSON.parse(anteriores || '[]');
        localStorage.setItem('pedidosDelivery', JSON.stringify([...pedidos, pedido]));
        try {
            localStorage.setItem('carritoDelivery', '[]');
        } catch (error) {
            if (anteriores === null) localStorage.removeItem('pedidosDelivery');
            else localStorage.setItem('pedidosDelivery', anteriores);
            throw error;
        }
        return pedido;
    }
};
