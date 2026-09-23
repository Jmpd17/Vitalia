"use strict";

// Bienvenida y primera pregunta.
const startButton = document.querySelector("#start-button");
const welcomeScreen = document.querySelector("#welcome-screen");
const questionnaireScreen = document.querySelector("#questionnaire-screen");
const questionTitle = document.querySelector("#question-title");
const reasonForm = document.querySelector("#reason-form");
const reasonMessage = document.querySelector("#reason-message");

// Preferencias.
const preferencesScreen = document.querySelector("#preferences-screen");
const preferencesTitle = document.querySelector("#preferences-title");
const preferencesForm = document.querySelector("#preferences-form");
const preferenceSelect = document.querySelector("#preference");
const preferencesMessage = document.querySelector("#preferences-message");
const backButton = document.querySelector("#back-to-reason");

// Selección del médico.
const doctorScreen = document.querySelector("#doctor-screen");
const doctorTitle = document.querySelector("#doctor-title");
const doctorDescription = document.querySelector("#doctor-description");
const doctorForm = document.querySelector("#doctor-form");
const doctorSelect = document.querySelector("#doctor");
const doctorMessage = document.querySelector("#doctor-message");
const backToPreferences = document.querySelector("#back-to-preferences");

// Barra de progreso.
const bookingProgress = document.querySelector("#booking-progress");
const progressBar = document.querySelector("#booking-progress-bar");
const progressPercentage = document.querySelector("#progress-percentage");
const progressDescription = document.querySelector("#progress-description");

// Respuestas temporales.
const appointmentDraft = {
  reason: null,
  preference: null,
  doctorId: null,
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

// Profesionales ficticios para el prototipo.
const doctors = [
  {
    id: "MED-001",
    name: "Dra. Ana Torres",
    specialty: "general_medicine",
  },
  {
    id: "MED-002",
    name: "Dr. Carlos Peña",
    specialty: "general_medicine",
  },
  {
    id: "MED-003",
    name: "Dra. Lucía Gómez",
    specialty: "dermatology",
  },
  {
    id: "MED-004",
    name: "Dr. Mario Ruiz",
    specialty: "cardiology",
  },
];

// Lleva el foco al título de la pantalla.
function focusTitle(title) {
  title.setAttribute("tabindex", "-1");
  title.focus();
}

// Muestra una sola pantalla.
function showScreen(screen, title) {
  const screens = [
    welcomeScreen,
    questionnaireScreen,
    preferencesScreen,
    doctorScreen,
  ];

  screens.forEach((item) => {
    item.hidden = item !== screen;
  });

  bookingProgress.hidden = false;

  updateProgress();
  focusTitle(title);
}

// Cuenta las etapas completadas.
function updateProgress() {
  let completedStages = 0;

  if (appointmentDraft.reason !== null) {
    completedStages += 1;

    if (appointmentDraft.preference !== null) {
      completedStages += 1;
    }
  }

  // La etapa 3 todavía necesita fecha y horario.
  // Guardar solo el médico no aumenta el porcentaje.
  const description =
    `${completedStages} de 4 etapas completadas`;

  progressBar.value = completedStages;
  progressBar.textContent = description;

  progressPercentage.textContent =
    `${(completedStages / 4) * 100} %`;

  progressDescription.textContent = description;
}

function startQuestionnaire() {
  showScreen(questionnaireScreen, questionTitle);
}

// Opciones para la segunda pregunta.
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
    preferenceSelect.add(
      new Option(option.label, option.value)
    );
  });

  preferenceSelect.value = appointmentDraft.preference ?? "";
  preferencesMessage.textContent = "";

  showScreen(preferencesScreen, preferencesTitle);
}

// Guarda el motivo y avanza a preferencias.
function saveReason(event) {
  event.preventDefault();

  const selectedReason = new FormData(reasonForm).get("reason");

  if (!Object.keys(reasonLabels).includes(selectedReason)) {
    reasonMessage.textContent = "Selecciona una opción válida.";
    return;
  }

  if (appointmentDraft.reason !== selectedReason) {
    appointmentDraft.preference = null;
    appointmentDraft.doctorId = null;
  }

  appointmentDraft.reason = selectedReason;
  reasonMessage.textContent = "";

  showPreferences();
}

