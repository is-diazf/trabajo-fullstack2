package cl.veterinaria.sm.repository;

import cl.veterinaria.sm.model.HistorialMedico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistorialRepository extends JpaRepository<HistorialMedico, Long> {}