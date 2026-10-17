import {
    CrudList,
    CrudForm,
    Dashboard,
    Reports,
    Orders,
} from '../src/pages/Admin';
import { Categories } from '../src/pages/Catalog';
import ProductDetail from '../src/pages/ProductDetail';
import { About, Blog } from '../src/pages/Information';
import React, { useState } from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StoreProvider } from '../src/context/Store';
import Button from '../src/components/Button';
import Feedback from '../src/components/Feedback';
import Field from '../src/components/Field';
import ProductList from '../src/components/ProductList';
import { products } from '../src/data/seed';
import Catalog from '../src/pages/Catalog';
import { Login, Register } from '../src/pages/Account';
import { Contact } from '../src/pages/Information';
import { Cart, Checkout } from '../src/pages/Cart';
import App from '../src/App';
import { createDatabase } from '../src/data/database';
function wrap(component) {
    return render(
        <StoreProvider>
            <MemoryRouter>{component}</MemoryRouter>
        </StoreProvider>,
    );
}
afterEach(() => {
    cleanup();
    localStorage.clear();
    window.location.hash = '';
});
beforeEach(() => localStorage.clear());
describe('Componentes React: renderizado, props, estado y eventos', () => {
    it('renderiza todos los productos recibidos por props', () => {
        render(
            <MemoryRouter>
                <ProductList products={products} onAdd={() => {}} />
            </MemoryRouter>,
        );
        expect(screen.getAllByRole('heading', { level: 2 }).length).toBe(4);
    });
    it('muestra un mensaje cuando la lista está vacía', () => {
        render(<ProductList products={[]} onAdd={() => {}} />);
        expect(screen.getByRole('status').textContent).toContain(
            'No se encontraron',
        );
    });
    it('muestra un error solo cuando existe', () => {
        const view = render(<Feedback message="" />);
        expect(screen.queryByRole('alert')).toBeNull();
        view.rerender(<Feedback message="Error de prueba" />);
        expect(screen.getByRole('alert').textContent).toBe('Error de prueba');
    });
    it('el botón recibe su etiqueta y ejecuta onClick', () => {
        const fn = jasmine.createSpy('click');
        render(<Button onClick={fn}>Guardar producto</Button>);
        fireEvent.click(
            screen.getByRole('button', { name: 'Guardar producto' }),
        );
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it('un botón deshabilitado no ejecuta el evento', () => {
        const fn = jasmine.createSpy('click');
        render(
            <Button disabled onClick={fn}>
                Sin stock
            </Button>,
        );
        fireEvent.click(screen.getByRole('button'));
        expect(fn).not.toHaveBeenCalled();
    });
    it('actualiza el estado de un campo controlado', () => {
        function Form() {
            const [v, setV] = useState('');
            return (
                <Field
                    name="prueba"
                    label="Nombre de prueba"
                    value={v}
                    onChange={(e) => setV(e.target.value)}
                />
            );
        }
        render(<Form />);
        fireEvent.change(screen.getByLabelText('Nombre de prueba'), {
            target: { value: 'Ana' },
        });
        expect(screen.getByLabelText('Nombre de prueba').value).toBe('Ana');
    });
    it('filtra el catálogo al escribir una búsqueda', () => {
        wrap(<Catalog />);
        fireEvent.change(screen.getByLabelText('Buscar productos'), {
            target: { value: 'Sushi' },
        });
        expect(
            screen.getByRole('heading', { name: 'Sushi Roll Avocado' }),
        ).toBeTruthy();
        expect(
            screen.queryByRole('heading', { name: 'Pizza Pepperoni' }),
        ).toBeNull();
    });
    it('añadir un producto guarda una línea de carrito', () => {
        wrap(<Catalog />);
        fireEvent.click(screen.getAllByRole('button', { name: 'Añadir' })[0]);
        expect(createDatabase().snapshot().cart[0].quantity).toBe(1);
        expect(screen.getByRole('status').textContent).toContain('añadido');
    });
    it('el registro muestra errores de campos vacíos', () => {
        wrap(<Register />);
        fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
        expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
        expect(
            screen
                .getByLabelText('Nombre completo')
                .getAttribute('aria-invalid'),
        ).toBe('true');
    });
    it('el login rechaza una contraseña incorrecta', () => {
        wrap(<Login />);
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'admin@duoc.cl' },
        });
        fireEvent.change(screen.getByLabelText('Contraseña'), {
            target: { value: 'mala' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
        expect(screen.getByRole('alert').textContent).toContain('incorrectos');
    });
    it('contacto valida y guarda un mensaje', () => {
        wrap(<Contact />);
        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'Ana' },
        });
        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'ana@gmail.com' },
        });
        fireEvent.change(screen.getByLabelText('Mensaje'), {
            target: { value: 'Consulta de prueba' },
        });
        fireEvent.click(
            screen.getByRole('button', { name: 'Guardar mensaje' }),
        );
        expect(screen.getByRole('status').textContent).toContain('guardado');
        expect(createDatabase().snapshot().messages.length).toBe(1);
    });
    it('muestra carrito vacío sin botón de checkout', () => {
        wrap(<Cart />);
        expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy();
        expect(
            screen.queryByRole('link', { name: 'Continuar al checkout' }),
        ).toBeNull();
    });
    it('el carrito cambia cantidades mediante eventos', () => {
        createDatabase().cart(1, 1);
        wrap(<Cart />);
        fireEvent.change(
            screen.getByLabelText('Cantidad de Hamburguesa Doble Queso'),
            { target: { value: '2' } },
        );
        expect(createDatabase().snapshot().cart[0].quantity).toBe(2);
    });
    it('checkout autocompleta los datos del perfil', () => {
        const db = createDatabase();
        db.login('admin@duoc.cl', 'Admin123');
        db.profile({
            nombre: 'Admin prueba',
            telefono: '912345678',
            direccion: 'Calle 123',
            region: 'Región Metropolitana',
            comuna: 'Santiago',
        });
        db.cart(1, 1);
        wrap(<Checkout />);
        expect(screen.getByLabelText('Nombre completo').value).toBe(
            'Admin prueba',
        );
        expect(screen.getByLabelText('Dirección de entrega').value).toBe(
            'Calle 123',
        );
    });
    it('oculta Crear cuenta cuando existe sesión', () => {
        createDatabase().login('admin@duoc.cl', 'Admin123');
        render(<App />);
        expect(screen.queryByRole('link', { name: 'Crear cuenta' })).toBeNull();
        expect(
            screen.getByRole('button', { name: 'Cerrar sesión' }),
        ).toBeTruthy();
    });
    it('un cliente no puede entrar al panel administrativo', () => {
        const db = createDatabase();
        db.register({
            nombre: 'Cliente',
            correo: 'cliente@gmail.com',
            password: 'abcd',
        });
        db.login('cliente@gmail.com', 'abcd');
        window.location.hash = '#/admin';
        render(<App />);
        expect(
            screen.getByRole('heading', { name: 'Acceso restringido' }),
        ).toBeTruthy();
    });
});

