# DeliveryApp · Evaluación 2

Frontend de una tienda de delivery desarrollado con React, React Router, Bootstrap y persistencia local. Continúa el proyecto de la evaluación 1. El backend se incorporará en una etapa posterior.

## Ejecutar

Requisitos: Node.js 22.12 o superior compatible con Vite (recomendado Node 24 LTS), npm y Google Chrome para las pruebas.

```powershell
npm install
npm run dev
```

Abrir la dirección que muestre Vite, normalmente `http://127.0.0.1:5173`. Para detenerlo, presionar Ctrl+C. Esta versión NO se ejecuta haciendo doble clic en index.html ni con Live Server.

## Administrador de demostración

- Correo: `admin@duoc.cl`
- Contraseña: `Admin123`

Los clientes crean su cuenta desde Crear cuenta. Se conservan los dominios de correo y la longitud de contraseña de la evaluación 1 para la demostración.

## Funcionalidades

- Inicio, catálogo con búsqueda, filtro por categoría y orden por precio.
- Categorías, ofertas con descuento, detalle de productos, blog, nosotros y contacto.
- Registro, inicio/cierre de sesión y perfil editable.
- Carrito con cantidades, checkout con datos del perfil, dirección y tipo de envío.
- Pago simulado aprobado o rechazado, resumen y comprobante académico.
- CRUD completo de productos, categorías y usuarios para el administrador.
- Stock crítico (5 unidades o menos), órdenes, historial por usuario, reportes y mensajes.
- La compra aprobada descuenta stock y vacía el carrito. La rechazada conserva ambos.
- Datos e imágenes iniciales incluidos; no se necesita una API externa para usar el catálogo.

## Pruebas y compilación

```powershell
npm test
npm run build
npm run preview
```

`npm test` utiliza Jasmine y Karma, ejecuta Chrome en modo headless y genera cobertura en `coverage/html/index.html`. No utiliza Jest ni Vitest. Si Chrome no se detecta, definir `CHROME_BIN` con la ruta a chrome.exe y repetir el comando. El lanzador de pruebas usa un perfil temporal aislado. `npm run test:watch` mantiene Karma abierto; si cambias archivos, reconstruye el paquete de tests volviendo a ejecutar el comando (el bundle no se recompila automáticamente).

`npm run build` crea `dist/`. `npm run preview` sirve esa compilación. Las rutas con `#` permiten usar hosting estático sin configurar redirecciones.

Ver `docs/TESTING.md` para la propuesta, resultados y limitaciones de las pruebas; `docs/ERS-V2.md` contiene los requisitos de esta versión.

## Estructura

```text
src/
  components/   Controles, tarjetas, listados y navegación reutilizables
  context/      Estado compartido y sincronización de la interfaz
  data/         Datos iniciales y operaciones de persistencia/CRUD
  pages/        Vistas públicas y administrativas
  utils/        Validaciones y formato de precios
public/         Fotografías y recurso visual de respaldo
tests/          Pruebas Jasmine de componentes y reglas de negocio
scripts/        Preparación del paquete de pruebas
```

El estado se guarda como un único documento `deliveryAppReactV2` en localStorage. Todas las escrituras se completan antes de actualizar la interfaz; las compras guardan pedido, carrito y stock en una sola escritura. Para probar desde cero, elimina únicamente esa clave desde las herramientas del navegador. No elimina datos de la evaluación 1: utiliza una clave nueva; no importa automáticamente sus cuentas, carritos ni pedidos.

## Continuar en el repositorio existente

Copia esta carpeta `DeliveryApp-React` DENTRO de tu repositorio original. Conserva su `.git` y los archivos de la evaluación 1. No ejecutes `git init` ni reemplaces `.git`.

Desde esa carpeta puedes ejecutar los comandos anteriores. En la raíz del repositorio puedes revisar y crear el commit:

```powershell
git status
git add DeliveryApp-React
git diff --cached --stat
git commit -m "Migrar DeliveryApp a React con CRUD, checkout y pruebas Jasmine Karma"
git push origin main
```

Comprueba lo que se va a incluir antes del commit. El `.gitignore` de esta carpeta excluye node_modules, dist, cobertura temporal y archivos de pruebas generados. El historial anterior seguirá intacto.

## Limitaciones

Es una simulación académica: los roles, cuentas y contraseñas son editables desde el navegador y no constituyen seguridad real. Usar datos ficticios. No hay cobros reales, correos enviados, servidor ni base de datos remota. Los datos pertenecen al navegador y al origen utilizado. La sincronización entre pestañas no reemplaza transacciones de un backend y no garantiza exclusión mutua entre compras concurrentes.

Los documentos ERS y testing describen el proyecto; completar los nombres del equipo y adaptar el formato de entrega que solicite el docente.

## Fuentes técnicas

- React: https://react.dev/learn/build-a-react-app-from-scratch
- Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
- Karma: https://karma-runner.github.io/6.4/config/configuration-file.html
- Jasmine: https://jasmine.github.io/

Las fotografías de comida proceden de Unsplash. Referencias originales en `docs/FOTOGRAFIAS.md`.
