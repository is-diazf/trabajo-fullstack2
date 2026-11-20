package SanMarcos.cl.shop.purchase;

import SanMarcos.cl.shop.product.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiError> notFound(ResourceNotFoundException exception) {
		return response(HttpStatus.NOT_FOUND, exception.getMessage());
	}

	@ExceptionHandler(InsufficientStockException.class)
	public ResponseEntity<ApiError> insufficientStock(InsufficientStockException exception) {
		return response(HttpStatus.CONFLICT, exception.getMessage());
	}

	@ExceptionHandler(InvalidPurchaseException.class)
	public ResponseEntity<ApiError> invalidPurchase(InvalidPurchaseException exception) {
		return response(HttpStatus.BAD_REQUEST, exception.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> invalidRequest(MethodArgumentNotValidException exception) {
		String message = exception.getBindingResult().getFieldErrors().stream()
				.findFirst()
				.map(error -> error.getField() + ": " + error.getDefaultMessage())
				.orElse("La solicitud contiene datos inválidos");
		return response(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiError> unreadableRequest() {
		return response(HttpStatus.BAD_REQUEST, "El cuerpo de la solicitud no es válido");
	}

	private ResponseEntity<ApiError> response(HttpStatus status, String message) {
		return ResponseEntity.status(status).body(new ApiError(status.value(), status.getReasonPhrase(), message));
	}

	public record ApiError(int status, String error, String message) {
	}
}
