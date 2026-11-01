import { compressPhoto, formatBytes, MAX_PHOTOS } from './photo-compressor.js';
import { isValidCanadianPostalCode, isValidPhone, isValidEmail, validateContactMethods } from './form-validator.js';

export function initSubmissionForm() {
  const form = document.getElementById('submission-form');
  if (!form) return;

  const blockResidential = document.getElementById('block-residential');
  const blockCommercial = document.getElementById('block-commercial');
  const blockSpecialized = document.getElementById('block-specialized');
  const housingTypeSelect = document.getElementById('housingType');
  const housingTypeOtherContainer = document.getElementById('housingTypeOtherContainer');
  const descRequiredStar = document.getElementById('description-required-star');
  const descriptionInput = document.getElementById('description');

  // Affichage conditionnel selon le service (Section 9.1)
  const serviceRadios = form.querySelectorAll('input[name="serviceType"]');
  const updateServiceBlocks = () => {
    const selected = form.querySelector('input[name="serviceType"]:checked')?.value;
    
    if (blockResidential) blockResidential.classList.toggle('hidden', selected !== 'residentiel');
    if (blockCommercial) blockCommercial.classList.toggle('hidden', selected !== 'commercial');
    if (blockSpecialized) blockSpecialized.classList.toggle('hidden', selected !== 'specialise');

    // Description obligatoire si spécialisé
    if (selected === 'specialise') {
      if (descRequiredStar) descRequiredStar.classList.remove('hidden');
    } else {
      if (descRequiredStar) descRequiredStar.classList.add('hidden');
    }
  };

  serviceRadios.forEach(radio => radio.addEventListener('change', updateServiceBlocks));
  updateServiceBlocks();

  // Affichage du champ "Précisez" pour Autre type de logement
  if (housingTypeSelect && housingTypeOtherContainer) {
    housingTypeSelect.addEventListener('change', () => {
      housingTypeOtherContainer.classList.toggle('hidden', housingTypeSelect.value !== 'Autre');
    });
  }

  // Compteurs de caractères
  const bindCharCount = (inputId, countId, max) => {
    const input = document.getElementById(inputId);
    const count = document.getElementById(countId);
    if (input && count) {
      input.addEventListener('input', () => {
        count.textContent = `${input.value.length} / ${max}`;
      });
    }
  };
  bindCharCount('description', 'char-count-description', 1500);
  bindCharCount('comments', 'char-count-comments', 1000);

  // Gestion des photos (Section 9.2)
  const photoInput = document.getElementById('photo-input');
  const dropzone = document.getElementById('photo-dropzone');
  const previewList = document.getElementById('photo-preview-list');
  const photoError = document.getElementById('photo-error-message');
  let selectedPhotos = [];

  const updatePhotoPreviews = () => {
    if (!previewList) return;
    previewList.innerHTML = '';
    
    selectedPhotos.forEach((photo, index) => {
      const card = document.createElement('div');
      card.className = "flex items-center gap-3 p-3 bg-[#F8FCFC] border border-[#0E7C86]/20 rounded-xl relative group shadow-2xs";
      card.innerHTML = `
        <img src="${photo.dataUrl}" alt="Aperçu photo ${index + 1}" class="w-14 h-14 rounded-lg object-cover shrink-0 border border-[#0E7C86]/20 shadow-xs" />
        <div class="overflow-hidden flex-1 text-xs">
          <p class="font-extrabold text-[#0B2A2E] truncate">${photo.name}</p>
          <p class="text-[11px] font-semibold text-[#0E7C86] mt-0.5">${formatBytes(photo.size)}</p>
        </div>
        <button type="button" class="remove-photo-btn p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" aria-label="Retirer cette photo">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      `;

      card.querySelector('.remove-photo-btn')?.addEventListener('click', () => {
        selectedPhotos.splice(index, 1);
        updatePhotoPreviews();
      });

      previewList.appendChild(card);
    });
  };

  const handleFiles = async (files) => {
    if (photoError) photoError.classList.add('hidden');

    if (selectedPhotos.length + files.length > MAX_PHOTOS) {
      if (photoError) {
        photoError.textContent = "Vous pouvez joindre jusqu'à 3 photos.";
        photoError.classList.remove('hidden');
      }
      return;
    }

    for (const file of Array.from(files)) {
      try {
        const compressed = await compressPhoto(file);
        selectedPhotos.push(compressed);
      } catch (err) {
        if (photoError) {
          photoError.textContent = err.message || "Erreur lors du traitement de l'image.";
          photoError.classList.remove('hidden');
        }
      }
    }
    updatePhotoPreviews();
  };

  if (dropzone && photoInput) {
    dropzone.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', (e) => {
      if (e.target.files) handleFiles(e.target.files);
    });

    ['dragenter', 'dragover'].forEach(event => {
      dropzone.addEventListener(event, (e) => {
        e.preventDefault();
        dropzone.classList.add('bg-brand-primary-light/40');
      });
    });

    ['dragleave', 'drop'].forEach(event => {
      dropzone.addEventListener(event, (e) => {
        e.preventDefault();
        dropzone.classList.remove('bg-brand-primary-light/40');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
    });
  }

  // --- GESTION DU STEPPER PROGRESSIF AVEC TIMELINE CHECKPOINTS ---
  let currentStep = 1;
  let maxVisitedStep = 1;
  const totalSteps = 4;
  const stepPanels = form.querySelectorAll('.form-step-panel');
  const checkpoints = document.querySelectorAll('.step-checkpoint');
  const progressBar = document.getElementById('timeline-progress-bar');
  const mobileStepIndicator = document.getElementById('mobile-step-indicator');
  const mobileStepName = document.getElementById('mobile-step-name');
  const stepperContainer = document.getElementById('submission-stepper');

  const stepNames = [
    "Votre service",
    "Localisation",
    "Votre espace",
    "Vos coordonnées"
  ];

  // Validation par étape
  const validateStep = (step) => {
    // Reset erreurs
    form.querySelectorAll('[role="alert"]').forEach(el => el.classList.add('hidden'));
    if (errorSummary) errorSummary.classList.add('hidden');

    if (step === 1) {
      const serviceType = form.querySelector('input[name="serviceType"]:checked')?.value;
      const freq = form.querySelector('input[name="frequency"]:checked')?.value;
      if (!serviceType || !freq) return false;
      return true;
    }

    if (step === 2) {
      const city = document.getElementById('city')?.value.trim();
      const postalCode = document.getElementById('postalCode')?.value.trim();
      let valid = true;

      if (!city) {
        document.getElementById('city-error')?.classList.remove('hidden');
        document.getElementById('city')?.focus();
        valid = false;
      }

      if (!postalCode || !isValidCanadianPostalCode(postalCode)) {
        document.getElementById('postalCode-error')?.classList.remove('hidden');
        if (valid) document.getElementById('postalCode')?.focus();
        valid = false;
      }

      return valid;
    }

    if (step === 3) {
      const serviceType = form.querySelector('input[name="serviceType"]:checked')?.value;
      if (serviceType === 'specialise') {
        const checkedSpecialized = form.querySelectorAll('input[name="specializedItems"]:checked');
        if (checkedSpecialized.length === 0) {
          document.getElementById('specializedItems-error')?.classList.remove('hidden');
          return false;
        }
        if (!descriptionInput?.value.trim()) {
          document.getElementById('description-error')?.classList.remove('hidden');
          descriptionInput?.focus();
          return false;
        }
      }
      return true;
    }

    return true;
  };

  const updateStepperUI = () => {
    // 1. Panneaux de formulaire
    stepPanels.forEach((panel) => {
      const panelId = panel.id;
      const isTarget = panelId === `step-panel-${currentStep}`;
      panel.classList.toggle('hidden', !isTarget);
    });

    // 2. Timeline Checkpoints
    checkpoints.forEach((cp) => {
      const stepTarget = parseInt(cp.getAttribute('data-step-target') || '1', 10);
      const nodeCircle = cp.querySelector('.checkpoint-node');
      const nodeNumber = cp.querySelector('.checkpoint-number');
      const nodeCheck = cp.querySelector('.checkpoint-check');
      const nodeLabel = cp.querySelector('.checkpoint-label');

      if (stepTarget < currentStep) {
        // Étape complétée / passée
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

    // 3. Barre de progression
    if (progressBar) {
      const pct = ((currentStep - 1) / (totalSteps - 1)) * 100;
      progressBar.style.width = `${pct}%`;
    }

    // 4. Mobile indicators
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

  // Écouteurs sur boutons "Suivant" et "Précédent"
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

  // Écouteurs sur checkpoints de la timeline
  checkpoints.forEach((cp) => {
    cp.addEventListener('click', () => {
      const target = parseInt(cp.getAttribute('data-step-target') || '1', 10);
      if (target <= maxVisitedStep || target <= currentStep) {
        goToStep(target);
      }
    });
  });

  // Lecture de l'étape initiale via URL (ex. ?step=2)
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

  // Initialisation UI stepper
  updateStepperUI();

  // Soumission & Validation finale (Section 9.3)
  const errorSummary = document.getElementById('error-summary');
  const errorSummaryList = document.getElementById('error-summary-list');
  const submitBtn = document.getElementById('submit-button');
  const submitText = document.getElementById('submit-button-text');
  const submitSpinner = document.getElementById('submit-button-spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset des erreurs
    const errors = [];
    if (errorSummary) errorSummary.classList.add('hidden');
    form.querySelectorAll('[role="alert"]').forEach(el => el.classList.add('hidden'));

    const serviceType = form.querySelector('input[name="serviceType"]:checked')?.value;
    const city = document.getElementById('city')?.value.trim();
    const postalCode = document.getElementById('postalCode')?.value.trim();
    const firstName = document.getElementById('firstName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const consent = document.getElementById('consent')?.checked;

    // 1. Ville
    if (!city) {
      errors.push({ step: 2, id: 'city', message: "Le champ Ville est obligatoire." });
      document.getElementById('city-error')?.classList.remove('hidden');
    }

    // 2. Code postal canadien
    if (!postalCode || !isValidCanadianPostalCode(postalCode)) {
      errors.push({ step: 2, id: 'postalCode', message: "Veuillez saisir un code postal valide (ex. H2X 1Y4)." });
      document.getElementById('postalCode-error')?.classList.remove('hidden');
    }

    // 3. Spécialisé : au moins un élément coché
    if (serviceType === 'specialise') {
      const checkedSpecialized = form.querySelectorAll('input[name="specializedItems"]:checked');
      if (checkedSpecialized.length === 0) {
        errors.push({ step: 3, id: 'block-specialized', message: "Veuillez choisir au moins une option pour le service spécialisé." });
        document.getElementById('specializedItems-error')?.classList.remove('hidden');
      }
      if (!descriptionInput?.value.trim()) {
        errors.push({ step: 3, id: 'description', message: "La description des besoins est obligatoire pour un service spécialisé." });
        document.getElementById('description-error')?.classList.remove('hidden');
      }
    }

    // 4. Prénom
    if (!firstName) {
      errors.push({ step: 4, id: 'firstName', message: "Le champ Prénom est obligatoire." });
      document.getElementById('firstName-error')?.classList.remove('hidden');
    }

    // 5. Règle contact (au moins téléphone OU courriel valide)
    const contactCheck = validateContactMethods(phone, email);
    if (!contactCheck.valid) {
      errors.push({ step: 4, id: 'phone', message: contactCheck.message });
      const contactErr = document.getElementById('contact-required-error');
      if (contactErr) {
        contactErr.textContent = contactCheck.message;
        contactErr.classList.remove('hidden');
      }
    }

    // 6. Consentement obligatoire
    if (!consent) {
      errors.push({ step: 4, id: 'consent', message: "Vous devez accepter la politique de confidentialité pour envoyer le formulaire." });
      document.getElementById('consent-error')?.classList.remove('hidden');
    }

    // Si erreurs : redirection vers la première étape avec erreur & affichage du résumé
    if (errors.length > 0) {
      const firstError = errors[0];
      if (firstError.step && firstError.step !== currentStep) {
        goToStep(firstError.step, false);
      }

      if (errorSummary && errorSummaryList) {
        errorSummaryList.innerHTML = '';
        errors.forEach(err => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${err.id}`;
          a.className = "text-brand-error underline font-semibold hover:text-red-800";
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

    // Verrouillage du bouton pendant l'envoi
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = "Envoi en cours…";
    if (submitSpinner) submitSpinner.classList.remove('hidden');

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.photos = selectedPhotos.map(p => ({ name: p.name, size: p.size }));

      const res = await fetch('/api/soumission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        alert(result.error || "Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.textContent = "Envoyer ma demande de soumission";
        if (submitSpinner) submitSpinner.classList.add('hidden');
      }
    } catch (err) {
      alert("Erreur de connexion. Veuillez vérifier votre accès internet.");
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = "Envoyer ma demande de soumission";
      if (submitSpinner) submitSpinner.classList.add('hidden');
    }
  });
}
