package cl.sanmarcos.shop.config;

import cl.sanmarcos.shop.model.Producto;
import cl.sanmarcos.shop.repository.ProductoRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Carga el catálogo inicial de la tienda cuando la tabla de productos está vacía.
 * Se desactiva con {@code shop.catalogo-inicial.enabled=false}.
 */
@Configuration
@ConditionalOnProperty(name = "shop.catalogo-inicial.enabled", havingValue = "true", matchIfMissing = true)
public class CatalogoInicial {

	@Bean
	ApplicationRunner cargarCatalogoInicial(ProductoRepository productoRepository) {
		return args -> {
			if (productoRepository.count() > 0) {
				return;
			}
			productoRepository.saveAll(List.of(
					new Producto("Juguete interactivo",
							"Un juguete resistente para mantener a tu mascota activa y entretenida.",
							new BigDecimal("8990"), 50, "Juguetes", "/img/juguetes_mascotas.jpg"),
					new Producto("Cama para mascotas",
							"Un espacio cómodo y acogedor para que tu compañero descanse.",
							new BigDecimal("24990"), 20, "Accesorios", "/img/cama-perros.jpg"),
					new Producto("Shampoo para mascotas",
							"Fórmula suave para acompañar el baño y cuidado del pelaje.",
							new BigDecimal("6990"), 40, "Cuidado", "/img/shampoo-perros.jpg"),
					new Producto("Kit de cuidado y bienestar",
							"Artículos seleccionados para consentir y cuidar a tu mascota.",
							new BigDecimal("12990"), 25, "Cuidado", "/img/esterilizacion.jpeg")));
		};
	}
}
