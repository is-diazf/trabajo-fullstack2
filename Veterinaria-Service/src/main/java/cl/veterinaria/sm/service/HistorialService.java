package cl.veterinaria.sm.service;

import cl.veterinaria.sm.model.HistorialMedico;
import cl.veterinaria.sm.repository.HistorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistorialService {
    @Autowired
    private HistorialRepository repository;

    public List<HistorialMedico> obtenerTodos() { return repository.findAll(); }
    
    public List<HistorialMedico> obtenerPorUsuario(Long usuarioId) {
        return repository.findAll().stream()
                .filter(h -> h.getUsuarioId() != null && h.getUsuarioId().equals(usuarioId))
                .collect(Collectors.toList());
    }
    public HistorialMedico guardar(HistorialMedico historial) { return repository.save(historial); }
}