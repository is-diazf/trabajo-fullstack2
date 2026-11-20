package SanMarcos.cl.shop.purchase;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompraRepository extends JpaRepository<Compra, Long> {

	List<Compra> findAllByUsuarioIdOrderByCreadaEnDesc(Long usuarioId);
}
