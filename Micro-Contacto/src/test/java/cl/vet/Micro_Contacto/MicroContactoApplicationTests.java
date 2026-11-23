package cl.vet.Micro_Contacto;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "jwt.secreto=clave-de-pruebas-de-contacto-con-32-caracteres-o-mas")
class MicroContactoApplicationTests {

	@Test
	void contextLoads() {
	}

}
