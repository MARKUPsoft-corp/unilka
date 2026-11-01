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

    // Liste de modèles prioritaires avec basculement automatique en cas de surcharge 503
    // gemini-3.5-flash-lite et flash-lite-latest offrent une latence ultra-faible (~1s) et une disponibilité maximale
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.8-flash'
    ];
    const genAI = new GoogleGenerativeAI(apiKey);

    // Nettoyage et validation stricte de l'historique pour l'API Gemini
    // RÈGLES GEMINI : 
    // 1. Le premier message d'historique DOIT obligatoirement avoir le rôle 'user'
    // 2. Les rôles doivent alterner (user -> model -> user -> model)
    // 3. L'historique avant sendMessage doit se terminer par 'model' pour que le tour suivant soit 'user'
    const sanitizeHistoryForGemini = (rawList: any[], currentMsg: string) => {
      if (!Array.isArray(rawList)) return [];

      let items = rawList.filter(h => h && typeof h.content === 'string' && h.content.trim() !== '');

      // Si le dernier message envoyé est identique au message courant, le retirer de l'historique
      if (items.length > 0 && items[items.length - 1].content.trim() === currentMsg.trim() && items[items.length - 1].role === 'user') {
        items.pop();
      }

      let formatted = items.map(item => ({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: item.content.trim() }]
      }));

      // Règle 1 : le premier élément doit impérativement être 'user'
      while (formatted.length > 0 && formatted[0].role !== 'user') {
        formatted.shift();
      }

      // Règle 2 : l'historique doit se terminer par 'model' (car sendMessage va fournir le 'user')
      while (formatted.length > 0 && formatted[formatted.length - 1].role !== 'model') {
        formatted.pop();
      }

      // Limite aux 6 derniers échanges
      if (formatted.length > 6) {
        formatted = formatted.slice(-6);
        while (formatted.length > 0 && formatted[0].role !== 'user') {
          formatted.shift();
        }
      }

      return formatted;
    };

    const formattedHistory = sanitizeHistoryForGemini(history, message);

    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION
        });

        const chat = model.startChat({
          history: formattedHistory,
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7,
          }
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        return new Response(JSON.stringify({
          reply: responseText,
          provider: `gemini (${modelName})`
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err: any) {
        lastError = err;
        console.warn(`Modèle ${modelName} indisponible, tentative avec le suivant...`, err.message);
      }
    }

    // Si tous les modèles Gemini sont temporairement surchargés (ex. 503),
    // on répond gracieusement avec le moteur d'estimation intelligent au lieu d'un message d'erreur
    console.error("Tous les modèles Gemini ont échoué, activation du fallback gracieux:", lastError?.message);
    const gracefulReply = getSmartFallbackResponse(message);

    return new Response(JSON.stringify({
      reply: gracefulReply,
      provider: 'smart-fallback',
      notice: 'Réponse servie par le moteur de secours intelligent suite à une forte affluence sur les serveurs Google.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Erreur critique chat API:", error);
    const safeReply = getSmartFallbackResponse("bonjour");
    return new Response(JSON.stringify({
      reply: safeReply,
      provider: 'emergency-fallback'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
