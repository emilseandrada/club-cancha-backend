# ⚽ Club Cancha — Backend

API REST del sistema de reservas de canchas de **Club Cancha**, desarrollada con **NestJS** y **MySQL**.

Es el backend del frontend en React ([club-cancha-frontend](https://github.com/Belen-Bulacio/club-cancha-frontend)).

> 🚧 **Proyecto en desarrollo.** Por ahora está creada la estructura de módulos y la base de datos; la lógica de cada módulo se va a ir completando.

## 👥 Integrantes — Grupo 6

| Integrante | Módulo |
|---|---|
| Lourdes Ortega | Auth y Users |
| Analía Roldan | Canchas |
| Laura Soria | Horarios |
| Emilse Andrada | Reservas |
| Belén Bulacio | Clientes |

## 🛠️ Tecnologías

- **NestJS** (Node.js + TypeScript)
- **MySQL** (administrado con MySQL Workbench)
- **Postman** para probar y documentar los endpoints

## 🧩 ¿Cómo se conecta todo?

Todo el proyecto se ejecuta de forma **local**:

```text
Frontend (React)   →   Backend (NestJS)   →   Base de datos (MySQL)
localhost:5173         localhost:4000         localhost:3306
```

El frontend nunca se conecta directamente a la base de datos: le pide los datos al backend.

## 🚀 Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/emilseandrada/club-cancha-backend.git
   cd club-cancha-backend
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Iniciar MySQL (desde XAMPP o MySQL Server).

4. Crear la base de datos: abrir `database/club_cancha.sql` en MySQL Workbench y ejecutarlo completo.

5. Crear el archivo `.env` en la raíz del proyecto (ver abajo).

6. Levantar el servidor:

   ```bash
   npm run start:dev
   ```

## 🔐 Variables de entorno

Crear un archivo `.env` en la raíz con estas variables, completando el usuario y la contraseña de MySQL de cada integrante:

```env
PORT=4000
DATABASE_URL=mysql://usuario:password@localhost:3306/club_cancha
API_BASE_URL=http://localhost:4000/
```

> El archivo `.env` **no se sube** al repositorio (está en el `.gitignore`).

**Nota:** La configuración de variables de entorno y la conexión a MySQL se encuentran en desarrollo. Definir `DATABASE_URL` no establece automáticamente la conexión con la base de datos.

## 🗄️ Base de datos

El script `database/club_cancha.sql` crea la base `club_cancha` con sus tablas, relaciones y datos de prueba.

| Tabla | Guarda |
|---|---|
| `usuarios` | Usuarios que ingresan al panel de administración |
| `clientes` | Clientes que reservan (nombre y teléfono) |
| `canchas` | Canchas del club y su deporte |
| `tarifas` | Precio de cada cancha según duración y franja horaria |
| `horarios` | Turnos del club, de 08:00 a 23:00 |
| `reservas` | Reservas: cancha, cliente, horario, fecha, duración, seña y estado |

**Relaciones:**

```text
clientes  1 ──── N  reservas  N ──── 1  canchas  1 ──── N  tarifas
usuarios  1 ──── N  reservas  N ──── 1  horarios
```

- Cada reserva pertenece a un cliente, una cancha y un horario, y la registra un usuario.
- Cada cancha tiene varias tarifas, según la duración y la franja (día o noche).

## 📁 Estructura

```text
club-cancha-backend/
├── database/
│   └── club_cancha.sql
└── src/
    ├── main.ts
    └── modules/
        ├── app/
        ├── auth/        login y registro
        ├── users/       CRUD de usuarios
        ├── canchas/
        ├── clientes/
        ├── horarios/
        └── reservas/
```

Los módulos se organizan mediante archivos `controller`, `service` y `module`. Según su implementación, también pueden incluir carpetas `dto` y `entities`.

## 🔗 Endpoints (provisorios)

La estructura CRUD habitual de los recursos generados por NestJS contempla las siguientes operaciones:

| Método | Ruta | Acción |
|---|---|---|
| POST | `/modulo` | Crear |
| GET | `/modulo` | Listar todos |
| GET | `/modulo/:id` | Buscar uno |
| PATCH | `/modulo/:id` | Editar |
| DELETE | `/modulo/:id` | Eliminar |

Módulos: `users`, `auth`, `canchas`, `clientes`, `horarios`, `reservas`.

Ejemplo de ruta prevista: `GET http://localhost:4000/canchas`.

> Estas rutas son orientativas. La disponibilidad y el funcionamiento de cada endpoint dependen de la implementación de su módulo. El módulo de autenticación puede utilizar rutas diferentes.

## 📮 Postman

Los endpoints se probarán y documentarán en Postman, en la colección **Club Cancha**:

- Una carpeta por módulo, con sus peticiones correspondientes.
- Un entorno **Local** con la variable `base_url`, para no repetir la dirección en cada petición.
- Ejemplo de petición: `{{base_url}}/canchas`.

## 🌿 Ramas

| Rama | Uso |
|---|---|
| `main` | Versión estable |
| `dev` | Integración del desarrollo |
| `feature/...` | Nuevas funcionalidades |
| `fix/...` | Correcciones |
| `refactor/...` | Reorganización del código |
| `docs/...` | Documentación |

Ramas de trabajo recientes: feature/reservas, feature/canchas, feature/config-env y docs/readme. Las funcionalidades se integran a dev mediante Pull Requests.

Cada cambio se trabaja en su propia rama y se integra a `dev` mediante un Pull Request.