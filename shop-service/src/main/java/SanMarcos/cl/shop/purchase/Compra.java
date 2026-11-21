package SanMarcos.cl.shop.purchase;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "compras")
public class Compra {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "usuario_id", nullable = false)
	private Long usuarioId;

	@Column(nullable = false, precision = 14, scale = 2)
	private BigDecimal total;

	@Column(name = "creada_en", nullable = false)
	private Instant creadaEn;

	@OneToMany(mappedBy = "compra", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CompraDetalle> items = new ArrayList<>();

	protected Compra() {
	}

	public Compra(Long usuarioId) {
		this.usuarioId = usuarioId;
		this.creadaEn = Instant.now();
		this.total = BigDecimal.ZERO;
	}

	public void addItem(CompraDetalle item) {
		items.add(item);
		item.setCompra(this);
	}

	public Long getId() {
		return id;
	}

	public Long getUsuarioId() {
		return usuarioId;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	public Instant getCreadaEn() {
		return creadaEn;
	}

	public List<CompraDetalle> getItems() {
		return items;
	}
}
