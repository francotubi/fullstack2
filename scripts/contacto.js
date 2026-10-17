document.getElementById('form-contacto').addEventListener('submit', function(e) {
    e.preventDefault();
    const val = id => document.getElementById(id).value.trim(),
    estado = document.getElementById('estado-contacto');
    estado.textContent = '';
    const nombre = val('nombre-cont'),
    correo = val('correo-cont').toLowerCase(),
    comentario = val('comentario');
    if (!Formularios.mostrar({
        'nombre-cont': !nombre || nombre.length > 100 ? 'Ingresa tu nombre (máximo 100 caracteres).' : '',
        'correo-cont': !Auth.correo(correo) || correo.length > 100 ? 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com (máximo 100 caracteres).' : '',
        comentario: !comentario || comentario.length > 500 ? 'Escribe un mensaje de 1 a 500 caracteres.' : ''
    })) return;
    try {
        const mensajes = JSON.parse(localStorage.getItem('mensajesDelivery') || '[]');
        mensajes.push({
            nombre,
            correo,
            comentario,
            fecha: new Date().toISOString()
        });
        localStorage.setItem('mensajesDelivery', JSON.stringify(mensajes));
        this.reset();
        estado.className = 'alert alert-success mt-3';
        estado.textContent = 'Mensaje guardado en este navegador como demostración. Gracias por contactarnos.';
    } catch (error) {
        estado.className = 'alert alert-danger mt-3';
        estado.textContent = 'No se pudo guardar el mensaje. Intenta nuevamente.';
    }
});
