import { Link } from "react-router-dom";
import styles from "./GameRoomCard.module.css";
import axios from "axios";

const GameRoomCard = ({ title, leader, progress, isInProgress, id , setToken}) => {

    const handleClickRoom = () => {
      enterRoom();
    }

    const enterRoom = () => {
        // 게임 진행중일 때 return

      getToken();
    }

    const getToken = () => {
        axios
            .post("https://i11e106.p.ssafy.io/openvidu/text-chat/api/session/join",
              JSON.stringify({userId: "ssafy", sessionNo: id}),
              {headers: {'Content-type': 'application/json'}
                })
            .then((response) => {
                console.log("Successfully Getting Token");
                setToken(response.data.token);
            })
            .catch((error) => {
              console.log(error);
                // window.location.reload();
            });
    };

    return (
        <div className="kimjungchul-bold">
            <Link to={`/game-room/${id}`} className={`${isInProgress ? styles.inProgress : styles.notStarted}`} onClick={handleClickRoom}>
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

