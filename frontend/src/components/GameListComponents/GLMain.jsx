import { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import classNames from "classnames"
import GameRoomCard from "./GameRoomCard";
import styles from "./GLMain.module.css";

const GLMain = ({ setViduToken, checkPublic, checkPrivate, checkCanEnter, search, triggerSearch }) => {
    const [rooms, setRooms] = useState([])

    const GLMainClass = classNames('kimjungchul-bold', styles.container)

    // 방 목록을 가져오는 함수 정의
    const fetchRooms = useCallback(async () => {
        try {
            const access = localStorage.getItem('access')
            let response

            // 필터링 여부에 따라 API 엔드포인트 결정
            let filter1 = checkPublic ? 'true' : 'false'
            let filter2 = checkPrivate ? 'true' : 'false'
            const filter3 = checkCanEnter ? 'true' : 'false'

            // filter1과 filter2가 둘 다 true이면 둘 다 false로 변경
            if (filter1 === 'true' && filter2 === 'true') {
                filter1 = 'false'
                filter2 = 'false'
            }

            const filterUrl = `https://i11e106.p.ssafy.io/api/rooms/filter?filter1=${filter1}&filter2=${filter2}&filter3=${filter3}&search=${encodeURIComponent(search)}&page=0&size=200`;

            response = await axios.get(filterUrl, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                }
            })

            setRooms(response.data)
        } catch (error) {
            console.log("Failed to fetch rooms :", error)
        }
    }, [checkPublic, checkPrivate, checkCanEnter, search]) // 필터와 검색어가 변경될 때마다 함수가 업데이트

    // 초기 로딩 시 필터 상태에 따른 방 목록 가져오기
    useEffect(() => {
        fetchRooms()
    }, [checkPublic, checkPrivate, checkCanEnter, triggerSearch]) // 필터 또는 트리거가 변경될 때만 호출

    return (
        <>
            <div className={GLMainClass}>
                {rooms.map((room) => (
                    <div className={styles.cardWrapper} key={room.roomId}>
                        <GameRoomCard
                            id={room.roomId}
                            title={room.title}
                            leader={room.ownerName}
                            progress={room.nowPlayer}
                            inInProgress={room.maxPlayer}
                            setViduToken={setViduToken}
                            password={room.password}
                            isPrivate={room.private}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default GLMain;
