import GameRoomCard from "./GameRoomCard";
import styles from "./GLMain.module.css";
import axios from "axios";
import React, {useEffect, useState ,useRef} from "react";

const GLMain = ({setViduToken, setState}) => {

    const getGameList = (maxPlayer, isPublic) => {
      axios.get("https://i11e106.p.ssafy.io/api/game",{
        headers: { Authorization: `Bearer accessToken`},
        params: {maxPlayer: maxPlayer, maxPlayerId: maxPlayer},
      })
        .then(({data}) => {
          console.log(data);

        })
        .catch(({response}) => {
          // err
        });
    };

    useEffect(() => {
      // getGameList(); //ToDo: 로그인 완료 시 살리기
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="1" title="고국으로" leader="강진" progress={7} isInProgress={false} setViduToken={setViduToken}/>
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="2" title="대한의 독립을 위하여" leader="수빈" progress={6} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="3" title="고향의 푸른 산하" leader="최진" progress={8} isInProgress={true} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="1" title="고국으로" leader="강진" progress={7} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="2" title="대한의 독립을 위하여" leader="수빈" progress={6} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="3" title="고향의 푸른 산하" leader="최진" progress={8} isInProgress={true} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="1" title="고국으로" leader="강진" progress={7} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="2" title="대한의 독립을 위하여" leader="수빈" progress={6} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="3" title="고향의 푸른 산하" leader="최진" progress={8} isInProgress={true} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="1" title="고국으로" leader="강진" progress={7} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="2" title="대한의 독립을 위하여" leader="수빈" progress={6} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="3" title="고향의 푸른 산하" leader="최진" progress={8} isInProgress={true} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="1" title="고국으로" leader="강진" progress={7} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="2" title="대한의 독립을 위하여" leader="수빈" progress={6} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="3" title="고향의 푸른 산하" leader="최진" progress={8} isInProgress={true} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="1" title="고국으로" leader="강진" progress={7} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="2" title="대한의 독립을 위하여" leader="수빈" progress={6} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="3" title="고향의 푸른 산하" leader="최진" progress={8} isInProgress={true} />
            </div>
            {/* 필요 시 더 많은 카드 추가 */}
        </div>
    );
};

export default GLMain;
