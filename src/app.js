import { initializeWebSocket } from './controller.js';
import { sendMessageToServer } from './controller.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded. Initializing app...");

    // Get the app container
    const appContainer = document.getElementById("app");

    if (!appContainer) {
        console.error("❌ Error: 'app' container not found in index.html.");
        return;
    }

    // Create Buttons and Input Fields
    const getUsersButton = document.createElement("button");
    getUsersButton.textContent = "Get Users";
    getUsersButton.id = "getUsersButton";

    const nameInput = document.createElement("input");
    nameInput.id = "nameInput";
    nameInput.type = "text";
    nameInput.placeholder = "Enter name";

    const ageInput = document.createElement("input");
    ageInput.id = "ageInput";
    ageInput.type = "number";
    ageInput.placeholder = "Enter age";

    const addUserButton = document.createElement("button");
    addUserButton.textContent = "Add User";
    addUserButton.id = "addUserButton";

    // Append Elements to the Container
    appContainer.appendChild(getUsersButton);
    appContainer.appendChild(document.createElement("br"));
    appContainer.appendChild(nameInput);
    appContainer.appendChild(ageInput);
    appContainer.appendChild(addUserButton);

    console.log("✅ UI elements added.");

    // Initialize WebSocket
    const wsClient = initializeWebSocket();

    // Event Listeners for Buttons
    getUsersButton.addEventListener("click", () => {
        sendMessageToServer(wsClient, "getUsers");
    });

    addUserButton.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const age = ageInput.value.trim();

        if (name && age) {
            sendMessageToServer(wsClient, "addUser", { name, age });
        } else {
            console.warn("⚠️ Please enter both name and age.");
        }
    });
});
