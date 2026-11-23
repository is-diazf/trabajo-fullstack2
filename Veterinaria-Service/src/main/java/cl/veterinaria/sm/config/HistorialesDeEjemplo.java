package cl.veterinaria.sm.config;

import cl.veterinaria.sm.model.HistorialMedico;
import cl.veterinaria.sm.repository.HistorialRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Carga historiales médicos de ejemplo cuando la tabla está vacía.
 * Los usuarioId corresponden a los clientes de ejemplo de Micro-Usuario
 * (2 = María García, 3 = Juan Pérez; el 1 es el administrador).
 * Se desactiva con {@code app.historiales-ejemplo.enabled=false}.
 */
@Component
@ConditionalOnProperty(name = "app.historiales-ejemplo.enabled", havingValue = "true", matchIfMissing = true)
public class HistorialesDeEjemplo implements CommandLineRunner {

    private final HistorialRepository repository;

    public HistorialesDeEjemplo(HistorialRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        repository.save(historial(2L, "Firulais", "2024-05-10", "Vacuna"));
        repository.save(historial(3L, "Michi", "2024-06-15", "Control"));
    }

    private static HistorialMedico historial(Long usuarioId, String mascota, String fecha, String motivo) {
        HistorialMedico historial = new HistorialMedico();
        historial.setUsuarioId(usuarioId);
        historial.setMascota(mascota);
        historial.setFecha(fecha);
        historial.setMotivo(motivo);
        return historial;
    }
}
