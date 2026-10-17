// Simulación académica: los datos solo existen en este navegador.
const Auth = {
    key: 'usuariosDelivery',
    session: 'sesionDelivery',
    usuarios() {
        const data = JSON.parse(localStorage.getItem(this.key) || '[]');
        if (!Array.isArray(data)) throw new Error('Datos de usuarios inválidos.');
        return data;
    },
    guardar(users) {
        localStorage.setItem(this.key, JSON.stringify(users));
    },
    correo(value) {
        return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(value);
    },
    actual() {
        const session = JSON.parse(localStorage.getItem(this.session) || 'null');
        return session && this.usuarios().find(u => u.id === session.id);
    },
    registrar(user, desdeAdmin = false) {
        const users = this.usuarios();
        if (users.some(u => u.correo === user.correo)) throw new Error('Ya existe una cuenta con ese correo.');
        if (desdeAdmin && this.actual()?.rol !== 'Admin') throw new Error('Debes ingresar como administrador.');
        const created = {
            ...user,
            id: Date.now().toString(36) + Math.random().toString(36).slice(2),
            rol: desdeAdmin ? user.rol : 'Cliente'
        };
        this.guardar([...users, created]);
        return created;
    },
    iniciar(correo, password) {
        const user = this.usuarios().find(u => u.correo === correo && u.password === password);
        if (!user) throw new Error('Correo o contraseña incorrectos.');
        localStorage.setItem(this.session, JSON.stringify({
            id: user.id
        }));
        return user;
    }
};
try {
    if (localStorage.getItem(Auth.key) === null) Auth.guardar([{
        id: 'admin-demo',
        nombre: 'Administrador',
        correo: 'admin@duoc.cl',
        password: 'Admin123',
        rol: 'Admin'
    }]);
    const user = Auth.actual();
    if (location.pathname.split('/').pop().startsWith('admin-') && user?.rol !== 'Admin') location.replace('login.html');
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('a[href="registro.html"]').forEach(link => {
            link.hidden = !!user;
        });
        document.querySelectorAll('a[href="login.html"]').forEach(link => {
            if (!user || location.pathname.endsWith('registro.html')) return;
            link.textContent = 'Cerrar sesión';
            link.href = '#';
            link.addEventListener('click', e => {
                e.preventDefault();
                localStorage.removeItem(Auth.session);
                location.href = 'index.html';
            });
        });
        if (user?.rol === 'Admin' && !location.pathname.split('/').pop().startsWith('admin-')) {
            const nav = document.querySelector('.navbar .container');
            if (nav) {
                const link = document.createElement('a');
                link.href = 'admin-home.html';
                link.textContent = 'Panel administrador';
                link.className = 'btn btn-light';
                nav.append(link);
            }
        }
    });
} catch (error) {
    document.addEventListener('DOMContentLoaded', () => {
        const box = document.createElement('p');
        box.className = 'alert alert-danger';
        box.setAttribute('role', 'alert');
        box.textContent = 'No se pudo acceder a los datos locales. Revisa el almacenamiento del navegador.';
        document.querySelector('main')?.prepend(box);
        if (location.pathname.split('/').pop().startsWith('admin-')) location.replace('login.html');
    });
}
