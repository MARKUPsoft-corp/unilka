export interface ClientRecord {
  id: string;
  rawId?: string;
  name: string;
  type: string;
  category: 'residentiel' | 'commercial' | 'ponctuel' | string;
  typeBadge?: string;
  sector: string;
  photo?: string;
  frequency: string;
  regularStaff: string;
  monthlyRevenue: string;
  since: string;
  accessNotes: string;
  status: string;
  phone: string;
  email: string;
  address: string;
}

export const defaultClients: ClientRecord[] = [
  {
    id: "CLI-01",
    name: "Alexandre & Sophie Tremblay",
    type: "Résidence privée",
    category: "residentiel",
    typeBadge: "bg-emerald-100 text-emerald-800",
    sector: "Outremont, Montréal",
    photo: "/images/admin/submission-condo.jpg",
    frequency: "Bimensuel (jeudi)",
    regularStaff: "Fatou D.",
    monthlyRevenue: "390,00 $ CAD",
    since: "Avril 2026",
    accessNotes: "Boîte à clés sécurisée #4182. Chien très calme.",
    status: "Actif",
    phone: "(514) 829-1029",
    email: "a.tremblay@email.ca",
    address: "742 Av. Elm, Outremont, QC H2V 2X7"
  },
  {
    id: "CLI-02",
    name: "Cabinet Dentaire Saint-Laurent",
    type: "Clinique & Bureaux",
    category: "commercial",
    typeBadge: "bg-blue-100 text-blue-800",
    sector: "Ville-Marie, Montréal",
    photo: "/images/admin/submission-clinic.jpg",
    frequency: "Hebdomadaire (mardi & ven. soir)",
    regularStaff: "Assane N.",
    monthlyRevenue: "960,00 $ CAD",
    since: "Janvier 2026",
    accessNotes: "Alarme code #9021. Badge remis.",
    status: "Actif",
    phone: "(514) 845-2200",
    email: "direction@dentairesaintlaurent.qc.ca",
    address: "2150 Boul. Saint-Laurent, Ville-Marie, QC H2X 2T2"
  },
  {
    id: "CLI-03",
    name: "Mme Claire Vachon",
    type: "Résidence privée",
    category: "residentiel",
    typeBadge: "bg-emerald-100 text-emerald-800",
    sector: "Westmount, Montréal",
    photo: "",
    frequency: "Hebdomadaire (mardi matin)",
    regularStaff: "Fatou D.",
    monthlyRevenue: "880,00 $ CAD",
    since: "Février 2026",
    accessNotes: "Parquet ancien huilé. Produits doux bio Unilka.",
    status: "Actif",
    phone: "(514) 935-7182",
    email: "c.vachon@westmount.ca",
    address: "32 Av. Clarke, Westmount, QC H3Y 3C7"
  },
  {
    id: "CLI-04",
    name: "Agence Numérique Pixel Inc.",
    type: "Espace bureaux",
    category: "commercial",
    typeBadge: "bg-blue-100 text-blue-800",
    sector: "Vieux-Montréal",
    photo: "",
    frequency: "Hebdomadaire (lundi soir)",
    regularStaff: "Assane N.",
    monthlyRevenue: "440,00 $ CAD",
    since: "Juin 2026",
    accessNotes: "Entrée principale, code ascenseur #304.",
    status: "Actif",
    phone: "(514) 500-8890",
    email: "ops@pixelmontreal.agency",
    address: "410 Rue Saint-Paul Ouest, Vieux-Montréal, QC H2Y 2A6"
  },
  {
    id: "CLI-05",
    name: "Famille Bédard",
    type: "Maison unifamiliale",
    category: "residentiel",
    typeBadge: "bg-emerald-100 text-emerald-800",
    sector: "Brossard, Rive-Sud",
    photo: "",
    frequency: "Bimensuel (mercredi matin)",
    regularStaff: "Khadija B.",
    monthlyRevenue: "420,00 $ CAD",
    since: "Août 2026",
    accessNotes: "Code garage envoyé par SMS la veille.",
    status: "Actif",
    phone: "(450) 672-4411",
    email: "famille.bedard@brossard.net",
    address: "8120 Rue de Charny, Brossard, QC J4X 2T9"
  },
  {
    id: "CLI-06",
    name: "Boutique Mode Laurier",
    type: "Commerce & Showroom",
    category: "commercial",
    typeBadge: "bg-purple-100 text-purple-800",
    sector: "Plateau-Mont-Royal",
    photo: "",
    frequency: "Hebdomadaire (lundi matin avant ouverture)",
    regularStaff: "Jean-Marc T.",
    monthlyRevenue: "360,00 $ CAD",
    since: "Mars 2026",
    accessNotes: "Clé remise à la gérante le matin.",
    status: "Actif",
    phone: "(514) 279-5050",
    email: "contact@modelaurier.ca",
    address: "1040 Av. Laurier Ouest, Montréal, QC H2V 2K8"
  },
  {
    id: "CLI-07",
    name: "Jean-Philippe Roy",
    type: "Grand ménage ponctuel",
    category: "ponctuel",
    typeBadge: "bg-amber-100 text-amber-900",
    sector: "Rosemont, Montréal",
    photo: "",
    frequency: "Mission ponctuelle (Déménagement)",
    regularStaff: "Fatou D. & Jean-Marc T.",
    monthlyRevenue: "380,00 $ CAD",
    since: "Octobre 2026",
    accessNotes: "Présent sur place pour accueil et remise des clés.",
    status: "Actif",
    phone: "(514) 778-9012",
    email: "jp.roy@service.ca",
    address: "5420 4e Avenue, Rosemont, QC H1Y 2V5"
  },
  {
    id: "CLI-08",
    name: "Immeuble Le Saint-Denis (Syndicat)",
    type: "Nettoyage approfondi annuel",
    category: "ponctuel",
    typeBadge: "bg-amber-100 text-amber-900",
    sector: "Plateau-Mont-Royal",
    photo: "",
    frequency: "Mission ponctuelle (Parties communes)",
    regularStaff: "Assane N.",
    monthlyRevenue: "1 250,00 $ CAD",
    since: "Septembre 2026",
    accessNotes: "Interphone syndicat #01. Local poubelles et hall.",
    status: "Actif",
    phone: "(514) 902-3344",
    email: "syndic.stdenis@copropriete.ca",
    address: "4110 Rue Saint-Denis, Montréal, QC H2W 2M5"
  }
];
