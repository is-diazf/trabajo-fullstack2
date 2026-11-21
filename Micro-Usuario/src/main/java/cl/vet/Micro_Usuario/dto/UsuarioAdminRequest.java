package cl.vet.Micro_Usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioAdminRequest(
        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
        String nombre,

        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "Ingresa un correo válido.")
        @Size(max = 100, message = "El correo no puede superar los 100 caracteres.")
        String correo,

        @Size(min = 6, max = 72, message = "La contraseña debe tener entre 6 y 72 caracteres.")
        String contrasena,

        boolean admin
) {
}
