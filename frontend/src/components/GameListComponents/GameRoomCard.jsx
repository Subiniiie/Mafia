import { Link } from "react-router-dom";
import styles from "./GameRoomCard.module.css";

const GameRoomCard = ({ title, leader, progress, isInProgress, id }) => {
    return (
        <div className="kimjungchul-bold">
            <Link to={`/game-room/${id}`} className={`${isInProgress ? styles.inProgress : styles.notStarted}`}>
                <div className={`${styles.cardMain} ${isInProgress ? styles.inProgressMain : styles.notStartedMain}`}>
                    {/* <p className={styles.title}>{title}</p> */}
                    <p className={`${isInProgress ? styles.inProgressTitle : styles.notStartedTitle}`}>{title}</p>
                    <p className={styles.leader}>대장 동지 : {leader}</p>
                </div>
                {/* <div className={styles.cardContent}> */}
                <div className={`${styles.cardMain} ${isInProgress ? styles.inProgressContent : styles.notStartedContent}`}>
                    <p className={styles.progress}>{progress}/8</p>
                </div>
            </Link>
        </div>
    );
};

export default GameRoomCard;

