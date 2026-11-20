package cl.vet.Micro_Usuario.controller;

import cl.vet.Micro_Usuario.dto.AuthResponse;
import cl.vet.Micro_Usuario.dto.LoginRequest;
import cl.vet.Micro_Usuario.dto.RegistroRequest;
import cl.vet.Micro_Usuario.dto.UsuarioResponse;
import cl.vet.Micro_Usuario.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest datos) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.registrar(datos));
    }

    @PostMapping("/login")
    public AuthResponse iniciarSesion(@Valid @RequestBody LoginRequest datos) {
        return service.iniciarSesion(datos);
    }

    @GetMapping("/perfil")
    public UsuarioResponse perfil(@AuthenticationPrincipal Jwt jwt) {
        return service.obtenerPerfil(Long.valueOf(jwt.getSubject()));
    }
}
