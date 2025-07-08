export function initializeWebSocket() {
    const wsClient = new WebSocket('wss://localhost:9002');

    wsClient.addEventListener('open', handleWebSocketOpen);
    wsClient.addEventListener('message', handleWebSocketMessage);
    wsClient.addEventListener('close', handleWebSocketClose);
    wsClient.addEventListener('error', handleWebSocketError);

    return wsClient;
}

function handleWebSocketOpen(event) {
    console.log("✅ WebSocket connection opened:", event);
    displayMessage("WebSocket connection established (Secure).");
}

function handleWebSocketMessage(event) {
    try {
        const parsedData = JSON.parse(event.data);
        processServerMessage(parsedData);
    } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
    }
}

function handleWebSocketClose(event) {
    console.warn("⚠️ WebSocket connection closed:", event);
    displayMessage("WebSocket connection closed.");
}

function handleWebSocketError(event) {
    console.error("❌ WebSocket encountered an error:", event);
}

function processServerMessage(parsedData) {
    const dispText = document.getElementById('message_display');
    if (!dispText) {
        console.error("❌ Display element not found.");
        return;
    }

    if (parsedData.type === 'success') {
        dispText.textContent = `✅ Success: ${parsedData.message}`;
        console.log('📊 Data:', parsedData.data);
    } else if (parsedData.type === 'error') {
        dispText.textContent = `❌ Error: ${parsedData.error}`;
    } else {
        dispText.textContent = `❓ Unknown response: ${JSON.stringify(parsedData)}`;
    }
}

export function sendMessageToServer(wsClient, command, payload = {}) {
    if (wsClient.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ command, payload });
        wsClient.send(message);
        console.log("📤 Sent to server:", message);
    } else {
        console.error("❌ WebSocket is not open. Unable to send message.");
    }
}

function displayMessage(message) {
    const messageDisplay = document.getElementById('message_display');
    if (messageDisplay) {
        messageDisplay.textContent = message;
    } else {
        console.warn("⚠️ Message display element not found.");
    }
}

window.electronAPI.onIPCLogToRenderer(handleIPCLogToRenderer);

window.electronAPI.onIPCMsgToRenderer(handleIPCMsgToRenderer);

function handleIPCLogToRenderer(message) {
    console.log('controller.js handleIPCLogToRenderer\n Main Log:', message);
}

function handleIPCMsgToRenderer(reply) {
    console.log("controller.js handleIPCMsgToRenderer\n", reply);            // -> developer tools console
    // const dispText = document.getElementById('disp_text_2');
    // dispText.textContent = reply.error;

    // if (reply.type === 'success') {
    //     dispText.textContent = `Success: ${reply.message}`;
    //     console.log('Data:', reply.data);
    // } else if (reply.type === 'error') {
    //     dispText.textContent = `Error: ${reply.error}`;
    // } else {
    //     dispText.textContent = `Unknown response: ${JSON.stringify(reply)}`;
    // }
};
