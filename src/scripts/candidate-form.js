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

  // 3. Gestion du Stepper Progressif
  let currentStep = 1;
  let maxVisitedStep = 1;
  const totalSteps = 4;
  const stepPanels = form.querySelectorAll('.cand-step-panel');
  const checkpoints = document.querySelectorAll('.cand-step-checkpoint');
  const progressBar = document.getElementById('cand-timeline-progress-bar');
  const mobileStepIndicator = document.getElementById('cand-mobile-step-indicator');
  const mobileStepName = document.getElementById('cand-mobile-step-name');
  const stepperContainer = document.getElementById('candidate-stepper');

  const stepNames = [
    "Votre profil",
    "Votre parcours",
    "Vos disponibilités",
    "Validation finale"
  ];

  const getCheckedValues = (name) => {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((el) => el.value);
  };

  const validateStep = (step) => {
    form.querySelectorAll('[role="alert"]').forEach((el) => el.classList.add('hidden'));

    if (step === 1) {
      let valid = true;
      const firstName = document.getElementById('cand-firstName')?.value.trim();
      const lastName = document.getElementById('cand-lastName')?.value.trim();
      const phone = document.getElementById('cand-phone')?.value.trim();
      const email = document.getElementById('cand-email')?.value.trim();
      const city = document.getElementById('cand-city')?.value.trim();
      const isAdult = document.getElementById('cand-isAdult')?.checked;
      const languages = getCheckedValues('languages');

      if (!firstName) {
        document.getElementById('cand-firstName-error')?.classList.remove('hidden');
        document.getElementById('cand-firstName')?.focus();
        valid = false;
      }
      if (!lastName) {
        document.getElementById('cand-lastName-error')?.classList.remove('hidden');
        if (valid) document.getElementById('cand-lastName')?.focus();
        valid = false;
      }
      if (!phone || !isValidPhone(phone)) {
        document.getElementById('cand-phone-error')?.classList.remove('hidden');
        if (valid) document.getElementById('cand-phone')?.focus();
        valid = false;
      }
      if (!email || !isValidEmail(email)) {
        document.getElementById('cand-email-error')?.classList.remove('hidden');
        if (valid) document.getElementById('cand-email')?.focus();
        valid = false;
      }
      if (!city) {
        document.getElementById('cand-city-error')?.classList.remove('hidden');
        if (valid) document.getElementById('cand-city')?.focus();
        valid = false;
      }
      if (!isAdult) {
        document.getElementById('cand-isAdult-error')?.classList.remove('hidden');
        if (valid) document.getElementById('cand-isAdult')?.focus();
        valid = false;
      }
      if (languages.length === 0) {
        document.getElementById('cand-languages-error')?.classList.remove('hidden');
        valid = false;
      }
      return valid;
    }

    if (step === 2) {
      let valid = true;
      const desiredWorkTypes = getCheckedValues('desiredWorkTypes');
      if (desiredWorkTypes.length === 0) {
        document.getElementById('cand-desiredWorkTypes-error')?.classList.remove('hidden');
        valid = false;
      }
      return valid;
    }

    if (step === 3) {
      let valid = true;
      const availableDays = getCheckedValues('availableDays');
      const availableTimes = getCheckedValues('availableTimes');
      const workZones = getCheckedValues('workZones');

      if (availableDays.length === 0) {
        document.getElementById('cand-availableDays-error')?.classList.remove('hidden');
        valid = false;
      }
      if (availableTimes.length === 0) {
        document.getElementById('cand-availableTimes-error')?.classList.remove('hidden');
        valid = false;
      }
      if (workZones.length === 0) {
        document.getElementById('cand-workZones-error')?.classList.remove('hidden');
        valid = false;
      }
      return valid;
    }

    if (step === 4) {
      let valid = true;
      const consentAccuracy = document.getElementById('cand-consentAccuracy')?.checked;
      const consentContact = document.getElementById('cand-consentContact')?.checked;
      const consentPrivacy = document.getElementById('cand-consentPrivacy')?.checked;

      if (!consentAccuracy) {
        document.getElementById('cand-consentAccuracy-error')?.classList.remove('hidden');
        valid = false;
      }
      if (!consentContact) {
        document.getElementById('cand-consentContact-error')?.classList.remove('hidden');
        valid = false;
      }
      if (!consentPrivacy) {
        document.getElementById('cand-consentPrivacy-error')?.classList.remove('hidden');
        valid = false;
      }
      return valid;
    }

    return true;
  };

  const updateStepperUI = () => {
    // 1. Affichage des panneaux
    stepPanels.forEach((panel) => {
      const panelId = panel.id;
      const isTarget = panelId === `cand-step-panel-${currentStep}`;
      panel.classList.toggle('hidden', !isTarget);
    });

    // 2. Mise à jour visuelle des checkpoints
    checkpoints.forEach((cp) => {
      const stepTarget = parseInt(cp.getAttribute('data-step-target') || '1', 10);
      const nodeCircle = cp.querySelector('.checkpoint-node');
      const nodeNumber = cp.querySelector('.checkpoint-number');
      const nodeCheck = cp.querySelector('.checkpoint-check');
      const nodeLabel = cp.querySelector('.checkpoint-label');

      if (stepTarget < currentStep) {
        // Étape passée
        cp.classList.remove('opacity-60', 'cursor-not-allowed');
        cp.classList.add('cursor-pointer');
        cp.setAttribute('aria-selected', 'false');
        if (nodeCircle) {
          nodeCircle.className = "checkpoint-node w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-extrabold text-sm sm:text-base transition-all duration-300 shadow-xs bg-[#0E7C86] text-white";
        }
        if (nodeNumber) nodeNumber.classList.add('hidden');
        if (nodeCheck) nodeCheck.classList.remove('hidden');
        if (nodeLabel) {
          nodeLabel.className = "checkpoint-label text-xs sm:text-sm font-bold text-[#0B2A2E] block transition-colors";
        }
      } else if (stepTarget === currentStep) {
        // Étape active
        cp.classList.remove('opacity-60', 'cursor-not-allowed');
        cp.classList.add('cursor-pointer');
        cp.setAttribute('aria-selected', 'true');
        if (nodeCircle) {
          nodeCircle.className = "checkpoint-node w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-extrabold text-sm sm:text-base transition-all duration-300 shadow-xs bg-[#0E7C86] text-white ring-4 ring-[#0E7C86]/25";
        }
        if (nodeNumber) nodeNumber.classList.remove('hidden');
        if (nodeCheck) nodeCheck.classList.add('hidden');
        if (nodeLabel) {
          nodeLabel.className = "checkpoint-label text-xs sm:text-sm font-extrabold text-[#0E7C86] block transition-colors";
        }
      } else {
        // Étape future
        const canClick = stepTarget <= maxVisitedStep;
        cp.classList.toggle('opacity-60', !canClick);
        cp.classList.toggle('cursor-not-allowed', !canClick);
        cp.classList.toggle('cursor-pointer', canClick);
        cp.setAttribute('aria-selected', 'false');
        if (nodeCircle) {
          nodeCircle.className = "checkpoint-node w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-extrabold text-sm sm:text-base transition-all duration-300 shadow-xs bg-white text-[#3D5A5E] border-2 border-[#0E7C86]/25";
        }
        if (nodeNumber) nodeNumber.classList.remove('hidden');
        if (nodeCheck) nodeCheck.classList.add('hidden');
        if (nodeLabel) {
          nodeLabel.className = "checkpoint-label text-xs sm:text-sm font-semibold text-[#3D5A5E] block transition-colors";
        }
      }
    });

    // 3. Ligne de progression
    if (progressBar) {
      const pct = ((currentStep - 1) / (totalSteps - 1)) * 100;
      progressBar.style.width = `${pct}%`;
    }

    // 4. Indicateurs mobiles
    if (mobileStepIndicator) {
      mobileStepIndicator.textContent = `Étape ${currentStep} sur ${totalSteps}`;
    }
    if (mobileStepName) {
      mobileStepName.textContent = stepNames[currentStep - 1] || '';
    }
  };

  const goToStep = (targetStep, smoothScroll = true) => {
    if (targetStep === currentStep) return;

    if (targetStep > currentStep) {
      for (let s = currentStep; s < targetStep; s++) {
        if (!validateStep(s)) {
          return;
        }
      }
    }

    currentStep = targetStep;
    if (currentStep > maxVisitedStep) {
      maxVisitedStep = currentStep;
    }

    updateStepperUI();

    if (smoothScroll && stepperContainer) {
      stepperContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Boutons Suivant / Précédent
  form.querySelectorAll('.btn-step-next').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-target') || '1', 10);
      goToStep(target);
    });
  });

  form.querySelectorAll('.btn-step-prev').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-target') || '1', 10);
      goToStep(target);
    });
  });

  // Clics sur les checkpoints
  checkpoints.forEach((cp) => {
    cp.addEventListener('click', () => {
      const target = parseInt(cp.getAttribute('data-step-target') || '1', 10);
      if (target <= maxVisitedStep || target <= currentStep) {
        goToStep(target);
      }
    });
  });

  // URL step param (?step=2)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = parseInt(urlParams.get('step') || '1', 10);
    if (stepParam >= 1 && stepParam <= totalSteps) {
      currentStep = stepParam;
      maxVisitedStep = stepParam;
    }
  } catch (e) {
    // ignore
  }

  // Initialisation UI
  updateStepperUI();

  // 4. Soumission finale du formulaire
  const errorSummary = document.getElementById('cand-error-summary');
  const errorSummaryList = document.getElementById('cand-error-summary-list');
  const submitBtn = document.getElementById('cand-submit-btn');
  const submitText = document.getElementById('cand-submit-text');
  const submitSpinner = document.getElementById('cand-submit-spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation globale de chaque étape
    for (let s = 1; s <= totalSteps; s++) {
      if (!validateStep(s)) {
        goToStep(s);

        if (errorSummary && errorSummaryList) {
          errorSummaryList.innerHTML = '';
          const activeErrors = form.querySelectorAll('.cand-step-panel:not(.hidden) [role="alert"]:not(.hidden)');
          activeErrors.forEach((errEl) => {
            const li = document.createElement('li');
            li.textContent = errEl.textContent.trim();
            errorSummaryList.appendChild(li);
          });
          if (activeErrors.length > 0) {
            errorSummary.classList.remove('hidden');
            errorSummary.focus();
            errorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        return;
      }
    }

    if (errorSummary) errorSummary.classList.add('hidden');

    // Verrouillage du bouton
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Envoi en cours…';
    if (submitSpinner) submitSpinner.classList.remove('hidden');

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.languages = getCheckedValues('languages');
      payload.desiredWorkTypes = getCheckedValues('desiredWorkTypes');
      payload.availableDays = getCheckedValues('availableDays');
      payload.availableTimes = getCheckedValues('availableTimes');
      payload.workZones = getCheckedValues('workZones');
      payload.transportModes = getCheckedValues('transportModes');
      payload.trainingTopics = getCheckedValues('trainingTopics');
      payload.isAdult = document.getElementById('cand-isAdult')?.checked || false;
      payload.consentAccuracy = document.getElementById('cand-consentAccuracy')?.checked || false;
      payload.consentContact = document.getElementById('cand-consentContact')?.checked || false;
      payload.consentPrivacy = document.getElementById('cand-consentPrivacy')?.checked || false;

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
        if (submitText) submitText.textContent = 'Envoyer mon dossier de candidature';
        if (submitSpinner) submitSpinner.classList.add('hidden');
      }
    } catch {
      alert('Erreur de connexion. Veuillez vérifier votre accès internet.');
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Envoyer mon dossier de candidature';
      if (submitSpinner) submitSpinner.classList.add('hidden');
    }
  });
}
