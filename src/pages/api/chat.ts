import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const prerender = false;

const SYSTEM_INSTRUCTION = `
Tu es le Concierge Virtuel d'unilka (https://unilka.ca), le service d'entretien ménager et de nettoyage haute couture et haut de gamme basé à Montréal, Québec.

TON RÔLE :
Accueillir chaleureusement les visiteurs, répondre à leurs questions sur les services d'unilka, estimer le temps de travail et le tarif indicatif, et les orienter en douceur vers le formulaire de soumission personnalisée (/soumission/).

IDENTITÉ & VALEURS D'UNILKA :
- Standards hôteliers 5 étoiles : rigueur, discrétion absolue, protocole "zéro trace", supervision par des gouvernants formés aux exigences des palaces.
- Personnel salarié, qualifié, rigoureusement vérifié (antécédents judiciaires contrôlés, clause de confidentialité stricte NDA).
- Aucun engagement forcé : liberté totale pour le client d'ajuster ou d'interrompre ses prestations.
- Produits sains, éco-certifiés et haut de gamme respectueux des résidents, des enfants et des animaux de compagnie.

SERVICES PROPOSÉS :
1. Nettoyage Résidentiel : résidences privées, condos & penthouses de prestige, villas.
2. Nettoyage Commercial : bureaux d'affaires, cabinets d'avocats, cliniques médicales & dentaires, boutiques de luxe, sièges sociaux.
3. Nettoyage Spécialisé : fin de chantier et après rénovations, vitres en hauteur, nettoyage en profondeur des tapis et tissus d'ameublement.
4. Entretien Régulier : passages hebdomadaires, aux deux semaines (bimensuel) ou mensuels.

ZONES DESSERVIES :
- Montréal (Ville-Marie, Outremont, Westmount, Plateau-Mont-Royal, Griffintown, Vieux-Montréal, Mile-End, NDG, etc.)
- Rive-Sud (Longueuil, Brossard / DIX30, Boucherville, Saint-Lambert, Candiac)
- Lanaudière (Terrebonne, Mascouche, Repentigny)

GRILLE INDICATIVE D'ESTIMATION DU TEMPS ET PRIX :
- Taux horaire indicatif : environ 45 $ à 55 $ CAD / heure par préposé qualifié.
- Repères indicatifs pour entretien régulier ou grand ménage :
  * Condo 1 à 2 chambres (600 à 900 pi²) : environ 3h à 4h de travail (estimation 140 $ à 190 $ CAD).
  * Maison ou grand condo (3 à 4 chambres, 1 200 à 2 000 pi²) : environ 4h à 6h (estimation 190 $ à 290 $ CAD).
  * Grande propriété de prestige (> 2 500 pi²) : intervention sur mesure avec équipe ou gouvernant dédié.
  * Options complémentaires disponibles : intérieur du four (+35 $), intérieur du réfrigérateur (+30 $), vitres intérieures/extérieures.
- RÈGLE D'OR : Précise toujours qu'il s'agit d'une estimation indicative et transparente. Invite poliment le client à valider sa soumission officielle en 2 minutes sur notre formulaire sans engagement : [Faire une soumission](/soumission/). Une proposition ferme et personnalisée lui sera envoyée sous 24h.

TON ET STYLE :
- Ton distingué, courtois, respectueux et chaleureux (style hôtellerie de luxe québécoise).
- Bilingue : réponds en français si le client écrit en français, et en anglais s'il écrit en anglais.
- Réponses concises, claires et bien présentées.
`;

function getSmartFallbackResponse(userPrompt: string): string {
  const q = userPrompt.toLowerCase();

  if (q.includes('prix') || q.includes('tarif') || q.includes('cout') || q.includes('coût') || q.includes('combien') || q.includes('rate') || q.includes('price')) {
    return "Nos prestations d'excellence sont calculées sur une base indicative de **45 $ à 55 $ / heure** par préposé qualifié.\n\n" +
      "À titre indicatif :\n" +
      "• **Condo 1 à 2 chambres (600-900 pi²)** : 3h à 4h d'intervention (~140 $ à 190 $)\n" +
      "• **Maison ou grand condo (3-4 chambres)** : 4h à 6h d'intervention (~190 $ à 290 $)\n" +
      "• **Options extras** : Intérieur de four (+35 $), réfrigérateur (+30 $), vitres.\n\n" +
      "Pour obtenir une proposition ferme adaptée exactement à votre espace, vous pouvez remplir notre [formulaire de soumission express](/soumission/). Réponse garantie sous 24h.";
  }

  if (q.includes('zone') || q.includes('secteur') || q.includes('ou') || q.includes('où') || q.includes('ville') || q.includes('montreal') || q.includes('montréal') || q.includes('rive-sud')) {
    return "unilka dessert activement les secteurs suivants :\n\n" +
      "• **Grand Montréal** : Outremont, Westmount, Ville-Marie, Le Plateau, Griffintown, Vieux-Montréal, etc.\n" +
      "• **Rive-Sud** : Longueuil, Brossard, Boucherville, Saint-Lambert.\n" +
      "• **Lanaudière** : Terrebonne, Mascouche, Repentigny.\n\n" +
      "Votre adresse se situe-t-elle dans l'une de ces régions ?";
  }

  if (q.includes('commercial') || q.includes('bureau') || q.includes('clinique') || q.includes('entreprise')) {
    return "Nous assurons l'entretien haut de gamme pour les espaces professionnels exigeants : cabinets d'avocats, cliniques médicales et dentaires, sièges sociaux et boutiques de prestige.\n\n" +
      "Nos équipes interviennent en dehors de vos heures d'ouverture avec une clause stricte de confidentialité (NDA).\n\n" +
      "Souhaitez-vous que nous préparions un plan d'intervention sur mesure via notre [formulaire de soumission](/soumission/) ?";
  }

  return "Bonjour et bienvenue chez **unilka**, conciergerie et entretien ménager haut de gamme à Montréal.\n\n" +
    "Je suis à votre entière disposition pour vous renseigner sur nos protocoles hôteliers 5 étoiles, vous aider à estimer votre besoin ou vous guider vers notre [formulaire de soumission personnalisée](/soumission/).\n\n" +
    "En quoi puis-je vous accompagner aujourd'hui ?";
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const message = body.message || '';
    const history = body.history || [];

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: "Message requis" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || (import.meta.env && import.meta.env.GEMINI_API_KEY) || '';

    // Si la clé API Gemini n'est pas encore renseignée, fallback intelligent
    if (!apiKey || apiKey.trim() === '') {
      const reply = getSmartFallbackResponse(message);
      return new Response(JSON.stringify({
        reply,
        provider: 'fallback',
        notice: 'Configurez GEMINI_API_KEY dans votre fichier .env pour activer Gemini en direct.'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Appel au SDK Google Gemini avec le modèle officiel gemini-flash-latest
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    // Formatage de l'historique de discussion
    const formattedHistory = history.slice(-6).map((item: any) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return new Response(JSON.stringify({
      reply: responseText,
      provider: 'gemini'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Erreur Gemini API:", error);
    return new Response(JSON.stringify({
      reply: "Je vous prie de m'excuser, une brève interruption technique est survenue. N'hésitez pas à nous joindre directement ou à remplir notre [formulaire de soumission express](/soumission/).",
      error: error.message
    }), {
      status: 200, // On retourne 200 pour que le chatbot puisse afficher le message d'amabilité au visiteur
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
