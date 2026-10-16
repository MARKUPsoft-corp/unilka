import { isValidPhone, isValidEmail } from './form-validator.js';

export function initCandidateForm() {
  const form = document.getElementById('candidate-form');
  if (!form) return;

  // 1. Toggles conditionnels
  const toggleVisibility = (element, shouldShow) => {
    if (element) element.classList.toggle('hidden', !shouldShow);
  };

  // Expérience
  const expBlock = document.getElementById('cand-experienceDetailsBlock');
  form.querySelectorAll('input[name="hasExperience"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      toggleVisibility(expBlock, form.querySelector('input[name="hasExperience"]:checked')?.value === 'Oui');
    });
  });

  // Situation actuelle (Autre)
  const sitOther = document.getElementById('cand-situationOtherContainer');
  form.querySelectorAll('input[name="currentSituation"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      toggleVisibility(sitOther, form.querySelector('input[name="currentSituation"]:checked')?.value === 'Autre');
    });
  });

  // Langues (Autre)
  const langOtherBox = form.querySelector('input[name="languages"][value="Autre"]');
  const langOtherCont = document.getElementById('cand-langOtherContainer');
  langOtherBox?.addEventListener('change', () => {
    toggleVisibility(langOtherCont, langOtherBox.checked);
  });

  // Transport (Autre)
  const transOtherBox = form.querySelector('input[name="transportModes"][value="Autre"]');
  const transOtherCont = document.getElementById('cand-transportOtherContainer');
  transOtherBox?.addEventListener('change', () => {
    toggleVisibility(transOtherCont, transOtherBox.checked);
  });

  // Formation
  const trainBlock = document.getElementById('cand-trainingsListBlock');
  form.querySelectorAll('input[name="wantsTraining"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const val = form.querySelector('input[name="wantsTraining"]:checked')?.value;
      toggleVisibility(trainBlock, val !== 'Non');
    });
  });

  const topicOtherBox = form.querySelector('input[name="trainingTopics"][value="Autre"]');
  const topicOtherCont = document.getElementById('cand-trainingOtherContainer');
  topicOtherBox?.addEventListener('change', () => {
    toggleVisibility(topicOtherCont, topicOtherBox.checked);
  });

  // 2. Compteur de caractères pour compétences
  const skillsInput = document.getElementById('cand-skills');
  const skillsCounter = document.getElementById('char-count-candSkills');
  skillsInput?.addEventListener('input', () => {
    if (skillsCounter) skillsCounter.textContent = `${skillsInput.value.length} / 800`;
  });

  // 3. Validation & Soumission
  const errorSummary = document.getElementById('cand-error-summary');
  const errorSummaryList = document.getElementById('cand-error-summary-list');
  const submitBtn = document.getElementById('cand-submit-btn');
  const submitText = document.getElementById('cand-submit-text');
  const submitSpinner = document.getElementById('cand-submit-spinner');

  const getCheckedValues = (name) => {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((el) => el.value);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errors = [];

    // Reset des erreurs
    if (errorSummary) errorSummary.classList.add('hidden');
    form.querySelectorAll('[role="alert"]').forEach((el) => el.classList.add('hidden'));

    // Lecture des champs
    const firstName = document.getElementById('cand-firstName')?.value.trim();
    const lastName = document.getElementById('cand-lastName')?.value.trim();
    const phone = document.getElementById('cand-phone')?.value.trim();
    const email = document.getElementById('cand-email')?.value.trim();
    const city = document.getElementById('cand-city')?.value.trim();
    const isAdult = document.getElementById('cand-isAdult')?.checked;
    const languages = getCheckedValues('languages');
    const desiredWorkTypes = getCheckedValues('desiredWorkTypes');
    const availableDays = getCheckedValues('availableDays');
    const availableTimes = getCheckedValues('availableTimes');
    const workZones = getCheckedValues('workZones');
    const consentAccuracy = document.getElementById('cand-consentAccuracy')?.checked;
    const consentContact = document.getElementById('cand-consentContact')?.checked;
    const consentPrivacy = document.getElementById('cand-consentPrivacy')?.checked;

    // Contrôles
    if (!firstName) {
      errors.push({ id: 'cand-firstName', message: 'Le prénom est obligatoire.' });
      document.getElementById('cand-firstName-error')?.classList.remove('hidden');
    }
    if (!lastName) {
      errors.push({ id: 'cand-lastName', message: 'Le nom est obligatoire.' });
      document.getElementById('cand-lastName-error')?.classList.remove('hidden');
    }
    if (!phone || !isValidPhone(phone)) {
      errors.push({ id: 'cand-phone', message: 'Veuillez saisir un numéro de téléphone valide.' });
      document.getElementById('cand-phone-error')?.classList.remove('hidden');
    }
    if (!email || !isValidEmail(email)) {
      errors.push({ id: 'cand-email', message: 'Veuillez saisir une adresse courriel valide.' });
      document.getElementById('cand-email-error')?.classList.remove('hidden');
    }
    if (!city) {
      errors.push({ id: 'cand-city', message: 'La ville de résidence est obligatoire.' });
      document.getElementById('cand-city-error')?.classList.remove('hidden');
    }
    if (!isAdult) {
      errors.push({ id: 'cand-isAdult', message: 'Vous devez confirmer que vous avez 18 ans ou plus.' });
      document.getElementById('cand-isAdult-error')?.classList.remove('hidden');
    }
    if (languages.length === 0) {
      errors.push({ id: 'lang-Français', message: 'Veuillez sélectionner au moins une langue parlée.' });
      document.getElementById('cand-languages-error')?.classList.remove('hidden');
    }
    if (desiredWorkTypes.length === 0) {
      errors.push({ id: 'cand-desiredWorkTypes-error', message: 'Veuillez choisir au moins un type de travail recherché.' });
      document.getElementById('cand-desiredWorkTypes-error')?.classList.remove('hidden');
    }
    if (availableDays.length === 0) {
      errors.push({ id: 'cand-availableDays-error', message: 'Veuillez sélectionner au moins un jour disponible.' });
      document.getElementById('cand-availableDays-error')?.classList.remove('hidden');
    }
    if (availableTimes.length === 0) {
      errors.push({ id: 'cand-availableTimes-error', message: 'Veuillez sélectionner au moins un moment de la journée.' });
      document.getElementById('cand-availableTimes-error')?.classList.remove('hidden');
    }
    if (workZones.length === 0) {
      errors.push({ id: 'cand-workZones-error', message: 'Veuillez choisir au moins une zone de travail.' });
      document.getElementById('cand-workZones-error')?.classList.remove('hidden');
    }
    if (!consentAccuracy) {
      errors.push({ id: 'cand-consentAccuracy', message: "Veuillez confirmer l'exactitude des informations." });
      document.getElementById('cand-consentAccuracy-error')?.classList.remove('hidden');
    }
    if (!consentContact) {
      errors.push({ id: 'cand-consentContact', message: "Veuillez accepter d'être contacté(e)." });
      document.getElementById('cand-consentContact-error')?.classList.remove('hidden');
    }
    if (!consentPrivacy) {
      errors.push({ id: 'cand-consentPrivacy', message: 'Veuillez accepter la politique de confidentialité.' });
      document.getElementById('cand-consentPrivacy-error')?.classList.remove('hidden');
    }

    if (errors.length > 0) {
      if (errorSummary && errorSummaryList) {
        errorSummaryList.innerHTML = '';
        errors.forEach((err) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${err.id}`;
          a.className = 'text-brand-error underline font-semibold hover:text-red-800';
          a.textContent = err.message;
          li.appendChild(a);
          errorSummaryList.appendChild(li);
        });
        errorSummary.classList.remove('hidden');
        errorSummary.focus();
        errorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Verrouillage du bouton
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Envoi en cours…';
    if (submitSpinner) submitSpinner.classList.remove('hidden');

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.languages = languages;
      payload.desiredWorkTypes = desiredWorkTypes;
      payload.availableDays = availableDays;
      payload.availableTimes = availableTimes;
      payload.workZones = workZones;
      payload.transportModes = getCheckedValues('transportModes');
      payload.trainingTopics = getCheckedValues('trainingTopics');

      const res = await fetch('/api/candidature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        alert(result.error || "Une erreur est survenue lors de l'envoi de votre candidature.");
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.textContent = 'Envoyer mon inscription';
        if (submitSpinner) submitSpinner.classList.add('hidden');
      }
    } catch {
      alert('Erreur de connexion. Veuillez vérifier votre accès internet.');
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Envoyer mon inscription';
      if (submitSpinner) submitSpinner.classList.add('hidden');
    }
  });
}
