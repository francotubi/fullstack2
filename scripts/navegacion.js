// Menú compartido: permite navegar y consultar el carrito desde cualquier página pública.
const menuButton = document.querySelector('.navbar-toggler');
const menu = document.getElementById('navbarNav');
menuButton?.addEventListener('click', () => {
    const abierto = menu.classList.toggle('show');
    menuButton.setAttribute('aria-expanded', String(abierto));
    menuButton.setAttribute('aria-label', abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
});
function actualizarContadorNavegacion() {
    try {
        const carrito = JSON.parse(localStorage.getItem('carritoDelivery') || '[]');
        document.querySelectorAll('#cart-count').forEach(el => el.textContent = Array.isArray(carrito) ? carrito.length : 0);
    } catch (error) {
        document.querySelectorAll('#cart-count').forEach(el => el.textContent = '0');
    }
}
actualizarContadorNavegacion();
window.addEventListener('pageshow', actualizarContadorNavegacion);
window.addEventListener('storage', actualizarContadorNavegacion);
