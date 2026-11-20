package cl.vet.Micro_Usuario.service;

import cl.vet.Micro_Usuario.dto.AuthResponse;
import cl.vet.Micro_Usuario.dto.LoginRequest;
import cl.vet.Micro_Usuario.dto.RegistroRequest;
import cl.vet.Micro_Usuario.dto.UsuarioResponse;
import cl.vet.Micro_Usuario.exception.ErrorApi;
import cl.vet.Micro_Usuario.model.Usuario;
import cl.vet.Micro_Usuario.repository.UsuarioRepository;
import cl.vet.Micro_Usuario.security.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(UsuarioRepository repository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public AuthResponse registrar(RegistroRequest datos) {
        String correo = normalizarCorreo(datos.correo());
        if (repository.existsByCorreo(correo)) {
            throw new ErrorApi(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(datos.nombre().trim());
        usuario.setCorreo(correo);
        usuario.setContrasena(passwordEncoder.encode(datos.contrasena()));
        usuario.setAdmin(false);

        Usuario guardado = repository.save(usuario);
        return new AuthResponse(tokenService.generarToken(guardado), UsuarioResponse.desde(guardado));
    }

    public AuthResponse iniciarSesion(LoginRequest datos) {
        Usuario usuario = repository.findByCorreo(normalizarCorreo(datos.correo()))
                .filter(encontrado -> passwordEncoder.matches(datos.contrasena(), encontrado.getContrasena()))
                .orElseThrow(() -> new ErrorApi(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos."));

        return new AuthResponse(tokenService.generarToken(usuario), UsuarioResponse.desde(usuario));
    }

    public UsuarioResponse obtenerPerfil(Long id) {
        return repository.findById(id)
                .map(UsuarioResponse::desde)
                .orElseThrow(() -> new ErrorApi(HttpStatus.NOT_FOUND, "No se encontró la cuenta."));
    }

    private String normalizarCorreo(String correo) {
        return correo.trim().toLowerCase();
    }
}
