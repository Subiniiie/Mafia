import React, { useState, useEffect, useParams } from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import styles from "./GamePageHeader.module.css"
import GameSettingsModal from "../../modals/GameSettingsModal";

function GamePageHeader({ gameData, id, leaveSession }) {
    const navigate = useNavigate();

    const roomTitle = gameData.title

    const roomManager = gameData.userList.find(user => user.owner === true && user.me === true);
    const roomManagerSettings = <button className={styles.settings} onClick={openModal}>게임설정</button>
    const roomId = gameData.roomId

    const access = localStorage.getItem("access");
    
    // 방장만 게임 설정 바꿀 수 있게
    // 버튼을 클릭하면 게임 설정 모달이 열림
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ blackBackground, setBlackBackground ] = useState(false)
    
    function openModal() {
        setIsModalOpen((preState) => !preState)
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

    const exitHandler = async (e) => {
        e.preventDefault();
        await axios.delete(
          `https://i11e106.p.ssafy.io/api/rooms/users/${id}`,
          {
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${access}`,
              }
          }
        ).then((resp) => {
            console.log(" 나 나가요.", resp);
            return leaveSession();
        }).then((response) => {
            console.log("IN!");
            navigate('/game-list');
        }).catch((e) => {
            console.error("탈출실패!");
        })
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.roomTitle}>
                        {roomTitle}
                    </div>
                    <div className={styles.contentBox}>
                        {roomManager ? roomManagerSettings : null}
                        { blackBackground ? <div className={styles.black} onClick={openModal}></div> : null}
                            <Link to="/game-list" className={styles.exit} onClick={exitHandler}>
                                <img src="/exit.png" alt="exit.png" className={styles.exitImage} />
                                나가기
                            </Link>
                    </div>
                </div>
                <div>
                    {isModalOpen ? <GameSettingsModal isOpen={isModalOpen} openModal={openModal} roomId={roomId} className={styles.modal}/> : null}
                </div>
            </div>
            { blackBackground ? <div className={styles.black} onClick={openModal}></div> : null }
        </>
    )
}

export default GamePageHeader;