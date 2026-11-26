package cl.sanmarcos.shop.dto;

import cl.sanmarcos.shop.model.Producto;
import java.math.BigDecimal;

public record ProductoResponse(Long id, String nombre, String descripcion, BigDecimal precio, int stock,
		String categoria, String imagen) {

	public static ProductoResponse from(Producto producto) {
		return new ProductoResponse(
				producto.getId(),
				producto.getNombre(),
				producto.getDescripcion(),
				producto.getPrecio(),
				producto.getStock(),
				producto.getCategoria(),
				producto.getImagen());
	}
}
