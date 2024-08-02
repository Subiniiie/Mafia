package e106.emissary_backend.global.error;

import e106.emissary_backend.global.error.exception.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionAdvice {

    @ExceptionHandler
    public ResponseEntity<Object> notFoundUser(NotFoundUserException e) {
        ErrorCode errorCode = e.getErrorCode();
        return handleExceptionInternal(errorCode);
    }

    @ExceptionHandler
    public ResponseEntity<Object> notFoundRoom(NotFoundRoomException e) {
        ErrorCode errorCode = e.getErrorCode();
        return handleExceptionInternal(errorCode);
    }

    @ExceptionHandler
    public ResponseEntity<Object> notFoundGame(NotFoundGameException e) {
        ErrorCode errorCode = e.getErrorCode();
        return handleExceptionInternal(errorCode);
    }

    @ExceptionHandler
    public ResponseEntity<Object> alreadyExistUser(AlreadyExistUserException e) {
        ErrorCode errorCode = e.getErrorCode();
        return handleExceptionInternal(errorCode);
    }


    @ExceptionHandler
    public ResponseEntity<Object> alreadyUserInRoom(AlreadyUserInRoomException e) {
        ErrorCode errorCode = e.getErrorCode();
        return handleExceptionInternal(errorCode);
    }

    @ExceptionHandler
    public ResponseEntity<Object> gameFull(GameFullException e) {
        ErrorCode errorCode = e.getErrorCode();
        return handleExceptionInternal(errorCode);
    }

    @ExceptionHandler
    public ResponseEntity<Object> alreadyUseAppease(AlreadyUseAppeaseException e) {
        ErrorCode errorCode = e.getErrorCode();
        return handleExceptionInternal(errorCode);
    }

    @ExceptionHandler
    public ResponseEntity<Object> alreadyRemoveUser(AlreadyRemoveUserException e) {
        ErrorCode errorCode = e.getErrorCode();
        return handleExceptionInternal(errorCode);
    }

    @ExceptionHandler
    public ResponseEntity<Object> emissaryKill(EmissaryKillException e) {
        ErrorCode errorCode = e.getErrorCode();
        return handleExceptionInternal(errorCode);
    }

    @ExceptionHandler
    public ResponseEntity<Object> alreadyDetectUser(AlreadyDetectUserException e) {
        ErrorCode errorCode = e.getErrorCode();
        return handleExceptionInternal(errorCode);
    }

    @ExceptionHandler
    public ResponseEntity<Object> emissaryAppeaseEmissary(EmissaryAppeaseEmissaryException e) {
        ErrorCode errorCode = e.getErrorCode();
        return handleExceptionInternal(errorCode);
    }

    private ResponseEntity<Object> handleExceptionInternal(ErrorCode errorCode) {
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(ErrorDto.builder()
                        .code(errorCode.name())
                        .message(errorCode.getMessage())
                        .build());
    }
}
