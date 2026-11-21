package SanMarcos.cl.shop.purchase;

import SanMarcos.cl.shop.product.Producto;
import SanMarcos.cl.shop.product.ProductoRepository;
import SanMarcos.cl.shop.product.ResourceNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompraService {

	private final CompraRepository compraRepository;
	private final ProductoRepository productoRepository;

	public CompraService(CompraRepository compraRepository, ProductoRepository productoRepository) {
		this.compraRepository = compraRepository;
		this.productoRepository = productoRepository;
	}

	@Transactional
	public CompraResponse create(CompraRequest request) {
		Map<Long, Integer> quantitiesByProduct = new TreeMap<>();
		for (CompraRequest.ItemCompraRequest item : request.items()) {
			try {
				quantitiesByProduct.merge(item.productoId(), item.cantidad(), Math::addExact);
			} catch (ArithmeticException exception) {
				throw new InvalidPurchaseException("La cantidad solicitada es demasiado grande");
			}
		}

		Compra compra = new Compra(request.usuarioId());
		BigDecimal total = BigDecimal.ZERO;
		for (Map.Entry<Long, Integer> entry : quantitiesByProduct.entrySet()) {
			Producto producto = productoRepository.findByIdForUpdate(entry.getKey())
					.orElseThrow(() -> new ResourceNotFoundException(
							"No existe el producto " + entry.getKey()));
			int cantidad = entry.getValue();
			if (producto.getStock() < cantidad) {
				throw new InsufficientStockException(
						"Stock insuficiente para el producto " + producto.getId());
			}

			producto.setStock(producto.getStock() - cantidad);
			CompraDetalle detalle = new CompraDetalle(
					producto.getId(),
					producto.getNombre(),
					cantidad,
					producto.getPrecio());
			compra.addItem(detalle);
			total = total.add(detalle.getSubtotal());
		}

		compra.setTotal(total);
		return CompraResponse.from(compraRepository.save(compra));
	}

	@Transactional(readOnly = true)
	public List<CompraResponse> findByUsuarioId(Long usuarioId) {
		return compraRepository.findAllByUsuarioIdOrderByCreadaEnDesc(usuarioId).stream()
				.map(CompraResponse::from)
				.toList();
	}
}
