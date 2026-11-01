import { POST as handleSoumission } from '../src/pages/api/soumission.ts';
import { POST as handleCandidature } from '../src/pages/api/candidature.ts';
import assert from 'node:assert';

console.log('--- TEST DES SERVERLESS API ROUTES (SOUMISSION & CANDIDATURE) ---');

async function testEndpoints() {
  // Test Soumission : Cas nominal
  console.log('\n[API 1] Soumission nominale...');
  const req1 = new Request('http://localhost/api/soumission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      serviceType: 'residentiel',
      frequency: 'ponctuel',
      city: 'Montréal',
      postalCode: 'H2X 1Y4',
      firstName: 'Jean',
      phone: '514 555 0123',
      consent: true
    })
  });
  const res1 = await handleSoumission({ request: req1 } as any);
  const data1 = await res1.json();

  assert.strictEqual(res1.status, 200);
  assert.strictEqual(data1.success, true);
  assert.strictEqual(data1.redirectUrl, '/soumission/merci/');
  console.log('✓ Soumission nominale acceptée avec statut 200.');

  // Test Soumission avec photo Cloudinary
  console.log('\n[API 1b] Soumission avec photo Cloudinary...');
  const samplePhoto = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const reqPhoto = new Request('http://localhost/api/soumission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      serviceType: 'residentiel',
      frequency: 'hebdo',
      city: 'Montréal',
      postalCode: 'H2X 1Y4',
      firstName: 'Camille',
      lastName: 'Bergeron',
      phone: '514 555 9876',
      email: 'camille@unilka-test.ca',
      consent: true,
      photos: [
        { name: 'salon-test.jpg', size: 1024, data: samplePhoto }
      ]
    })
  });
  const resPhoto = await handleSoumission({ request: reqPhoto } as any);
  const dataPhoto = await resPhoto.json();
  assert.strictEqual(resPhoto.status, 200);
  assert.strictEqual(dataPhoto.success, true);
  assert.ok(dataPhoto.submissionId, 'Un ID de soumission doit être retourné');
  console.log('✓ Soumission avec photo Cloudinary traitée avec succès ID :', dataPhoto.submissionId);

  // Test Soumission : Spécialisé sans description ou sans case
  console.log('\n[API 2] Soumission spécialisée incomplète...');
  const req2 = new Request('http://localhost/api/soumission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      serviceType: 'specialise',
      city: 'Montréal',
      postalCode: 'H2X 1Y4',
      firstName: 'Jean',
      phone: '514 555 0123',
      consent: true
      // specializedItems manquant et description manquante
    })
  });
  const res2 = await handleSoumission({ request: req2 } as any);
  const data2 = await res2.json();
  assert.strictEqual(res2.status, 400);
  assert.strictEqual(data2.success, false);
  console.log('✓ Soumission spécialisée incomplète bloquée avec statut 400.');

  // Test Soumission : Code postal invalide
  console.log('\n[API 3] Soumission code postal invalide...');
  const req3 = new Request('http://localhost/api/soumission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      serviceType: 'residentiel',
      city: 'Montréal',
      postalCode: '12345',
      firstName: 'Jean',
      phone: '514 555 0123',
      consent: true
    })
  });
  const res3 = await handleSoumission({ request: req3 } as any);
  const data3 = await res3.json();
  assert.strictEqual(res3.status, 400);
  assert.strictEqual(data3.success, false);
  console.log('✓ Code postal invalide rejeté avec statut 400.');

  // Test Candidature : Cas nominal
  console.log('\n[API 4] Candidature nominale...');
  const req4 = new Request('http://localhost/api/candidature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Marie',
      lastName: 'Tremblay',
      isAdult: true,
      phone: '514 555 0199',
      email: 'marie@exemple.ca',
      city: 'Montréal',
      workAuth: 'Oui',
      consentAccuracy: true,
      consentContact: true,
      consentPrivacy: true
    })
  });
  const res4 = await handleCandidature({ request: req4 } as any);
  const data4 = await res4.json();
  assert.strictEqual(res4.status, 200);
  assert.strictEqual(data4.success, true);
  assert.strictEqual(data4.redirectUrl, '/carrieres/merci/');
  console.log('✓ Candidature nominale acceptée avec statut 200.');

  // Test Candidature : Sans consentement Loi 25
  console.log('\n[API 5] Candidature sans consentement Loi 25...');
  const req5 = new Request('http://localhost/api/candidature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Marie',
      lastName: 'Tremblay',
      isAdult: true,
      phone: '514 555 0199',
      email: 'marie@exemple.ca',
      city: 'Montréal',
      workAuth: 'Oui',
      consentAccuracy: true,
      consentContact: false, // Refus
      consentPrivacy: true
    })
  });
  const res5 = await handleCandidature({ request: req5 } as any);
  const data5 = await res5.json();
  assert.strictEqual(res5.status, 400);
  assert.strictEqual(data5.success, false);
  console.log('✓ Candidature sans consentement Loi 25 rejetée avec statut 400.');

  console.log('\nToutes les vérifications API ont réussi avec succès !');
  process.exit(0);
}

testEndpoints().catch((err) => {
  console.error(err);
  process.exit(1);
});
