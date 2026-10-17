const Formularios = {
    mostrar(errors) {
        Object.entries(errors).forEach(([id, mensaje]) => {
            const input = document.getElementById(id);
            input.classList.toggle('is-invalid', !!mensaje);
            input.setAttribute('aria-invalid', String(!!mensaje));
            document.getElementById('error-' + id).textContent = mensaje;
        });
        const first = Object.keys(errors).find(id => errors[id]);
        if (first) document.getElementById(first).focus();
        return !first;
    },
    run(value) {
        if (!/^[0-9]{7,8}[0-9K]$/.test(value)) return false;
        let sum = 0,
        factor = 2;
        for (const digit of value.slice(0, - 1).split('').reverse()) {
            sum += Number(digit) * factor;
            factor = factor === 7 ? 2 : factor + 1;
        }
        const result = 11 - sum % 11;
        return value.slice( - 1) === (result === 11 ? '0' : result === 10 ? 'K' : String(result));
    }
};
