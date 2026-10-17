document.getElementById('form-registro').addEventListener('submit', e => {
    e.preventDefault();
    const get = id => document.getElementById(id);
    const correo = get('correo-reg').value.trim().toLowerCase();
    const password = get('pass-reg').value;
    const errors = {
        nombre: !get('nombre').value.trim() || get('nombre').value.trim().length > 150 ? 'Ingresa tu nombre (máximo 150 caracteres).' : '',
        'correo-reg': correo.length > 100 || !Auth.correo(correo) ? 'Ingresa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com (máximo 100 caracteres).' : '',
        'pass-reg': password.length < 4 || password.length > 10 || !password.trim() ? 'Usa entre 4 y 10 caracteres.' : '',
        'pass-conf': password !== get('pass-conf').value ? 'Las contraseñas no coinciden.' : '',
        telefono: get('telefono').value.length > 20 ? 'Usa máximo 20 caracteres.' : ''
    };
    Object.entries(errors).forEach(([id, error]) => {
        get(id).classList.toggle('is-invalid', !!error);
        get(id).setAttribute('aria-invalid', String(!!error));
        get('error-' + id).textContent = error;
    });
    get('estado-registro').textContent = '';
    const invalid = Object.keys(errors).find(id => errors[id]);
    if (invalid) {
        get(invalid).focus();
        return;
    }
    try {
        Auth.registrar({
            nombre: get('nombre').value.trim(),
            correo,
            password,
            telefono: get('telefono').value.trim(),
            region: get('region').value,
            comuna: get('comuna').value
        });
        location.href = 'login.html?registro=ok';
    } catch (error) {
        get('estado-registro').textContent = error.message;
        get('estado-registro').className = 'alert alert-danger';
    }
});
