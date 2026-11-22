package cl.veterinaria.sm.controller;

import cl.veterinaria.sm.model.HistorialMedico;
import cl.veterinaria.sm.service.HistorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/historiales")
@CrossOrigin(origins = "*")
public class HistorialController {
    @Autowired
    private HistorialService service;

    @GetMapping
    public List<HistorialMedico> listarTodos() { return service.obtenerTodos(); }

    @GetMapping("/usuario/{usuarioId}")
    public List<HistorialMedico> listarPorUsuario(@PathVariable Long usuarioId) { return service.obtenerPorUsuario(usuarioId); }

    @PostMapping
    public HistorialMedico crear(@RequestBody HistorialMedico historial) { return service.guardar(historial); }
}