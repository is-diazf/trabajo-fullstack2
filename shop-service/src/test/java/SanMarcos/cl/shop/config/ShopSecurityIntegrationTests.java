package SanMarcos.cl.shop.config;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ShopSecurityIntegrationTests {

	@LocalServerPort
	private int port;

	@Test
	void productReadsArePublicButProductWritesAndPurchaseHistoryRequireAdmin() throws Exception {
		assertEquals(200, send("GET", "/api/productos", null, null).statusCode());
		assertEquals(401, send("POST", "/api/productos", """
				{"nombre":"Collar","precio":15.50,"stock":2}
				""", null).statusCode());
		assertEquals(201, send("POST", "/api/productos", """
				{"nombre":"Collar","precio":15.50,"stock":2}
				""", adminAuthorization()).statusCode());
		assertEquals(401, send("GET", "/api/compras/usuario/7", null, null).statusCode());
		assertEquals(200, send("GET", "/api/compras/usuario/7", null, adminAuthorization()).statusCode());
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
		return java.net.http.HttpClient.newHttpClient()
				.send(request.build(), HttpResponse.BodyHandlers.ofString());
	}

	private String adminAuthorization() {
		String credentials = Base64.getEncoder().encodeToString(
				"test-admin:test-password".getBytes(StandardCharsets.UTF_8));
		return "Basic " + credentials;
	}
}
