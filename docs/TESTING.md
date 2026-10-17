# Propuesta y análisis del testing · DeliveryApp V2

## Objetivo y herramientas

Verificar la lógica de persistencia y el comportamiento observable de los componentes React. Se utiliza Jasmine para especificaciones y aserciones, Karma como ejecutor, Chrome Headless como navegador y Testing Library para simular eventos y consultar elementos por su rol/etiqueta. Esbuild transforma JSX; Istanbul instrumenta solamente src/ y karma-coverage genera las métricas. No se sustituyeron Jasmine y Karma por otro ejecutor.

## Ejecución reproducible

```powershell
npm install
npm test
```

Se necesita Google Chrome. Si no se encuentra, configurar CHROME_BIN con su ruta. El navegador de pruebas se inicia con perfil temporal y se cierra al finalizar. La cobertura HTML se genera en coverage/html/index.html y el resumen JSON en coverage/coverage-summary.json. El informe se vuelve a calcular en cada ejecución.

## Resultado observado

Ejecución: 17 de octubre de 2026. Navegador: Chrome Headless 155, Windows. Resultado: **55 pruebas aprobadas, 0 fallidas**. La compilación de producción con `npm run build` finalizó correctamente.

| Métrica instrumentada | Cobertura | Cubierto / total |
| --------------------- | --------- | ---------------- |
| Sentencias            | 79.43 %   | 475 / 598        |
| Ramas                 | 70.45 %   | 384 / 545        |
| Funciones             | 82.96 %   | 151 / 182        |
| Líneas                | 79.26 %   | 390 / 492        |

Los porcentajes son cobertura de código instrumentado en src/, no porcentaje de requisitos aprobados. Se excluyen dependencias, archivos de pruebas, configuración y CSS. Las métricas de líneas pueden reflejar la transformación JSX realizada para ejecutar el navegador. El resumen bruto y la salida de pruebas se adjuntan en docs/evidencia/.

## Matriz de pruebas

| Grupo                                 | Casos | Qué comprueba                                                                                                                                                                                                                     |
| ------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Persistencia y negocio                | 26    | Semillas, registro, normalización, duplicados, login/logout, permisos, CRUD de tres entidades, restricciones, perfil, carrito, descuentos, pagos, stock, persistencia, fallos de escritura, mensajes, datos corruptos y RUN       |
| Componentes básicos y vistas públicas | 16    | Lista completa/vacía, errores condicionales, props y clic del botón, botón deshabilitado, estado del formulario, búsqueda, añadir al carrito, validación de registro/login/contacto, cantidades, precarga y visibilidad según rol |
| Administración y navegación           | 12    | Resumen, búsqueda, cancelar/confirmar eliminación, stock crítico, validaciones de producto, alta de categoría, órdenes vacías, reportes, categorías, ofertas, producto inexistente y contenido informativo                        |
| Regresión del checkout                | 1     | Al guardar una compra y vaciar el carrito se muestra la vista exitosa, sin redirigir erróneamente al carrito vacío                                                                                                                |

## Casos representativos del alcance solicitado

- Renderizado: ProductList muestra todos los productos recibidos por props.
- Renderizado condicional: Feedback no crea una alerta cuando no hay mensaje.
- Props: Button utiliza su etiqueta y ejecuta la función onClick recibida.
- Estado: un campo controlado conserva el texto introducido y el catálogo cambia con la búsqueda.
- Eventos: añadir productos y modificar cantidades actualiza la persistencia y la interfaz.
- Integración React: checkout precarga el perfil y completa la navegación posterior a una compra.

Cada prueba comienza con almacenamiento aislado. Los tests de negocio utilizan un almacenamiento en memoria, sin alterar las cuentas del usuario. Los tests de componentes se ejecutan en el origen de Karma, separado del servidor Vite.

## Comprobación adicional en navegador

Se verificaron recorridos completos en Chrome: registro y login de cliente, ocultamiento de Crear cuenta, checkout precargado, pago rechazado y reintento aprobado, carrito vacío tras aprobar, edición de precio como administrador, alta y eliminación de una categoría y consulta de órdenes/reportes/perfil. Se revisó la navegación móvil a 390 px y escritorio a 1440 px, sin desbordamiento horizontal en el catálogo ni errores de JavaScript durante esos recorridos.

## Análisis y límites

Los tests cubren la funcionalidad central y condiciones negativas relevantes. La revisión del flujo completo detectó una redirección al carrito vacío antes de mostrar la compra exitosa: se corrigió el orden de actualización/navegación y se incorporó la prueba de regresión correspondiente.

La cobertura no llega al 100 %. Quedan combinaciones de validación, ramas secundarias de vistas administrativas y errores de entorno sin recorrer. No se declara que todos los posibles comportamientos estén cubiertos. CSS y fidelidad visual de todos los tamaños no se miden con pruebas unitarias. La comprobación visual fue en Chrome; no se realizó una matriz completa de Safari/Firefox ni una auditoría integral de accesibilidad.

No se prueban un backend, pasarela bancaria ni envío real de correo porque no forman parte de esta versión. Las compras simultáneas desde pestañas diferentes requieren control transaccional futuro en backend.

## Mantenimiento

Al modificar requisitos, actualizar los casos afectados, ejecutar `npm test`, revisar fallos y recalcular el informe. El comando `npm run test:watch` mantiene Karma abierto, pero el bundle requiere volver a generarse al cambiar el código. Utilizar el comando completo de pruebas después de cada cambio relevante.
