package cl.sanmarcos.shop.repository;

import cl.sanmarcos.shop.model.Compra;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompraRepository extends JpaRepository<Compra, Long> {

	List<Compra> findAllByUsuarioIdOrderByCreadaEnDesc(Long usuarioId);

	List<Compra> findAllByOrderByCreadaEnDesc();
}
