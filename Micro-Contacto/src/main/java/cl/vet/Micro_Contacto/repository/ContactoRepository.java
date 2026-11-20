package cl.vet.Micro_Contacto.repository;

import cl.vet.Micro_Contacto.model.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactoRepository extends JpaRepository<Contacto, Long> {
    
}
