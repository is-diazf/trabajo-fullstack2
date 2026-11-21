package cl.vet.Micro_Contacto.service;

import org.springframework.stereotype.Service;

import cl.vet.Micro_Contacto.model.Contacto;
import cl.vet.Micro_Contacto.repository.ContactoRepository;

import java.util.List;

@Service 
public class ContactoService {
    private final ContactoRepository repository;
    
    public ContactoService(ContactoRepository repository) {
        this.repository = repository;
    }

    public Contacto guardar(Contacto contacto) {
        contacto.setId(null);
        contacto.setEstado("PENDIENTE");
        return repository.save(contacto);
    }

    public List<Contacto> listar() {
        return repository.findAll();
    }
}
