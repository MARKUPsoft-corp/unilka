import type { APIRoute } from 'astro';
import { isValidCanadianPostalCode, validateContactMethods } from '../../scripts/form-validator';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // Validation minimale côté serveur
    if (!data.serviceType || !data.frequency || !data.city || !data.postalCode || !data.firstName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Veuillez remplir tous les champs obligatoires."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validation code postal canadien
    if (!isValidCanadianPostalCode(data.postalCode)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Veuillez saisir un code postal valide (ex. H2X 1Y4)."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validation téléphone ou courriel
    const contactCheck = validateContactMethods(data.phone || '', data.email || '');
    if (!contactCheck.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: contactCheck.message
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Consentement Loi 25
    if (!data.consent) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Vous devez accepter la politique de confidentialité pour envoyer le formulaire."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let submissionId: string | null = null;

    try {
      const { db } = await import('../../lib/firebase');
      const { collection, addDoc } = await import('firebase/firestore');

      const docRef = await addDoc(collection(db, 'submissions'), {
        serviceType: data.serviceType,
        frequency: data.frequency,
        city: data.city,
        postalCode: data.postalCode,
        clientName: `${data.firstName} ${data.lastName || ''}`.trim(),
        firstName: data.firstName,
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        notes: data.notes || '',
        photos: data.photos || [],
        status: 'nouveau',
        createdAt: new Date().toISOString()
      });
      submissionId = docRef.id;
      console.log("[unilka Firestore] Soumission enregistrée avec succès ID :", submissionId);
    } catch (dbErr: any) {
      console.warn("[unilka Firestore Warning] Sauvegarde locale/offline :", dbErr?.message);
    }

    console.log("[unilka API] Nouvelle demande de soumission reçue :", {
      id: submissionId,
      service: data.serviceType,
      city: data.city,
      postalCode: data.postalCode,
      client: `${data.firstName} ${data.lastName || ''}`,
      contact: data.email || data.phone,
      photosCount: data.photos ? (Array.isArray(data.photos) ? data.photos.length : 1) : 0,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({
        success: true,
        submissionId,
        redirectUrl: "/soumission/merci/"
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error("[unilka API Error] Erreur lors du traitement de la soumission :", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer."
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
