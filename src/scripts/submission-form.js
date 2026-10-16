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
      card.className = "flex items-center gap-3 p-2.5 bg-brand-surface-subtle border border-brand-primary-light rounded-lg relative group";
      card.innerHTML = `
        <img src="${photo.dataUrl}" alt="Aperçu photo ${index + 1}" class="w-12 h-12 rounded object-cover shrink-0 border border-brand-primary-light" />
        <div class="overflow-hidden flex-1 text-xs">
          <p class="font-bold text-brand-text truncate">${photo.name}</p>
          <p class="text-brand-muted">${formatBytes(photo.size)}</p>
        </div>
        <button type="button" class="remove-photo-btn p-1.5 text-brand-error hover:bg-red-100 rounded-md transition-colors" aria-label="Retirer cette photo">
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

  // Soumission & Validation (Section 9.3)
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
      errors.push({ id: 'city', message: "Le champ Ville est obligatoire." });
      document.getElementById('city-error')?.classList.remove('hidden');
    }

    // 2. Code postal canadien
    if (!postalCode || !isValidCanadianPostalCode(postalCode)) {
      errors.push({ id: 'postalCode', message: "Veuillez saisir un code postal valide (ex. H2X 1Y4)." });
      document.getElementById('postalCode-error')?.classList.remove('hidden');
    }

    // 3. Spécialisé : au moins un élément coché
    if (serviceType === 'specialise') {
      const checkedSpecialized = form.querySelectorAll('input[name="specializedItems"]:checked');
      if (checkedSpecialized.length === 0) {
        errors.push({ id: 'block-specialized', message: "Veuillez choisir au moins une option pour le service spécialisé." });
        document.getElementById('specializedItems-error')?.classList.remove('hidden');
      }
      if (!descriptionInput?.value.trim()) {
        errors.push({ id: 'description', message: "La description des besoins est obligatoire pour un service spécialisé." });
        document.getElementById('description-error')?.classList.remove('hidden');
      }
    }

    // 4. Prénom
    if (!firstName) {
      errors.push({ id: 'firstName', message: "Le champ Prénom est obligatoire." });
      document.getElementById('firstName-error')?.classList.remove('hidden');
    }

    // 5. Règle contact (au moins téléphone OU courriel valide)
    const contactCheck = validateContactMethods(phone, email);
    if (!contactCheck.valid) {
      errors.push({ id: 'phone', message: contactCheck.message });
      const contactErr = document.getElementById('contact-required-error');
      if (contactErr) {
        contactErr.textContent = contactCheck.message;
        contactErr.classList.remove('hidden');
      }
    }

    // 6. Consentement obligatoire
    if (!consent) {
      errors.push({ id: 'consent', message: "Vous devez accepter la politique de confidentialité pour envoyer le formulaire." });
      document.getElementById('consent-error')?.classList.remove('hidden');
    }

    // Si erreurs : affichage du résumé d'erreurs en haut du formulaire avec focus
    if (errors.length > 0) {
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
        if (submitText) submitText.textContent = "Envoyer ma demande";
        if (submitSpinner) submitSpinner.classList.add('hidden');
      }
    } catch (err) {
      alert("Erreur de connexion. Veuillez vérifier votre accès internet.");
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = "Envoyer ma demande";
      if (submitSpinner) submitSpinner.classList.add('hidden');
    }
  });
}
