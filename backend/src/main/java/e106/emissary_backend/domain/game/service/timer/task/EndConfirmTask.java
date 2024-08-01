package e106.emissary_backend.domain.game.service.timer.task;

import e106.emissary_backend.domain.game.service.GameService;
import e106.emissary_backend.domain.game.service.subscriber.message.EndConfirmMessage;
import e106.emissary_backend.domain.game.service.subscriber.message.EndVoteMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EndConfirmTask implements GameTask {
    private Long gameId;

    private final GameService gameService;

    @Override
    public void run() {
        execute(gameId);
    }

    @Override
    public void execute(Long gameId) {
        // todo : vote 종료 로직 구현
        // todo : 투표 결과를 EndVoteMessage에 담아서 내려보내야함.
        // todo : 이거 그냥 바로 service로 넘길까? 그래야 publish를 한번에 처리하기가 좋고 schedule 예약하기가 좋음
        // todo : 게임 상태도 confirm으로 바꿔줘야함
        gameService.endConfirm(EndConfirmMessage.builder().gameId(gameId).build());
    }

    public void setGameId(long gameId){
        this.gameId = gameId;
    }

}
