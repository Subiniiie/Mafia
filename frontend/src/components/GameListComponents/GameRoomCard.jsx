import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./GameRoomCard.module.css";

const GameRoomCard = ({ id, title, leader, progress, isInProgress }) => {
    const [gameData, setGameData] = useState({})

    const getGameRoomInfo = async () => {
        console.log('GameRoomCard 를 클릭했구나!')
        try {
            const access = localStorage.getItem('access')
            // const body = {
            //     roomId: id,
            // }
            // console.log('body :', body)
            const response = await axios.post(`https://i11e106.p.ssafy.io/api/rooms/${id}`, JSON.stringify(), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                }
            })
            console.log('POST 요청에 대한 response :', response)
            console.log('POST 요청에 대한 response.data :', response.data)
            setGameData(response.data)
        } catch (error) {
            console.log("게임방 API를 불러오지 못했습니다", error)
        }
    }

    useEffect(() => {
        console.log(gameData)
    }, [gameData])



    return (
        // <div className="kimjungchul-bold" onClick={getGameRoomInfo}>
        <div className="kimjungchul-bold">
            <div className={`${isInProgress ? styles.inProgress : styles.notStarted}`} onClick={getGameRoomInfo}>
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
                {/* </Link> */}
            </div>
        </div>
    );
};

export default GameRoomCard;

