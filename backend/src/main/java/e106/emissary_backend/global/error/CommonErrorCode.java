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
    NOT_FOUND_ROOM_EXCEPTION(HttpStatus.NO_CONTENT, "Room Not Found Error"),
    NOT_FOUND_GAME_EXCEPTION(HttpStatus.NO_CONTENT, "Game Not Found Error"),
    ALREADY_EXIST_USER_EXCEPTION(HttpStatus.CONFLICT, "Already Exist User Error"),
    ALREADY_USE_APPEASE_EXCEPTION(HttpStatus.CONFLICT, "Already Use Appease Error"),
    ALREADY_REMOVE_USER_EXCEPTION(HttpStatus.CONFLICT, "Already Remove User Error"),
    EMISSARY_KILL_EXCEPTION(HttpStatus.CONFLICT, "You Can't Kill Emissary Error"),
    GAME_FULL_EXCEPTION(HttpStatus.CONFLICT, "Game Not Found Error");

    private final HttpStatus httpStatus;
    private String message;
}
