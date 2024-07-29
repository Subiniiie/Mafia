import { Link } from "react-router-dom";
import styles from "./GameRoomCard.module.css";

const GameRoomCard = ({ title, leader, progress, isInProgress, id }) => {
    return (
        <div>
            <Link to={`/game-room/${id}`} className={`${styles.card} ${isInProgress ? styles.inProgress : styles.notStarted}`}>
                <div>
                    <p className={styles.title}>{title}</p>
                    <p className={styles.leader}>대장 동지 : {leader}</p>
                </div>
                <p className={styles.progress}>{progress}/8</p>
            </Link>
        </div>
    );
};

export default GameRoomCard;

