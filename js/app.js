"use strict";

const startButton = document.querySelector("start-button");
const statusMessage = document.querySelector("#status-message");

function showStartMessage() {
    statusMessage.textContent =
    "¡Todo conectado! El siguiente paso sera contruir el cuestionario";
}

startButton.addEventListener("click", showStartMessage);
