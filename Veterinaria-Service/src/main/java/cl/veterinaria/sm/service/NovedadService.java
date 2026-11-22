package cl.veterinaria.sm.service;

import cl.veterinaria.sm.model.Novedad;
import cl.veterinaria.sm.repository.NovedadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NovedadService {
    @Autowired
    private NovedadRepository repository;

    public List<Novedad> obtenerTodas() { return repository.findAll(); }
    public Novedad guardar(Novedad novedad) { return repository.save(novedad); }
    public Novedad actualizar(Long id, Novedad datos) {
        Novedad n = repository.findById(id).orElseThrow();
        n.setTitulo(datos.getTitulo());
        n.setResumen(datos.getResumen());
        n.setDetalle(datos.getDetalle());
        n.setImagen(datos.getImagen());
        return repository.save(n);
    }
    public void eliminar(Long id) { repository.deleteById(id); }
}