// Guarda la preferencia y avanza a médicos.
function savePreference(event) {
  event.preventDefault();

  const selectedOption = getPreferenceOptions().find(
    (option) => option.value === preferenceSelect.value
  );

  if (!selectedOption) {
    preferencesMessage.textContent = "Selecciona una opción válida.";
    return;
  }

  if (appointmentDraft.preference !== selectedOption.value) {
    appointmentDraft.doctorId = null;
  }

  appointmentDraft.preference = selectedOption.value;
  preferencesMessage.textContent = "";

  showDoctors();
}

function getSelectedSpecialty() {
  if (appointmentDraft.reason === "specialist") {
    return appointmentDraft.preference;
  }

  // Simplificación para consulta general y seguimiento.
  return "general_medicine";
}

function getAvailableDoctors() {
  return doctors.filter(
    (doctor) => doctor.specialty === getSelectedSpecialty()
  );
}

// Prepara el listado de médicos según la especialidad.
function showDoctors() {
  const specialty = specialtyOptions.find(
    (option) => option.value === getSelectedSpecialty()
  );

  doctorDescription.textContent =
    appointmentDraft.reason === "followup"
      ? "En este prototipo, el seguimiento se muestra con medicina general. No se consulta un expediente previo."
      : `Servicio seleccionado: ${specialty.label}.`;

  doctorSelect.replaceChildren(
    new Option("Selecciona un médico", "")
  );

  const availableDoctors = getAvailableDoctors();

  availableDoctors.forEach((doctor) => {
    doctorSelect.add(
      new Option(doctor.name, doctor.id)
    );
  });

  doctorSelect.value = appointmentDraft.doctorId ?? "";

  const hasDoctors = availableDoctors.length > 0;

  doctorSelect.disabled = !hasDoctors;

  doctorForm.querySelector('button[type="submit"]').disabled =
    !hasDoctors;

  doctorMessage.textContent = hasDoctors
    ? ""
    : "No hay profesionales de demostración para esta especialidad.";

  showScreen(doctorScreen, doctorTitle);
}

// Guarda el médico elegido.
function saveDoctor(event) {
  event.preventDefault();

  const selectedDoctor = getAvailableDoctors().find(
    (doctor) => doctor.id === doctorSelect.value
  );

  if (!selectedDoctor) {
    doctorMessage.textContent = "Selecciona un médico válido.";
    return;
  }

  appointmentDraft.doctorId = selectedDoctor.id;

  doctorMessage.textContent =
    `Médico seleccionado: ${selectedDoctor.name}. Falta elegir fecha y horario.`;
}

function goBackToReason() {
  showScreen(questionnaireScreen, questionTitle);
}

// Cambiar el motivo invalida las respuestas posteriores.
function clearReasonMessage() {
  appointmentDraft.reason = null;
  appointmentDraft.preference = null;
  appointmentDraft.doctorId = null;

  reasonMessage.textContent = "";
  preferencesMessage.textContent = "";
  doctorMessage.textContent = "";

  updateProgress();
}

// Cambiar la preferencia invalida el médico guardado.
function clearPreferenceMessage() {
  appointmentDraft.preference = null;
  appointmentDraft.doctorId = null;

  preferencesMessage.textContent = "";
  doctorMessage.textContent = "";

  updateProgress();
}

function clearDoctorMessage() {
  appointmentDraft.doctorId = null;
  doctorMessage.textContent = "";
}

// Conexión de botones y formularios.
startButton.addEventListener("click", startQuestionnaire);

reasonForm.addEventListener("submit", saveReason);
reasonForm.addEventListener("change", clearReasonMessage);

preferencesForm.addEventListener("submit", savePreference);
preferenceSelect.addEventListener("change", clearPreferenceMessage);
backButton.addEventListener("click", goBackToReason);

doctorForm.addEventListener("submit", saveDoctor);
doctorSelect.addEventListener("change", clearDoctorMessage);
backToPreferences.addEventListener("click", showPreferences);
