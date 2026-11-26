package cl.sanmarcos.shop.dto;

import cl.sanmarcos.shop.model.Compra;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record CompraResponse(
		Long id,
		Long usuarioId,
		Instant creadaEn,
		BigDecimal total,
		List<ItemResponse> items) {

	public static CompraResponse from(Compra compra) {
		List<ItemResponse> items = compra.getItems().stream()
				.map(item -> new ItemResponse(
						item.getProductoId(),
						item.getNombreProducto(),
						item.getCantidad(),
						item.getPrecioUnitario(),
						item.getSubtotal()))
				.toList();
		return new CompraResponse(compra.getId(), compra.getUsuarioId(), compra.getCreadaEn(), compra.getTotal(), items);
	}

	public record ItemResponse(
			Long productoId,
			String nombreProducto,
			int cantidad,
			BigDecimal precioUnitario,
			BigDecimal subtotal) {
	}
}
