"use strict";

const startButton = document.querySelector("#start-button");
const welcomeScreen = document.querySelector("#welcome-screen");
const questionnaireScreen = document.querySelector("#questionnaire-screen");
const questionTitle = document.querySelector("#question-title");
const reasonForm = document.querySelector("#reason-form");
const reasonMessage = document.querySelector("#reason-message");

const preferencesScreen = document.querySelector("#preferences-screen");
const preferencesTitle = document.querySelector("#preferences-title");
const preferencesForm = document.querySelector("#preferences-form");
const preferenceSelect = document.querySelector("#preference");
const preferencesMessage = document.querySelector("#preferences-message");
const backButton = document.querySelector("#back-to-reason");

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

function focusTitle(title) {
  title.setAttribute("tabindex", "-1");
  title.focus();
}

function startQuestionnaire() {
  welcomeScreen.hidden = true;
  questionnaireScreen.hidden = false;

  focusTitle(questionTitle);
}

function getPreferenceOptions() {
  return appointmentDraft.reason === "specialist"
    ? specialtyOptions
    : scheduleOptions;
}

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
    preferenceSelect.add(new Option(option.label, option.value));
  });

  preferenceSelect.value = appointmentDraft.preference ?? "";
  preferencesMessage.textContent = "";

  questionnaireScreen.hidden = true;
  preferencesScreen.hidden = false;

  focusTitle(preferencesTitle);
}

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
}

function goBackToReason() {
  preferencesScreen.hidden = true;
  questionnaireScreen.hidden = false;

  focusTitle(questionTitle);
}

function clearReasonMessage() {
  reasonMessage.textContent = "";
}

function clearPreferenceMessage() {
  appointmentDraft.preference = null;
  preferencesMessage.textContent = "";
}

startButton.addEventListener("click", startQuestionnaire);
reasonForm.addEventListener("submit", saveReason);
reasonForm.addEventListener("change", clearReasonMessage);

preferencesForm.addEventListener("submit", savePreference);
preferenceSelect.addEventListener("change", clearPreferenceMessage);
backButton.addEventListener("click", goBackToReason);
