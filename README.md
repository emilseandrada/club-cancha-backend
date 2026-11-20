⚽ Club Cancha — Backend
API REST del sistema de reservas de canchas de Club Cancha, desarrollada con NestJS, TypeScript, Prisma ORM y MySQL.

Es el backend del frontend en React (club-cancha-frontend).
🚧 Proyecto en desarrollo. Ya se implementaron las validaciones de datos, la persistencia con Prisma en los módulos principales y la autenticación con registro y login. La integración y las pruebas del sistema continúan en desarrollo.

👥 Integrantes — Grupo 6
Integrante	Módulo
Lourdes Ortega	Auth y Users
Analía Roldan	Canchas
Laura Soria	Horarios
Emilse Andrada	Reservas
Belén Bulacio	Clientes


🛠️ Tecnologías
- NestJS (Node.js + TypeScript): framework del backend.
- MySQL: base de datos relacional, administrada con MySQL Workbench.
- Prisma ORM: modelos, relaciones y consultas a la base de datos.
- class-validator y class-transformer: validación de datos recibidos.
- bcrypt: almacenamiento seguro de contraseñas mediante hash.
- JWT (@nestjs/jwt): generación de tokens de acceso al iniciar sesión.
- Postman: pruebas de los endpoints HTTP.
🧩 ¿Cómo se conecta todo?
El proyecto se ejecuta de forma local durante el desarrollo:
Frontend (React)   →   Backend (NestJS)   →   Base de datos (MySQL)
localhost:5173          localhost:4000          localhost:3306
El frontend no se conecta directamente a MySQL: realiza peticiones HTTP al backend, que valida los datos y consulta la base mediante Prisma.
Petición HTTP → Controller → DTO / ValidationPipe → Service → Prisma → MySQL
🚀 Instalación
1. Clonar el repositorio:
   git clone https://github.com/emilseandrada/club-cancha-backend.git
   cd club-cancha-backend
2. Instalar las dependencias:
   npm install
3. Iniciar MySQL desde XAMPP o MySQL Server y crear la base de datos local. El proyecto incluye el script database/club_cancha.sql y la definición de modelos de Prisma en prisma/schema.prisma.
4. Crear el archivo .env en la raíz del proyecto, con los valores correspondientes a cada equipo (ver siguiente sección).
5. Generar el cliente de Prisma:
   npx prisma generate
6. Si corresponde preparar o actualizar la estructura de la base con las migraciones del proyecto, utilizar en el entorno de desarrollo:
   npx prisma migrate dev
   Antes de aplicar migraciones, revisar el estado de la base local si ya se importó el script SQL, para evitar conflictos entre esquemas.
7. Levantar el servidor:
   npm run start:dev
   La API se ejecuta en http://localhost:4000 si se configura PORT=4000.
🔐 Variables de entorno
Crear un archivo .env en la raíz del proyecto:
PORT=4000
DATABASE_URL="mysql://usuario:password@localhost:3306/club_cancha"
JWT_SECRET="reemplazar_por_una_clave_secreta_segura"
- PORT: puerto en el que escucha NestJS; si no se define, usa 3000.
- DATABASE_URL: conexión local de Prisma con MySQL.
- JWT_SECRET: clave utilizada para firmar los tokens JWT.
🔒 Importante: .env contiene datos privados y no debe subirse a GitHub. Está incluido en .gitignore. No compartir contraseñas ni claves reales.

🗄️ Base de datos — TP 11
La base de datos club_cancha está modelada con Prisma y organizada mediante relaciones entre entidades. El esquema se encuentra en prisma/schema.prisma y el proyecto también incluye database/club_cancha.sql.
Tabla	Guarda
usuarios	Usuarios del sistema: nombre, correo, contraseña cifrada y rol
clientes	Clientes que realizan reservas: nombre, apellido y teléfono
deportes	Deportes disponibles, como fútbol y pádel
canchas	Canchas del club asociadas a un deporte
tarifas	Precios por deporte, duración y franja horaria
horarios	Horarios disponibles, de 08:00 a 23:00
reservas	Cancha, cliente, horario, usuario, fecha, duración, política y estado


Relaciones principales:
clientes  1 ──── N reservas N ──── 1 canchas  N ──── 1 deportes
usuarios  1 ──── N reservas N ──── 1 horarios
                                  deportes 1 ──── N tarifas
