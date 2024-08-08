import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./GameRoomCard.module.css";

const GameRoomCard = ({ title, leader, progress, isInProgress, id }) => {
    console.log('여기까지 왔어')
    const [ gameData, setGameData ] = useState({})


    // const getGameRoomInfo = async() => {
    //     try {
    //         const access = localStorage.getItem('access')
    //         const response = await axios.get(`https://i11e106.p.ssafy.io/api/rooms/${id}`, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${access}`,
    //             }
    //         })
    //         console.log('얘는 리스폰스',response.data)
    //         setGameData(response.data)
    //     } catch (error) {
    //         console.log("게임방 API를 불러오지 못했습니다", error)
    //     }
    // }

    // useEffect(() => {
    //     console.log(gameData)
    // }, [gameData])



    return (
        // <div className="kimjungchul-bold" onClick={getGameRoomInfo}>
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

