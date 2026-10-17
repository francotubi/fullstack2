const estado = document.getElementById('estado-login');
if (new URLSearchParams(location.search).get('registro') === 'ok') estado.textContent = 'Cuenta creada. Ya puedes iniciar sesión.';
document.getElementById('form-login').addEventListener('submit', e => {
    e.preventDefault();
    const correo = document.getElementById('correo').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const errors = {
        correo: !Auth.correo(correo) || correo.length > 100 ? 'Ingresa un correo permitido (máximo 100 caracteres).' : '',
        password: password.length < 4 || password.length > 10 ? 'Ingresa una contraseña de 4 a 10 caracteres.' : ''
    };
    Object.entries(errors).forEach(([id, msg]) => {
        const box = document.getElementById('error-' + id);
        box.textContent = msg;
        box.style.display = msg ? 'block' : 'none';
        box.setAttribute('role', 'alert');
        document.getElementById(id).setAttribute('aria-invalid', String(!!msg));
    });
    estado.textContent = '';
    if (Object.values(errors).some(Boolean)) return;
    try {
        const user = Auth.iniciar(correo, password);
        location.href = user.rol === 'Admin' ? 'admin-home.html' : 'index.html';
    } catch (error) {
        estado.textContent = error.message;
        estado.className = 'alert alert-danger mt-3';
    }
});
