package cl.vet.Micro_Usuario.repository;

import cl.vet.Micro_Usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreo(String correo);

    boolean existsByCorreo(String correo);

    boolean existsByAdminTrue();

    boolean existsByCorreoAndIdNot(String correo, Long id);

    long countByAdminTrue();
}
