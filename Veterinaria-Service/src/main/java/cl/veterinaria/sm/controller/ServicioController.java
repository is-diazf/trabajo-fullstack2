package cl.veterinaria.sm.controller;

import cl.veterinaria.sm.model.Servicio;
import cl.veterinaria.sm.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {
    @Autowired
    private ServicioService service;

    @GetMapping
    public List<Servicio> listar() { return service.obtenerTodos(); }
    @PostMapping
    public Servicio crear(@RequestBody Servicio servicio) { return service.guardar(servicio); }
    @PutMapping("/{id}")
    public Servicio actualizar(@PathVariable Long id, @RequestBody Servicio servicio) { return service.actualizar(id, servicio); }
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}