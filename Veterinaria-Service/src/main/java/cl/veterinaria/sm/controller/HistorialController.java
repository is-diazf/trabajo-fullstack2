package cl.veterinaria.sm.controller;

import cl.veterinaria.sm.model.HistorialMedico;
import cl.veterinaria.sm.service.HistorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/historiales")
@CrossOrigin(origins = "*")
public class HistorialController {
    @Autowired
    private HistorialService service;

    @GetMapping
    public List<HistorialMedico> listarTodos() { return service.obtenerTodos(); }

    /** Solo el propio dueño o un administrador. */
    @GetMapping("/usuario/{usuarioId}")
    public List<HistorialMedico> listarPorUsuario(@AuthenticationPrincipal Jwt token, @PathVariable Long usuarioId) {
        List<String> roles = token.getClaimAsStringList("roles");
        boolean esAdmin = roles != null && roles.contains("ADMIN");
        if (!usuarioId.toString().equals(token.getSubject()) && !esAdmin) {
            throw new AccessDeniedException("No puedes ver los historiales de otro usuario");
        }
        return service.obtenerPorUsuario(usuarioId);
    }

    @PostMapping
    public HistorialMedico crear(@RequestBody HistorialMedico historial) { return service.guardar(historial); }
}