import React, { useState, useEffect } from "react";
import Monitor from "./Monitor";
import EmissaryModal from "../../modals/EmissaryModal"
import PoliceModal from "../../modals/PoliceModal";
import ChoiceDieOrTurncoat from "../../modals/ChoiceDieOrTurncoat";
import FinalDefensePlayerModal from "../../modals/FinalDefensePlayerModal";
import styles from "./GamePageMain.module.css"

function GamePageMain({ setSystemMessage }) {
    // 플레이어들의 초기 상태
    const initialPlayers = [
        {nickname: 'player1', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player2', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player3', role: 'emissary', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player4', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player5', role: 'police', isRoomManager: true, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player6', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player7', role: 'independenceActivist', isRoomManager: false, isMe: true, isAlive: true, hasVoted: false},
        {nickname: 'player8', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
    ]


    const [ players , setPlayers ] = useState(initialPlayers)                           // Player들의 상태를 관리
    const [ currentPhase, setCurrentPhase ] = useState('night')                         // 게임 단계(night, police, discussion, finalDefense)
    const [ nightTimer, setNightTimer ] = useState(30)                                  // 밤 타이머   
    const [ policeTimer, setPoliceTimer ] = useState(30)                                // 첩보원 타이머
    const [ discussionTimer, setDiscussionTimer ] = useState(90)                        // 토론(낮) 타이머
    const [ finalDefenseTimer, setFinalDefenseTimer ] = useState(30)                    // 최후 변론 타이머 
    const [ emissaryTarget, setEmissaryTarget ] = useState(null)                        // 밀정이 선택한 시민
    const [ policeTarget, setPoliceTarget ] = useState(null)                            // 첩보원이 선택한 시민
    const [ voteCounts, setVoteCounts ] = useState({})                                  // 각 플레이어가 받은 투표 수
    const [ isFinalDefensePhase, setIsFinalDefensePhase ] = useState(false)             // 최후 변론 단계
    const [ finalDefensePlayer, setFinalDefensePlayer ] = useState(null)                // 최후 변론 플레이어
    const [ approvalVotes, setApprovalVotes ] = useState({})                            // 찬반 투표 상태
    const [ voteTimer, setVoteTimer ] = useState(null)                                  // 투표 타이머 상태
    const [ makeTurncoat, setMakeTurnCoat ] = useState(true)                            // 밀정이 독립운동가를 변절자로 만드는 변수
    const [ choiceDieOrTurncoat, setchoiceDieOrTurncoat ] = useState(false)             // 독립운동가를 죽일지 변절자로 만들지 결정하는 변수
    const [ selectedPlayer, setSelectedPlayer ] = useState(null)                        // 선택된 플레이어
    const [ action, setAction ] = useState(null)                                        // 죽임 / 변절 액션 상태
    const [ showEmissaryModal, setShowEmissaryModal ] = useState(false)                 // 변절자 모달 표시 여부
    const [ showPoliceModal, setPoliceModal ] = useState(false)                         // 첩보원 모달 표시 여부
    const [ emissaryAction, setEmissaryAction ] = useState(null)                        // 액션 선택 모달

    // // useEffect로 타이머 설정
    useEffect(() => {
        let timer
        switch (currentPhase) {
            case 'night' :
                setSystemMessage("밤이 되었습니다. 밀정이 활동 중입니다.")
                setShowEmissaryModal(true)
                timer = setInterval(() => {
                    setNightTimer(prev => {
                        if (prev <= 1) {
                            clearInterval(timer)
                            // 선택된 누군가가 죽을거임
                            // 알리기는 낮에
                            // 다음 단계로 가는 거 알리기
                            setCurrentPhase('police')
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)
                break
            case 'police' :
                setSystemMessage("밤이 되었습니다. 첩보원이 활동 중입니다.")
                setPoliceModal(true)
                timer = setInterval(() => {
                    setPoliceTimer(prev => {
                        if (prev <= 1) {
                            clearInterval(timer)
                            setCurrentPhase('discussion')
                            return 0
                        }
                        return prev -1
                    })
                }, 1000)
                break
            case 'discussion' :
                // 낮이 되면 간밤의 상황 알려줌
                // useEffect 이용
                timer = setInterval(() => {
                    setDiscussionTimer(prev => {
                        if (prev <= 1) {
                            clearInterval(timer)
                            // 투표 확인 - 시간이 다 됐을 때
                            // 이때는 모든 사람이 투표를 다 했는지 확인X
                            checkVoteResults()
                            return 0
                        }
                        return prev - 1
                    })
                    // 모든 사람이 투표를 다 했는지 확인해서
                    // 만약 모든 플레이어가 투표를 완료했다면 투표 결과 바로 확인
                    checkVoteResultsIfAllVoted()
                }, 1000)
                break
            case 'finalDefense' :
                timer = setInterval(() => {
                    setFinalDefenseTimer(prev => {
                        if (prev <= 1) {
                            clearInterval(timer)
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)
                break
            default :
            break
        }
        // 컴포넌트 언마운트 시 타이머 정리
        return() => clearInterval(timer)
    }, [currentPhase])




    // 밀정이 밤에 죽일지 / 변절시킬 플레이어를 고름
    const choicePlayer = function(choicedNickname) {
        setShowEmissaryModal(false)
        setEmissaryTarget(choicedNickname)
        // 독립운동가를 변절시킬 수 있으면
        // 밀정은 선택권이 있음
        if (makeTurncoat) {
            // 변절시키겠습니까? 죽이겠습니까?
            setchoiceDieOrTurncoat(true)
        } else {
            // 죽였음
            setAction({ type: 'kill', target: choicedNickname})
        }
    }

    const handleChoiceDieOrTurncoat = function(choiced) {
        if (choiced === '변절') {
            setMakeTurnCoat(false)
            setPlayers(prevState => 
                prevState.map(player => 
                    player.nickname === emissaryTarget
                    ? {...player, role: 'turncoat'}
                    : player
                )
            )
            // 변절자의 화면에만 '지금부터 당신은 변절자입니다' 뜨게 하기
        } else {
            setAction({ type: 'kill', target: emissaryTarget})
        }
        setchoiceDieOrTurncoat(false)
    }

    // 낮이 됐을 때 간밤의 상황 알려주는 함수 2
    const handleDiscussionPhase = function() {
        if (action && action.type === 'kill') {
            setSystemMessage(`낮이 되었습니다. 간밤에 ${action.target}님이 사망하셨습니다.`)
            setPlayers(prevState => 
                prevState.map(player =>
                    player.nickname === action.target
                    ? {...player, isAlive: false}
                    : player
                )
            );
            setAction(null);
        } else {
            setSystemMessage('낮이 되었습니다. 간밤에 아무도 사망하지 않았습니다.')
        }
    };

    // 첩보원이 선택한 플레이어의 역할을 아는 함수
    const policeChoicedPlayer = function(choicedNickname, choicedRole) {
            setPoliceModal(false)
            let roleName = ""
            if (choicedRole === 'emissary') {
                roleName = '밀정'
            } else {
                roleName = '독립운동가'
            }
            // 첩보원 화면에만 뜨게 하기
            console.log(`${choicedNickname}님은 ${roleName}입니다.`)
    }

    // 낮이 됐을 때 간밤의 상황 알려주는 함수 1
    useEffect(() => {
        if (currentPhase === 'discussion') {
            handleDiscussionPhase();
        }
    }, [currentPhase]);




    // 타이머는 아직 남았지만 모든 사람이 다 투표했을 때 코드
    const checkVoteResultsIfAllVoted = function() {
        const alivePlayers = players.filter(player => player.isAlive)
        const allVoted = alivePlayers.every(player => player.hasVoted)

        if (allVoted) {
            checkVoteResults()
            clearInterval(timer)
        }
    }

    // 투표 결과 확인
    const checkVoteResults = function() {
        const alivePlayers = players.filter(player => player.isAlive)
        const aliveVotes = alivePlayers.reduce((acc, player) => {
            if (player.hasVoted) {
                acc[player.vote] = (acc[player.vote] || 0) + 1
            }
            return acc
        }, {})

        const topPlayers = findTopPlayers(aliveVotes)
        if (topPlayers.length === 1) {
            // 최후변론ㄱ
            startFinalDefense(topPlayers[0])
        } else {
            // 최다득표가 2명 이상
            // 그 사람들만 대상으로 다시 투표
            setPlayers(prevState =>
                prevState.map(player =>
                    player.isAlive ? { ...player, hasVoted: false } : player
                )
            )
            checkVoteResultsIfAllVoted()
        }
    }

    // 가장 많은 표를 받은 플레이어 찾기
    const findTopPlayers = function(voteCounts) {
        let maxVotes = 0
        let topPlayers = []
        Object.keys(voteCounts).forEach(player => {
            const votes = voteCounts[player]
            if (votes > maxVotes) {
                maxVotes = votes
                topPlayers = [player]
            } else if ( votes === maxVotes ) {
                topPlayers.push(player)
            }
        })
        return topPlayers
    }

    // 최후 변론을 시작하는 함수
    const startFinalDefense = function(player){
        setFinalDefensePlayer(player)
        setCurrentPhase('finalDefense')
        
    }

    // 최후 변론 후 찬반 투표를 처리하는 함수
    const handleFinalDefenseResult = function(result) {
        if (result === '죽음') {
            setSystemMessage(`${finalDefensePlayer}님이 투표에 의해 사망하셨습니다.`)
            setPlayers(prevState =>
                prevState.map(player =>
                    player.nickname === finalDefensePlayer
                    ? {...player, isAlive: false}
                    : player
                )
            )
        } else if (result === '생존') {
            setSystemMessage(`${finalDefensePlayer}님이 투표에 의해 생존하셨습니다.`)
        } else if (result === '동점') {
            setSystemMessage('동점이 나왔습니다. 재투표를 실시합니다.')
            setFinalDefensePlayer(finalDefensePlayer)
        }
        setCurrentPhase('night')
        resetGame()
    }

    // 게임을 리셋하는 함수
    const resetGame = function() {
        setEmissaryTarget(null)
        setPoliceTarget(null)
        setFinalDefensePlayer(null)
        setVoteCounts({})
        setApprovalVotes({})
    }

 

    return (
        <>
            <div className={styles.monitors}>
                {players.map((player, index) => (
                    <Monitor
                        key={index}
                        nickname={player.nickname}
                        isRoomManager={player.isRoomManager}
                        isMe={player.isMe}
                        isAlive={player.isAlive}
                        
                    />
                ))}
            </div>
            <div className={styles.timer}>
                {currentPhase === 'night' && <p>밤 시간: {nightTimer}초</p>}
                {currentPhase === 'police' && <p>첩보원 시간: {policeTimer}초</p>}
                {currentPhase === 'discussion' && <p>토론 시간: {discussionTimer}초</p>}
                {currentPhase === 'finalDefense' && <p>최후 변론 시간: {finalDefensePlayer}초</p>}
            </div>
            <div>
                {showEmissaryModal ? <EmissaryModal players={players} onAction={choicePlayer}/>
                : null}
                {choiceDieOrTurncoat ? <ChoiceDieOrTurncoat choicedNickname={emissaryTarget} onChioce={handleChoiceDieOrTurncoat} /> : null}
                {showPoliceModal ? <PoliceModal players={players} onChioce={policeChoicedPlayer}/>
                : null}
                {finalDefensePlayer ? <FinalDefensePlayerModal player={finalDefensePlayer} onMessage={handleFinalDefenseResult}/> : null }
            </div>
        </>
    )
}


export default GamePageMain;