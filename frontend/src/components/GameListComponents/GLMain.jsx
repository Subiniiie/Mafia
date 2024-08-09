import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GameRoomCard from "./GameRoomCard";
import styles from "./GLMain.module.css";

const GLMain = ({setViduToken}) => {
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const access = localStorage.getItem('access')
                const response = await axios.get('https://i11e106.p.ssafy.io/api/rooms', {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access}`,
                    }
                })
                console.log(response.data)
                setRooms(response.data)
            } catch (error) {
                console.error("Failed to fetch rooms :", error)
            }
        }

        fetchRooms()
    }, [])


    return (
        <div className={styles.container}>
            {rooms.map((room) => (
                // <div className={styles.cardWrapper} key={room.roomId}>
                <div className={styles.cardWrapper} key={room.id}>
                    <GameRoomCard
                        id={room.roomId}
                        title={room.title}
                        leader={room.ownerName}
                        progress={room.nowPlayer}
                        inInProgress={room.maxPlayer}
                        setViduToken={setViduToken}
                    />
                </div>
            ))}
        </div>
    );
};

export default GLMain;
