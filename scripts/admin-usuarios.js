document.addEventListener('DOMContentLoaded', () => {
    try {
        if (Auth.actual()?.rol !== 'Admin') return;
        const body = document.getElementById('lista-usuarios');
        Auth.usuarios().forEach(u => {
            const row = document.createElement('tr');
            [u.run || '—', u.nombre, u.correo, u.rol].forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.append(cell);
            });
            body.append(row);
        });
    } catch (error) {
        document.querySelector('main').append(document.createTextNode(error.message));
    }
});
