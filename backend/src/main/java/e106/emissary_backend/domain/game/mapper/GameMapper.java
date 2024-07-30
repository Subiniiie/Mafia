package e106.emissary_backend.domain.game.mapper;

import e106.emissary_backend.domain.game.entity.Game;
import e106.emissary_backend.domain.game.model.GameDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface GameMapper {
    GameMapper INSTANCE = Mappers.getMapper(GameMapper.class);
    Game toGame(GameDTO gameDTO);
//    MessageListServiceDto toMessageListServiceDto(String messageId, Integer count, RequestDto requestDto);
    GameDTO toGameDTO(Game game);
}
