-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `rol` ENUM('admin', 'empleado') NOT NULL DEFAULT 'empleado',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `apellido` VARCHAR(50) NOT NULL,
    `telefono` CHAR(10) NOT NULL,

    UNIQUE INDEX `clientes_telefono_key`(`telefono`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deportes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT NULL,
    `tipo` ENUM('Fútbol', 'Pádel') NOT NULL,

    UNIQUE INDEX `deportes_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `canchas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `deporte_id` INTEGER NOT NULL,

    UNIQUE INDEX `canchas_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tarifas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deporte_id` INTEGER NOT NULL,
    `duracion` DECIMAL(2, 1) NOT NULL,
    `franja` ENUM('dia', 'noche') NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `tarifas_deporte_id_duracion_franja_key`(`deporte_id`, `duracion`, `franja`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `horarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hora` CHAR(5) NOT NULL,

    UNIQUE INDEX `horarios_hora_key`(`hora`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cancha_id` INTEGER NOT NULL,
    `cliente_id` INTEGER NOT NULL,
    `horario_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `fecha` DATE NOT NULL,
    `duracion` DECIMAL(2, 1) NOT NULL,
    `politica` BOOLEAN NOT NULL DEFAULT true,
    `estado` ENUM('reservada', 'cancelada') NOT NULL DEFAULT 'reservada',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `canchas` ADD CONSTRAINT `canchas_deporte_id_fkey` FOREIGN KEY (`deporte_id`) REFERENCES `deportes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarifas` ADD CONSTRAINT `tarifas_deporte_id_fkey` FOREIGN KEY (`deporte_id`) REFERENCES `deportes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `reservas_cancha_id_fkey` FOREIGN KEY (`cancha_id`) REFERENCES `canchas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `reservas_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `reservas_horario_id_fkey` FOREIGN KEY (`horario_id`) REFERENCES `horarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `reservas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
