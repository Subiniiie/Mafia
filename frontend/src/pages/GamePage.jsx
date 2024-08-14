import React, { useState, useEffect, useRef } from "react";
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

    // 직업 카드에 보여지는 직업 정의
    const [ myJob, setMyJob ] = useState("")
    const getMyJob = (job) => {
        setMyJob(job)
    }

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
    // 일반 채팅: signal:chat, 밤 채팅: signal:secretChat
    // 초기 상태 == 일반 채팅, 모든 유저에게 브로드캐스팅
    // GamePageMain에서 변경되고, GameChat에서 사용
    const [chatMode, setChatMode] = useState({ mode: 'signal:chat', to: [] });

    // System
    const [ systemMessage, setSystemMessage ] = useState(null)

    // Game
    const [ gameData, setGameData ] = useState({})
    const [ gameResponse, setGameResponse ] = useState("")
    const [ nowGameState, setNowGameState ] = useState("")

    // player 설정
    const [players, setPlayers] = useState([
        // {nickname: 'player1', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        // {nickname: 'player2', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        // {nickname: 'player3', role: 'emissary', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        // {nickname: 'player4', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        // {nickname: 'player5', role: 'police', isRoomManager: true, isMe: false, isAlive: true, hasVoted: false},
        // {nickname: 'player6', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        // {nickname: 'player7', role: 'independenceActivist', isRoomManager: false, isMe: true, isAlive: true, hasVoted: false},
        // {nickname: 'player8', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
    ]);

    // 방 정보 가져오기
    useEffect(() => {
        const access = localStorage.getItem('access');

        const gameRoomInfo = async () => {
            await axios.get(`https://i11e106.p.ssafy.io/api/rooms/${roomId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                }
            }).then((res) => {
                setGameData(res.data);
                console.log("API요청으로 데이터 들고옴",res.data);

                res.data.userList = res.data.userList.sort((a, b) => a.creationTime - b.creationTime);
                console.log('res.data.userList 정렬 시도', res.data.userList);

                setPlayers(res.data.userList)
                console.log("API요청으로 들고온 USER", res.data.userList);
             
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
            const response = JSON.parse(event.data);
            const nickname = response.nickname;
            const message = response.message;
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


    const leaveSession = async () => {
        const mySession = session;
        console.log("Attempting to leave session:", mySession);

        if (mySession) {
            await mySession.disconnect();
            console.log("Session disconnected.");
        } else {
            console.log("No session found to disconnect.");
        }

        // this.OV = null;
        // setSession(undefined);
        // setStreamManagers([]);
    }

    // creationTime 순으로 정렬된 streamManagers 배열을 반환
    const getSortedStreamManagers =
        strMgrs => [...strMgrs].sort((a, b) => a.stream.creationTime - b.stream.creationTime);


    const stompClient = useRef(null)
    const access = localStorage.getItem('access');

    // const activeWebsocket = setInterval(() => {
    //     console.log('의미없는 메시지지지')
    //     stompClient.current.send(
    //         `/ws/pub/connect/${roomId}`, 
    //         {
    //             'Authorization': `Bearer ${access}`
    //         }, 
    //         {}
    //     )
    // }, 20000)

    // 구독할래
    useEffect(() => {
        // 원래 했던 거
        if (stompClient.current) {
            stompClient.current.disconnect()
            console.log("구독 안됐는지 확인")
        }

        // 연결을 해
        const socket = new WebSocket("wss://i11e106.p.ssafy.io/ws")
        const access = localStorage.getItem('access');

        stompClient.current = Stomp.over(socket)
        stompClient.current.connect({
            'Authorization': `Bearer ${access}`
        }, () => {
            // /sub/roomID로 구독을해
            stompClient.current.subscribe(`/sub/${roomId}`, (message) =>
                {
                    if(message.body){
                        console.log("IN! WS");
                        console.log(message.body);
                        const messageJson = JSON.parse(message.body);
                        console.log('게임페이지에서 구독한 거 보여줌', messageJson)

                        // console.log('playerMap 타입 : ', typeof messageJson.gameDTO.playerMap);

                        // messageJson.gameDTO.playerMap = Object.values(messageJson.gameDTO.playerMap);


                        // messageJson.gameDTO.playerMap = messageJson.gameDTO.playerMap.sort((a, b) => a.creationTime - b.creationTime);

                        console.log('messageJson.playerMap 정렬 시도', messageJson);

                        setGameResponse(messageJson);
                        setNowGameState(messageJson.gameState)
                        console.log('웹소켓을 구독하고 나서 서버에서 뭔가를 내려줬을때 받은 message, gameResponse', messageJson);
                        // activeWebsocket()
                        console.log("입장 데이터 확인 : ", messageJson)
                    } else {
                       console.log("OUT! WS");
                    }
                    // const messageJson = JSON.parse(message.body)
                    // setNowGameState(messageJson.gameState)
            })
        })

        setTimeout(() => {
            stompClient.current.send(
                `/ws/pub/enter/${roomId}`, 
                {            
                    'Authorization': `Bearer ${access}`
                },
                {}
            );
        }, 1000);

    

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect()
            }
        }

    }, [])

      
    return (
        <>
            <div className={styles.container}>
                {/* 게임데이터 있는지 확인 -> 게임데이터에 유저리스트가 있는지 확인 -> 그 유저리스트 array인지 확인  */}
                {gameData && gameData.userList && Array.isArray(gameData.userList) &&
                    <GamePageHeader gameData={gameData} id={roomId} leaveSession={leaveSession} />
                }
                {gameData && gameData.userList && Array.isArray(gameData.userList) &&
                    <GamePageMain
                        setSystemMessage={setSystemMessage}
                        roomId={roomId}
                        streamManagers={getSortedStreamManagers(streamManagers)}
                        setChatHistory={setChatHistory}
                        setChatMode={setChatMode}
                        stompClient={stompClient}
                        // 여기도 하나
                        gameData={gameData}
                        nowGameState={nowGameState}
                        setNowGameState={setNowGameState}
                        gameResponse={gameResponse}
                        // 여기 하나
                        players={players}
                        // 바뀔수있는 방법?
                        setPlayers={setPlayers}
                        getMyJob={getMyJob}
                    />
                }
                {gameData && gameData.userList && Array.isArray(gameData.userList) &&
                    <GamePageFooter
                        systemMessage={systemMessage}
                        roomId={roomId}
                        stompClient={stompClient}
                        //여기도 하나
                        gameData={gameData}
                        nowGameState={nowGameState}
                        gameResponse={gameResponse}
                        session={session}
                        chatHistory={chatHistory}
                        chatMode={chatMode}
                        //여기하나
                        players={players}
                        myJob={myJob}
                    />
                }
            </div>
        </>
    )
}

export default GamePage;