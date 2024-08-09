import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./GameRoomCard.module.css";

const GameRoomCard = ({ id, title, leader, progress, isInProgress }) => {
    const [gameData, setGameData] = useState({})

    const getGameRoomInfo = async () => {
        console.log('GameRoomCard 를 클릭했구나!')
        try {
            const access = localStorage.getItem('access')
            const body = {
                id: id,
            }
            // console.log('body :', body)
            const response = await axios.post(`https://i11e106.p.ssafy.io/api/rooms/${id}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                }
            })
            console.log('POST 요청에 대한 response :', response)
            console.log('POST 요청에 대한 response.data :', response.data)
            setGameData(response.data)
        } catch (error) {
            console.log("나 못 가", error)
        }
    }

    useEffect(() => {
        console.log('안녕 너와?????', gameData)
    }, [gameData])



    return (
        // <div className="kimjungchul-bold" onClick={getRoomPlayer}>
        <div className="kimjungchul-bold">
            <Link to={`/game-room/${id}`}>
                <div className={`${isInProgress ? styles.inProgress : styles.notStarted}`} onClick={getGameRoomInfo}>
                    <div className={`${styles.cardMain} ${isInProgress ? styles.inProgressMain : styles.notStartedMain}`}>
                        <p className={`${isInProgress ? styles.inProgressTitle : styles.notStartedTitle}`}>{title}</p>
                        <p className={styles.leader}>대장 동지 : {leader}</p>
                    </div>
                    <div className={`${styles.cardMain} ${isInProgress ? styles.inProgressContent : styles.notStartedContent}`}>
                        <p className={styles.progress}>{progress}/8</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default GameRoomCard;

