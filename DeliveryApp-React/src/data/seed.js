export const categories = ['Comida Rápida', 'Pizzas', 'Sushi', 'Saludable'].map(
    (nombre, i) => ({ id: i + 1, nombre }),
);
export const products = [
    {
        id: 1,
        codigo: '001',
        nombre: 'Hamburguesa Doble Queso',
        categoria: 'Comida Rápida',
        precio: 6500,
        stock: 50,
        descuento: 0,
        descripcion:
            'Doble carne de res, queso cheddar, lechuga y nuestra salsa especial.',
        imagen: import.meta.env.BASE_URL + 'images/hamburguesa.jpg',
    },
    {
        id: 2,
        codigo: '002',
        nombre: 'Pizza Pepperoni',
        categoria: 'Pizzas',
        precio: 12000,
        stock: 15,
        descuento: 15,
        descripcion: 'Masa crujiente, salsa de tomate, mozzarella y pepperoni.',
        imagen: import.meta.env.BASE_URL + 'images/pizza.jpg',
    },
    {
        id: 3,
        codigo: '003',
        nombre: 'Sushi Roll Avocado',
        categoria: 'Sushi',
        precio: 5500,
        stock: 8,
        descuento: 10,
        descripcion: 'Roll de arroz, palta y verduras frescas.',
        imagen: import.meta.env.BASE_URL + 'images/sushi.jpg',
    },
    {
        id: 4,
        codigo: '004',
        nombre: 'Ensalada César',
        categoria: 'Saludable',
        precio: 4500,
        stock: 4,
        descuento: 0,
        descripcion: 'Lechuga fresca, crutones y aderezo César.',
        imagen: import.meta.env.BASE_URL + 'images/ensalada.jpg',
    },
];
export const admin = {
    id: 'admin-demo',
    nombre: 'Administrador',
    correo: 'admin@duoc.cl',
    password: 'Admin123',
    rol: 'Admin',
    direccion: '',
    telefono: '',
    region: 'Región Metropolitana',
    comuna: 'Santiago',
};
export const posts = [
    {
        id: 1,
        titulo: 'El origen de la pizza Margarita',
        resumen:
            'Descubre la historia de uno de los clásicos de la cocina italiana.',
        contenido:
            'La pizza Margarita combina tomate, mozzarella y albahaca. Su historia está vinculada a Nápoles y forma parte de la tradición gastronómica italiana.',
        imagen: products[1].imagen,
    },
    {
        id: 2,
        titulo: 'El sushi a través del tiempo',
        resumen: 'El sushi no siempre fue como lo conocemos hoy.',
        contenido:
            'El sushi evolucionó a partir de formas de conservar pescado con arroz. Con el paso del tiempo surgieron distintas preparaciones, incluidos los rolls que hoy encontramos en muchos restaurantes.',
        imagen: import.meta.env.BASE_URL + 'images/blog-sushi.jpg',
    },
];
