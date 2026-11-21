package SanMarcos.cl.shop.purchase;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "compra_items")
public class CompraDetalle {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "compra_id", nullable = false)
	private Compra compra;

	@Column(name = "producto_id", nullable = false)
	private Long productoId;

	@Column(name = "nombre_producto", nullable = false, length = 120)
	private String nombreProducto;

	@Column(nullable = false)
	private int cantidad;

	@Column(name = "precio_unitario", nullable = false, precision = 12, scale = 2)
	private BigDecimal precioUnitario;

	protected CompraDetalle() {
	}

	public CompraDetalle(Long productoId, String nombreProducto, int cantidad, BigDecimal precioUnitario) {
		this.productoId = productoId;
		this.nombreProducto = nombreProducto;
		this.cantidad = cantidad;
		this.precioUnitario = precioUnitario;
	}

	void setCompra(Compra compra) {
		this.compra = compra;
	}

	public Long getProductoId() {
		return productoId;
	}

	public String getNombreProducto() {
		return nombreProducto;
	}

	public int getCantidad() {
		return cantidad;
	}

	public BigDecimal getPrecioUnitario() {
		return precioUnitario;
	}

	public BigDecimal getSubtotal() {
		return precioUnitario.multiply(BigDecimal.valueOf(cantidad));
	}
}
