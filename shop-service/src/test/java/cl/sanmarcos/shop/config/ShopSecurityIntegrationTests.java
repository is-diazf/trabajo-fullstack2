package cl.sanmarcos.shop.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cl.sanmarcos.shop.model.Producto;
import cl.sanmarcos.shop.repository.CompraRepository;
import cl.sanmarcos.shop.repository.ProductoRepository;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ShopSecurityIntegrationTests {

	@LocalServerPort
	private int port;

	@Value("${jwt.secreto}")
	private String secreto;

	@Autowired
	private ProductoRepository productoRepository;

	@Autowired
	private CompraRepository compraRepository;

	private final HttpClient httpClient = HttpClient.newHttpClient();

	@BeforeEach
	void limpiar() {
		compraRepository.deleteAll();
		productoRepository.deleteAll();
	}

	@Test
	void lecturaDeProductosEsPublicaYEscriturasRequierenAdmin() throws Exception {
		String producto = """
				{"nombre":"Collar","precio":15.50,"stock":2}
				""";
		assertEquals(200, send("GET", "/api/productos", null, null).statusCode());
		assertEquals(401, send("POST", "/api/productos", producto, null).statusCode());
		assertEquals(403, send("POST", "/api/productos", producto, token(7L, "USUARIO")).statusCode());
		assertEquals(201, send("POST", "/api/productos", producto, token(1L, "ADMIN", "USUARIO")).statusCode());
	}

	@Test
	void laCompraSeRegistraANombreDelUsuarioDelToken() throws Exception {
		Producto producto = productoRepository.save(new Producto("Vacuna", "Dosis", new BigDecimal("1000"), 5));
		String compra = """
				{"usuarioId":99,"items":[{"productoId":%d,"cantidad":1}]}
				""".formatted(producto.getId());

		assertEquals(401, send("POST", "/api/compras", compra, null).statusCode());

		HttpResponse<String> respuesta = send("POST", "/api/compras", compra, token(7L, "USUARIO"));
		assertEquals(201, respuesta.statusCode());
		// El usuarioId del cuerpo se ignora: manda el del token.
		assertTrue(respuesta.body().contains("\"usuarioId\":7"), respuesta.body());
		assertEquals(0, compraRepository.findAllByUsuarioIdOrderByCreadaEnDesc(99L).size());
	}

	@Test
	void historialDeComprasSoloParaElDuenoOAdmin() throws Exception {
		assertEquals(401, send("GET", "/api/compras/usuario/7", null, null).statusCode());
		assertEquals(200, send("GET", "/api/compras/usuario/7", null, token(7L, "USUARIO")).statusCode());
		assertEquals(403, send("GET", "/api/compras/usuario/8", null, token(7L, "USUARIO")).statusCode());
		assertEquals(200, send("GET", "/api/compras/usuario/8", null, token(1L, "ADMIN", "USUARIO")).statusCode());

		assertEquals(403, send("GET", "/api/compras", null, token(7L, "USUARIO")).statusCode());
		assertEquals(200, send("GET", "/api/compras", null, token(1L, "ADMIN", "USUARIO")).statusCode());
	}

	@Test
	void rechazaTokensFirmadosConOtroSecreto() throws Exception {
		String falso = firmar("otra-clave-distinta-de-al-menos-32-caracteres!!", 1L, "ADMIN");
		assertEquals(401, send("GET", "/api/compras", null, falso).statusCode());
	}

	private String token(Long usuarioId, String... roles) {
		return firmar(secreto, usuarioId, roles);
	}

	private static String firmar(String clave, Long usuarioId, String... roles) {
		SecretKey secretKey = new SecretKeySpec(clave.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
		NimbusJwtEncoder encoder = new NimbusJwtEncoder(new ImmutableSecret<>(secretKey));
		Instant ahora = Instant.now();
		JwtClaimsSet claims = JwtClaimsSet.builder()
				.issuedAt(ahora)
				.expiresAt(ahora.plusSeconds(300))
				.subject(String.valueOf(usuarioId))
				.claim("roles", List.of(roles))
				.build();
		JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
		return "Bearer " + encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
	}

	private HttpResponse<String> send(String method, String path, String body, String authorization)
			throws Exception {
		HttpRequest.Builder request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path));
		if (body != null) {
			request.header("Content-Type", "application/json")
					.method(method, HttpRequest.BodyPublishers.ofString(body));
		} else {
			request.method(method, HttpRequest.BodyPublishers.noBody());
		}
		if (authorization != null) {
			request.header("Authorization", authorization);
		}
		return httpClient.send(request.build(), HttpResponse.BodyHandlers.ofString());
	}
}
