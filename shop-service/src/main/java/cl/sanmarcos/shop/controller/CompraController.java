package cl.sanmarcos.shop.controller;

import cl.sanmarcos.shop.dto.CompraRequest;
import cl.sanmarcos.shop.dto.CompraResponse;
import cl.sanmarcos.shop.service.CompraService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
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

	@PostMapping
	public ResponseEntity<CompraResponse> create(@Valid @RequestBody CompraRequest request) {
		CompraResponse compra = compraService.create(request);
		return ResponseEntity.created(URI.create("/api/compras/" + compra.id())).body(compra);
	}

	@GetMapping("/usuario/{id}")
	public List<CompraResponse> findByUsuarioId(@PathVariable Long id) {
		return compraService.findByUsuarioId(id);
	}
}
