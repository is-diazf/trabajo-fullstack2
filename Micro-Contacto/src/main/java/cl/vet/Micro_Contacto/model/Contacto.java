package cl.vet.Micro_Contacto.model;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table (name = "contacto")
public class Contacto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotBlank(message = "Ingresa tu nombre.")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
    @Column(name = "nombre_completo", nullable = false, length = 150)
    private String nombreCompleto;

    @NotBlank(message = "Ingresa tu correo electrónico.")
    @Email(message = "Ingresa un correo electrónico válido.")
    @Size(max = 100, message = "El correo no puede superar los 100 caracteres.")
    @Column(nullable = false, length = 150)
    private String correo;

    @NotBlank(message = "Escribe tu mensaje.")
    @Size(max = 500, message = "El mensaje no puede superar los 500 caracteres.")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column (name = "estado", nullable = false, length = 20)
    private String estado = "PENDIENTE";

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column (name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void asignarFechaCreacion() {
        this.fechaCreacion = LocalDateTime.now();
    }
}
