CREATE TABLE usuario (

    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_usuario_correo UNIQUE (correo)
);
