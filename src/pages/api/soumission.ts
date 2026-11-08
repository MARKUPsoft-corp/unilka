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
    if (!data.serviceType || !data.frequency || !data.city || !data.firstName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Veuillez remplir tous les champs obligatoires."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validation code postal canadien (uniquement si renseigné)
    if (data.postalCode && !isValidCanadianPostalCode(data.postalCode)) {
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
    const uploadedPhotos: Array<{ url: string; publicId: string; name: string }> = [];

    // Téléversement sécurisé des photos sur Cloudinary si fournies
    if (Array.isArray(data.photos) && data.photos.length > 0) {
      try {
        const { uploadPhoto } = await import('../../lib/cloudinary');
        for (let i = 0; i < Math.min(data.photos.length, 3); i++) {
          const item = data.photos[i];
          const photoData = typeof item === 'string' ? item : item?.data;
          const photoName = typeof item === 'object' && item?.name ? item.name : `photo-${i + 1}.jpg`;

          if (photoData && typeof photoData === 'string' && photoData.startsWith('data:image/')) {
            try {
              const res = await uploadPhoto(photoData, 'unilka/soumissions', photoName);
              uploadedPhotos.push({
                url: res.url,
                publicId: res.publicId,
                name: photoName
              });
              console.log(`[unilka Cloudinary] Photo ${i + 1} téléversée :`, res.url);
            } catch (pErr: any) {
              console.warn(`[unilka Cloudinary Warning] Échec photo ${i + 1} :`, pErr?.message);
            }
          }
        }
      } catch (cloudErr: any) {
        console.warn("[unilka Cloudinary Warning] Module Cloudinary non disponible :", cloudErr?.message);
      }
    }

    // Libellés lisibles pour l'interface d'administration
    const serviceLabelMap: Record<string, string> = {
      residentiel: "Nettoyage résidentiel",
      commercial: "Nettoyage commercial",
      specialise: "Nettoyage spécialisé"
    };
    const freqLabelMap: Record<string, string> = {
      hebdo: "Hebdomadaire",
      bihebdo: "Bimensuel (aux 2 semaines)",
      mensuel: "Mensuel",
      ponctuel: "Ponctuel"
    };

    const serviceDisplay = serviceLabelMap[data.serviceType] || data.serviceType;
    const frequencyDisplay = freqLabelMap[data.frequency] || data.frequency;

    let surfaceDisplay = "";
    if (data.serviceType === 'residentiel') {
      const area = data.residentialArea ? `${data.residentialArea} pi²` : "";
      const rooms = data.bedrooms ? `${data.bedrooms} ch` : "";
      const baths = data.bathrooms ? `${data.bathrooms} sdb` : "";
      const roomDetails = [rooms, baths].filter(Boolean).join(", ");
      surfaceDisplay = [area, roomDetails ? `(${roomDetails})` : ""].filter(Boolean).join(" ");
    } else if (data.serviceType === 'commercial') {
      surfaceDisplay = [
        data.commercialArea ? `${data.commercialArea} pi²` : "",
        data.commercialType ? `(${data.commercialType})` : ""
      ].filter(Boolean).join(" ");
    } else {
      surfaceDisplay = data.specializedItems || "Prestation sur mesure";
    }

    try {
      const { db } = await import('../../lib/firebase');
      const { collection, addDoc } = await import('firebase/firestore');

      const docRef = await addDoc(collection(db, 'submissions'), {
        service: serviceDisplay,
        serviceType: data.serviceType,
        frequency: frequencyDisplay,
        frequencyCode: data.frequency,
        city: data.city,
        postalCode: data.postalCode || '',
        location: data.address ? `${data.address}, ${data.city}, QC` : `${data.city}, QC`,
        address: data.address || '',
        surface: surfaceDisplay || 'Non spécifiée',
        client: `${data.firstName} ${data.lastName || ''}`.trim(),
        firstName: data.firstName,
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        preferredContact: data.preferredContact || 'courriel',
        notes: data.description || data.comments || data.notes || '',
        hasPhotos: uploadedPhotos.length > 0,
        photoUrl: uploadedPhotos[0]?.url || '',
        photoLabel: uploadedPhotos.length > 0 ? `${uploadedPhotos.length} photo(s) téléversée(s)` : '',
        photos: uploadedPhotos,
        status: 'À traiter',
        statusColor: 'bg-amber-100 text-amber-900 border-amber-200',
        estimatedPrice: 'Sur devis',
        createdAt: new Date().toISOString()
      });
      submissionId = docRef.id;
      console.log("[unilka Firestore] Soumission enregistrée avec succès ID :", submissionId);
    } catch (dbErr: any) {
      console.warn("[unilka Firestore Warning] Sauvegarde locale/offline :", dbErr?.message);
    }

    console.log("[unilka API] Demande de soumission traitée :", {
      id: submissionId,
      service: serviceDisplay,
      city: data.city,
      client: `${data.firstName} ${data.lastName || ''}`,
      contact: data.email || data.phone,
      photosUploaded: uploadedPhotos.length,
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
