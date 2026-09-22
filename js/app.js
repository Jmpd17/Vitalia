"use strict";

const startButton = document.querySelector("#start-button");
const statusMessage = document.querySelector("#status-message");
const questionnaireScreen = document.querySelector("#questionnaire-screen");
const questionTitle = document.querySelector("#question-title");
const reasonForm = document.querySelector("#reason-form");
const reasonInput = document.querySelector("#reason-input");

const appointmentData = {
    reason:null,
};
const reasonLabels = {
    general: "Consulta general",
    specialist: "Consulta con especialista",
    followUp: "Seguimiento de tratamiento",
};

function startQuestionnaire() {
    welcomeScreen.hidden = true;
    questionnaireScreen.hidden = false;

    questionTitle.setAttribute("tabindex", "-1");
    questionTitle.focus();
}

function saveReason(event) {
    event.preventDefault();

    const formData = new FormData(reasonForm);
    const selectedReason = formData.get("reason");

    if (!Object.keys(reasonLabels).includes(selectedReason)) {
        reasonMessage.textContent = "Por favor, selecciona una opcion valida.";
        return;
    }


    appointmentDraft.reason = selectedReason;

    reasonMessage.textContent =
    `Respuesta guardada: ${reasonLabels[selectedReason]}.`;
}

function clearReasonMessage() {
    appointmentDraft.reason = null;
    reasonMessage.textContent = "";
}



startButton.addEventListener("click", showStartMessage);
reasonForm.addEventListener("submit", saveReason);
reasonForm.addEventListener("change", clearReasonMessage);
