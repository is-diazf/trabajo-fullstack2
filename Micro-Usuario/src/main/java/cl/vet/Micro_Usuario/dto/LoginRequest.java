package cl.vet.Micro_Usuario.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Ingresa tu correo electrónico.")
        String correo,

        @NotBlank(message = "Ingresa tu contraseña.")
        String contrasena
) {
}
