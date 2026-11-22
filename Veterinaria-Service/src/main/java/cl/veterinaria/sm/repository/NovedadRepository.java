package cl.veterinaria.sm.repository;

import cl.veterinaria.sm.model.Novedad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NovedadRepository extends JpaRepository<Novedad, Long> {}