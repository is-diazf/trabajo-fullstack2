package cl.veterinaria.sm.controller;

import cl.veterinaria.sm.model.Novedad;
import cl.veterinaria.sm.service.NovedadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/novedades")
@CrossOrigin(origins = "*")
public class NovedadController {
    @Autowired
    private NovedadService service;

    @GetMapping
    public List<Novedad> listar() { return service.obtenerTodas(); }
    @PostMapping
    public Novedad crear(@RequestBody Novedad novedad) { return service.guardar(novedad); }
    @PutMapping("/{id}")
    public Novedad actualizar(@PathVariable Long id, @RequestBody Novedad novedad) { return service.actualizar(id, novedad); }
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}