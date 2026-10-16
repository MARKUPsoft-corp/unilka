import type { APIRoute } from 'astro';
import { isValidPhone, isValidEmail } from '../../scripts/form-validator';

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

    // Validation des champs obligatoires
    if (!data.firstName || !data.lastName || !data.isAdult || !data.phone || !data.email || !data.city) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Veuillez remplir tous les champs obligatoires marqués d'un astérisque."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidPhone(data.phone)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Veuillez saisir un numéro de téléphone valide (ex. 514 555 0123)."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidEmail(data.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Veuillez saisir une adresse courriel valide."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Consentements obligatoires
    if (!data.consentAccuracy || !data.consentContact || !data.consentPrivacy) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Vous devez cocher les cases de consentement pour envoyer votre candidature."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log("[unilka API] Nouvelle candidature reçue :", {
      candidate: `${data.firstName} ${data.lastName}`,
      city: data.city,
      phone: data.phone,
      email: data.email,
      workAuth: data.workAuth,
      experience: data.hasExperience,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({
        success: true,
        redirectUrl: "/carrieres/merci/"
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error("[unilka API Error] Erreur lors de l'enregistrement de la candidature :", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer."
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
