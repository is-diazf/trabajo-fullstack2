package cl.veterinaria.sm.service;

import cl.veterinaria.sm.model.Servicio;
import cl.veterinaria.sm.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServicioService {
    @Autowired
    private ServicioRepository repository;

    public List<Servicio> obtenerTodos() { return repository.findAll(); }
    public Servicio guardar(Servicio servicio) { return repository.save(servicio); }
    public Servicio actualizar(Long id, Servicio datos) {
        Servicio s = repository.findById(id).orElseThrow();
        s.setTitulo(datos.getTitulo());
        s.setDescripcion(datos.getDescripcion());
        s.setPrecio(datos.getPrecio());
        s.setImagen(datos.getImagen());
        return repository.save(s);
    }
    public void eliminar(Long id) { repository.deleteById(id); }
}