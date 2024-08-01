import GameRoomCard from "./GameRoomCard";
import styles from "./GLMain.module.css";
import axios from "axios";

const GLMain = () => {
    return (
        <div className={styles.container}>
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
