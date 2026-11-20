# shop-service

Servicio independiente para el catálogo de productos y el historial de compras. Usa Java 25, Spring Boot 4.2.0 y escucha en el puerto `8083`.

## Ejecutar

Requiere MySQL accesible. Configura estas variables de entorno antes de iniciar:

- `DB_URL`: por defecto `jdbc:mysql://localhost:3306/shop_db?createDatabaseIfNotExist=true&serverTimezone=UTC`
- `DB_USERNAME` y `DB_PASSWORD`: credenciales MySQL; no se usan credenciales predeterminadas.
- `SERVER_PORT`: `8083`
- `SHOP_ADMIN_USERNAME` y `SHOP_ADMIN_PASSWORD`: credenciales requeridas para arrancar y proteger operaciones administrativas e historial.
- `CORS_ALLOWED_ORIGINS`: por defecto `http://localhost:3000,http://localhost:5173`.

En PowerShell, configura credenciales antes de iniciar:

```powershell
$env:DB_USERNAME = "shop_user"
$env:DB_PASSWORD = "<clave-de-mysql>"
$env:SHOP_ADMIN_USERNAME = "admin"
$env:SHOP_ADMIN_PASSWORD = "<una-clave-segura>"
.\mvnw.cmd -f shop-service\pom.xml spring-boot:run
```

Desde la raíz del workspace, ejecuta las pruebas con:

```powershell
.\mvnw.cmd -f shop-service\pom.xml clean test
```

## API

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/productos` | Público |
| GET | `/api/productos/{id}` | Público |
| POST | `/api/productos` | HTTP Basic, rol admin |
| PUT | `/api/productos/{id}` | HTTP Basic, rol admin |
| DELETE | `/api/productos/{id}` | HTTP Basic, rol admin |
| POST | `/api/compras` | React/cliente |
| GET | `/api/compras/usuario/{id}` | HTTP Basic, rol admin |

Las credenciales HTTP Basic se toman de `SHOP_ADMIN_USERNAME` y `SHOP_ADMIN_PASSWORD`. Las solicitudes de compra reciben identificadores y cantidades; los precios y el total siempre se obtienen del catálogo del servidor. Cada compra conserva nombre y precio unitario como datos históricos, y el stock se valida y descuenta dentro de una transacción.

Usa HTTPS al exponer los endpoints protegidos fuera de un entorno local.

Ejemplo de `POST /api/compras`:

```json
{
  "usuarioId": 42,
  "items": [
    { "productoId": 3, "cantidad": 2 }
  ]
}
```

No se integró autenticación de usuarios porque no se especificó un proveedor de identidad. Por ahora el cliente envía `usuarioId` y la creación de compras no exige autenticación; antes de producción, debe verificarse la identidad del usuario y que coincida con ese ID.
