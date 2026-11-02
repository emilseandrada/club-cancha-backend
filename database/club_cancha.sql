DROP DATABASE IF EXISTS club_cancha;
CREATE DATABASE club_cancha CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE club_cancha;

-- Usuarios del panel (login). La contraseña se va a guardar encriptada más adelante.
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'empleado') NOT NULL DEFAULT 'empleado',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Clientes que reservan. El teléfono no se repite (en el front se agrupan por teléfono).
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono CHAR(10) NOT NULL UNIQUE
);

CREATE TABLE canchas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  deporte ENUM('Fútbol 5', 'Fútbol 7', 'Pádel') NOT NULL,
  tipo ENUM('Fútbol', 'Pádel') NOT NULL,
  imagen VARCHAR(255)
);

-- Precio de cada cancha según la duración y la franja (dia: 08 a 16:59, noche: 17 a 00)
CREATE TABLE tarifas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cancha_id INT NOT NULL,
  duracion DECIMAL(2,1) NOT NULL,
  franja ENUM('dia', 'noche') NOT NULL,
  precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
  UNIQUE (cancha_id, duracion, franja),
  FOREIGN KEY (cancha_id) REFERENCES canchas(id)
);

-- Turnos del club: de 08:00 a 23:00
CREATE TABLE horarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hora TIME NOT NULL UNIQUE
);

-- Solo se guarda 'reservada' o 'cancelada'. 'en curso' y 'finalizada' se calculan con la hora.
CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cancha_id INT NOT NULL,
  cliente_id INT NOT NULL,
  horario_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha DATE NOT NULL,
  duracion DECIMAL(2,1) NOT NULL CHECK (duracion IN (1, 1.5, 2)),
  sena DECIMAL(10,2) NOT NULL CHECK (sena >= 0),
  politica BOOLEAN NOT NULL DEFAULT TRUE,
  estado ENUM('reservada', 'cancelada') NOT NULL DEFAULT 'reservada',
  FOREIGN KEY (cancha_id) REFERENCES canchas(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (horario_id) REFERENCES horarios(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ===== Datos de prueba =====

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Lourdes Ortega', 'lourdes@clubcancha.com', '1234', 'admin'),
('Emilse Andrada', 'emilse@clubcancha.com', '1234', 'admin'),
('Analía Roldan', 'analia@clubcancha.com', '1234', 'empleado'),
('Belén Bulacio', 'belen@clubcancha.com', '1234', 'empleado'),
('Laura Soria', 'laura@clubcancha.com', '1234', 'empleado');

INSERT INTO clientes (nombre, telefono) VALUES
('Pérez, Juan', '3884000000'),
('Gómez, Ana', '3885112233'),
('Díaz, Luis', '3886224455'),
('Romero, Sofía', '3884556677'),
('Flores, Martín', '3887334455');

INSERT INTO canchas (nombre, deporte, tipo, imagen) VALUES
('Cancha 1', 'Fútbol 5', 'Fútbol', '/canchas/cancha-futbol5.jpg'),
('Cancha 2', 'Fútbol 7', 'Fútbol', '/canchas/cancha-futbol7.jpg'),
('Cancha 3', 'Pádel', 'Pádel', '/canchas/cancha-padel.jpg'),
('Cancha 4', 'Pádel', 'Pádel', '/canchas/cancha-padel.jpg'),
('Cancha 5', 'Fútbol 5', 'Fútbol', '/canchas/cancha-futbol5.jpg');

-- Fútbol: solo 1 hora. Pádel: 1, 1.5 y 2 horas.
INSERT INTO tarifas (cancha_id, duracion, franja, precio) VALUES
(1, 1, 'dia', 35000), (1, 1, 'noche', 50000),
(2, 1, 'dia', 45000), (2, 1, 'noche', 62000),
(3, 1, 'dia', 40000), (3, 1, 'noche', 50000),
(3, 1.5, 'dia', 50000), (3, 1.5, 'noche', 60000),
(3, 2, 'dia', 55000), (3, 2, 'noche', 70000),
(4, 1, 'dia', 40000), (4, 1, 'noche', 50000),
(4, 1.5, 'dia', 50000), (4, 1.5, 'noche', 60000),
(4, 2, 'dia', 55000), (4, 2, 'noche', 70000),
(5, 1, 'dia', 35000), (5, 1, 'noche', 50000);

INSERT INTO horarios (hora) VALUES
('08:00'), ('09:00'), ('10:00'), ('11:00'), ('12:00'), ('13:00'), ('14:00'), ('15:00'),
('16:00'), ('17:00'), ('18:00'), ('19:00'), ('20:00'), ('21:00'), ('22:00'), ('23:00');

-- La seña es siempre la mitad del precio (como en el front)
INSERT INTO reservas (cancha_id, cliente_id, horario_id, usuario_id, fecha, duracion, sena, politica, estado) VALUES
(2, 1, 12, 1, '2026-11-02', 1, 31000, TRUE, 'reservada'),
(3, 2, 14, 2, '2026-11-02', 1.5, 30000, TRUE, 'reservada'),
(1, 3, 3, 3, '2026-11-02', 1, 17500, TRUE, 'cancelada'),
(4, 4, 2, 4, '2026-11-03', 2, 27500, TRUE, 'reservada'),
(5, 5, 11, 5, '2026-11-03', 1, 25000, TRUE, 'reservada');

-- ===== Verificación =====

SELECT * FROM usuarios;
SELECT * FROM clientes;
SELECT * FROM canchas;
SELECT * FROM tarifas;
SELECT * FROM horarios;
SELECT * FROM reservas;

-- Las reservas con los datos de sus tablas relacionadas
SELECT r.id, r.fecha, h.hora, c.nombre AS cancha, cl.nombre AS cliente,
       r.duracion, r.sena, r.estado, u.nombre AS registrada_por
FROM reservas r
JOIN canchas c ON c.id = r.cancha_id
JOIN clientes cl ON cl.id = r.cliente_id
JOIN horarios h ON h.id = r.horario_id
JOIN usuarios u ON u.id = r.usuario_id;
