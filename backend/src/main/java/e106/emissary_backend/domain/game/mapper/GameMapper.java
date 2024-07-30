package e106.emissary_backend.domain.game.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface GameDaoMapper {
    GameDaoMapper INSTANCE = Mappers.getMapper(GameDaoMapper.class);

}
