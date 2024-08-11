import React, { useState, useEffect, useRef, forwardRef } from "react";
import {useLocation, useParams} from "react-router-dom";
import axios from "axios";
import { Client, Stomp } from "@stomp/stompjs";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"
import {OpenVidu} from "openvidu-browser";

function GamePage() {
    const {state} = useLocation();
    console.log(state);

    // 화면 이동 시 LeaveSession
    // useEffect(()=>{
    //     // window.onbeforeunload = () => leaveSession();
    //     return () => {
    //         window.onbeforeunload = null;
    //     };
    // },[]);

    // 게임방 주소에 roomId 추가해서 리스트에서 들어가는 게임방마다 다른 경로로 가게 하기
    const { roomId } = useParams();

    // OpenVidu Session Variables
    const OV = new OpenVidu();
    const [session, setSession] = useState();
    const [streamManagers, setStreamManagers] = useState([]);

    // User Info
    const [userId, setUserId] = useState();
    const [nickname, setNickname] = useState();

    // ViduChat
    // chat => { nickname, message } 객체 형식
    // const [viduToken, setViduToken] = useState("");
    // setViduToken(state);
    const [chatHistory, setChatHistory] = useState([]);
    // 일반 채팅: signal:chat, 밤 채팅: signal:signal:secretChat
    // 초기 상태 == 일반 채팅, 모든 유저에게 브로드캐스팅
    // GamePageMain에서 변경되고, GameChat에서 사용
    const [chatMode, setChatMode] = useState({ mode: 'signal:chat', to: [] });

    // System
    const [ systemMessage, setSystemMessage ] = useState(null)

    // Game
    const [ gameData, setGameData ] = useState({})
    const [ nowGameState, setNowGameState ] = useState(null)

    // player 설정
    // const [players, setPlayers] = useState([
    //     {nickname: 'player1', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
    //     {nickname: 'player2', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
    //     {nickname: 'player3', role: 'emissary', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
    //     {nickname: 'player4', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
    //     {nickname: 'player5', role: 'police', isRoomManager: true, isMe: false, isAlive: true, hasVoted: false},
    //     {nickname: 'player6', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
    //     {nickname: 'player7', role: 'independenceActivist', isRoomManager: false, isMe: true, isAlive: true, hasVoted: false},
    //     {nickname: 'player8', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
    // ]);
ga

    // 방 정보 가져오기
    useEffect(() => {
        const access = localStorage.getItem('access');

        async function gameRoomInfo() {
            await axios.get(`https://i11e106.p.ssafy.io/api/rooms/${roomId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                }
            }).then((res) => {
                setGameData(res.data);
                console.log("RES",res.data);
            }).catch ((err) => {
                console.log("게임방 API를 불러오지 못했습니다", err);
            })
        }

        gameRoomInfo();
    }, [])



    useEffect( () => {
        const access = localStorage.getItem('access');
        // TODO: get nickname & userId from accessToken
        const nickname = "ssafy";
        const userId = "ssafy@ssafy.com";

        setNickname(nickname);
        setUserId(userId);


        const mySession = OV.initSession();
        setSession(mySession);

        const addStreamManager =
            strMgr => setStreamManagers(subs => [...subs, strMgr]);

        const deleteStreamManager =
            strMgr => setStreamManagers(subs => subs.filter(s => s !== strMgr));

        const handleStreamCreated = (event) => {
            mySession.subscribeAsync(event.stream, undefined)
                     .then(strMgr => addStreamManager(strMgr));
        }

        const handleStreamDestroyed =
            event => deleteStreamManager(event.stream.streamManager);

        const handleChatSignal = (event) => {
            const message = event.data;
            const nickname = JSON.parse(event.from).nickname;
            setChatHistory(prevHistory => [ ...prevHistory, { nickname, message } ]);
        }

        const handleSecretChatSignal = (event) => {
            const message = event.data;
            const nickname = JSON.parse(event.from).nickname;
            setChatHistory(prevHistory => [ ...prevHistory, { nickname, message } ]);
        }

        // 세션 이벤트 추가
        mySession.on("streamCreated", handleStreamCreated);
        mySession.on("streamDestroyed", handleStreamDestroyed);
        mySession.on("signal:chat", handleChatSignal);
        mySession.on("signal:secretChat", handleSecretChatSignal);
        mySession.on("exception", exception => console.warn(exception));

        // 메타 데이터, Connection 객체에서 꺼내 쓸 수 있음
        const data = {
            nickname, roomId
        };

        // 세션 연결 및 publisher 객체 streamManagers 배열에 추가
        mySession.connect(state, data)
            .then(async () => {
                const publisher = OV.initPublisher(undefined, {
                    audioSource: undefined,
                    videoSource: undefined,
                    publishAudio: true,
                    publishVideo: true,
                    resolution: '300x200',
                    frameRate: 30,
                    insertMode: 'APPEND',
                    mirror: true,
                });

                await mySession.publish(publisher);
                addStreamManager(publisher);
            })
            .catch(error => console.warn(error));

        return () => {
            window.onbeforeunload = () => {};
        }

    }, [] );


    const leaveSession = () => {
        const mySession = session;

        // 서버에서 유저 삭제 등 처리를 위해 axios로 API 호출
        axios.delete(`https://i11e106.p.ssafy.io/api/rooms/${roomId}`)
             .then(response => console.log('Player left successfully:', response.data))
             .catch(error => console.error('Error leaving session:', error))

        if (mySession) mySession.disconnect();

        this.OV = null;
        setSession(undefined);
        setStreamManagers([]);
        window.location.reload();
    }

    // creationTime 순으로 정렬된 streamManagers 배열을 반환
    const getSortedStreamManagers =
        strMgrs => [...strMgrs].sort((a, b) => a.stream.creationTime - b.stream.creationTime);


    const stompClient = useRef(null)
    // const { roomid }  = useParams()

    // 방 정보 가져오기
    useEffect(() => {
        const gameRoomInfo = async() => {
            console.log('장하오')
            try {
                const response = await axios.get(`https://i11e106.p.ssafy.io/api/rooms/${roomId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access}`,
                    }
                })
                console.log("resp", response.data)
                setGameData(response.data)
                console.log('제발 나와라!!!11', gameData);
                console.log('너 나와!!!!!', gameData.title)
                console.log('너도 나와!!!!!!', gameData.title)
            } catch (error) {
                console.log("게임방 API를 불러오지 못했습니다", error)
            }
        }
        gameRoomInfo()
    }, [])

    useEffect(() => {
        console.log('나 들어감??', gameData)
        console.log('나 갔따', gameData.title)
    }, [gameData, gameData.title])

    // useEffect( () => {
    //
    //     // TODO: get nickname & userId from accessToken
    //     const nickname = "ssafy";
    //     const userId = "ssafy@ssafy.com";
    //
    //     setNickname(nickname);
    //     setUserId(userId);
    //
    //
    //     const mySession = OV.initSession();
    //     setSession(mySession);
    //
    //     const addStreamManager =
    //         strMgr => setStreamManagers(subs => [...subs, strMgr]);
    //
    //     const deleteStreamManager =
    //         strMgr => setStreamManagers(subs => subs.filter(s => s !== strMgr));
    //
    //     const handleStreamCreated = (event) => {
    //         mySession.subscribeAsync(event.stream, undefined)
    //                  .then(strMgr => addStreamManager(strMgr));
    //     }
    //
    //     const handleStreamDestroyed =
    //         event => deleteStreamManager(event.stream.streamManager);
    //
    //     const handleChatSignal = (event) => {
    //         const message = event.data;
    //         const nickname = JSON.parse(event.from).nickname;
    //         setChatHistory(prevHistory => [ ...prevHistory, { nickname, message } ]);
    //     }
    //
    //     const handleSecretChatSignal = (event) => {
    //         const message = event.data;
    //         const nickname = JSON.parse(event.from).nickname;
    //         setChatHistory(prevHistory => [ ...prevHistory, { nickname, message } ]);
    //     }
    //
    //     // 세션 이벤트 추가
    //     mySession.on("streamCreated", handleStreamCreated);
    //     mySession.on("streamDestroyed", handleStreamDestroyed);
    //     mySession.on("signal:chat", handleChatSignal);
    //     mySession.on("signal:secretChat", handleSecretChatSignal);
    //     mySession.on("exception", exception => console.warn(exception));
    //
    //     // 메타 데이터, Connection 객체에서 꺼내 쓸 수 있음
    //     const data = {
    //         nickname, id
    //     };
    //
    //     // 세션 연결 및 publisher 객체 streamManagers 배열에 추가
    //     mySession.connect(location.state.option.ownerToken, data)
    //         .then(async () => {
    //             const publisher = OV.initPublisher(undefined, {
    //                 audioSource: undefined,
    //                 videoSource: undefined,
    //                 publishAudio: true,
    //                 publishVideo: true,
    //                 resolution: '300x200',
    //                 frameRate: 30,
    //                 insertMode: 'APPEND',
    //                 mirror: true,
    //             });
    //
    //             await mySession.publish(publisher);
    //             addStreamManager(publisher);
    //         })
    //         .catch(error => console.warn(error));
    //
    //     return () => {
    //         window.onbeforeunload = () => {};
    //     }
    //
    // }, [location] );


    // const leaveSession = () => {
    //     const mySession = session;
    //
    //     // 서버에서 유저 삭제 등 처리를 위해 axios로 API 호출
    //     axios.delete(`https://i11e106.p.ssafy.io/api/rooms/${roomId}`)
    //          .then(response => console.log('Player left successfully:', response.data))
    //          .catch(error => console.error('Error leaving session:', error))
    //
    //     if (mySession) mySession.disconnect();
    //
    //     this.OV = null;
    //     setSession(undefined);
    //     setStreamManagers([]);
    //     window.location.reload();
    // }

    // creationTime 순으로 정렬된 streamManagers 배열을 반환
    // const getSortedStreamManagers =
    //     strMgrs => [...strMgrs].sort((a, b) => a.stream.creationTime - b.stream.creationTime);
    //
    //
    // const stompClient = useRef(null)
    // const { id }  = useParams()

    // 구독할래
    useEffect(() => {
        // 원래 했던 거
        if (stompClient.current) {
            stompClient.current.disconnect()
            console.log("구독 안됐는지 확인")
        }

        const socket = new WebSocket("wss://i11e106.p.ssafy.io/ws")
        const access = localStorage.getItem('access');

        stompClient.current = Stomp.over(socket)
        stompClient.current.connect({
            'Authorization': `Bearer ${access}`
        }, () => {
            stompClient.current.subscribe(`/ws/sub/${roomId}`, (message) =>
                {
                    const messageJson = JSON.parse(message.body)
                    console.log("입장 데이터 확인 : ", messageJson)
                    setNowGameState('입장 하고 데이터 받는다ㅏㅏ', messageJson.gameState)
                })
        })

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect()
            }
        }

    }, [])

    const handleButtonClick = () => {
        // 버튼 클릭 시 실행할 로직을 여기에 작성합니다.
        console.log('버튼이 클릭되었습니다.');
        gameStart();
      };

    const gameStart = () => {
        const access = localStorage.getItem('access');
        if (stompClient.current) {
            stompClient.current.send(
                `/ws/pub/start/${roomId}`, 
                {
                'Authorization': `Bearer ${access}`
                }, 
                {}
            );
        }
    }
      
    return (
        <>
            <div className={styles.container}>
                {/* 게임데이터 있는지 확인 -> 게임데이터에 유저리스트가 있는지 확인 -> 그 유저리스트 array인지 확인  */}
                {gameData && gameData.userList && Array.isArray(gameData.userList) &&
                    <GamePageHeader gameData={gameData} id={roomId} />
                }
                {gameData && gameData.userList && Array.isArray(gameData.userList) &&
                    <GamePageMain
                        setSystemMessage={setSystemMessage}
                        roomId={roomId}
                        streamManagers={getSortedStreamManagers(streamManagers)}
                        setChatHistory={setChatHistory}
                        setChatMode={setChatMode}
                        // 바로 보내도 되나?
                        stompClient={stompClient}
                        gameData={gameData}
                        nowGameState={nowGameState}
                        players={players}
                        setPlayers={setPlayers}
                    />
                }
                {gameData && gameData.userList && Array.isArray(gameData.userList) &&
                    <GamePageFooter
                        roomId={roomId}
                        systemMessage={systemMessage}
                        stompClient={stompClient}
                        gameData={gameData}
                        nowGameState={nowGameState}
                        session={session}
                        chatHistory={chatHistory}
                        chatMode={chatMode}
                        players={players}
                    />
                }
            </div>
            {/* <div>
                <GamePageHeader />
                <GamePageMain   setSystemMessage={setSystemMessage}
                                roomId={roomId}
                                streamManagers={getSortedStreamManagers(streamManagers)}
                                setChatMode={setChatMode}
                                stompClient={stompClient}
                                gameData={gameData}
                                nowGameState={nowGameState}
                                gameResponse={gameResponse}
                                players={players}
                                setPlayers={setPlayers}
                                />
                <GamePageFooter systemMessage={systemMessage}
                                stompClient={stompClient}
                                gameData={gameData}
                                nowGameState={nowGameState}
                                gameResponse={gameResponse}
                                session={session}
                                chatHistory={chatHistory}
                                chatMode={chatMode}
                                players={players}
                                />
            </div> */}
        </>
    )
}

export default GamePage;