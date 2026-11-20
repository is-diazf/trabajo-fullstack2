package cl.vet.Micro_Usuario.dto;

import cl.vet.Micro_Usuario.model.Usuario;

public record UsuarioResponse(Long id, String nombre, String correo, boolean admin) {

    public static UsuarioResponse desde(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getCorreo(), usuario.isAdmin());
    }
}
