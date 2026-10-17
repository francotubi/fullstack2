import { products, categories, admin } from './seed';
import {
    normalizeEmail,
    validEmail,
    validPassword,
    priceOf,
} from '../utils/validation';
export const DB_KEY = 'deliveryAppReactV2';
const copy = (data) => JSON.parse(JSON.stringify(data));
const empty = () => ({
    version: 2,
    products: copy(products),
    categories: copy(categories),
    users: [copy(admin)],
    orders: [],
    messages: [],
    cart: [],
    session: null,
});
export function validateProduct(p, state, id) {
    if (!p.nombre?.trim() || p.nombre.length > 100)
        throw new Error('Nombre requerido, máximo 100 caracteres.');
    if (!p.codigo?.trim() || p.codigo.length < 3 || p.codigo.length > 30)
        throw new Error('Código requerido: entre 3 y 30 caracteres.');
    if (
        state.products.some(
            (x) =>
                x.codigo.toLowerCase() === p.codigo.toLowerCase() &&
                x.id !== id,
        )
    )
        throw new Error('El código ya está registrado.');
    if (!Number.isSafeInteger(p.precio) || p.precio <= 0)
        throw new Error('El precio debe ser un entero mayor que cero.');
    if (!Number.isSafeInteger(p.stock) || p.stock < 0)
        throw new Error('El stock debe ser un entero igual o mayor que cero.');
    if (!Number.isFinite(p.descuento) || p.descuento < 0 || p.descuento > 90)
        throw new Error('El descuento debe estar entre 0 y 90 %.');
    if (!state.categories.some((c) => c.nombre === p.categoria))
        throw new Error('Selecciona una categoría existente.');
    if (p.descripcion.length > 500)
        throw new Error('Descripción: máximo 500 caracteres.');
    if (p.imagen) {
        let url;
        try {
            url = new URL(p.imagen, 'https://deliveryapp.local');
        } catch {
            throw new Error('La URL de imagen no es válida.');
        }
        if (!['http:', 'https:'].includes(url.protocol))
            throw new Error('La imagen debe usar http o https.');
    }
}
export function createDatabase(storage = window.localStorage) {
    const read = () => {
        const raw = storage.getItem(DB_KEY);
        if (raw === null) return empty();
        let state;
        try {
            state = JSON.parse(raw);
        } catch {
            throw new Error(
                'No se pudieron leer los datos guardados. No se han sobrescrito.',
            );
        }
        if (
            state.version !== 2 ||
            ![
                'products',
                'users',
                'orders',
                'messages',
                'cart',
                'categories',
            ].every((k) => Array.isArray(state[k]))
        )
            throw new Error('El formato de los datos guardados no es válido.');
        return state;
    };
    const save = (state) => storage.setItem(DB_KEY, JSON.stringify(state));
    const current = (s) => s.users.find((u) => u.id === s.session) || null;
    const adminOnly = (s) => {
        if (current(s)?.rol !== 'Admin')
            throw new Error('Necesitas una cuenta de administrador.');
    };
    const nextId = (list) =>
        Math.max(0, ...list.map((x) => Number(x.id) || 0)) + 1;
    const change = (fn) => {
        const state = read(),
            result = fn(state);
        save(state);
        return copy(result === undefined ? state : result);
    };
    return {
        snapshot: read,
        login(correo, password) {
            return change((s) => {
                const user = s.users.find(
                    (u) =>
                        u.correo === normalizeEmail(correo) &&
                        u.password === password,
                );
                if (!user) throw new Error('Correo o contraseña incorrectos.');
                s.session = user.id;
                return user;
            });
        },
        logout() {
            return change((s) => {
                s.session = null;
            });
        },
        register(v) {
            return change((s) => {
                if (
                    !v.nombre?.trim() ||
                    v.nombre.trim().length > 150 ||
                    !validEmail(v.correo) ||
                    v.correo.length > 100 ||
                    !validPassword(v.password)
                )
                    throw new Error('Revisa nombre, correo y contraseña.');
                const correo = normalizeEmail(v.correo);
                if (s.users.some((u) => u.correo === correo))
                    throw new Error('Ya existe una cuenta con ese correo.');
                const user = {
                    ...v,
                    correo,
                    id:
                        'u-' +
                        Date.now() +
                        '-' +
                        Math.random().toString(36).slice(2, 6),
                    rol: 'Cliente',
                };
                delete user.confirmacion;
                s.users.push(user);
                return user;
            });
        },
        list(collection) {
            if (!['products', 'categories'].includes(collection))
                adminOnly(read());
            return copy(read()[collection] || []);
        },
        create(collection, data) {
            return this.upsert(collection, data);
        },
        update(collection, id, data) {
            return this.upsert(collection, data, id);
        },
        upsert(collection, data, id = null) {
            return change((s) => {
                adminOnly(s);
                if (!['products', 'categories', 'users'].includes(collection))
                    throw new Error('Colección no editable.');
                const list = s[collection],
                    index = list.findIndex((x) => x.id === id);
                if (id !== null && index < 0)
                    throw new Error('El registro ya no existe.');
                const item = { ...data, id: id ?? nextId(list) };
                if (collection === 'products') {
                    validateProduct(item, s, id);
                    item.nombre = item.nombre.trim();
                    item.codigo = item.codigo.trim();
                }
                if (collection === 'categories') {
                    item.nombre = item.nombre?.trim();
                    if (!item.nombre || item.nombre.length > 60)
                        throw new Error(
                            'Nombre de categoría requerido: máximo 60 caracteres.',
                        );
                    if (
                        list.some(
                            (c) =>
                                c.id !== id &&
                                c.nombre.toLowerCase() ===
                                    item.nombre.toLowerCase(),
                        )
                    )
                        throw new Error('La categoría ya existe.');
                    if (index >= 0)
                        s.products.forEach((p) => {
                            if (p.categoria === list[index].nombre)
                                p.categoria = item.nombre;
                        });
                }
                if (collection === 'users') {
                    item.correo = normalizeEmail(item.correo);
                    if (
                        !item.nombre?.trim() ||
                        item.nombre.length > 150 ||
                        !validEmail(item.correo) ||
                        item.correo.length > 100 ||
                        !validPassword(item.password)
                    )
                        throw new Error('Revisa nombre, correo y contraseña.');
                    if (!['Admin', 'Cliente', 'Vendedor'].includes(item.rol))
                        throw new Error('Rol no válido.');
                    if (
                        list.some(
                            (u) => u.id !== id && u.correo === item.correo,
                        )
                    )
                        throw new Error('Ya existe una cuenta con ese correo.');
                    if (
                        list.some(
                            (u) =>
                                u.id !== id && item.run && u.run === item.run,
                        )
                    )
                        throw new Error('Ese RUN ya está registrado.');
                    if (id === s.session && item.rol !== 'Admin')
                        throw new Error(
                            'No puedes quitarte tu propio acceso de administrador.',
                        );
                }
                if (index < 0) list.push(item);
                else list[index] = item;
                return item;
            });
        },
        remove(collection, id) {
            return change((s) => {
                adminOnly(s);
                if (!['products', 'categories', 'users'].includes(collection))
                    throw new Error('Colección no editable.');
                if (!s[collection].some((x) => x.id === id))
                    throw new Error('El registro no existe.');
                if (collection === 'users' && id === s.session)
                    throw new Error('No puedes eliminar tu propia cuenta.');
                if (
                    collection === 'categories' &&
                    s.products.some(
                        (p) =>
                            p.categoria ===
                            s.categories.find((c) => c.id === id)?.nombre,
                    )
                )
                    throw new Error('La categoría tiene productos asociados.');
                s[collection] = s[collection].filter((x) => x.id !== id);
                if (collection === 'products')
                    s.cart = s.cart.filter((x) => x.id !== id);
            });
        },
        profile(data) {
            return change((s) => {
                const user = current(s);
                if (!user)
                    throw new Error('Inicia sesión para editar tu perfil.');
                if (!data.nombre?.trim() || data.nombre.length > 150)
                    throw new Error('Nombre requerido: máximo 150 caracteres.');
                Object.assign(user, {
                    nombre: data.nombre.trim(),
                    telefono: data.telefono || '',
                    direccion: data.direccion || '',
                    region: data.region || '',
                    comuna: data.comuna || '',
                });
                return user;
            });
        },
        cart(id, quantity) {
            return change((s) => {
                const p = s.products.find((p) => p.id === id);
                if (!p) throw new Error('Producto no disponible.');
                if (
                    !Number.isInteger(quantity) ||
                    quantity < 0 ||
                    quantity > p.stock
                )
                    throw new Error('La cantidad supera el stock disponible.');
                s.cart = s.cart.filter((x) => x.id !== id);
                if (quantity) s.cart.push({ id, quantity });
            });
        },
        message(data) {
            return change((s) => {
                if (
                    !data.nombre?.trim() ||
                    data.nombre.length > 100 ||
                    !validEmail(data.correo) ||
                    data.correo.length > 100 ||
                    !data.comentario?.trim() ||
                    data.comentario.length > 500
                )
                    throw new Error('Revisa los datos del mensaje.');
                s.messages.push({
                    ...data,
                    id: nextId(s.messages),
                    fecha: new Date().toISOString(),
                });
            });
        },
        checkout(data) {
            return change((s) => {
                if (!s.cart.length) throw new Error('El carrito está vacío.');
                if (
                    !data.nombre?.trim() ||
                    !validEmail(data.correo) ||
                    !data.direccion?.trim() ||
                    !data.telefono?.trim() ||
                    !['estandar', 'express'].includes(data.entrega) ||
                    !data.region ||
                    !data.comuna
                )
                    throw new Error(
                        'Completa tus datos y la dirección de entrega.',
                    );
                if (!['aprobado', 'rechazado'].includes(data.resultado))
                    throw new Error(
                        'Selecciona un resultado de pago simulado.',
                    );
                const items = s.cart.map((line) => {
                    const p = s.products.find((p) => p.id === line.id);
                    if (
                        !p ||
                        !Number.isInteger(line.quantity) ||
                        line.quantity <= 0 ||
                        line.quantity > p.stock
                    )
                        throw new Error('El stock cambió. Revisa el carrito.');
                    return {
                        id: p.id,
                        nombre: p.nombre,
                        precio: priceOf(p),
                        cantidad: line.quantity,
                    };
                });
                if (data.resultado === 'rechazado') return { ok: false };
                const envio = data.entrega === 'express' ? 2500 : 1500,
                    subtotal = items.reduce(
                        (n, p) => n + p.precio * p.cantidad,
                        0,
                    );
                const order = {
                    id: nextId(s.orders),
                    fecha: new Date().toISOString(),
                    usuarioId: current(s)?.id || null,
                    cliente: {
                        nombre: data.nombre,
                        correo: normalizeEmail(data.correo),
                        direccion: data.direccion,
                        telefono: data.telefono,
                        region: data.region,
                        comuna: data.comuna,
                    },
                    entrega: data.entrega,
                    items,
                    subtotal,
                    envio,
                    total: subtotal + envio,
                    estado: 'Pagado (simulado)',
                };
                items.forEach((line) => {
                    s.products.find((p) => p.id === line.id).stock -=
                        line.cantidad;
                });
                s.orders.push(order);
                s.cart = [];
                return { ok: true, order };
            });
        },
    };
}
