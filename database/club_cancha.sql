-- Base de datos del Club Cancha


DROP DATABASE IF EXISTS club_cancha;
CREATE DATABASE club_cancha CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE club_cancha;

-- Usuarios del sistema: el dueño (admin) y los empleados del club. Los clientes no ingresan.

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'empleado') NOT NULL DEFAULT 'empleado',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Clientes que usan las canchas. 
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  telefono CHAR(10) NOT NULL UNIQUE
);

-- Cada deporte y el tipo al que pertenece (el tipo depende del deporte, no de la cancha)
CREATE TABLE deportes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(30) NOT NULL UNIQUE,
  tipo ENUM('Fútbol', 'Pádel') NOT NULL
);

CREATE TABLE canchas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  deporte_id INT NOT NULL,
  FOREIGN KEY (deporte_id) REFERENCES deportes(id)
);

-- El precio depende del deporte, la duración y la franja (dia: 08 a 16:59, noche: 17 a 00)
CREATE TABLE tarifas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  deporte_id INT NOT NULL,
  duracion DECIMAL(2,1) NOT NULL CHECK (duracion IN (1, 1.5, 2)),
  franja ENUM('dia', 'noche') NOT NULL,
  precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
  UNIQUE (deporte_id, duracion, franja),
  FOREIGN KEY (deporte_id) REFERENCES deportes(id)
);

-- Turnos del club: de 08:00 a 23:00
CREATE TABLE horarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hora TIME NOT NULL UNIQUE
);

-- La seña no se guarda: es la mitad del precio de la tarifa y se calcula.
-- usuario_id es el dueño o empleado que cargó la reserva.
-- Solo se guarda 'reservada' o 'cancelada'. 'en curso' y 'finalizada' se calculan con la hora.
CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cancha_id INT NOT NULL,
  cliente_id INT NOT NULL,
  horario_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha DATE NOT NULL,
  duracion DECIMAL(2,1) NOT NULL CHECK (duracion IN (1, 1.5, 2)),
  politica BOOLEAN NOT NULL DEFAULT TRUE,
  estado ENUM('reservada', 'cancelada') NOT NULL DEFAULT 'reservada',
  FOREIGN KEY (cancha_id) REFERENCES canchas(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (horario_id) REFERENCES horarios(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

--  Datos de prueba

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Lourdes Ortega', 'lourdes@clubcancha.com', '1234', 'admin'),
('Emilse Andrada', 'emilse@clubcancha.com', '1234', 'admin'),
('Analía Roldan', 'analia@clubcancha.com', '1234', 'empleado'),
('Belén Bulacio', 'belen@clubcancha.com', '1234', 'empleado'),
('Laura Soria', 'laura@clubcancha.com', '1234', 'empleado');

INSERT INTO clientes (nombre, apellido, telefono) VALUES
('Juan', 'Pérez', '3884000000'),
('Ana', 'Gómez', '3885112233'),
('Luis', 'Díaz', '3886224455'),
('Sofía', 'Romero', '3884556677'),
('Martín', 'Flores', '3887334455');

INSERT INTO deportes (nombre, tipo) VALUES
('Fútbol 5', 'Fútbol'),
('Fútbol 7', 'Fútbol'),
('Pádel', 'Pádel');

INSERT INTO canchas (nombre, deporte_id) VALUES
('Cancha 1', 1),
('Cancha 2', 2),
('Cancha 3', 3);

-- Fútbol: solo 1 hora. Pádel: 1, 1.5 y 2 horas.
INSERT INTO tarifas (deporte_id, duracion, franja, precio) VALUES
(1, 1, 'dia', 35000), (1, 1, 'noche', 50000),
(2, 1, 'dia', 45000), (2, 1, 'noche', 62000),
(3, 1, 'dia', 40000), (3, 1, 'noche', 50000),
(3, 1.5, 'dia', 50000), (3, 1.5, 'noche', 60000),
(3, 2, 'dia', 55000), (3, 2, 'noche', 70000);

INSERT INTO horarios (hora) VALUES
('08:00'), ('09:00'), ('10:00'), ('11:00'), ('12:00'), ('13:00'), ('14:00'), ('15:00'),
('16:00'), ('17:00'), ('18:00'), ('19:00'), ('20:00'), ('21:00'), ('22:00'), ('23:00');

INSERT INTO reservas (cancha_id, cliente_id, horario_id, usuario_id, fecha, duracion, politica, estado) VALUES
(2, 1, 12, 1, '2026-11-02', 1, TRUE, 'reservada'),
(3, 2, 14, 2, '2026-11-03', 1.5, TRUE, 'reservada'),
(1, 3, 3, 3, '2026-11-04', 1, TRUE, 'cancelada'),
(3, 4, 2, 4, '2026-11-05', 2, TRUE, 'reservada'),
(2, 5, 11, 5, '2026-11-06', 1, TRUE, 'reservada');

-- Verificación  

SELECT * FROM usuarios;
SELECT * FROM clientes;
SELECT * FROM deportes;
SELECT * FROM canchas;
SELECT * FROM tarifas;
SELECT * FROM horarios;
SELECT * FROM reservas;


-- El precio sale de la tarifa (según deporte, duración y franja) y la seña es la mitad.
SELECT r.id, r.fecha, h.hora, c.nombre AS cancha, d.nombre AS deporte,
       CONCAT(cl.apellido, ', ', cl.nombre) AS cliente, r.duracion,
       t.precio, ROUND(t.precio / 2, 2) AS sena, r.estado, u.nombre AS registrada_por
FROM reservas r
JOIN canchas c ON c.id = r.cancha_id
JOIN deportes d ON d.id = c.deporte_id
JOIN clientes cl ON cl.id = r.cliente_id
JOIN horarios h ON h.id = r.horario_id
JOIN tarifas t ON t.deporte_id = c.deporte_id
              AND t.duracion = r.duracion
              AND t.franja = IF(h.hora < '17:00', 'dia', 'noche')
JOIN usuarios u ON u.id = r.usuario_id;
