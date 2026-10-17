document.addEventListener('DOMContentLoaded', () => {
    try {
        if (Auth.actual()?.rol !== 'Admin') return;
        const body = document.getElementById('lista-productos');
        Catalogo.listar().forEach(p => {
            const row = document.createElement('tr');
            [p.codigo, p.nombre, '$' + p.precio.toLocaleString('es-CL'), p.stock].forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                row.append(td);
            });
            const td = document.createElement('td'),
            link = document.createElement('a');
            link.className = 'btn btn-sm btn-outline-primary';
            link.textContent = 'Editar';
            link.href = 'admin-producto-form.html?id=' + p.id;
            td.append(link);
            row.append(td);
            body.append(row);
        });
    } catch (error) {
        document.getElementById('estado-productos').textContent = error.message;
    }
});
