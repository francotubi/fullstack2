# Especificación de requisitos de software · DeliveryApp V2

## Identificación

Asignatura: Desarrollo Fullstack II. Evaluación 2. Equipo e integrantes: completar por el estudiante. Esta versión migra la interfaz anterior a React. El backend queda fuera de esta entrega por el alcance acordado.

## Objetivo

Permitir que un cliente explore una tienda de delivery, gestione su cuenta y simule un pedido; permitir que un administrador mantenga el catálogo y consulte las operaciones registradas localmente.

## Actores

- Visitante: consulta catálogo, categorías, ofertas, información y blog; se registra, deja mensajes y compra como invitado.
- Cliente: inicia sesión, modifica su perfil, compra con datos precargados y consulta sus pedidos.
- Administrador: dispone de las funciones anteriores y acceso a mantenimiento, órdenes, stock crítico y reportes.
- Vendedor: rol conservado para compatibilidad conceptual con V1; en esta versión tiene acceso de tienda, sin permisos administrativos adicionales.

## Requisitos funcionales

| ID   | Requisito                                                                     | Implementación                                   |
| ---- | ----------------------------------------------------------------------------- | ------------------------------------------------ |
| RF01 | Navegar por las vistas sin recargar el documento                              | React Router y Layout común                      |
| RF02 | Consultar y filtrar productos por texto y categoría                           | Catalog, ProductList y ProductCard               |
| RF03 | Consultar detalle y disponibilidad                                            | ProductDetail                                    |
| RF04 | Mostrar ofertas y precio con descuento                                        | Catalog offers y priceOf                         |
| RF05 | Registrar clientes, validar datos y evitar correos duplicados                 | Register y database.register                     |
| RF06 | Iniciar/cerrar sesión y distinguir roles                                      | Login, Store y AdminLayout                       |
| RF07 | Actualizar el perfil y consultar compras propias                              | Profile y Order                                  |
| RF08 | Agregar, modificar cantidades y quitar productos del carrito                  | Cart y database.cart                             |
| RF09 | Completar dirección, región, comuna y opción de entrega                       | Checkout y AddressFields                         |
| RF10 | Precargar datos disponibles del usuario conectado                             | Checkout                                         |
| RF11 | Simular aprobación o rechazo y presentar el resultado                         | Checkout y Order                                 |
| RF12 | Registrar una compra aprobada, descontar stock y vaciar el carrito            | database.checkout, una escritura de persistencia |
| RF13 | Conservar carrito y stock al rechazar el pago                                 | database.checkout                                |
| RF14 | CRUD completo de productos, categorías y usuarios                             | CrudList, CrudForm y database                    |
| RF15 | Evitar eliminar categorías con productos y la propia cuenta del administrador | Validaciones de database.remove                  |
| RF16 | Consultar stock de 5 unidades o menos                                         | CrudList critical                                |
| RF17 | Consultar órdenes y comprobantes académicos                                   | Orders y OrderSummary                            |
| RF18 | Consultar historial por usuario                                               | Orders history                                   |
| RF19 | Reportar ingresos, unidades y productos más vendidos                          | Reports                                          |
| RF20 | Validar y guardar mensajes de contacto localmente                             | Contact                                          |

## Datos y reglas

Productos: id, código único, nombre, descripción, categoría, precio base entero positivo, stock entero no negativo, descuento de 0 a 90 % e imagen. Categorías: id y nombre único. Usuarios: id, nombre, correo único, contraseña de demostración, rol y datos de entrega; RUN opcional en administración con dígito verificador válido.

Pedidos: id, fecha, usuario si está conectado, datos de cliente, líneas con precio del momento, subtotal, envío y total. El envío estándar cuesta $1.500 y el express $2.500. Los descuentos se redondean a pesos enteros. Los pedidos conservan los precios de compra aunque después cambie el catálogo.

Los nuevos registros públicos reciben siempre rol Cliente. El administrador activo no puede eliminarse ni quitarse su rol. Los correos admitidos son duoc.cl, profesor.duoc.cl y gmail.com; contraseña de 4 a 10 caracteres, conforme a las reglas heredadas del proyecto.

## Requisitos no funcionales

- React con componentes por responsabilidad, props y estado local/compartido.
- Bootstrap con adaptación a móvil, tablet y escritorio.
- Etiquetas asociadas a controles y mensajes contextuales con roles accesibles.
- Persistencia local independiente de V1, sin sobrescribir sus claves.
- Jasmine y Karma para pruebas unitarias; informe de cobertura reproducible.
- Código formateado, dependencias fijadas por package-lock.json y documentación de ejecución.

## Arquitectura y herramientas

React + React Router para las vistas, Context para el estado común, un módulo JavaScript como base simulada y localStorage para persistir. Vite prepara JSX y genera la compilación estática. Bootstrap se instala como dependencia. Jasmine, Karma, Testing Library e Istanbul cubren pruebas y métricas.

## Criterios de aceptación

Completar registro/login, añadir un producto, cambiar cantidad, realizar pago rechazado y luego aprobado, comprobar carrito/stock/pedido. Como administrador, crear/editar/eliminar registros, revisar restricciones, consultar órdenes e historial y revisar reportes. Ejecutar `npm test` y `npm run build`. Contrastar cada vista con la pauta del docente; los wireframes son guía visual, no una reproducción exacta.

## Fuera de alcance

Backend, autenticación real, pagos, envío de mensajes por correo, facturación tributaria, catálogo logístico de todas las comunas de Chile y sincronización transaccional multiusuario. Las dos regiones y sus comunas son un conjunto de demostración.
