import React, { useState, useEffect, useParams } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./GamePageHeader.module.css"
import GameSettingsModal from "../../modals/GameSettingsModal";

function GamePageHeader({ gameData, roomId }) {
    const roomTitle = gameData.title

    const roomManager = gameData.userList.find(user => user.owner === true && user.me === true);
    const roomManagerSettings = <button className={styles.settings} onClick={openModal}>게임설정</button>

    
    
    // 방장만 게임 설정 바꿀 수 있게
    // 버튼을 클릭하면 게임 설정 모달이 열림
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ blackBackground, setBlackBackground ] = useState(false)
    
    function openModal() {
        setIsModalOpen(!isModalOpen)
        setBlackBackground((preState) => !preState)
    }

    // 토큰 갱신
    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) throw new Error('Refresh token is missing.');
    
            const response = await axios.post('https://i11e106.p.ssafy.io/api/auth/refresh', { token: refreshToken });
            const newAccessToken = response.data.accessToken;
    
            localStorage.setItem('access', newAccessToken);
            return newAccessToken;
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            // 로그인 페이지로 리디렉션 등 추가 처리 필요
        }
    }


    const GoBackGameList = async function() {
        try {
            console.log('나 나갈 아이디', roomId);
            let access = localStorage.getItem('access');
    
            if (!access) {
                console.log('액세스 토큰이 없습니다. 사용자에게 로그인하라고 안내합니다.');
                return;
            }
    
            try {
                const response = await axios.delete(
                    `https://i11e106.p.ssafy.io/api/rooms/users/${roomId}`, 
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${access}`,
                        }
                    }
                );
                console.log('나 나간다', response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.log('액세스 토큰이 만료되었습니다. 새 토큰으로 요청을 다시 시도합니다.');
                    access = await refreshToken();
                    if (access) {
                        const response = await axios.delete(
                            `https://i11e106.p.ssafy.io/api/rooms/users/${roomId}`, 
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${access}`,
                                }
                            }
                        );
                        console.log('나 나간다', response.data);
                    }
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.log('못 나갔다', error);
        }
    }
    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.roomTitle}>
                        {roomTitle}
                    </div>
                    <div className={styles.right}>
                        {roomManager ? roomManagerSettings : null}
                            <Link to="/game-list" className={styles.exit}>
                                <img src="/exit.png" alt="exit.png" className={styles.exitImage}
                                    onClick={GoBackGameList}
                                />
                                나가기
                            </Link>
                    </div>
                </div>
                <div>
                    {isModalOpen ? <GameSettingsModal isOpen={isModalOpen} openModal={openModal} roomId={roomId} /> : null}
                </div>
            </div>
            { blackBackground ? <div className={styles.black} onClick={openModal}></div> : null}
        </>
    )
}

export default GamePageHeader;