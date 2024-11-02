export function showPopupMessages(messages) {
    let currentIndex = 0;

    const popupContainer = document.createElement("div");
    popupContainer.className = "pop-up show";

    const messageElement = document.createElement("p");
    messageElement.innerText = messages[currentIndex];

    const nextButton = document.createElement("button");
    nextButton.innerText = "→";
    nextButton.className = "next-button";

    nextButton.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex < messages.length) {
            messageElement.innerText = messages[currentIndex];
        } else {
            popupContainer.classList.remove("show");
            popupContainer.style.opacity = "0";
            setTimeout(() => document.body.removeChild(popupContainer), 300);
        }
    });

    popupContainer.appendChild(messageElement);
    popupContainer.appendChild(nextButton);

    const board = document.querySelector(".tic-tac-toe-board");
    board.parentNode.insertBefore(popupContainer, board);
}