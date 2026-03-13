import { PitchTemplate, CanvasData, Slide } from '@/types/pitch';

// Helper: split komma-separated string naar bullets
function bullets(tekst: string): string[] {
  return tekst
    .split(/[,\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ── SLIDES ────────────────────────────────────────────────────────────────────

const coverSlide: Slide = {
  id: 'cover',
  titel: 'Cover',
  type: 'cover',
  inhoud: (c: CanvasData) => ({
    heading: c.bedrijfsnaam || 'Bedrijfsnaam',
    subheading: c.tagline || 'Jouw tagline hier',
    footer: c.website,
  }),
};

const probleemSlide: Slide = {
  id: 'probleem',
  titel: 'Het Probleem',
  type: 'probleem',
  inhoud: (c: CanvasData) => ({
    heading: 'Het Probleem',
    subheading: c.probleem || 'Beschrijf het probleem dat jij oplost',
    bullets: bullets(c.klantsegmenten).map((s) => `Doelgroep: ${s}`),
  }),
};

const oplossingSlide: Slide = {
  id: 'oplossing',
  titel: 'Onze Oplossing',
  type: 'oplossing',
  inhoud: (c: CanvasData) => ({
    heading: 'Onze Oplossing',
    subheading: c.oplossing || 'Jouw unieke oplossing',
    bullets: bullets(c.waardeproposities),
    highlight: c.concurrentievoordeel,
  }),
};

const marktSlide: Slide = {
  id: 'markt',
  titel: 'Markt & Kansen',
  type: 'markt',
  inhoud: (c: CanvasData) => ({
    heading: 'Markt & Kansen',
    subheading: `Marktgrootte: ${c.marktgrootte || 'Voeg marktdata toe'}`,
    bullets: bullets(c.klantsegmenten).map((s) => `Segment: ${s}`),
  }),
};

const businessmodelSlide: Slide = {
  id: 'businessmodel',
  titel: 'Business Model',
  type: 'businessmodel',
  inhoud: (c: CanvasData) => ({
    heading: 'Business Model',
    columns: [
      { titel: 'Inkomstenstromen', tekst: c.inkomstenstromen || '—' },
      { titel: 'Kanalen', tekst: c.kanalen || '—' },
      { titel: 'Klantrelaties', tekst: c.klantrelaties || '—' },
    ],
  }),
};

const tractionSlide: Slide = {
  id: 'traction',
  titel: 'Traction',
  type: 'traction',
  inhoud: (c: CanvasData) => ({
    heading: 'Traction & Resultaten',
    bullets: bullets(c.traction),
  }),
};

const teamSlide: Slide = {
  id: 'team',
  titel: 'Het Team',
  type: 'team',
  inhoud: (c: CanvasData) => ({
    heading: 'Het Team',
    bullets: bullets(c.team),
    footer: `Lead: ${c.contactpersoon}`,
  }),
};

const financienSlide: Slide = {
  id: 'financien',
  titel: 'Financiën',
  type: 'financien',
  inhoud: (c: CanvasData) => ({
    heading: 'Financiën & Investering',
    subheading: c.financiering || 'Financieringsbehoefte',
    columns: [
      { titel: 'Kostenstructuur', tekst: c.kostenstructuur || '—' },
      { titel: 'Inkomstenstromen', tekst: c.inkomstenstromen || '—' },
    ],
  }),
};

const vraagSlide: Slide = {
  id: 'vraag',
  titel: 'De Vraag',
  type: 'vraag',
  inhoud: (c: CanvasData) => ({
    heading: 'Wat Vragen Wij?',
    highlight: c.vraag || 'Jouw specifieke vraag aan de investeerder/klant',
    subheading: `Neem contact op met ${c.contactpersoon || 'ons'}`,
  }),
};

const contactSlide: Slide = {
  id: 'contact',
  titel: 'Contact',
  type: 'contact',
  inhoud: (c: CanvasData) => ({
    heading: 'Laten we samenwerken',
    subheading: c.bedrijfsnaam,
    bullets: [
      c.contactpersoon && `👤 ${c.contactpersoon}`,
      c.email && `✉️ ${c.email}`,
      c.website && `🌐 ${c.website}`,
    ].filter(Boolean) as string[],
  }),
};

// ── TEMPLATES ─────────────────────────────────────────────────────────────────

export const pitchTemplates: PitchTemplate[] = [
  {
    id: 'investor',
    naam: 'Investor Pitch',
    beschrijving:
      'Klassieke pitch voor investeerders. Sterk gericht op groei, markt en rendement.',
    doelgroep: 'Investeerders & VC',
    kleur: '#1e3a5f',
    accentKleur: '#3b82f6',
    icon: '💼',
    slides: [
      coverSlide,
      probleemSlide,
      oplossingSlide,
      marktSlide,
      businessmodelSlide,
      tractionSlide,
      teamSlide,
      financienSlide,
      vraagSlide,
      contactSlide,
    ],
  },
  {
    id: 'klant',
    naam: 'Klant Pitch',
    beschrijving:
      'Overtuig potentiële klanten van jouw waarde. Focus op oplossing en resultaat.',
    doelgroep: 'Potentiële Klanten',
    kleur: '#064e3b',
    accentKleur: '#10b981',
    icon: '🤝',
    slides: [
      coverSlide,
      probleemSlide,
      oplossingSlide,
      { ...businessmodelSlide, titel: 'Hoe werkt het?' },
      tractionSlide,
      teamSlide,
      vraagSlide,
      contactSlide,
    ],
  },
  {
    id: 'partner',
    naam: 'Partner Pitch',
    beschrijving:
      'Win strategische partners. Nadruk op synergie en gedeeld voordeel.',
    doelgroep: 'Strategische Partners',
    kleur: '#4c1d95',
    accentKleur: '#8b5cf6',
    icon: '🔗',
    slides: [
      coverSlide,
      probleemSlide,
      oplossingSlide,
      marktSlide,
      {
        id: 'synergie',
        titel: 'Synergie',
        type: 'product',
        inhoud: (c: CanvasData) => ({
          heading: 'Samen sterker',
          subheading: c.keypartners || 'Beschrijf de samenwerking',
          bullets: bullets(c.kernactiviteiten),
        }),
      },
      teamSlide,
      vraagSlide,
      contactSlide,
    ],
  },
  {
    id: 'accelerator',
    naam: 'Accelerator / Grant',
    beschrijving:
      'Pitch voor subsidies, accelerators en incubators. Sterk op impact en team.',
    doelgroep: 'Accelerators & Subsidies',
    kleur: '#7c2d12',
    accentKleur: '#f97316',
    icon: '🚀',
    slides: [
      coverSlide,
      probleemSlide,
      oplossingSlide,
      marktSlide,
      businessmodelSlide,
      teamSlide,
      tractionSlide,
      financienSlide,
      vraagSlide,
      contactSlide,
    ],
  },
];

export const defaultCanvas: CanvasData = {
  bedrijfsnaam: '',
  tagline: '',
  contactpersoon: '',
  email: '',
  website: '',
  waardeproposities: '',
  klantsegmenten: '',
  klantrelaties: '',
  kanalen: '',
  kernactiviteiten: '',
  kernmiddelen: '',
  keypartners: '',
  kostenstructuur: '',
  inkomstenstromen: '',
  probleem: '',
  oplossing: '',
  marktgrootte: '',
  concurrentievoordeel: '',
  traction: '',
  team: '',
  financiering: '',
  vraag: '',
};
