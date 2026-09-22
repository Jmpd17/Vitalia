"use strict";

// Elementos de la bienvenida y la primera pregunta.
const startButton = document.querySelector("#start-button");
const welcomeScreen = document.querySelector("#welcome-screen");
const questionnaireScreen = document.querySelector("#questionnaire-screen");
const questionTitle = document.querySelector("#question-title");
const reasonForm = document.querySelector("#reason-form");
const reasonMessage = document.querySelector("#reason-message");

// Elementos de la segunda pregunta.
const preferencesScreen = document.querySelector("#preferences-screen");
const preferencesTitle = document.querySelector("#preferences-title");
const preferencesForm = document.querySelector("#preferences-form");
const preferenceSelect = document.querySelector("#preference");
const preferencesMessage = document.querySelector("#preferences-message");
const backButton = document.querySelector("#back-to-reason");

// Elementos de la barra de progreso.
const bookingProgress = document.querySelector("#booking-progress");
const progressBar = document.querySelector("#booking-progress-bar");
const progressPercentage = document.querySelector("#progress-percentage");
const progressDescription = document.querySelector("#progress-description");

// Respuestas temporales. Se borran al recargar la página.
const appointmentDraft = {
  reason: null,
  preference: null,
};

const reasonLabels = {
  general: "Consulta general",
  specialist: "Consulta con especialista",
  followup: "Consulta de seguimiento",
};

const scheduleOptions = [
  { value: "morning", label: "Por la mañana" },
  { value: "afternoon", label: "Por la tarde" },
];

const specialtyOptions = [
  { value: "general_medicine", label: "Medicina general" },
  { value: "dermatology", label: "Dermatología" },
  { value: "cardiology", label: "Cardiología" },
];

// Coloca el foco en el título de la pantalla que se abre.
function focusTitle(title) {
  title.setAttribute("tabindex", "-1");
  title.focus();
}

// Calcula el progreso según las etapas guardadas.
function updateProgress() {
  let completedStages = 0;

  if (appointmentDraft.reason !== null) {
    completedStages += 1;

    if (appointmentDraft.preference !== null) {
      completedStages += 1;
    }
  }

  const percentage = (completedStages / 4) * 100;
  const description =
    `${completedStages} de 4 etapas completadas`;

  progressBar.value = completedStages;
  progressBar.textContent = description;
  progressPercentage.textContent = `${percentage} %`;
  progressDescription.textContent = description;
}

// Abre la primera pregunta.
function startQuestionnaire() {
  welcomeScreen.hidden = true;
  questionnaireScreen.hidden = false;
  preferencesScreen.hidden = true;
  bookingProgress.hidden = false;

  updateProgress();
  focusTitle(questionTitle);
}

// Determina las opciones correspondientes al motivo elegido.
function getPreferenceOptions() {
  return appointmentDraft.reason === "specialist"
    ? specialtyOptions
    : scheduleOptions;
}

// Prepara y muestra la segunda pregunta.
function showPreferences() {
  const titles = {
    general: "¿En qué horario prefieres tu consulta?",
    specialist: "¿Qué especialidad necesitas?",
    followup: "¿En qué horario prefieres tu seguimiento?",
  };

  preferencesTitle.textContent = titles[appointmentDraft.reason];

  preferenceSelect.replaceChildren(
    new Option("Selecciona una opción", "")
  );

  getPreferenceOptions().forEach((option) => {
    preferenceSelect.add(
      new Option(option.label, option.value)
    );
  });

  preferenceSelect.value = appointmentDraft.preference ?? "";
  preferencesMessage.textContent = "";

  questionnaireScreen.hidden = true;
  preferencesScreen.hidden = false;

  updateProgress();
  focusTitle(preferencesTitle);
}

// Valida y guarda el motivo antes de continuar.
function saveReason(event) {
  event.preventDefault();

  const formData = new FormData(reasonForm);
  const selectedReason = formData.get("reason");

  if (!Object.keys(reasonLabels).includes(selectedReason)) {
    reasonMessage.textContent = "Selecciona una opción válida.";
    return;
  }

  if (appointmentDraft.reason !== selectedReason) {
    appointmentDraft.preference = null;
  }

  appointmentDraft.reason = selectedReason;
  reasonMessage.textContent = "";

  showPreferences();
}

// Valida y guarda la preferencia.
function savePreference(event) {
  event.preventDefault();

  const selectedOption = getPreferenceOptions().find(
    (option) => option.value === preferenceSelect.value
  );

  if (!selectedOption) {
    preferencesMessage.textContent = "Selecciona una opción válida.";
    return;
  }

  appointmentDraft.preference = selectedOption.value;

  preferencesMessage.textContent =
    `Preferencia guardada: ${selectedOption.label}.`;

  updateProgress();
}

// Regresa sin borrar las respuestas guardadas.
function goBackToReason() {
  preferencesScreen.hidden = true;
  questionnaireScreen.hidden = false;

  focusTitle(questionTitle);
}

// Cambiar el motivo invalida ambas respuestas guardadas.
function clearReasonMessage() {
  appointmentDraft.reason = null;
  appointmentDraft.preference = null;

  reasonMessage.textContent = "";
  preferencesMessage.textContent = "";

  updateProgress();
}

// Cambiar la preferencia requiere guardarla nuevamente.
function clearPreferenceMessage() {
  appointmentDraft.preference = null;
  preferencesMessage.textContent = "";

  updateProgress();
}

// Conexión de botones y formularios.
startButton.addEventListener("click", startQuestionnaire);
reasonForm.addEventListener("submit", saveReason);
reasonForm.addEventListener("change", clearReasonMessage);

preferencesForm.addEventListener("submit", savePreference);
preferenceSelect.addEventListener("change", clearPreferenceMessage);
backButton.addEventListener("click", goBackToReason);
