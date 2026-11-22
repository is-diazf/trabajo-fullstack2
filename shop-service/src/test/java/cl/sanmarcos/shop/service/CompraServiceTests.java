package cl.sanmarcos.shop.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import cl.sanmarcos.shop.dto.CompraRequest;
import cl.sanmarcos.shop.dto.CompraResponse;
import cl.sanmarcos.shop.model.Producto;
import cl.sanmarcos.shop.repository.CompraRepository;
import cl.sanmarcos.shop.repository.ProductoRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class CompraServiceTests {

	@Autowired
	private CompraService compraService;

	@Autowired
	private CompraRepository compraRepository;

	@Autowired
	private ProductoRepository productoRepository;

	@BeforeEach
	void clearDatabase() {
		compraRepository.deleteAll();
		productoRepository.deleteAll();
	}

	@Test
	void calculatesTotalFromCatalogPricesAndUpdatesStock() {
		Producto producto = productoRepository.save(
				new Producto("Vacuna", "Dosis", new BigDecimal("1250.50"), 4));

		CompraResponse compra = compraService.create(new CompraRequest(
				7L, List.of(new CompraRequest.ItemCompraRequest(producto.getId(), 2))));

		assertEquals(new BigDecimal("2501.00"), compra.total());
		assertEquals(2, productoRepository.findById(producto.getId()).orElseThrow().getStock());
		assertEquals(1, compraRepository.findAllByUsuarioIdOrderByCreadaEnDesc(7L).size());
	}

	@Test
	void insufficientStockDoesNotPartiallyUpdateInventoryOrSavePurchase() {
		Producto available = productoRepository.save(
				new Producto("Vacuna", "Dosis", new BigDecimal("1250.50"), 4));
		Producto unavailable = productoRepository.save(
				new Producto("Alimento", "Bolsa", new BigDecimal("990.00"), 1));

		assertThrows(InsufficientStockException.class, () -> compraService.create(new CompraRequest(
				7L,
				List.of(
						new CompraRequest.ItemCompraRequest(available.getId(), 1),
						new CompraRequest.ItemCompraRequest(unavailable.getId(), 2)))));

		assertEquals(4, productoRepository.findById(available.getId()).orElseThrow().getStock());
		assertEquals(1, productoRepository.findById(unavailable.getId()).orElseThrow().getStock());
		assertEquals(0, compraRepository.count());
	}
}
