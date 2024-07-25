import styles from "./GameRoomCard.module.css"

const GameRoomCard = () => {

    return (
        <div className={styles.cardContainer}>
            <div>
                <p>방 제목</p>
                <p>대장 동지 : 강진</p>
            </div>
            <p>7/8</p>
        </div>
    );
};

export default GameRoomCard