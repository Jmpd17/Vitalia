"use strict";

const startButton = document.querySelector("#start-button");
const welcomeScreen = document.querySelector("#welcome-screen");
const questionnaireScreen = document.querySelector("#questionnaire-screen");
const questionTitle = document.querySelector("#question-title");
const reasonForm = document.querySelector("#reason-form");
const reasonMessage = document.querySelector("#reason-message");

const appointmentDraft = {
  reason: null,
};

const reasonLabels = {
  general: "Consulta general",
  specialist: "Consulta con especialista",
  followup: "Consulta de seguimiento",
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
    reasonMessage.textContent =
      "Por favor, selecciona una opción válida.";

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

startButton.addEventListener("click", startQuestionnaire);
reasonForm.addEventListener("submit", saveReason);
reasonForm.addEventListener("change", clearReasonMessage);
