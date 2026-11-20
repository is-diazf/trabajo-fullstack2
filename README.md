# Veterinaria San Marcos

Repositorio con el frontend y los servicios backend del proyecto, cada uno en su propia carpeta e independiente del resto.

| Carpeta | Qué es | Tecnología |
| --- | --- | --- |
| [`shop-service/`](shop-service/) | Catálogo de productos y compras (puerto `8083`) | Java 25, Spring Boot 4.2, MySQL |
| [`frontend/`](frontend/) | Sitio web | React, TypeScript, Vite |

## Backend: shop-service

```powershell
cd shop-service
.\mvnw.cmd clean test
.\mvnw.cmd spring-boot:run
```

Las variables de entorno necesarias (base de datos y credenciales de admin) están en [`shop-service/README.md`](shop-service/README.md).

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Pruebas: `npm test`.
