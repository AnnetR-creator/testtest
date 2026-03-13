export interface CanvasData {
  // Bedrijfsinfo (de 1 sheet die de gebruiker invult)
  bedrijfsnaam: string;
  tagline: string;
  contactpersoon: string;
  email: string;
  website: string;
  logo?: string;

  // Business Model Canvas blokken
  waardeproposities: string;
  klantsegmenten: string;
  klantrelaties: string;
  kanalen: string;
  kernactiviteiten: string;
  kernmiddelen: string;
  keypartners: string;
  kostenstructuur: string;
  inkomstenstromen: string;

  // Pitch-specifiek
  probleem: string;
  oplossing: string;
  marktgrootte: string;
  concurrentievoordeel: string;
  traction: string;
  team: string;
  financiering: string;
  vraag: string; // wat vraag je van de investeerder/klant
}

export interface Slide {
  id: string;
  titel: string;
  type: SlideType;
  inhoud: (canvas: CanvasData) => SlideContent;
}

export type SlideType =
  | 'cover'
  | 'probleem'
  | 'oplossing'
  | 'markt'
  | 'product'
  | 'businessmodel'
  | 'traction'
  | 'team'
  | 'financien'
  | 'vraag'
  | 'contact';

export interface SlideContent {
  heading: string;
  subheading?: string;
  bullets?: string[];
  highlight?: string;
  footer?: string;
  columns?: { titel: string; tekst: string }[];
}

export interface PitchTemplate {
  id: string;
  naam: string;
  beschrijving: string;
  doelgroep: string;
  kleur: string;
  accentKleur: string;
  slides: Slide[];
  icon: string;
}

export interface Deck {
  id: string;
  templateId: string;
  canvas: CanvasData;
  aangemaakt: string;
  verzonden?: string;
  ontvanger?: string;
}
