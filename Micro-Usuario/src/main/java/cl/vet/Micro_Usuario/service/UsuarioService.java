package cl.vet.Micro_Usuario.service;

import cl.vet.Micro_Usuario.dto.UsuarioAdminRequest;
import cl.vet.Micro_Usuario.dto.UsuarioResponse;
import cl.vet.Micro_Usuario.exception.ErrorApi;
import cl.vet.Micro_Usuario.model.Usuario;
import cl.vet.Micro_Usuario.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResponse> listar() {
        return repository.findAll().stream().map(UsuarioResponse::desde).toList();
    }

    public UsuarioResponse crear(UsuarioAdminRequest datos) {
        if (datos.contrasena() == null || datos.contrasena().isBlank()) {
            throw new ErrorApi(HttpStatus.BAD_REQUEST, "La contraseña debe tener al menos 6 caracteres.");
        }
        String correo = normalizarCorreo(datos.correo());
        if (repository.existsByCorreo(correo)) {
            throw new ErrorApi(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(datos.nombre().trim());
        usuario.setCorreo(correo);
        usuario.setContrasena(passwordEncoder.encode(datos.contrasena()));
        usuario.setAdmin(datos.admin());
        return UsuarioResponse.desde(repository.save(usuario));
    }

    public UsuarioResponse actualizar(Long id, UsuarioAdminRequest datos) {
        Usuario usuario = buscar(id);
        String correo = normalizarCorreo(datos.correo());
        if (repository.existsByCorreoAndIdNot(correo, id)) {
            throw new ErrorApi(HttpStatus.CONFLICT, "Ese correo ya está asociado a otra cuenta.");
        }
        if (usuario.isAdmin() && !datos.admin() && repository.countByAdminTrue() == 1) {
            throw new ErrorApi(HttpStatus.CONFLICT, "Debe quedar al menos una cuenta administradora.");
        }

        usuario.setNombre(datos.nombre().trim());
        usuario.setCorreo(correo);
        usuario.setAdmin(datos.admin());
        if (datos.contrasena() != null && !datos.contrasena().isBlank()) {
            usuario.setContrasena(passwordEncoder.encode(datos.contrasena()));
        }
        return UsuarioResponse.desde(repository.save(usuario));
    }

    public void eliminar(Long id, Long idSolicitante) {
        if (id.equals(idSolicitante)) {
            throw new ErrorApi(HttpStatus.CONFLICT, "No puedes eliminar tu propia cuenta desde esta pantalla.");
        }
        Usuario usuario = buscar(id);
        if (usuario.isAdmin() && repository.countByAdminTrue() == 1) {
            throw new ErrorApi(HttpStatus.CONFLICT, "Debe quedar al menos una cuenta administradora.");
        }
        repository.delete(usuario);
    }

    private Usuario buscar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ErrorApi(HttpStatus.NOT_FOUND, "No se encontró la cuenta seleccionada."));
    }

    private String normalizarCorreo(String correo) {
        return correo.trim().toLowerCase();
    }
}
