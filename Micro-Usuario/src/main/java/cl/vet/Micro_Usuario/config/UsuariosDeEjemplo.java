package cl.vet.Micro_Usuario.config;

import cl.vet.Micro_Usuario.model.Usuario;
import cl.vet.Micro_Usuario.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Crea clientes de ejemplo para desarrollo (María García y Juan Pérez).
 * Se ejecuta después de {@link DatosIniciales}, así el admin queda con el primer id.
 * Se desactiva con {@code app.usuarios-ejemplo.enabled=false}.
 */
@Component
@Order(2)
@ConditionalOnProperty(name = "app.usuarios-ejemplo.enabled", havingValue = "true", matchIfMissing = true)
public class UsuariosDeEjemplo implements CommandLineRunner {

    private static final String CONTRASENA_EJEMPLO = "contrasena123";

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuariosDeEjemplo(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        crearSiNoExiste("María García", "maria.garcia@example.com");
        crearSiNoExiste("Juan Pérez", "juan.perez@example.com");
    }

    private void crearSiNoExiste(String nombre, String correo) {
        if (repository.existsByCorreo(correo)) return;

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setCorreo(correo);
        usuario.setContrasena(passwordEncoder.encode(CONTRASENA_EJEMPLO));
        usuario.setAdmin(false);
        repository.save(usuario);
    }
}
