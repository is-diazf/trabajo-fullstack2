package cl.vet.Micro_Contacto.controller;

import cl.vet.Micro_Contacto.model.Contacto;
import cl.vet.Micro_Contacto.service.ContactoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController 
@RequestMapping ("/api/contactos")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactoController {

    private final ContactoService service;

    public ContactoController(ContactoService service) {
        this.service = service;
    }

    @PostMapping 
    public ResponseEntity<Contacto> guardar(@Valid @RequestBody Contacto contacto) {

        Contacto guardado = service.guardar(contacto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(guardado);
    }

    @GetMapping 
    public List<Contacto> listar(){
        return service.listar();
    }
}
