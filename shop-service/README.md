# shop-service

Microservicio independiente para el catálogo, las compras y el historial de la tienda. Usa Java 25, Spring Boot 4.2.0 y el puerto `8083`.

## Capas

- `model`: entidades `Producto`, `Compra` y `CompraItem`.
- `dto`: datos de entrada y salida de la API.
- `repository`: interfaces para guardar y buscar productos y compras.
- `service`: reglas de negocio, cálculo de totales y actualización de existencias.
- `controller`: rutas HTTP para productos y compras.

## Configuración

En ejecución requiere MySQL. Antes de iniciar, configura las variables de entorno:

- `DB_URL`: por defecto `jdbc:mysql://localhost:3306/shop_db?createDatabaseIfNotExist=true&serverTimezone=UTC`.
- `DB_USERNAME` y `DB_PASSWORD`: credenciales de MySQL.
- `SHOP_ADMIN_USERNAME` y `SHOP_ADMIN_PASSWORD`: credenciales del administrador.
- `SERVER_PORT`: opcional, por defecto `8083`.
- `CORS_ALLOWED_ORIGINS`: opcional, por defecto `http://localhost:3000,http://localhost:5173`.

Ejemplo en PowerShell:

```powershell
$env:DB_USERNAME = "shop_user"
$env:DB_PASSWORD = "<clave-de-mysql>"
$env:SHOP_ADMIN_USERNAME = "admin"
$env:SHOP_ADMIN_PASSWORD = "<una-clave-segura>"
.\mvnw.cmd -f shop-service\pom.xml spring-boot:run
```

Las pruebas usan H2 en memoria:

```powershell
.\mvnw.cmd -f shop-service\pom.xml clean test
```

## Endpoints

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/productos` | Público |
| GET | `/api/productos/{id}` | Público |
| POST | `/api/productos` | Administrador |
| PUT | `/api/productos/{id}` | Administrador |
| DELETE | `/api/productos/{id}` | Administrador |
| POST | `/api/compras` | Cliente |
| GET | `/api/compras/usuario/{id}` | Administrador |

`POST /api/compras` recibe `usuarioId` y una lista de `productoId`/`cantidad`. El servicio busca los precios del catálogo, calcula el total y descuenta existencias dentro de una transacción. Los detalles guardan el nombre y precio de cada producto al momento de la compra.

Ejemplo:

```json
{
  "usuarioId": 42,
  "items": [
    { "productoId": 3, "cantidad": 2 }
  ]
}
```

No se definió un proveedor de identidad de usuarios: por ahora la compra recibe el `usuarioId` enviado por el cliente. Antes de producción debe integrarse autenticación para comprobar que la persona solo compre con su propia cuenta. Usa HTTPS al exponer el servicio fuera de un entorno local.
