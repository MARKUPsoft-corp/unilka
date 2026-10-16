/**
 * Validateur de formulaires avec règles métier québécoises
 * Conforme à la section 9.3 de unilka-description-fonctionnelle.md
 */

// Regex officiel pour les codes postaux canadiens (ex. H2X 1Y4 ou H2X1Y4)
export const CANADIAN_POSTAL_CODE_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

// Regex pour numéros de téléphone 10 chiffres (Amérique du Nord)
export const PHONE_REGEX = /^(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

// Regex courriel standard
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Valide un code postal canadien
 * @param {string} postalCode
 * @returns {boolean}
 */
export function isValidCanadianPostalCode(postalCode) {
  if (!postalCode) return false;
  return CANADIAN_POSTAL_CODE_REGEX.test(postalCode.trim());
}

/**
 * Valide un numéro de téléphone nord-américain
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  return PHONE_REGEX.test(phone.trim());
}

/**
 * Valide une adresse courriel
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Valide la règle de contact : au moins un téléphone OU un courriel valide
 * @param {string} phone
 * @param {string} email
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateContactMethods(phone, email) {
  const hasPhone = phone && phone.trim().length > 0;
  const hasEmail = email && email.trim().length > 0;

  if (!hasPhone && !hasEmail) {
    return {
      valid: false,
      message: "Veuillez indiquer un numéro de téléphone ou une adresse courriel."
    };
  }

  if (hasPhone && !isValidPhone(phone)) {
    return {
      valid: false,
      message: "Veuillez saisir un numéro de téléphone valide (ex. 514 555 0123)."
    };
  }

  if (hasEmail && !isValidEmail(email)) {
    return {
      valid: false,
      message: "Veuillez saisir une adresse courriel valide."
    };
  }

  return { valid: true };
}
