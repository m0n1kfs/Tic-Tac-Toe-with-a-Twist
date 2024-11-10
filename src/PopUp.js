import { launchConfetti } from '/src/launchConfetti.js';

export function showSequentialMessages(messages, callback) {
    let currentIndex = 0;

    const popupContainer = document.createElement("div");
    popupContainer.className = "sequential-popup show";

    const messageElement = document.createElement("p");
    messageElement.innerText = messages[currentIndex];

    const nextButton = document.createElement("button");
    nextButton.innerText = "→";
    nextButton.className = "next-button";

    const nextHandler = () => {
        currentIndex++;
        if (currentIndex < messages.length) {
            messageElement.innerText = messages[currentIndex];
        } else {
            popupContainer.classList.remove("show");
            popupContainer.style.opacity = "0";
            setTimeout(() => {
                nextButton.removeEventListener("click", nextHandler);
                if (popupContainer.parentNode) {
                    popupContainer.parentNode.removeChild(popupContainer);
                }
                if (callback) callback();
            }, 300);
        }
    };

    nextButton.addEventListener("click", nextHandler);

    popupContainer.appendChild(messageElement);
    popupContainer.appendChild(nextButton);

    document.body.appendChild(popupContainer);
}

export function showSingleMessage(message, isWinner = false, callback) {
    const popup = document.createElement("div");
    popup.className = "single-popup show";
    if (isWinner) {
        popup.classList.add("winner-popup");
        launchConfetti(); 
    }
    popup.innerText = message;

    const nextButton = document.createElement("button");
    nextButton.innerText = "→";
    nextButton.className = "next-button";

    const nextHandler = () => {
        popup.classList.remove("show");
        popup.style.opacity = "0";
        setTimeout(() => {
            nextButton.removeEventListener("click", nextHandler);
            popup.remove();
            if (callback) callback();
        }, 300);
    };

    nextButton.addEventListener("click", nextHandler);

    popup.appendChild(nextButton);
    document.body.appendChild(popup);
}
