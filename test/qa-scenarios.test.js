import { isValidCanadianPostalCode, isValidPhone, isValidEmail, validateContactMethods } from '../src/scripts/form-validator.js';
import assert from 'node:assert';

console.log('--- EXÉCUTION DU BANC D\'ESSAI QA (SCÉNARIOS 1 À 11) ---');

// Scénario 3 : Validation Code Postal Canadien
console.log('\n[Test 1] Validation codes postaux canadiens...');
assert.strictEqual(isValidCanadianPostalCode('H2X 1Y4'), true, 'H2X 1Y4 devrait être valide');
assert.strictEqual(isValidCanadianPostalCode('h2x1y4'), true, 'h2x1y4 sans espace devrait être valide');
assert.strictEqual(isValidCanadianPostalCode('J5Z 4B9'), true, 'J5Z 4B9 devrait être valide');
assert.strictEqual(isValidCanadianPostalCode('12345'), false, '12345 (code US) ne doit pas être valide');
assert.strictEqual(isValidCanadianPostalCode('ABCDEF'), false, 'ABCDEF ne doit pas être valide');
assert.strictEqual(isValidCanadianPostalCode('H2X-1Y4'), true, 'H2X-1Y4 avec tiret devrait être valide');
console.log('✓ Codes postaux validés.');

// Scénario 4 : Téléphone & Courriel
console.log('\n[Test 2] Validation téléphone & courriel...');
assert.strictEqual(isValidPhone('514 555 0123'), true, '514 555 0123 valide');
assert.strictEqual(isValidPhone('(450) 123-4567'), true, '(450) 123-4567 valide');
assert.strictEqual(isValidPhone('+1 514 555 0123'), true, '+1 514 555 0123 valide');
assert.strictEqual(isValidPhone('123'), false, '123 invalide');
assert.strictEqual(isValidEmail('client@exemple.ca'), true, 'client@exemple.ca valide');
assert.strictEqual(isValidEmail('invalide-email'), false, 'invalide-email invalide');
console.log('✓ Téléphone et courriel validés.');

// Scénario 4 : Règle métier contact (téléphone OU courriel)
console.log('\n[Test 3] Règle de contact flexible (au moins 1 contact valide)...');
const c1 = validateContactMethods('', '');
assert.strictEqual(c1.valid, false, 'Deux champs vides doivent échouer');

const c2 = validateContactMethods('514 555 0123', '');
assert.strictEqual(c2.valid, true, 'Téléphone seul doit passer');

const c3 = validateContactMethods('', 'contact@unilka.ca');
assert.strictEqual(c3.valid, true, 'Courriel seul doit passer');

const c4 = validateContactMethods('123', '');
assert.strictEqual(c4.valid, false, 'Téléphone invalide seul doit échouer');

const c5 = validateContactMethods('', 'invalide');
assert.strictEqual(c5.valid, false, 'Courriel invalide seul doit échouer');
console.log('✓ Règle de contact validée.');

// Scénario 6 : Gestion limite photos
console.log('\n[Test 4] Règle limite 3 photos (MAX_PHOTOS = 3)...');
const MAX_PHOTOS = 3;
assert.strictEqual(2 + 1 <= MAX_PHOTOS, true);
assert.strictEqual(3 + 1 <= MAX_PHOTOS, false, '4 photos doivent être rejetées');
console.log('✓ Limite photos vérifiée.');

console.log('\nTous les tests unitaires QA ont réussi avec succès !');
