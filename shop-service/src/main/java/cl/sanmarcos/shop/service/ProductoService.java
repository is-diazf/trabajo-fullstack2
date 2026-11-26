package cl.sanmarcos.shop.service;

import cl.sanmarcos.shop.dto.ProductoRequest;
import cl.sanmarcos.shop.dto.ProductoResponse;
import cl.sanmarcos.shop.model.Producto;
import cl.sanmarcos.shop.repository.ProductoRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductoService {

	private final ProductoRepository productoRepository;

	public ProductoService(ProductoRepository productoRepository) {
		this.productoRepository = productoRepository;
	}

	@Transactional(readOnly = true)
	public List<ProductoResponse> findAll() {
		return productoRepository.findAll().stream().map(ProductoResponse::from).toList();
	}

	@Transactional(readOnly = true)
	public ProductoResponse findById(Long id) {
		return ProductoResponse.from(getProducto(id));
	}

	@Transactional
	public ProductoResponse create(ProductoRequest request) {
		Producto producto = new Producto(
				request.nombre(), request.descripcion(), request.precio(), request.stock(),
				request.categoria(), request.imagen());
		return ProductoResponse.from(productoRepository.save(producto));
	}

	@Transactional
	public ProductoResponse replace(Long id, ProductoRequest request) {
		Producto producto = getProducto(id);
		producto.setNombre(request.nombre());
		producto.setDescripcion(request.descripcion());
		producto.setPrecio(request.precio());
		producto.setStock(request.stock());
		producto.setCategoria(request.categoria());
		producto.setImagen(request.imagen());
		return ProductoResponse.from(producto);
	}

	@Transactional
	public void delete(Long id) {
		productoRepository.delete(getProducto(id));
	}

	private Producto getProducto(Long id) {
		return productoRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("No existe el producto " + id));
	}
}
