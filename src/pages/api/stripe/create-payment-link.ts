import type { APIRoute } from 'astro';
import { createStripeCheckoutSession } from '../../../lib/stripe';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: any = {};

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    }

    const {
      amount,
      clientName = 'Client',
      clientEmail,
      description = 'Prestation d\'entretien ménager',
      quoteId = '',
      serviceType = 'Entretien ménager',
      frequency = 'Ponctuel',
      mode = 'payment'
    } = body;

    const parsedAmount = typeof amount === 'number' ? amount : parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Montant invalide. Le montant doit être un nombre positif en dollars CAD."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await createStripeCheckoutSession({
      amount: parsedAmount,
      clientName: String(clientName).trim(),
      clientEmail: clientEmail ? String(clientEmail).trim() : undefined,
      description: String(description).trim(),
      quoteId: String(quoteId).trim(),
      serviceType: String(serviceType).trim(),
      frequency: String(frequency).trim(),
      mode: mode === 'subscription' ? 'subscription' : 'payment'
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: result.url,
        sessionId: result.sessionId
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error("Erreur API create-payment-link:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erreur interne du serveur lors de la création du lien Stripe."
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
