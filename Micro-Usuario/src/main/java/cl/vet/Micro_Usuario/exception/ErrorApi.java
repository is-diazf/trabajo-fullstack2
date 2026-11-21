package cl.vet.Micro_Usuario.exception;

import org.springframework.http.HttpStatus;

public class ErrorApi extends RuntimeException {

    private final HttpStatus estado;

    public ErrorApi(HttpStatus estado, String mensaje) {
        super(mensaje);
        this.estado = estado;
    }

    public HttpStatus getEstado() {
        return estado;
    }
}
