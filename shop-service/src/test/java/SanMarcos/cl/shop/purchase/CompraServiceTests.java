package SanMarcos.cl.shop.purchase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import SanMarcos.cl.shop.product.Producto;
import SanMarcos.cl.shop.product.ProductoRepository;
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
	void calculatesTotalFromProductPricesAndDecrementsStock() {
		Producto producto = productoRepository.save(
				new Producto("Vacuna", "Dosis", new BigDecimal("1250.50"), 4));

		CompraResponse response = compraService.create(new CompraRequest(
				7L,
				List.of(new CompraRequest.ItemCompraRequest(producto.getId(), 2))));

		assertEquals(new BigDecimal("2501.00"), response.total());
		assertEquals(2, productoRepository.findById(producto.getId()).orElseThrow().getStock());
		assertEquals(1, compraRepository.findAllByUsuarioIdOrderByCreadaEnDesc(7L).size());
	}

	@Test
	void insufficientStockDoesNotPersistPurchaseOrChangeInventory() {
		Producto availableProduct = productoRepository.save(
				new Producto("Vacuna", "Dosis", new BigDecimal("1250.50"), 4));
		Producto unavailableProduct = productoRepository.save(
				new Producto("Alimento", "Bolsa", new BigDecimal("990.00"), 1));

		assertThrows(InsufficientStockException.class, () -> compraService.create(new CompraRequest(
				7L,
				List.of(
						new CompraRequest.ItemCompraRequest(availableProduct.getId(), 1),
						new CompraRequest.ItemCompraRequest(unavailableProduct.getId(), 2)))));

		assertEquals(4, productoRepository.findById(availableProduct.getId()).orElseThrow().getStock());
		assertEquals(1, productoRepository.findById(unavailableProduct.getId()).orElseThrow().getStock());
		assertEquals(0, compraRepository.count());
	}
}
