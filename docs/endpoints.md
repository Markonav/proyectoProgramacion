# API interna

## Usuarios

### 1) `POST /api/users/register` — registrar nuevo usuario
#### Petición
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Secreto123",
}
```

#### Respuesta 
```json
{
  "id": 12,
  "public_id": "b4a7e0da-....",
  "email": "usuario@ejemplo.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "nickname": "juanp",
  "createdAt": "2025-10-26T12:34:56.000Z"
}
```

---

### 2) `POST /api/users/login` — login / obtención de token
#### Petición
```json
{ "email": "usuario@ejemplo.com", "password": "Secreto123" }
```

#### Respuesta 
```json
{
  "user": {
    "email": "usuario@ejemplo.com",
    "public_id": "b4a7e0da-....",
    "nickname": "juanp",
    "avatarUrl": "/uploads/12345.png",
    "createdAt": "2025-10-26T12:34:56.000Z"
  },
  "token": "eyJhbGciOiJIU..."
}
```

---

### 3) `PUT /api/users/password` — cambiar contraseña
#### Petición
```json
{ "email": "usuario@ejemplo.com", "currentPassword": "Antigua", "newPassword": "Nueva123" }
```

#### Respuesta 
```json
{ "message": "Contraseña actualizada", "user": { /* usuario actualizado */ } }
```

---

### 4) `PUT /api/users/update` — actualizar perfil 
#### Petición 
- Campos: `email` (required), `nombre`, `apellido`, `nickname`, `avatar` (file), `removeAvatar` (opcional boolean)

#### Respuesta 
```json
{
  "id": 5,
  "public_id": "uuid-...",
  "email": "usuario@ejemplo.com",
  "nombre": "Nuevo",
  "apellido": "Pérez",
  "nickname": "nickNuevo",
  "avatar": "/uploads/166xxx-123.jpg",
  "createdAt": "..."
}
```

---

### 5) `GET /api/users/favs` — obtener favoritos
#### Petición
`GET /api/users/favs?email=usuario@ejemplo.com`

#### Respuesta 
```json
{ "favs": { "1": true, "3": true, "7": false } }
```

---

### 6) `PUT /api/users/favs` — actualizar favoritos
#### Petición
```json
{ "email": "usuario@ejemplo.com", "favs": { "1": true, "3": true } }
```

#### Respuesta 
```json
{ "favs": { "1": true, "3": true } }
```

---

### 7) `DELETE /api/users/delete` — eliminar cuenta
#### Petición
```json
{ "email": "usuario@ejemplo.com", "password": "Secreto123" }
```

#### Respuesta 
```json
{ "message": "Cuenta eliminada correctamente" }
```

---

## Libros

### 8) `POST /api/libros` — crear libro 
#### Petición 
- Campos: `titulo`, `autor`, `categoria`, `PrecioRenta`, `sinopsis`, `cover` (file)

#### Respuesta 
```json
{ "message": "Libro agregado", "libro": { "id": 21, "titulo": "Mi Libro", "autor": "Autor", "categoria": "Ficción", "PrecioRenta": 3.5, "cover": "/uploads/166xxx.jpg" } }
```

---

### 9) `GET /api/libros` — listar libros
#### Petición
`GET /api/libros`

#### Respuesta 
```json
[
  { "id":1, "titulo":"El Principito", "autor":"Saint-Exupéry", "PrecioRenta":2.5, "cover":"/uploads/.." },
  { "id":2, "titulo":"Don Quijote", "autor":"Cervantes", "PrecioRenta":4.0 }
]
```

---

### 10) `GET /api/libros/:id` — obtener libro por id
#### Petición
`GET /api/libros/2`

#### Respuesta 
```json
{ "id":2, "titulo":"Don Quijote", "autor":"Cervantes", "sinopsis":"...", "PrecioRenta":4.0 }
```

---

### 11) `PUT /api/libros/:id` — actualizar libro 
#### Petición 
- Campos: `titulo`, `autor`, `categoria`, `PrecioRenta`, `sinopsis`, optional `cover` file

#### Respuesta 
```json
{ "message":"Libro actualizado", "libro": { /* libro actualizado */ } }
```

---

### 12) `DELETE /api/libros/:id` — borrar libro
#### Petición
`DELETE /api/libros/2`


## Categorías

### 13) `GET /api/categorias` — listar categorías
#### Petición
`GET /api/categorias`

#### Respuesta 
```json
[ "Ficción", "No Ficción", "Ciencia", "Historia" ]
```
# API externa 

### 1) `POST /api/paypal/orders` - crear orden de pago

### Headers: 
Authorization: Bearer <token>
Content-Type: application/json

### Petición 
```json
{
  "total": 5000,
  "currency": "USD"
}
```
### Respuesta (201)
```json
{
  "message": "Orden creada",
  "order": {...},
  "orderId": "5S960523MR593341Y",
  "timestamp": "2025-11-09T18:35:49.506Z"
}
```

### 2) `POST /api/paypal/orders/:orderId/capture` - capturar orden de pago

### Headers: 
Authorization: Bearer <token>
Content-Type: application/json

### Petición
`POST /api/paypal/orders/5S960523MR593341Y/capture`

### Respuesta (200)
```json
{
  "message": "Pago capturado",
  "capture": {...},
  "captureId": "5S960523MR593341Y",
  "timestamp":"2025-11-09T18:40:49.506Z"
}
```

### 3) `GET /api/paypal/orders/:orderId` - obtener detalles de la orden

### Headers: 
Authorization: Bearer <token>
Content-Type: application/json

### Petición 
`GET /api/paypal/orders/49V84762BW415040L`

### Respuesta (200)
```json
{
  "message": "Detalles de la orden obtenidos",
  "orderDetailsInfo": {...},
  "timestamp": "2025-11-09T18:43:49.506Z"
}
```

### 4) `POST /api/paypal/orders/:orderId/authorize`  - autorizar pago del cliente

### Headers: 
Authorization: Bearer <token>
Content-Type: application/json

### Petición 
`POST /api/paypal/orders/49V84762BW415040L/authorize`

### Respuesta (200)
```json
{
  "message": "Pago autorizado",
  "authorization": {...},
  "authorizationId": "49V84762BW415040L",
  "timestamp": "2025-11-09T18:45:49.506Z"
}
```

### 5) `PATCH /api/paypal/orders/:orderId/amount` - actualizar orden

### Headers: 
Authorization: Bearer <token>
Content-Type: application/json

### Petición
```json
{
  "newTotal": 100,
  "currency": "USD"
}
```

### Respuesta (200)
```json
{
  "message": "Monto de la orden actualizado",
  "timestamp": "2025-11-09T18:49:49.506Z"
}
```




