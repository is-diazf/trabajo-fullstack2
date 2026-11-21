package cl.vet.Micro_Usuario.security;

import cl.vet.Micro_Usuario.model.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TokenServiceTest {

    private static final String SECRETO = "clave-de-prueba-con-mas-de-32-caracteres-123";

    private final SecurityConfig config = new SecurityConfig(SECRETO);
    private final TokenService tokenService = new TokenService(config.jwtEncoder(), 60);
    private final JwtDecoder decoder = config.jwtDecoder();

    private Usuario crearUsuario(boolean admin) {
        Usuario usuario = new Usuario();
        usuario.setId(7L);
        usuario.setNombre("Ana");
        usuario.setCorreo("ana@mail.com");
        usuario.setAdmin(admin);
        return usuario;
    }

    @Test
    void generaUnTokenQueSePuedeValidarConLaMismaClave() {
        String token = tokenService.generarToken(crearUsuario(false));

        Jwt jwt = decoder.decode(token);

        assertThat(jwt.getSubject()).isEqualTo("7");
        assertThat(jwt.getClaimAsString("nombre")).isEqualTo("Ana");
        assertThat(jwt.getClaimAsString("correo")).isEqualTo("ana@mail.com");
        assertThat(jwt.getClaimAsStringList("roles")).isEqualTo(List.of("USUARIO"));
        assertThat(jwt.getExpiresAt()).isAfter(jwt.getIssuedAt());
    }

    @Test
    void elAdminRecibeElRolAdmin() {
        Jwt jwt = decoder.decode(tokenService.generarToken(crearUsuario(true)));

        assertThat(jwt.getClaimAsStringList("roles")).contains("ADMIN", "USUARIO");
    }

    @Test
    void rechazaUnTokenFirmadoConOtraClave() {
        TokenService otroServicio = new TokenService(
                new SecurityConfig("otra-clave-distinta-con-mas-de-32-caracteres").jwtEncoder(), 60);
        String tokenAjeno = otroServicio.generarToken(crearUsuario(true));

        assertThatThrownBy(() -> decoder.decode(tokenAjeno)).isInstanceOf(JwtException.class);
    }
}
