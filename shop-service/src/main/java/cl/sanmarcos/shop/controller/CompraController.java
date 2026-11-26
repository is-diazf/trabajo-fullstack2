package cl.sanmarcos.shop.controller;

import cl.sanmarcos.shop.dto.CompraRequest;
import cl.sanmarcos.shop.dto.CompraResponse;
import cl.sanmarcos.shop.service.CompraService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

	private final CompraService compraService;

	public CompraController(CompraService compraService) {
		this.compraService = compraService;
	}

	/** Registra una compra a nombre del usuario del token. */
	@PostMapping
	public ResponseEntity<CompraResponse> create(
			@AuthenticationPrincipal Jwt token,
			@Valid @RequestBody CompraRequest request) {
		CompraResponse compra = compraService.create(usuarioId(token), request);
		return ResponseEntity.created(URI.create("/api/compras/" + compra.id())).body(compra);
	}

	/** Todas las compras (solo administradores, ver SecurityConfiguration). */
	@GetMapping
	public List<CompraResponse> findAll() {
		return compraService.findAll();
	}

	/** Compras de un usuario: solo el propio usuario o un administrador. */
	@GetMapping("/usuario/{id}")
	public List<CompraResponse> findByUsuarioId(@AuthenticationPrincipal Jwt token, @PathVariable Long id) {
		if (!id.equals(usuarioId(token)) && !esAdmin(token)) {
			throw new AccessDeniedException("No puedes ver las compras de otro usuario");
		}
		return compraService.findByUsuarioId(id);
	}

	private static Long usuarioId(Jwt token) {
		return Long.valueOf(token.getSubject());
	}

	private static boolean esAdmin(Jwt token) {
		List<String> roles = token.getClaimAsStringList("roles");
		return roles != null && roles.contains("ADMIN");
	}
}
