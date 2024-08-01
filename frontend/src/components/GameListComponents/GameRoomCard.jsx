import { Link } from "react-router-dom";
import styles from "./GameRoomCard.module.css";
import axios from "axios";

const GameRoomCard = ({ title, leader, progress, isInProgress, id }) => {

    const enterRoom = () => {
        if (isInProgress){
            alert("이미 진행중인 방입니다.");
            return;
        }

        getToken();
    }

    const getToken = () => {
        axios
            .post("https://i11e106.p.ssafy.io/openvidu/text-chat/api/session/join",
                {
                headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({"userId": "ssafy", "sessionNo": id})
                })
            .then(({data}) => {
                setToken(data.token);
                setGameInfo(game);
            })
            .catch(({response}) => {
                window.location.reload();
            });
    };

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

