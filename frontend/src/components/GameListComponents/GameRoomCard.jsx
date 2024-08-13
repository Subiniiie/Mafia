import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./GameRoomCard.module.css";

const GameRoomCard = ({ id, title, leader, progress, isInProgress, password, isPrivate }) => {
    // const [gameData, setGameData] = useState({})
    const [viduToken, setViduToken] = useState("");
    const navigate = useNavigate();



    // 입장 시 로직 변경
    const handleEnterRoom = async (e) => {
        e.preventDefault();
        console.log("isPrivate", isPrivate)

        // 현재 입장 인원이 8명이면 입장 불가능, 안내 메시지 띄우기
        if (progress === 8) {
            alert("방이 가득 찼습니다. 더 이상 입장할 수 없습니다.")
            return;
        }

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


    return (
        <Link to={`/game-room/${id}`} state={viduToken} onClick={handleEnterRoom} >
            <div className={`${isInProgress ? styles.inProgress : styles.notStarted}`}>
                <div className={`${styles.cardMain} ${isInProgress ? styles.inProgressMain : styles.notStartedMain}`}>
                    <p className={`${isInProgress ? styles.inProgressTitle : styles.notStartedTitle}`}>{title}</p>
                    <p className={styles.leader}>대장 동지 : {leader}</p>
                </div>
                <div className={`${styles.cardMain} ${isInProgress ? styles.inProgressContent : styles.notStartedContent}`}>
                    <p className={styles.progress}>
                        {progress}/8
                        {isPrivate && <span>극비 임무</span>}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default GameRoomCard;

