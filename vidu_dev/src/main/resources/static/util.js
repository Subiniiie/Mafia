function addMessageToChat(senderId, message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${senderId}: ${message}`;
    elements.chatMessages.appendChild(messageElement);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}