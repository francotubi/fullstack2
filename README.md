# DeliveryApp · Evaluación 2

Frontend de una tienda de comida a domicilio desarrollado con React,
React Router y Bootstrap. Los datos se guardan en localStorage.

El proyecto continúa el trabajo de la evaluación 1. El backend se
incorporará en una etapa posterior.

## Requisitos

- Node.js 24 LTS recomendado.
- npm, incluido con Node.js.
- Git para clonar el repositorio.
- Google Chrome para ejecutar las pruebas.

## Instalación y ejecución

Clonar el repositorio:

```powershell
git clone https://github.com/francotubi/fullstack2.git
cd fullstack2
```

Instalar las dependencias:

```powershell
npm.cmd install
```

Iniciar la aplicación:

```powershell
npm.cmd run dev
```

Abrir en el navegador la dirección que muestre Vite, normalmente:

```text
http://127.0.0.1:5173/
```

Mantener la terminal abierta mientras se utiliza la aplicación.
Para detener el servidor, presionar Ctrl + C.

Esta versión se ejecuta desde la raíz del repositorio. No se utiliza
Live Server ni se abre index.html mediante doble clic.

En Linux o macOS, utilizar npm en lugar de npm.cmd.

## Administrador de demostración

- Correo: admin@duoc.cl
- Contraseña: Admin123

Los clientes pueden registrarse desde Crear cuenta.

Se admiten correos de los siguientes dominios:

- @duoc.cl
- @profesor.duoc.cl
- @gmail.com

Las contraseñas deben tener entre 4 y 10 caracteres.
Estas restricciones se mantienen del proyecto anterior para la demostración.

## Funcionalidades de la tienda

- Catálogo con búsqueda por nombre.
- Filtro por categoría y ordenamiento por precio.
- Vistas de categorías y ofertas.
- Detalle de productos y disponibilidad.
- Registro, inicio y cierre de sesión.
- Perfil editable e historial de compras del usuario.
- Carrito con modificación de cantidades.
- Checkout con datos de contacto y dirección de entrega.
- Precarga de los datos disponibles del usuario conectado.
- Selección de entrega estándar o express.
- Simulación de pago aprobado o rechazado.
- Resumen y comprobante del pedido.
- Secciones Nosotros, Blog y Contacto.

Una compra aprobada registra el pedido, descuenta el stock y vacía
el carrito. Una compra rechazada conserva el carrito y el stock.

## Administración

- Crear, consultar, editar y eliminar productos.
- Crear, consultar, editar y eliminar categorías.
- Crear, consultar, editar y eliminar usuarios.
- Consultar productos con stock crítico: 5 unidades o menos.
- Consultar órdenes y sus comprobantes.
- Consultar el historial de compras por usuario.
- Revisar reportes de ventas y mensajes de contacto.

Las categorías con productos asociados no se pueden eliminar.
El administrador conectado no puede eliminar su propia cuenta
ni quitarse su rol de administrador.

## Pruebas

Ejecutar:

```powershell
npm.cmd test
```

Las pruebas utilizan:

- Jasmine para las especificaciones y aserciones.
- Karma para ejecutar las pruebas en Chrome Headless.
- Testing Library para comprobar componentes y simular eventos.
- Istanbul y karma-coverage para medir la cobertura.

La suite contiene 55 pruebas de lógica y componentes.

Después de ejecutar las pruebas, el informe de cobertura se genera en:

```text
coverage/html/index.html
```

El resumen de cobertura se guarda en:

```text
coverage/coverage-summary.json
```

Si Chrome no se detecta automáticamente, configurar la variable
CHROME_BIN con la ruta de chrome.exe y repetir el comando.

Para mantener Karma abierto:

```powershell
npm.cmd run test:watch
```

El paquete de pruebas se genera al iniciar el comando. Después de
modificar el código, detenerlo y volver a ejecutarlo para reconstruirlo.

La propuesta, los resultados y las limitaciones de las pruebas
se describen en docs/TESTING.md.

