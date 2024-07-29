package e106.emissary_backend.domain.game.mapper;

import e106.emissary_backend.domain.game.model.Game;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface GameDaoMapper {
    GameDaoMapper INSTANCE = Mappers.getMapper(GameDaoMapper.class);

}
