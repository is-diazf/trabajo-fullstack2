package cl.sanmarcos.shop.controller;

import cl.sanmarcos.shop.service.InsufficientStockException;
import cl.sanmarcos.shop.service.ResourceNotFoundException;
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

	@ExceptionHandler({MethodArgumentNotValidException.class, HttpMessageNotReadableException.class,
			IllegalArgumentException.class})
	public ResponseEntity<ApiError> badRequest(Exception exception) {
		String message = exception instanceof MethodArgumentNotValidException validationException
				? validationException.getBindingResult().getFieldErrors().stream()
						.findFirst()
						.map(error -> error.getField() + ": " + error.getDefaultMessage())
						.orElse("La solicitud contiene datos inválidos")
				: exception instanceof IllegalArgumentException
						? exception.getMessage()
						: "El cuerpo de la solicitud no es válido";
		return response(HttpStatus.BAD_REQUEST, message);
	}

	private ResponseEntity<ApiError> response(HttpStatus status, String message) {
		return ResponseEntity.status(status).body(new ApiError(status.value(), status.getReasonPhrase(), message));
	}

	public record ApiError(int status, String error, String message) {
	}
}
