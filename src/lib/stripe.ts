import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || import.meta.env.STRIPE_SECRET_KEY || '';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!stripeSecretKey) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(stripeSecretKey, {
      typescript: true,
    });
  }
  return stripeClient;
}

export interface CreateCheckoutOptions {
  amount: number; // En dollars CAD (ex: 150.00)
  clientName: string;
  clientEmail?: string;
  description: string;
  quoteId?: string;
  serviceType?: string;
  frequency?: string;
  mode?: 'payment' | 'subscription';
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Génère une session Stripe Checkout officielle avec montant en CAD
 */
export async function createStripeCheckoutSession(options: CreateCheckoutOptions) {
  const stripe = getStripe();
  if (!stripe) {
    return {
      success: false,
      error: "Clé STRIPE_SECRET_KEY manquante. Veuillez la configurer dans vos variables d'environnement Vercel ou .env."
    };
  }

  const {
    amount,
    clientName,
    clientEmail,
    description,
    quoteId = '',
    serviceType = 'Entretien ménager',
    frequency = 'Ponctuel',
    mode = 'payment',
    successUrl = 'https://www.unilka.ca/soumission/merci/?payment=success',
    cancelUrl = 'https://www.unilka.ca/soumission/'
  } = options;

  if (!amount || amount <= 0) {
    return {
      success: false,
      error: "Le montant doit être supérieur à 0 $ CAD."
    };
  }

  try {
    // Montant en cents CAD (ex: 150.00 CAD -> 15000 cents)
    const unitAmountInCents = Math.round(amount * 100);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: mode,
      customer_email: clientEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `unilka — ${description}`,
              description: `Prestation : ${serviceType} (${frequency}) • Client : ${clientName}`,
              images: ['https://www.unilka.ca/images/service-residential.jpg']
            },
            unit_amount: unitAmountInCents
          },
          quantity: 1
        }
      ],
      metadata: {
        quoteId: quoteId,
        clientName: clientName,
        clientEmail: clientEmail || '',
        serviceType: serviceType,
        frequency: frequency
      },
      locale: 'fr-CA',
      success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}&quote_id=${encodeURIComponent(quoteId)}`,
      cancel_url: cancelUrl
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      success: true,
      url: session.url,
      sessionId: session.id
    };
  } catch (err: any) {
    console.error("Erreur Stripe Checkout Session:", err);
    return {
      success: false,
      error: err.message || "Erreur lors de la communication avec Stripe."
    };
  }
}
