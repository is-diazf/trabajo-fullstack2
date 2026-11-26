package cl.veterinaria.sm.config;

import cl.veterinaria.sm.model.Novedad;
import cl.veterinaria.sm.model.Servicio;
import cl.veterinaria.sm.repository.NovedadRepository;
import cl.veterinaria.sm.repository.ServicioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Carga los servicios y novedades iniciales del sitio (los que antes estaban fijos en el
 * frontend) cuando sus tablas están vacías. Se desactiva con
 * {@code app.contenido-inicial.enabled=false}.
 */
@Component
@ConditionalOnProperty(name = "app.contenido-inicial.enabled", havingValue = "true", matchIfMissing = true)
public class ContenidoInicial implements CommandLineRunner {

    private final ServicioRepository servicios;
    private final NovedadRepository novedades;

    public ContenidoInicial(ServicioRepository servicios, NovedadRepository novedades) {
        this.servicios = servicios;
        this.novedades = novedades;
    }

    @Override
    public void run(String... args) {
        if (servicios.count() == 0) {
            servicios.save(servicio("Esterilización de mascotas",
                    "Servicio de esterilización para mascotas, incluye anestesia y recuperación",
                    30000, "/img/esterilizacion.jpeg"));
            servicios.save(servicio("Perruquería",
                    "Peluquería de mascotas, corte y baño",
                    25000, "/img/perruqueria.jpg"));
        }

        if (novedades.count() == 0) {
            novedades.save(novedad("Nueva campaña de vacunación",
                    "Protege a tu mascota contra la rabia y otras enfermedades.",
                    "Durante todo el mes de mayo, tendremos un 20% de descuento en la vacuna antirrábica y la vacuna séxtuple. ¡No dejes pasar esta oportunidad de cuidar a tu mejor amigo!",
                    "/img/esterilizacion.jpeg"));
            novedades.save(novedad("Horario extendido los sábados",
                    "Ahora atendemos hasta las 18:00 hrs los fines de semana.",
                    "Sabemos que la semana es agitada, por eso hemos extendido nuestro horario de atención los días sábados. Podrás traer a tu mascota a consulta o peluquería hasta las 18:00 hrs.",
                    "/img/perruqueria.jpg"));
            novedades.save(novedad("Llegaron los nuevos juguetes",
                    "Visita nuestra tienda y encuentra lo mejor para tu mascota.",
                    "Tenemos una nueva colección de juguetes interactivos y camas súper cómodas para perros y gatos. ¡Ven a conocerlos!",
                    "/img/juguetes_mascotas.jpg"));
        }
    }

    private static Servicio servicio(String titulo, String descripcion, int precio, String imagen) {
        Servicio servicio = new Servicio();
        servicio.setTitulo(titulo);
        servicio.setDescripcion(descripcion);
        servicio.setPrecio(precio);
        servicio.setImagen(imagen);
        return servicio;
    }

    private static Novedad novedad(String titulo, String resumen, String detalle, String imagen) {
        Novedad novedad = new Novedad();
        novedad.setTitulo(titulo);
        novedad.setResumen(resumen);
        novedad.setDetalle(detalle);
        novedad.setImagen(imagen);
        return novedad;
    }
}
