package cl.vet.Micro_Usuario.security;

import cl.vet.Micro_Usuario.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class TokenService {

    private final JwtEncoder encoder;
    private final long expiracionMinutos;

    public TokenService(JwtEncoder encoder, @Value("${jwt.expiracion-minutos}") long expiracionMinutos) {
        this.encoder = encoder;
        this.expiracionMinutos = expiracionMinutos;
    }

    public String generarToken(Usuario usuario) {
        Instant ahora = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("micro-usuario")
                .issuedAt(ahora)
                .expiresAt(ahora.plus(expiracionMinutos, ChronoUnit.MINUTES))
                .subject(String.valueOf(usuario.getId()))
                .claim("nombre", usuario.getNombre())
                .claim("correo", usuario.getCorreo())
                .claim("roles", usuario.isAdmin() ? List.of("ADMIN", "USUARIO") : List.of("USUARIO"))
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
