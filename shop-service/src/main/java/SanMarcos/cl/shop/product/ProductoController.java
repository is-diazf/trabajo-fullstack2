package SanMarcos.cl.shop.product;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

	private final ProductoService productoService;

	public ProductoController(ProductoService productoService) {
		this.productoService = productoService;
	}

	@GetMapping
	public List<ProductoResponse> findAll() {
		return productoService.findAll();
	}

	@GetMapping("/{id}")
	public ProductoResponse findById(@PathVariable Long id) {
		return productoService.findById(id);
	}

	@PostMapping
	public ResponseEntity<ProductoResponse> create(@Valid @RequestBody ProductoRequest request) {
		ProductoResponse producto = productoService.create(request);
		return ResponseEntity.created(URI.create("/api/productos/" + producto.id())).body(producto);
	}

	@PutMapping("/{id}")
	public ProductoResponse replace(@PathVariable Long id, @Valid @RequestBody ProductoRequest request) {
		return productoService.replace(id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		productoService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
