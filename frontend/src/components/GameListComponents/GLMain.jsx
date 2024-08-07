import { useState, useEffect } from 'react'
import axios from 'axios';
import GameRoomCard from "./GameRoomCard";
import styles from "./GLMain.module.css";

const GLMain = () => {
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('https://i11e106.p.ssafy.io/api/rooms')
                console.log(response.data)
                setRooms(response.data)
            } catch (error) {
                console.error("Failed to fetch rooms :", error)
            }
        }

        fetchRooms()
    })


    return (
        <div className={styles.container}>
            {rooms.map((room) => (
                <div className={styles.cardWrapper} key={room.id}>
                    <GameRoomCard
                        id={room.id}
                        title={room.title}
                        ownerName={room.ownerName}
                        progress={room.progress}
                        inInProgress={room.isInProgress}
                    />
                </div>
            ))}

            {/* 

            <div className={styles.cardWrapper}>
                <GameRoomCard id="1" title="고국으로" leader="강진" progress={7} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="2" title="대한의 독립을 위하여" leader="수빈" progress={6} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="3" title="고향의 푸른 산하" leader="최진" progress={8} isInProgress={true} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="1" title="고국으로" leader="강진" progress={7} isInProgress={false} />
            </div>
            <div className={styles.cardWrapper}>
                <GameRoomCard id="2" title="대한의 독립을 위하여" leader="수빈" progress={6} isInProgress={false} />
            </div>
            

            필요 시 더 많은 카드 추가 */}
        </div>
    );
};

export default GLMain;
