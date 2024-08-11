import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./GameRoomCard.module.css";

const GameRoomCard = ({ id, title, leader, progress, isInProgress }) => {
    const [gameData, setGameData] = useState({})
    const [viduToken, setViduToken] = useState("");
    const navigate = useNavigate();

    // 입장 시 로직 변경
    const handleEnterRoom = async (e) => {
        e.preventDefault();
        const access = localStorage.getItem('access');
        await axios.post(`https://i11e106.p.ssafy.io/api/rooms/${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access}`,
            }
        }).then((resp) => {
            console.log(resp);
            navigate(`/game-room/${id}`, { state: resp.data.token });
        }).catch((err) => {
            console.error(err);
        })
    }

    useEffect(() => {
        console.log('안녕 너와?????', gameData)
    }, [gameData])



    return (
        // <div className="kimjungchul-bold" onClick={getRoomPlayer}>
        <div className="kimjungchul-bold">
            <Link to={`/game-room/${id}`} state={viduToken} onClick={handleEnterRoom} >
                {/*<div className={`${isInProgress ? styles.inProgress : styles.notStarted}`} onClick={getGameRoomInfo}*/}
                <div className={`${isInProgress ? styles.inProgress : styles.notStarted}`}>
                    {/* <Link to={`/game-room/${id}`} className={`${isInProgress ? styles.inProgress : styles.notStarted}`}> */}
                    <div className={`${styles.cardMain} ${isInProgress ? styles.inProgressMain : styles.notStartedMain}`}>
                        {/* <p className={styles.title}>{title}</p> */}
                        <p className={`${isInProgress ? styles.inProgressTitle : styles.notStartedTitle}`}>{title}</p>
                        <p className={styles.leader}>대장 동지 : {leader}</p>
                    </div>
                    {/* <div className={styles.cardContent}> */}
                    <div className={`${styles.cardMain} ${isInProgress ? styles.inProgressContent : styles.notStartedContent}`}>
                        <p className={styles.progress}>{progress}/8</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default GameRoomCard;

