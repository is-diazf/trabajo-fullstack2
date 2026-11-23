package cl.sanmarcos.shop.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductoRequest(
		@NotBlank @Size(max = 120) String nombre,
		@Size(max = 1000) String descripcion,
		@NotNull @DecimalMin("0.01") @Digits(integer = 10, fraction = 2) BigDecimal precio,
		@NotNull @PositiveOrZero Integer stock,
		@Size(max = 60) String categoria,
		@Size(max = 255) String imagen) {
}
