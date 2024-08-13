import React, {useEffect, useState} from "react";
import { Client } from '@stomp/stompjs';
import axios from "axios";
import Monitor from "./Monitor";
import EmissaryModal from "../../modals/EmissaryModal"
import PoliceModal from "../../modals/PoliceModal";
import ChoiceDieOrTurncoat from "../../modals/ChoiceDieOrTurncoat";
import FinalDefensePlayerModal from "../../modals/FinalDefensePlayerModal";
import styles from "./GamePageMain.module.css"

function GamePageMain({ setSystemMessage, roomId, streamManagers, setChatMode, stompClient, gameData, nowGameState, gameResponse, players, setPlayers }) {
    // players 배열을 생성된 시간 순으로 정렬
    // streamManagers와 순서를 맞춰야 하므로 정렬이 필요함
    // setPlayers(playes => players.sort((a, b) => a.creationTime - b.creationTime));

    // const [ currentPhase, setCurrentPhase ] = useState('night')                         // 게임 단계(night, police, discussion, finalDefense)
    const [ nightTimer, setNightTimer ] = useState(30)                                  // 밤 타이머   
    const [ policeTimer, setPoliceTimer ] = useState(30)                                // 첩보원 타이머
    const [ discussionTimer, setDiscussionTimer ] = useState(90)                        // 토론(낮) 타이머
    const [ finalDefenseTimer, setFinalDefenseTimer ] = useState(30)                    // 최후 변론 타이머
    const [ emissaryTarget, setEmissaryTarget ] = useState(null)                        // 밀정이 선택한 시민
    const [ policeTarget, setPoliceTarget ] = useState(null)                            // 첩보원이 선택한 시민
    const [ finalDefensePlayer, setFinalDefensePlayer ] = useState(false)                // 최후 변론 플레이어
    const [ choiceDieOrTurncoat, setchoiceDieOrTurncoat ] = useState(false)             // 독립운동가를 죽일지 변절자로 만들지 결정하는 변수
    const [ showEmissaryModal, setShowEmissaryModal ] = useState(false)                 // 변절자 모달 표시 여부
    const [ showPoliceModal, setShowPoliceModal ] = useState(false)                         // 첩보원 모달 표시 여부
    const [ votes, setVotes ] = useState({});
    const [ suspect, setSuspect ] = useState(null)
    const [ winnerModal, setWinnerModal ] = useState(false)                                // 우승자 표시

    const access = localStorage.getItem('access');
    const header =  {'Authorization': `Bearer ${access}`}

    // // 게임 시작하기
    // const gameStart = () => {
    //     const socket = new WebSocket(`ws://i11e106.p.ssafy.io/pub/start/${roomId}`)
    //     socket.onopen = function(event) {
    //         console.log('웹소켓 연결이 열렸습니다. 게임을 시작합니다')
    //     }
    //     socket.onerror = function(error) {
    //         console.error('게임 시작 웹소켓에서 에러가 발생했습니다.:', error);
    //     }
    //     socket.close()
    //     socket.onclose = function(event) {
    //         console.log('게임 시작 웹소켓 연결이 닫혔습니다')
    //     }
    // }

    // 밀정 시간
    const emissaryTime = () => {
        // 30초 동안 타이머를 1초 간격으로 감소
        const intervalId = setInterval(() => {
            setNightTimer(prevState => {
                if (prevState <= 1) {
                    clearInterval(intervalId)
                    setShowEmissaryModal(true)
                }
            })
        }, 1000)
        return () => clearInterval(intervalId)
    }

    // 밀정이 밤에 죽일지 / 변절시킬 플레이어를 고름 / 죽일거야 변절시킬거야?
    const choicePlayer = (choicedId) => {
        setShowEmissaryModal(false)
        setEmissaryTarget(choicedId)
        setchoiceDieOrTurncoat(true)
    }

    // 죽일까 변절시킬까
    const handleChoiceDieOrTurncoat = (choiced) => {
        if (choiced === '변절') {
            stompClient.current.send(
                `/ws/pub/appease/${roomId}/${emissaryTarget}`, 
                header,
                {}
            )
        } else if (choiced === '죽임') {
            stompClient.current.send(
                `/ws/pub/kill/${roomId}/${emissaryTarget}`, 
                header,
                {}
            )
        }
        setchoiceDieOrTurncoat(false)
    }

    // 첩보원이 활동한다
    // isMe 어떻게 오는지 확인하고 코드 바꾸기
    const policeTime = () => {
        const me = gameData.playerMap
          .filter(player => player.isAlive)
          .find(player => player.isMe)
        if (me) {
            setShowPoliceModal(true)
        }
    }

    // 첩보원이 선택한 플레이어의 역할을 아는 함수
    const policeChoicedPlayer = function(targetId, targetNickname, targetRole) {
        setShowPoliceModal(false)
        stompClient.current.send(
            `/ws/pub/detect/${roomId}/${targetId}`, 
            header,
            {}
        )
        // 첩보원 화면에만 뜨게 하기
        // isMe 어떻게 뜨는지 확인22
        const me = gameData.playerMap
            .filter(player => player.isAlive)
            .find(player => player.isMe)
        if (me) {
            setSystemMessage(`${targetNickname}님은 ${targetRole}입니다.`)
        }
        // 첩보원 활동이 끝났다는 메시지 보내기
        stompClient.current.send(
            `/ws/pub/day/${roomId}`, 
            header,
            {}
        )
    }

    // 낮(토론 및 투표 중)
    const voteStart = (targetId) => {
        stompClient.current.send(
            `/ws/pub//vote/${roomId}`, 
            header,
            JSON.stringify({ targetId })
        )
        handleVote(targetId)

        const timer = setTimeOut(() => {
            if (stompClient.current && stompClient.current.connected) {
                console.log('낮이 종료되었습니다')
            }
        }, 30000)

        return () => {
            clearTimeout(timer)
        }
    }

    // 낮에 투표 전송
    const handleVote = (targetId) => {
        if (stompClient.current && stompClient.connected) {
            stompClient.current.send(
                 `/pub/vote/${roomId}`, 
                 header, 
                 JSON.stringify({ targetId })
            )
            console.log('투표 메시지를 전송했습니다')
        } else {
            console.log('STOMP 클라이언트가 연결되지 않았습니다')
        }
    }

    const isEmissaryOrBetrayer = (player) => {
        return player.role === 'emissary' || player.role === 'betrayer';
    }

    // 밤이 되었을 때 비디오/오디오 처리 handler
    const handleVideoAudioAtNight = () => {
        const publisherIdx = streamManagers.findIndex(strMgr => !strMgr.remote);

        // 밀정, 변절자를 제외한 유저는 비디오/오디오를 publish 하지도 않고,
        // 다른 유저들의 비디오/오디오를 subscribe 하지도 않는다.
        if (!isEmissaryOrBetrayer(players[publisherIdx])) {
            streamManagers[publisherIdx].publishVideo(false);
            streamManagers[publisherIdx].publishAideo(false);

            streamManagers
              .filter(strMgr => strMgr.remote)
              .forEach(strMgr => {
                    strMgr.subscribeToVideo(false);
                    strMgr.subscribeToAudio(false);
                }
              )
        }
    }

    // 낮이 되었을 때 비디오/오디오 처리 handler
    const handleVideoAudioAtDay = () => {
        const publisherIdx = streamManagers.findIndex(strMgr => !strMgr.remote);

        if (!isEmissaryOrBetrayer(players[publisherIdx])) {
            streamManagers[publisherIdx].publishVideo(true);
            streamManagers[publisherIdx].publishAideo(true);

            streamManagers
              .filter(strMgr => strMgr.remote)
              .forEach(strMgr => {
                    strMgr.subscribeToVideo(true);
                    strMgr.subscribeToAudio(true);
                }
              )
        }
    }

    // 밤이 되었을 때, 채팅 모드 변환
    const changeToSecretChatMode = () => {
        const enemies = streamManagers
          .filter((_, idx) => isEmissaryOrBetrayer(players[idx]))
          .map(strMgr => strMgr.stream.connection);

        setChatMode(() => { return { mode: 'signal:secretChat', to: enemies }; });
    }

    // 낮이 되었을 때, 채팅 모드 변환
    const changeToNormalChatMode = () => {
        setChatMode(() => { return { mode: 'signal:chat', to: [] }; });
    }


    // 두 배열을 하나로 묶는 함수
    // python의 map과 유사
    const zip = (arr1, arr2) => {
        const length = Math.min(arr1.length, arr2.length);
        return Array.from({ length }, (_, index) => [arr1[index], arr2[index]]);
    }

    // players 배열을 생성된 시간 순으로 정렬
    // streamManager와 순서를 맞춰야 하므로 정렬이 필요함
    // useEffect(()=>{
    //     setPlayers(players => players.sort((a, b) => a.creationTime - b.creationTime));
    // })
    // useEffect(() => {
    //     setPlayers(players => [...players].sort((a, b) => a.creationTime - b.creationTime));
    // }, [players, setPlayers]);
    useEffect(() => {
        // 기존 players와 비교하여 변경된 경우에만 업데이트
        setPlayers(prevPlayers => {
            const newSortedPlayers = [...players].sort((a, b) => a.creationTime - b.creationTime);
            // 상태가 변경된 경우에만 업데이트
            if (JSON.stringify(prevPlayers) !== JSON.stringify(newSortedPlayers)) {
                return newSortedPlayers;
            }
            return prevPlayers;
        });
    }, [players]);


    // 재투표를 해야할 때
    const voteAgain = () => {
        setVotes(prevState => {
            const updatedVotes = {}
            Object.keys(prevState).forEach(playerId => {
                updatedVotes[playerId] = false
            })
            return updatedVotes
        })
    }

    // 최종 용의자 한 명이 나옴
    const voteFinish = () => {
        setSystemMessage('최종 변론을 실시하세요.')
        setSuspect(gameData.maxPlayerList[0])
    }

    // 최종 투표 찬반
    const confirmStart = () => {
        setFinalDefensePlayer(true)
    }

    //보냄 어디로?
    const handleFinalDefenseResult = (choiced) => {
        setFinalDefensePlayer(false)
        const targetId = suspect
        // 죽이는 거에 찬성하는지 반대하는지 어떻게 알지?
        if (choiced === '찬성') {
            stompClient.current.send(
                `/pub/confirm/${roomId}`, 
                header, 
                JSON.stringify({targetId})
            )
        }
    }

    // 게임 끝
    const gameEnd = () => {
        stompClient.current.send(
            `/pub/end/${roomId}`, 
            header, 
            {}
        )
        handleResult()
    }


    // 게임 결과 반영
    const handleResult = async() => {
        await axios.post('https://i11e106.p.ssafy.io/api/results', {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access}`,
            }, 
        })
            .then((response) => {
                console.log(response)
                handleAchievenets()
            })
            .catch((error) => {
                console.log(error)
            })
        
    }

    // 업적 처리
    const handleAchievenets = async() => {
        await axios.post('https://i11e106.p.ssafy.io//api/honors', {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access}`,
            },
        })
            .then((response) => {
                console.log(response)
                showResult()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 결과 어케 받??
    // 직업으로 주지 않을까?
    const showResult = async() => {
        const winnerJob = gameResponse.어쩌궞쩌구
        setWinnerModal(true)

        setTimeout(() => {
            setWinnerModal(false)
        }, 3000)
    }


    switch (nowGameState)
    {
        case 'STARTED' :
            gameStart()
            break
        case 'NIGHT_EMISSARY' :
            // 밤이 되었을 때, 비디오/오디오 처리
            handleVideoAudioAtNight();
            // 밤이 되었을 때, 채팅 처리
            changeToSecretChatMode();
            setSystemMessage('밤이 시작되었습니다. 밀정이 활동 중입니다.')
            emissaryTime()
            break
        case 'NIGHT_POLICE' :
            setSystemMessage('밤이 되었습니다. 첩보원이 활동 중입니다.')
            policeTime()
            break
        case 'VOTE_START' :
            // 낮이 되었을 때, 비디오/오디오 처리
            handleVideoAudioAtDay();
            // 낮이 되었을 때, 채팅 처리
            changeToNormalChatMode();
            setSystemMessage('낮이 되었습니다. 토론을 하며 투표를 진행하세요.')
            voteStart()
            break
        case 'VOTE_END' :
            setSystemMessage('낮이 되었습니다. 투표가 끝이 났습니다.')
            voteEnd()
            break
        case 'REVOTE' :
            setSystemMessage('동점자가 나왔습니다. 재투표를 실시합니다.')
            voteAgain()
            break
        case 'FINISH' :
            setSystemMessage(`투표에 의해 ${suspect}님이 최종 용의자가 되었습니다.`)
            voteFinish()
            break
        case 'CONFIRM_START' :
            setSystemMessage(`최종 투표를 시작합니다.`)
            confirmStart()
            break
        case 'CONFIRM_END' :
            setSystemMessage(`최종 투표가 끝이 났습니다`)
            confirmEnd()
            break
        case 'END' :
            setSystemMessage('게임이 끝이 났습니다.')
            gameEnd()
            break
    }

    return (
      <>
          <div className={styles.monitors}>
                {zip(players, streamManagers).map((player, index) => (
                    <Monitor
                        key={index}
                        nickname={player[0].nickname}
                        isRoomManager={player[0].isRoomManager}
                        isMe={player[0].isMe}
                        isAlive={player[0].isAlive}
                        roomId={roomId}
                        streamManager={player[1]}
                        isVote={votes[player.id] || false}
                        onVote={handleVote}
                    />
                ))}
            </div>
            <div className={styles.timer}>
                {/* {currentPhase === 'night' && <p>밤 시간: {nightTimer}초</p>}
                {currentPhase === 'police' && <p>첩보원 시간: {policeTimer}초</p>}
                {currentPhase === 'discussion' && <p>토론 시간: {discussionTimer}초</p>}
                {currentPhase === 'finalDefense' && <p>최후 변론 시간: {finalDefensePlayer}초</p>} */}
            </div>
            <div>
                {showEmissaryModal ? <EmissaryModal gameData={gameData} onAction={choicePlayer}/>
                : null}
                {choiceDieOrTurncoat ? <ChoiceDieOrTurncoat onChioce={handleChoiceDieOrTurncoat} /> : null}
                {showPoliceModal ? <PoliceModal gameData={gameData} onChioce={policeChoicedPlayer}/>: null}
                {finalDefensePlayer ? <FinalDefensePlayerModal suspect={suspect} onMessage={handleFinalDefenseResult}/> : null }
            </div>
            { winnerModal ? <div className={styles.winner}><span style={{ color: 'red', fontWeight: 'bold' }}>{winnerJob}</span>의 승리입니다.</div> : null}
        </>
    )
}


export default GamePageMain;