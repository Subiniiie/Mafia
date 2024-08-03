import styles from './CreateRoomModal.module.css'; // 스타일 파일을 별도로 관리합니다.
import ModalHeader from "../components/ModalHeader"
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const CreateRoomModal = ({ isOpen, openModal, setToken}) => {

    const navigate = useNavigate();

    const modalTitle = '새로운 도전'
    const [gameTitle, setGameTitle] = useState("");
    const [gamePwd, setGamePwd] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    if (!isOpen) return null; // 모달이 열리지 않은 경우 아무것도 렌더링하지 않음

    const navigateToRoom = (id) =>{
        navigate(`/game-room/${id}`);
    }

    const makeRoom = (e) => {
        e.preventDefault();

        if(gameTitle === "") return;
        if (isPrivate && gamePwd === "") return;

        const body = {
            ownerId: "ssafy", // userId
            gameTitle: gameTitle,
            private: isPrivate,
            password: gamePwd
        }

        axios.post("https://i11e106.p.ssafy.io/openvidu/text-caht/api/session/join", body, {
            // headers: { Authorization: `Bearer accessToken`}, ToDo: Set using token
        }).then((res)=>{
            // let newBody = body;
            // newBody.id = res.data.newSessionInfo.gameId;
            // newBody.password = "";
            setToken(res.data.newSessionInfo.token);
            navigateToRoom(res.data.newSessionInfo.gameId);
        }).catch((response) => {
            if(response.status === 403){
                localStorage.removeItem("access_token");
                window.location.reload();
            }
        })
    }

    const checkboxHandler = (e) => {
        setIsPrivate(!e.target.checked);
        console.log(isPrivate);
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <ModalHeader modalTitle={modalTitle} openModal={openModal}/>

                <div className="form-el">
                    <label htmlFor="roomTitle" className="text-3xl">방 이름</label><br/>
                    <input
                      required
                      type="text"
                      placeholder={"전설의 독립군"}
                      className="border-none w-[90%] pl-2 text-black text-2xl"
                      value={gameTitle}
                      onChange={(e) => setGameTitle(e.target.value)}
                    />
                </div>
                <div className="form-el">
                    <label htmlFor="roomPwd" className="text-3xl">비밀번호</label> <br/>
                    <input
                      type="password"
                      placeholder={"비밀번호를 입력해주세요."}
                      value={gamePwd}
                      onChange={(e) => setGamePwd(e.target.value)}
                      className="border-none w-[90%] pl-2 text-black"
                    />
                </div>
                <div className={styles.formBtn}>
                    <div className={styles.privateForm}>
                        <label className={styles.checkboxLabel} htmlFor="isPrivate"><span className="text-3xl">비밀방</span></label>
                        <input className={styles.checkBox} type="checkbox" name="비밀방"
                               onChange={checkboxHandler}></input>
                    </div>
                    <button onClick={makeRoom} className="text-black text-2xl">
                        도전하기
                    </button>
                </div>

                <div className="form">

                </div>
            </div>
        </div>
    );
};

export default CreateRoomModal;