- Cada reserva corresponde a un cliente, una cancha, un horario y un usuario que la registra.
- Cada cancha pertenece a un deporte; las tarifas se asocian al deporte y dependen de la duración y la franja.
- Los estados de reserva definidos son reservada y cancelada.
- La seña no se almacena en la tabla reservas: el esquema indica que corresponde a la mitad del precio y se calcula cuando es necesario.
- El esquema está organizado para evitar duplicaciones de datos, siguiendo criterios de normalización hasta tercera forma normal (3FN).
Prisma permite realizar operaciones como create, findMany, findUnique, update y delete sobre las tablas del sistema.
📁 Estructura
club-cancha-backend/
├── database/
│   └── club_cancha.sql
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── main.ts
│   ├── generated/prisma/       Cliente generado por Prisma
│   └── modules/
│       ├── app/                Módulo principal
│       ├── auth/               Registro, login, bcrypt y JWT
│       ├── users/              Consulta, edición y eliminación de usuarios
│       ├── canchas/            CRUD de canchas
│       ├── clientes/           CRUD de clientes
│       ├── horarios/           CRUD de horarios
│       ├── reservas/           CRUD de reservas
│       └── prisma/             Servicio de conexión y manejo de errores
├── prisma7.config.ts
├── package.json
└── README.md
Los módulos se organizan mediante archivos controller, service y module, y los datos de entrada se definen mediante clases dto.
- Controller: recibe las peticiones HTTP y llama al servicio correspondiente.
- Service: contiene la lógica de cada operación y utiliza Prisma para acceder a MySQL.
- DTO: define y valida los datos que recibe cada endpoint.
- PrismaService: comparte la conexión con la base de datos entre módulos.
✅ Validaciones — TP 10
Se utilizan DTO (Data Transfer Objects) y decoradores de class-validator para verificar los datos recibidos en las peticiones.

Entre las validaciones utilizadas se encuentran:
- @IsNotEmpty(): campos obligatorios.
- @IsString(), @IsInt() y @IsNumber(): tipos de datos.
- @IsEmail(): formato de correo electrónico.
- @IsBoolean(): valores verdaderos o falsos.
- @IsEnum() y @IsIn(): valores permitidos.
- @MinLength(), @MaxLength() y @Matches(): longitud y formato.
- @IsOptional(): campos no obligatorios.
En src/main.ts se activa un ValidationPipe global, que permite aplicar las validaciones definidas en los DTO. Los DTO de actualización permiten modificar únicamente los campos enviados.

Cuando una petición contiene datos inválidos, NestJS puede devolver 400 Bad Request con los mensajes de validación.
🔗 Endpoints — TP 11 y TP 12
Los siguientes endpoints están definidos en los controllers del proyecto.
CRUD de recursos
Método	Ruta	Acción
POST	/canchas	Crear cancha
GET	/canchas	Listar canchas
GET	/canchas/:id	Buscar cancha por ID
PATCH	/canchas/:id	Actualizar cancha
DELETE	/canchas/:id	Eliminar cancha
POST	/clientes	Crear cliente
GET	/clientes	Listar clientes
GET	/clientes/:id	Buscar cliente por ID
PATCH	/clientes/:id	Actualizar cliente
DELETE	/clientes/:id	Eliminar cliente
POST	/horarios	Crear horario
GET	/horarios	Listar horarios
GET	/horarios/:id	Buscar horario por ID
PATCH	/horarios/:id	Actualizar horario
DELETE	/horarios/:id	Eliminar horario
POST	/reservas	Crear reserva
GET	/reservas	Listar reservas
GET	/reservas/:id	Buscar reserva por ID
PATCH	/reservas/:id	Actualizar reserva
DELETE	/reservas/:id	Eliminar reserva


Usuarios: GET /users, GET /users/:id, PATCH /users/:id y DELETE /users/:id. El alta de usuarios se realiza desde el registro de autenticación.

Ejemplo: GET http://localhost:4000/reservas.
🔑 Autenticación — TP 12
Método	Ruta	Acción
POST	/auth/register	Registrar un nuevo usuario
POST	/auth/login	Iniciar sesión y obtener un token JWT


- Registro: valida los datos, genera un hash de la contraseña con bcrypt y guarda el usuario en MySQL mediante Prisma. No devuelve la contraseña en la respuesta.
- Login: busca el usuario por correo, comprueba la contraseña con bcrypt y, si es correcta, devuelve access_token y datos básicos del usuario.
- JWT: el token incluye identificador, correo y rol del usuario; su expiración está configurada en 1 hora.
- El código revisado implementa generación de tokens. No debe asumirse que todas las rutas CRUD están protegidas con JWT hasta incorporar y verificar los guards correspondientes.
Respuestas HTTP habituales
Código	Significado
200 OK	Consulta o modificación correcta
201 Created	Recurso creado correctamente
400 Bad Request	Datos inválidos
401 Unauthorized	Credenciales de acceso incorrectas
404 Not Found	Recurso inexistente
409 Conflict	Conflicto, por ejemplo un correo ya registrado


📮 Postman
Los endpoints se pueden probar desde Postman, utilizando una colección Club Cancha:
- Una carpeta por módulo, con las peticiones correspondientes.
- Un entorno Local con la variable base_url configurada como http://localhost:4000.
- Ejemplo de petición: {{base_url}}/reservas.
- Probar operaciones GET, POST, PATCH y DELETE, además de casos con datos inválidos.
- Probar POST /auth/register y POST /auth/login para verificar el registro y la devolución del token.
Para probar operaciones que acceden a la base de datos, MySQL debe estar iniciado y la conexión de Prisma debe estar correctamente configurada.

🌿 Ramas
Rama	Uso
main	Versión estable
dev	Integración del desarrollo
feature/...	Nuevas funcionalidades
fix/...	Correcciones
refactor/...	Reorganización del código
docs/...	Documentación


Ramas de trabajo utilizadas: feature/reservas, feature/canchas, feature/horarios, feature/auth y feature/base-de-datos, entre otras.

Cada cambio se trabaja en su rama correspondiente y se integra a dev mediante un Pull Request. Luego, los cambios integrados pueden incorporarse a main.