const comunasPorRegion = {
    'Región Metropolitana': ['Santiago', 'Providencia'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar']
};
const regionSelect = document.getElementById('region-admin'), comunaSelect = document.getElementById('comuna-admin');
function actualizarComunas() {
    comunaSelect.replaceChildren();
    (comunasPorRegion[regionSelect.value] || []).forEach(nombre => {
        const option = document.createElement('option');
        option.textContent = nombre;
        comunaSelect.append(option);
    });
}
regionSelect.addEventListener('change', actualizarComunas);
actualizarComunas();
document.getElementById('form-admin-usuario').addEventListener('submit', e => {
    e.preventDefault();
    const val = id => document.getElementById(id).value.trim(),
    estado = document.getElementById('estado-admin');
    estado.textContent = '';
    const correo = val('correo-admin').toLowerCase(),
    password = document.getElementById('password-admin').value,
    run = val('run').toUpperCase();
    const errors = {
        run: !Formularios.run(run) ? 'Ingresa un RUN válido, incluido su dígito verificador, sin puntos ni guion.' : '',
        'nombre-admin': !val('nombre-admin') || val('nombre-admin').length > 50 ? 'Ingresa un nombre de hasta 50 caracteres.' : '',
        'apellidos-admin': !val('apellidos-admin') || val('apellidos-admin').length > 100 ? 'Ingresa los apellidos (máximo 100 caracteres).' : '',
        'correo-admin': !Auth.correo(correo) || correo.length > 100 ? 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com (máximo 100 caracteres).' : '',
        'password-admin': password.length < 4 || password.length > 10 || !password.trim() ? 'Usa de 4 a 10 caracteres.' : '',
        'direccion-admin': !val('direccion-admin') || val('direccion-admin').length > 300 ? 'Ingresa una dirección de hasta 300 caracteres.' : '',
        nacimiento: val('nacimiento') && val('nacimiento') > new Date().toLocaleDateString('sv-SE') ? 'La fecha de nacimiento no puede ser futura.' : '',
        rol: !['Cliente', 'Admin', 'Vendedor'].includes(val('rol')) ? 'Selecciona un rol válido.' : '',
        'region-admin': '',
        'comuna-admin': ''
    };
    if (!comunasPorRegion[val('region-admin')]?.includes(val('comuna-admin'))) errors['comuna-admin'] = 'Selecciona una comuna de la región indicada.';
    try {
        const users = Auth.usuarios();
        if (users.some(u => u.correo === correo)) errors['correo-admin'] = 'Ya existe una cuenta con este correo.';
        if (users.some(u => u.run === run)) errors.run = 'Ya existe un usuario con este RUN.';
    } catch (error) {
        estado.textContent = 'No se pudo leer la lista de usuarios.';
        return;
    }
    if (!Formularios.mostrar(errors)) return;
    try {
        Auth.registrar({
            run,
            nombre: val('nombre-admin') + ' ' + val('apellidos-admin'),
            correo,
            password,
            rol: val('rol'),
            nacimiento: val('nacimiento'),
            region: val('region-admin'),
            comuna: val('comuna-admin'),
            direccion: val('direccion-admin')
        }, true);
        location.href = 'admin-usuarios.html';
    } catch (error) {
        estado.textContent = error.message;
    }
});
