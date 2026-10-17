export const normalizeEmail = (value) =>
    String(value || '')
        .trim()
        .toLowerCase();
export const validEmail = (value) =>
    /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(
        normalizeEmail(value),
    );
export const validPassword = (value) =>
    typeof value === 'string' &&
    !!value.trim() &&
    value.length >= 4 &&
    value.length <= 10;
export function validRun(value) {
    const run = String(value || '').toUpperCase();
    if (!/^[0-9]{7,8}[0-9K]$/.test(run)) return false;
    let sum = 0,
        factor = 2;
    for (const digit of run.slice(0, -1).split('').reverse()) {
        sum += Number(digit) * factor;
        factor = factor === 7 ? 2 : factor + 1;
    }
    const rest = 11 - (sum % 11);
    return (
        run.slice(-1) === (rest === 11 ? '0' : rest === 10 ? 'K' : String(rest))
    );
}
export const regions = {
    'Región Metropolitana': ['Santiago', 'Providencia', 'Ñuñoa', 'Maipú'],
    Valparaíso: ['Valparaíso', 'Viña del Mar', 'Quilpué'],
};
export function userErrors(v, { register = false } = {}) {
    const errors = {};
    if (!v.nombre?.trim() || v.nombre.trim().length > 150)
        errors.nombre = 'Ingresa un nombre de hasta 150 caracteres.';
    if (!validEmail(v.correo) || v.correo.length > 100)
        errors.correo =
            'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    if (register && !validPassword(v.password))
        errors.password = 'Usa una contraseña de 4 a 10 caracteres.';
    if (register && v.password !== v.confirmacion)
        errors.confirmacion = 'Las contraseñas no coinciden.';
    return errors;
}
export const money = (value) =>
    new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(value);
export const priceOf = (p) =>
    Math.round(p.precio * (1 - (p.descuento || 0) / 100));
