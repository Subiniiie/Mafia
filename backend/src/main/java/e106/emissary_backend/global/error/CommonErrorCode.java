package e106.emissary_backend.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
@AllArgsConstructor
public enum CommonErrorCode implements ErrorCode{

    NOT_FOUND_USER_EXCEPTION(HttpStatus.NO_CONTENT, "User Not Found Error"),
    NOT_FOUND_ROOM_EXCEPTION(HttpStatus.NO_CONTENT, "Room Not Found Error");

    private final HttpStatus httpStatus;
    private String message;
}
