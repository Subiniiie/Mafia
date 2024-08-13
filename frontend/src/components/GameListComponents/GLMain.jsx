import { useState, useEffect } from 'react'
import axios from 'axios';
import classNames from "classnames"
import GameRoomCard from "./GameRoomCard";
import styles from "./GLMain.module.css";

const GLMain = ({ setViduToken, checkPublic, checkPrivate, checkCanEnter }) => {
    const [rooms, setRooms] = useState([])

    const GLMainClass = classNames('kimjungchul-bold', styles.container)

    // useEffect(() => {
    //     const fetchRooms = async () => {
    //         try {
    //             const access = localStorage.getItem('access')
    //             const response = await axios.get('https://i11e106.p.ssafy.io/api/rooms?page=0&size=20', {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Authorization": `Bearer ${access}`,
    //                 }
    //             })

    //             setRooms(response.data)
    //             console.log(rooms)

    //         } catch (error) {
    //             console.error("Failed to fetch rooms :", error)
    //         }
    //     }

    //     fetchRooms()
    // }, [])


    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const access = localStorage.getItem('access')
                let response

                // 필터링 여부에 따라 API 엔드포인트 결정
                if (checkPublic || checkPrivate || checkCanEnter) {
                    // 하나 이상의 필터가 체크된 경우
                    const filter1 = checkPublic ? 'true' : 'false'
                    const filter2 = checkPrivate ? 'true' : 'false'
                    const filter3 = checkCanEnter ? 'true' : 'false'
                    const search = '' // 필요에 따라 검색 문자열 추가 가능

                    const filterUrl = `https://i11e106.p.ssafy.io/api/rooms/filter?filter1=${filter1}&filter2=${filter2}&filter3=${filter3}&search=${search}`;

                    response = await axios.get(filterUrl, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${access}`,
                        }
                    })
                } else {
                    // 모든 필터가 해제된 경우
                    response = await axios.get('https://i11e106.p.ssafy.io/api/rooms?page=0&size=20', {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${access}`,
                        }
                    })
                }

                setRooms(response.data)
                console.log(rooms)
            } catch (error) {
                console.log("Failed to fetch rooms :", error)
            }
        }

        fetchRooms()
    }, [checkPublic, checkPrivate, checkCanEnter]) // 필터 상태가 변경될 때마다 fetchRooms 호출




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
