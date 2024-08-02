// HTML Element 변수
const nicknameInput = document.querySelector('input[placeholder="닉네임"]');
const sessionInput = document.querySelector('input[placeholder="세션 번호"]');
const connectButton = document.getElementById('connectButton');
const nightModeButton = document.getElementById('nightModeButton');
const dayModeButton = document.getElementById('dayModeButton');
const leaveSessionButton = document.getElementById('leaveSessionButton');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');

const OV = new OpenVidu();

let userId = null;
let connectionHandler = null;

// 접속 버튼 클릭 이벤트 리스너
connectButton.addEventListener('click', async () => {
    userId = nicknameInput.value;
    const sessionNo = sessionInput.value;

    if (!userId || !sessionNo) {
        alert('닉네임과 세션 번호를 모두 입력해주세요.');
        return;
    }

    try {
        const token = await getToken(userId, sessionNo);
        await connectToSession(token);
    } catch (error) {
        console.error('세션 연결 중 오류 발생:', error);
        alert('접속 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
});

nightModeButton.addEventListener('click', async () => {
    nightModeButton.style.display = 'none';
    dayModeButton.style.display = 'inline-block';

    const sessionNo = sessionInput.value;

    const response = await fetch('http://192.168.30.134:5000/text-chat/api/session/time/night', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionNo }),
    });
});

dayModeButton.addEventListener('click', async () => {
    dayModeButton.style.display = 'none';
    nightModeButton.style.display = 'inline-block';

    const sessionNo = sessionInput.value;

    const response = await fetch('http://192.168.30.134:5000/text-chat/api/session/time/day', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionNo }),
    });
});

// 나가기 버튼 클릭 이벤트 리스너
leaveSessionButton.addEventListener('click', () => {
    leaveSession();
});

// 채팅 전송 버튼 클릭 이벤트 리스너
sendButton.addEventListener('click', () => {
    sendChatMessage();
});

// 채팅 입력 필드에서 Enter 키 이벤트 리스너
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
});

// 토큰 획득 함수
async function getToken(userId, sessionNo) {
    const response = await fetch('http://192.168.30.134:5000/text-chat/api/session/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, sessionNo }),
    });

    if (!response.ok) {
        throw new Error('서버 응답 오류');
    }

    const data = await response.json();
    return data.token;
}

// OpenVidu 세션 연결 함수
async function connectToSession(token) {
    const session = OV.initSession();
    connectionHandler = new OpenViduConnectionHandler(session);

    try {
        await session.connect(token);
        console.log('세션에 연결되었습니다');

        // 자신의 비디오 스트림 생성 및 게시
        const publisher = OV.initPublisher('video-waiting-container', {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: '300x200',
            frameRate: 30,
            insertMode: 'APPEND',

            mirror: false
        });

        await session.publish(publisher);

        addUserScreen(document.getElementById('video-waiting-container').lastElementChild, publisher);

        connectButton.style.display = 'none';
        leaveSessionButton.style.display = 'block';
    } catch (error) {
        console.error('OpenVidu 세션 연결 오류:', error);
        throw error;
    }
}

// 세션 나가기 함수
function leaveSession() {
    if (connectionHandler.session) {
        connectionHandler.session.disconnect();

        // video-container-test 내부의 video-box 초기화
        const elem = document.getElementById('video-container-test');
        while (elem.firstChild) elem.removeChild(elem.lastChild);
        for (let i = 0; i < 8; ++i) {
            elem.appendChild(Object.assign(document.createElement('div'), {className: 'video-box'}));
        }

        connectionHandler = null;

        console.log('세션에서 나갔습니다');

        connectButton.style.display = 'block';
        leaveSessionButton.style.display = 'none';
    }
}

// 채팅 메시지 전송 함수
function sendChatMessage() {
    const message = chatInput.value.trim();
    if (message && connectionHandler.session) {
        connectionHandler.session.signal({
            data: JSON.stringify({ userId: userId, message: message }),
            type: 'chat'
        }).then(() => {
            console.log('Message successfully sent');
            chatInput.value = '';
        }).catch(error => {
            console.error(error);
        });
    }
}