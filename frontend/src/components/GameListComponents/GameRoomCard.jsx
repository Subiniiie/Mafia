import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./GameRoomCard.module.css";

const GameRoomCard = ({ title, leader, progress, isInProgress, id }) => {

    // // 방 입장하기
    // const getRoomPlayer = async() => {
    //     console.log('나 들어간다!', id)
        
    //     try { 
    //         const access = localStorage.getItem('access')
    //         const response = await axios.post(`https://i11e106.p.ssafy.io/api/rooms/${id}`,{},{
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${access}`,
    //             },
    //         })

    //         console.log('나 방 잘 들어왔어!', response.data);
    //     } catch (error) {
    //         console.log('나 방에 못 들어왔어', error)
    //     }
    // }

    return (
        // <div className="kimjungchul-bold" onClick={getRoomPlayer}>
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

