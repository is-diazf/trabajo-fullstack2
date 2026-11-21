package cl.vet.Micro_Usuario.config;

import cl.vet.Micro_Usuario.model.Usuario;
import cl.vet.Micro_Usuario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatosIniciales implements CommandLineRunner {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String nombre;
    private final String correo;
    private final String contrasena;

    public DatosIniciales(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder,
            @Value("${admin.nombre}") String nombre,
            @Value("${admin.correo}") String correo,
            @Value("${admin.contrasena}") String contrasena) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.nombre = nombre;
        this.correo = correo;
        this.contrasena = contrasena;
    }

    @Override
    public void run(String... args) {
        if (repository.existsByAdminTrue()) return;

        Usuario admin = new Usuario();
        admin.setNombre(nombre);
        admin.setCorreo(correo.trim().toLowerCase());
        admin.setContrasena(passwordEncoder.encode(contrasena));
        admin.setAdmin(true);
        repository.save(admin);
    }
}
