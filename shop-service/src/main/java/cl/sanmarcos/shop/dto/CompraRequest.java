package cl.sanmarcos.shop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

/** El usuario que compra se toma del token, no del cuerpo. */
public record CompraRequest(
		@NotEmpty List<@NotNull @Valid ItemCompraRequest> items) {

	public record ItemCompraRequest(
			@NotNull @Positive Long productoId,
			@NotNull @Positive Integer cantidad) {
	}
}
