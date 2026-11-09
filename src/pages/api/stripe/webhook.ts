import type { APIRoute } from 'astro';
import { getStripe } from '../../../lib/stripe';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || import.meta.env.STRIPE_WEBHOOK_SECRET || '';

  if (!stripe) {
    return new Response(
      JSON.stringify({ error: "Stripe n'est pas initialisé" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const sig = request.headers.get('stripe-signature');
  let event: any;

  try {
    const rawBody = await request.text();

    if (webhookSecret && sig) {
      // Vérification cryptographique de la signature Stripe
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // Mode fallback si le secret webhook n'est pas configuré
      event = JSON.parse(rawBody);
    }
  } catch (err: any) {
    console.error(`⚠️ Erreur webhook signature: ${err.message}`);
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Traitement de l'événement
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const quoteId = session.metadata?.quoteId;
      const clientEmail = session.customer_details?.email || session.metadata?.clientEmail;
      const amountTotal = (session.amount_total || 0) / 100;

      console.log(`✅ Paiement Stripe réussi pour session ${session.id} — Montant: ${amountTotal} $ CAD — Devis: ${quoteId}`);
      // L'événement a été validé avec succès
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log(`✅ Intention de paiement réussie: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`Événement Stripe non géré: ${event.type}`);
  }

  return new Response(
    JSON.stringify({ received: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