describe('Vistas administrativas y navegación', () => {
    function login() {
        createDatabase().login('admin@duoc.cl', 'Admin123');
    }
    it('muestra el resumen del administrador', () => {
        login();
        wrap(<Dashboard />);
        expect(
            screen.getByRole('heading', { name: 'Panel de administración' }),
        ).toBeTruthy();
    });
    it('busca registros por nombre en administración', () => {
        login();
        wrap(<CrudList collection="products" />);
        fireEvent.change(screen.getByLabelText('Buscar por nombre'), {
            target: { value: 'Ensalada' },
        });
        expect(
            screen.getByRole('cell', { name: 'Ensalada César' }),
        ).toBeTruthy();
        expect(
            screen.queryByRole('cell', { name: 'Pizza Pepperoni' }),
        ).toBeNull();
    });
    it('cancela y confirma la eliminación de una categoría sin productos', () => {
        login();
        createDatabase().create('categories', { nombre: 'Postres' });
        wrap(<CrudList collection="categories" />);
        const row = screen.getByRole('cell', { name: 'Postres' }).closest('tr');
        fireEvent.click(row.querySelector('button'));
        fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
        expect(createDatabase().snapshot().categories.length).toBe(5);
        fireEvent.click(row.querySelector('button'));
        fireEvent.click(
            screen.getByRole('button', { name: 'Confirmar eliminación' }),
        );
        expect(createDatabase().snapshot().categories.length).toBe(4);
    });
    it('filtra el listado crítico por stock menor o igual a cinco', () => {
        login();
        wrap(<CrudList collection="products" critical />);
        expect(
            screen.getByRole('cell', { name: 'Ensalada César' }),
        ).toBeTruthy();
        expect(
            screen.queryByRole('cell', { name: 'Pizza Pepperoni' }),
        ).toBeNull();
    });
    it('valida un producto antes de guardarlo', () => {
        login();
        wrap(<CrudForm collection="products" />);
        fireEvent.click(
            screen.getByRole('button', { name: 'Guardar', exact: true }),
        );
        expect(screen.getAllByRole('alert').length).toBeGreaterThan(1);
        expect(createDatabase().snapshot().products.length).toBe(4);
    });
    it('crea una categoría desde el formulario React', () => {
        login();
        wrap(<CrudForm collection="categories" />);
        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'Postres' },
        });
        fireEvent.click(
            screen.getByRole('button', { name: 'Guardar', exact: true }),
        );
        expect(
            createDatabase()
                .snapshot()
                .categories.some((c) => c.nombre === 'Postres'),
        ).toBeTrue();
    });
    it('muestra órdenes vacías sin inventar compras', () => {
        login();
        wrap(<Orders />);
        expect(screen.getByText('No hay compras registradas.')).toBeTruthy();
    });
    it('muestra reportes a partir de una compra real simulada', () => {
        login();
        const db = createDatabase();
        db.cart(1, 1);
        db.checkout({
            nombre: 'Ana',
            correo: 'ana@gmail.com',
            telefono: '912345678',
            direccion: 'Calle 123',
            region: 'Región Metropolitana',
            comuna: 'Santiago',
            entrega: 'express',
            resultado: 'aprobado',
        });
        wrap(<Reports />);
        expect(
            screen.getByRole('cell', { name: 'Hamburguesa Doble Queso' }),
        ).toBeTruthy();
    });
    it('muestra las cuatro categorías disponibles', () => {
        wrap(<Categories />);
        expect(screen.getAllByRole('heading', { level: 2 }).length).toBe(4);
    });
    it('muestra solo productos con descuento en ofertas', () => {
        wrap(<Catalog offers />);
        expect(screen.getAllByRole('heading', { level: 2 }).length).toBe(2);
        expect(
            screen.queryByRole('heading', { name: 'Ensalada César' }),
        ).toBeNull();
    });
    it('el detalle controla un producto inexistente', () => {
        wrap(<ProductDetail />);
        expect(
            screen.getByRole('heading', { name: 'Producto no encontrado' }),
        ).toBeTruthy();
    });
    it('renderiza la información de la tienda y el blog', () => {
        const view = wrap(<About />);
        expect(
            screen.getByRole('heading', { name: 'Sobre nosotros' }),
        ).toBeTruthy();
        view.unmount();
        wrap(<Blog />);
        expect(screen.getAllByRole('link', { name: 'Leer más' }).length).toBe(
            2,
        );
    });
});

describe('Flujo integrado de checkout', () => {
    it('muestra compra exitosa al vaciar el carrito tras confirmar', () => {
        const db = createDatabase();
        db.login('admin@duoc.cl', 'Admin123');
        db.profile({
            nombre: 'Administrador',
            telefono: '912345678',
            direccion: 'Calle 123',
            region: 'Región Metropolitana',
            comuna: 'Santiago',
        });
        db.cart(1, 1);
        window.location.hash = '#/checkout';
        render(<App />);
        fireEvent.click(
            screen.getByRole('button', { name: 'Confirmar compra simulada' }),
        );
        expect(
            screen.getByRole('heading', { name: '¡Compra exitosa!' }),
        ).toBeTruthy();
        expect(createDatabase().snapshot().cart.length).toBe(0);
    });
});
