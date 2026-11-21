package SanMarcos.cl.shop.purchase;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

public record CompraRequest(
		@NotNull @Positive Long usuarioId,
		@NotEmpty List<@NotNull @Valid ItemCompraRequest> items) {

	public record ItemCompraRequest(
			@NotNull @Positive Long productoId,
			@NotNull @Positive Integer cantidad) {
	}
}
