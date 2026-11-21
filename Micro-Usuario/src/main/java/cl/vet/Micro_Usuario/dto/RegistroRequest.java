package cl.vet.Micro_Usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroRequest(
        @NotBlank(message = "Ingresa tu nombre.")
        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
        String nombre,

        @NotBlank(message = "Ingresa tu correo electrónico.")
        @Email(message = "Ingresa un correo válido.")
        @Size(max = 100, message = "El correo no puede superar los 100 caracteres.")
        String correo,

        @NotBlank(message = "Ingresa una contraseña.")
        @Size(min = 6, max = 72, message = "La contraseña debe tener entre 6 y 72 caracteres.")
        String contrasena
) {
}