## Compilación de producción

Generar la versión de producción:

```powershell
npm.cmd run build
```

Los archivos compilados se guardan en dist/.

Para revisar esa compilación:

```powershell
npm.cmd run preview
```

Abrir la dirección que muestre la terminal.

La navegación utiliza rutas con # para facilitar el uso de hosting
estático sin configurar redirecciones de rutas.

## Estructura del proyecto

```text
src/
├── components/     Elementos reutilizables y navegación
├── context/        Estado compartido de la aplicación
├── data/           Datos iniciales, persistencia y operaciones CRUD
├── pages/          Pantallas públicas y administrativas
├── utils/          Validaciones y formato de precios
├── App.jsx         Rutas de la aplicación
├── main.jsx        Inicio de React e importación de estilos
└── styles.css      Estilos personalizados

public/             Fotografías y recurso visual de respaldo
tests/              Pruebas Jasmine
scripts/            Preparación del paquete de pruebas
docs/               Requisitos, testing y evidencias
```

Para modificar la aplicación, trabajar en src/.
Los archivos de dist/ se generan automáticamente al compilar.

## Persistencia

La información se guarda en localStorage bajo la clave:

```text
deliveryAppReactV2
```

Incluye usuarios, productos, categorías, sesión, carrito, pedidos
y mensajes de contacto.

Las compras actualizan el pedido, el carrito y el stock mediante
una única escritura del estado local.

Los datos pertenecen al navegador y al origen utilizado.
Para conservarlos, usar la misma dirección y navegador.

Para reiniciar la demostración, eliminar únicamente la clave
deliveryAppReactV2 desde las herramientas del navegador.

Esta versión utiliza una clave diferente de la evaluación 1.
No importa automáticamente sus cuentas, carritos ni pedidos.

Las fotografías iniciales están incluidas en public/images.
Las imágenes externas agregadas por el administrador requieren
conexión a internet.

## Historial y versiones

La raíz del repositorio contiene la versión actual en React,
correspondiente a la evaluación 2.

La versión final de la evaluación 1 está disponible en la etiqueta:

```text
ev1-final
```

En GitHub se puede seleccionar esa etiqueta y descargar su ZIP.

El historial conserva los commits y los autores anteriores.

## Documentación

- docs/ERS-V2.md: requisitos y alcance de la versión.
- docs/TESTING.md: propuesta, resultados y análisis de pruebas.
- docs/evidencia/: resultados guardados de las pruebas.
- docs/FOTOGRAFIAS.md: referencias de las fotografías utilizadas.

Completar los datos de los integrantes y ajustar el formato
de los documentos según las instrucciones del docente.

## Archivos generados

El archivo .gitignore excluye del repositorio:

- node_modules/
- dist/
- .test-build/
- coverage/
- Archivos de registro y variables de entorno.

Las dependencias se recuperan con npm.cmd install.
Los archivos de compilación y cobertura se regeneran mediante
sus comandos correspondientes.

## Limitaciones

Esta aplicación es una demostración académica.

- No incluye backend ni base de datos remota.
- No realiza cobros reales.
- Los comprobantes no son boletas tributarias.
- Los mensajes de contacto se guardan localmente y no se envían por correo.
- Las cuentas, contraseñas y roles se almacenan en el navegador
  y pueden modificarse desde sus herramientas.
- Se deben utilizar únicamente datos ficticios.
- Las regiones y comunas disponibles son un conjunto de demostración.
- No existe control transaccional para compras simultáneas
  realizadas desde distintas pestañas o equipos.

La autenticación real, la persistencia remota y la coordinación
entre usuarios se implementarán al conectar los microservicios.

## Referencias técnicas

- React: https://react.dev/
- React Router: https://reactrouter.com/
- Bootstrap: https://getbootstrap.com/
- Vite: https://vite.dev/
- Jasmine: https://jasmine.github.io/
- Karma: https://karma-runner.github.io/