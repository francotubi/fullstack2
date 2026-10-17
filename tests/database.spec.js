import { createDatabase, DB_KEY } from '../src/data/database';
import { validRun } from '../src/utils/validation';
function memory() {
    const map = new Map();
    return {
        getItem: (key) => map.get(key) ?? null,
        setItem: (key, value) => map.set(key, value),
    };
}
describe('Persistencia y reglas de negocio', () => {
    let storage, db;
    beforeEach(() => {
        storage = memory();
        db = createDatabase(storage);
    });
    const login = () => db.login('admin@duoc.cl', 'Admin123');
    const product = () => ({
        ...db.snapshot().products[0],
        codigo: '009',
        nombre: 'Producto de prueba',
    });
    const shipping = {
        nombre: 'Cliente',
        correo: 'cliente@gmail.com',
        telefono: '+56912345678',
        direccion: 'Calle 123',
        region: 'Región Metropolitana',
        comuna: 'Santiago',
        entrega: 'estandar',
        resultado: 'aprobado',
    };
    it('carga los cuatro productos iniciales', () =>
        expect(db.snapshot().products.length).toBe(4));
    it('normaliza el correo y crea siempre un cliente', () => {
        const u = db.register({
            nombre: 'Ana',
            correo: ' ANA@GMAIL.COM ',
            password: 'abcd',
            rol: 'Admin',
        });
        expect(u.correo).toBe('ana@gmail.com');
        expect(u.rol).toBe('Cliente');
    });
    it('impide correos duplicados', () => {
        db.register({
            nombre: 'Ana',
            correo: 'ana@gmail.com',
            password: 'abcd',
        });
        expect(() =>
            db.register({
                nombre: 'Ana',
                correo: 'ANA@gmail.com',
                password: 'abcd',
            }),
        ).toThrowError(/existe/);
    });
    it('rechaza datos de registro inválidos', () =>
        expect(() =>
            db.register({ nombre: '', correo: 'a@otro.cl', password: 'a' }),
        ).toThrow());
    it('rechaza credenciales incorrectas', () =>
        expect(() => db.login('admin@duoc.cl', 'mala')).toThrowError(
            /incorrectos/,
        ));
    it('guarda y cierra la sesión', () => {
        login();
        expect(db.snapshot().session).toBe('admin-demo');
        db.logout();
        expect(db.snapshot().session).toBeNull();
    });
    it('bloquea el CRUD sin administrador', () =>
        expect(() => db.create('products', product())).toThrowError(
            /administrador/,
        ));
    it('crea, lee, edita y elimina un producto', () => {
        login();
        const p = db.create('products', product());
        expect(db.list('products').find((x) => x.id === p.id).nombre).toBe(
            'Producto de prueba',
        );
        db.update('products', p.id, { ...p, precio: 9990 });
        expect(db.list('products').find((x) => x.id === p.id).precio).toBe(
            9990,
        );
        db.remove('products', p.id);
        expect(db.list('products').some((x) => x.id === p.id)).toBeFalse();
    });
    it('rechaza precio negativo y stock fraccionario', () => {
        login();
        expect(() =>
            db.create('products', { ...product(), precio: -1 }),
        ).toThrow();
        expect(() =>
            db.create('products', { ...product(), stock: 1.5 }),
        ).toThrow();
    });
    it('rechaza códigos duplicados', () => {
        login();
        expect(() =>
            db.create('products', { ...product(), codigo: '001' }),
        ).toThrowError(/código/);
    });
    it('crea categorías y propaga su cambio de nombre', () => {
        login();
        db.update('categories', 1, { nombre: 'Hamburguesas' });
        expect(db.snapshot().products[0].categoria).toBe('Hamburguesas');
        const c = db.create('categories', { nombre: 'Postres' });
        db.remove('categories', c.id);
        expect(db.snapshot().categories.length).toBe(4);
    });
    it('impide eliminar categorías usadas', () => {
        login();
        expect(() => db.remove('categories', 1)).toThrowError(/asociados/);
    });
    it('completa el CRUD de usuarios', () => {
        login();
        const u = db.create('users', {
            nombre: 'Luis',
            correo: 'luis@gmail.com',
            password: 'abcd',
            rol: 'Cliente',
        });
        db.update('users', u.id, { ...u, nombre: 'Luis Pérez' });
        expect(db.list('users').find((x) => x.id === u.id).nombre).toBe(
            'Luis Pérez',
        );
        db.remove('users', u.id);
        expect(db.list('users').length).toBe(1);
    });
    it('protege la cuenta del administrador activo', () => {
        login();
        expect(() => db.remove('users', 'admin-demo')).toThrow();
        expect(() =>
            db.update('users', 'admin-demo', {
                ...db.snapshot().users[0],
                rol: 'Cliente',
            }),
        ).toThrow();
    });
    it('actualiza el perfil sin cambiar el rol', () => {
        login();
        db.profile({
            nombre: 'Nuevo nombre',
            direccion: 'Calle 1',
            rol: 'Cliente',
        });
        expect(db.snapshot().users[0].nombre).toBe('Nuevo nombre');
        expect(db.snapshot().users[0].rol).toBe('Admin');
    });
    it('actualiza y elimina líneas del carrito', () => {
        db.cart(1, 2);
        expect(db.snapshot().cart[0].quantity).toBe(2);
        db.cart(1, 0);
        expect(db.snapshot().cart.length).toBe(0);
    });
    it('rechaza cantidades inválidas o superiores al stock', () => {
        expect(() => db.cart(1, 51)).toThrow();
        expect(() => db.cart(1, 1.5)).toThrow();
        expect(() => db.cart(99, 1)).toThrow();
    });
    it('aplica descuentos al total y descuenta stock al comprar', () => {
        db.cart(2, 2);
        const result = db.checkout(shipping);
        expect(result.order.subtotal).toBe(20400);
        expect(result.order.total).toBe(21900);
        expect(db.snapshot().products[1].stock).toBe(13);
        expect(db.snapshot().cart.length).toBe(0);
    });
    it('conserva carrito y stock cuando el pago es rechazado', () => {
        db.cart(1, 2);
        expect(
            db.checkout({ ...shipping, resultado: 'rechazado' }).ok,
        ).toBeFalse();
        expect(db.snapshot().cart.length).toBe(1);
        expect(db.snapshot().orders.length).toBe(0);
        expect(db.snapshot().products[0].stock).toBe(50);
    });
    it('rechaza un checkout vacío o sin dirección', () => {
        expect(() => db.checkout(shipping)).toThrowError(/vacío/);
        db.cart(1, 1);
        expect(() => db.checkout({ ...shipping, direccion: '' })).toThrow();
    });
    it('detecta cambios de stock antes del checkout', () => {
        db.cart(1, 2);
        login();
        const p = db.snapshot().products[0];
        db.update('products', 1, { ...p, stock: 1 });
        expect(() => db.checkout(shipping)).toThrowError(/stock/);
    });
    it('persiste las compras al crear una nueva instancia', () => {
        db.cart(1, 1);
        db.checkout(shipping);
        expect(createDatabase(storage).snapshot().orders.length).toBe(1);
    });
    it('no guarda una compra parcial cuando falla el almacenamiento', () => {
        db.cart(1, 1);
        const before = storage.getItem(DB_KEY);
        storage.setItem = () => {
            throw Error('Sin espacio');
        };
        expect(() => db.checkout(shipping)).toThrow();
        expect(storage.getItem(DB_KEY)).toBe(before);
    });
    it('guarda y valida mensajes de contacto', () => {
        db.message({
            nombre: 'Ana',
            correo: 'ana@gmail.com',
            comentario: 'Consulta',
        });
        expect(db.snapshot().messages.length).toBe(1);
        expect(() =>
            db.message({ nombre: ' ', correo: 'x', comentario: '' }),
        ).toThrow();
    });
    it('no sobrescribe datos corruptos', () => {
        storage.setItem(DB_KEY, '{roto');
        expect(() => db.snapshot()).toThrow();
        expect(storage.getItem(DB_KEY)).toBe('{roto');
    });
    it('valida el dígito verificador del RUN', () => {
        expect(validRun('123456785')).toBeTrue();
        expect(validRun('123456789')).toBeFalse();
    });
});
