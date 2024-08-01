function zip(arr1, arr2) {
    const length = Math.min(arr1.length, arr2.length);
    return Array.from({ length }, (_, index) => [arr1[index], arr2[index]]);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 채팅 메시지를 화면에 추가하는 함수
function addMessageToChat(senderId, message, isLocal = false) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${isLocal ? 'You' : senderId}: ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addUserScreen(videoElement, streamManager) {
    const position = addStreamManager(streamManager);
    const target = addVideoElement(videoElement, position);
    connectionHandler.parentMap.set(streamManager.stream.connection.connectionId, target);
    addNickName(target, streamManager);
}

function addStreamManager(streamManager) {
    const creationTime = streamManager.stream.creationTime;

    let index = 0;
    for (; index < streamManagers.length; ++index) {
        const creationT = streamManagers[index].stream.creationTime;
        if (creationTime < creationT) break;
    }

    streamManagers.splice(index, 0, streamManager);

    return index;
}

function addVideoElement(videoElement, position) {
    const videoContainer = document.getElementById('video-container-test');
    const pos = videoContainer.children.item(position);

    const wrapper = Object.assign(document.createElement('div'), {className: 'video-box'});
    wrapper.appendChild(videoElement);

    pos.before(wrapper);
    videoContainer.removeChild(videoContainer.lastElementChild);

    return wrapper;
}

function addNickName(targetElement, streamManager) {
    // 닉네임 표시를 위한 요소 생성
    const nicknameElement = document.createElement('div');
    nicknameElement.className = 'nickname';
    nicknameElement.textContent = streamManager.stream.connection.data; // 연결 데이터에서 닉네임 추출
    targetElement.appendChild(nicknameElement);
}