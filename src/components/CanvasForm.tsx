'use client';

import { CanvasData } from '@/types/pitch';

interface Props {
  canvas: CanvasData;
  onChange: (canvas: CanvasData) => void;
}

interface FieldConfig {
  key: keyof CanvasData;
  label: string;
  placeholder: string;
  multiline?: boolean;
  helper?: string;
}

const SECTIONS: { titel: string; emoji: string; fields: FieldConfig[] }[] = [
  {
    titel: 'Bedrijfsinfo',
    emoji: '🏢',
    fields: [
      { key: 'bedrijfsnaam', label: 'Bedrijfsnaam', placeholder: 'bijv. Acme BV' },
      { key: 'tagline', label: 'Tagline', placeholder: 'bijv. Wij maken X eenvoudiger' },
      { key: 'contactpersoon', label: 'Contactpersoon', placeholder: 'Naam contactpersoon' },
      { key: 'email', label: 'E-mail', placeholder: 'info@bedrijf.nl' },
      { key: 'website', label: 'Website', placeholder: 'www.bedrijf.nl' },
    ],
  },
  {
    titel: 'Probleem & Oplossing',
    emoji: '💡',
    fields: [
      {
        key: 'probleem',
        label: 'Het Probleem',
        placeholder: 'Welk pijnpunt los jij op?',
        multiline: true,
        helper: 'Beschrijf het probleem dat jouw klant ervaart',
      },
      {
        key: 'oplossing',
        label: 'De Oplossing',
        placeholder: 'Hoe los jij dit op?',
        multiline: true,
      },
      {
        key: 'waardeproposities',
        label: 'Waardeproposities',
        placeholder: 'Sneller, goedkoper, gebruiksvriendelijker...',
        multiline: true,
        helper: 'Gescheiden door komma of nieuwe regel',
      },
      {
        key: 'concurrentievoordeel',
        label: 'Concurrentievoordeel',
        placeholder: 'Wat maakt jou uniek vs. de concurrentie?',
        multiline: true,
      },
    ],
  },
  {
    titel: 'Markt',
    emoji: '📊',
    fields: [
      {
        key: 'klantsegmenten',
        label: 'Klantsegmenten',
        placeholder: 'MKB, ZZP, Corporates...',
        multiline: true,
        helper: 'Gescheiden door komma of nieuwe regel',
      },
      {
        key: 'marktgrootte',
        label: 'Marktgrootte',
        placeholder: 'bijv. €500M TAM, €50M SAM',
      },
    ],
  },
  {
    titel: 'Business Model Canvas',
    emoji: '🧩',
    fields: [
      {
        key: 'inkomstenstromen',
        label: 'Inkomstenstromen',
        placeholder: 'SaaS abonnement, eenmalig, commissie...',
        multiline: true,
      },
      {
        key: 'kanalen',
        label: 'Kanalen',
        placeholder: 'Online, partners, direct sales...',
        multiline: true,
      },
      {
        key: 'klantrelaties',
        label: 'Klantrelaties',
        placeholder: 'Self-service, persoonlijk, community...',
        multiline: true,
      },
      {
        key: 'kernactiviteiten',
        label: 'Kernactiviteiten',
        placeholder: 'Productontwikkeling, marketing, support...',
        multiline: true,
      },
      {
        key: 'kernmiddelen',
        label: 'Kernmiddelen',
        placeholder: 'Technologie, team, IP, data...',
        multiline: true,
      },
      {
        key: 'keypartners',
        label: 'Key Partners',
        placeholder: 'Leveranciers, distributeurs, technologiepartners...',
        multiline: true,
      },
      {
        key: 'kostenstructuur',
        label: 'Kostenstructuur',
        placeholder: 'Personeel, hosting, marketing...',
        multiline: true,
      },
    ],
  },
  {
    titel: 'Traction & Team',
    emoji: '🏆',
    fields: [
      {
        key: 'traction',
        label: 'Traction',
        placeholder: '500 gebruikers, €50K ARR, 3 pilotklanten...',
        multiline: true,
        helper: 'Elk resultaat op een nieuwe regel of gescheiden door komma',
      },
      {
        key: 'team',
        label: 'Team',
        placeholder: 'Jan Jansen – CEO, 10 jaar ervaring\nMarie de Vries – CTO...',
        multiline: true,
        helper: 'Elk teamlid op een nieuwe regel',
      },
    ],
  },
  {
    titel: 'Financiering & Vraag',
    emoji: '💰',
    fields: [
      {
        key: 'financiering',
        label: 'Financieringsbehoefte',
        placeholder: 'bijv. €500K voor 18 maanden runway',
        multiline: true,
      },
      {
        key: 'vraag',
        label: 'De Vraag',
        placeholder: 'Wat vraag jij precies aan de investeerder/klant/partner?',
        multiline: true,
        helper: 'Dit is de centrale call-to-action van jouw pitch',
      },
    ],
  },
];

function Field({
  config,
  value,
  onChange,
}: {
  config: FieldConfig;
  value: string;
  onChange: (v: string) => void;
}) {
  const baseClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition';

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {config.label}
      </label>
      {config.helper && (
        <p className="text-xs text-slate-400">{config.helper}</p>
      )}
      {config.multiline ? (
        <textarea
          className={`${baseClass} min-h-[80px] resize-y`}
          placeholder={config.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={baseClass}
          placeholder={config.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export default function CanvasForm({ canvas, onChange }: Props) {
  function update(key: keyof CanvasData, value: string) {
    onChange({ ...canvas, [key]: value });
  }

  return (
    <div className="space-y-8">
      {SECTIONS.map((section) => (
        <div key={section.titel} className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
          <div className="flex items-center gap-2 bg-white border-b border-slate-200 px-4 py-3">
            <span className="text-lg">{section.emoji}</span>
            <h3 className="font-semibold text-slate-700 text-sm">{section.titel}</h3>
          </div>
          <div className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {section.fields.map((f) => (
              <div key={f.key} className={f.multiline ? 'sm:col-span-2' : ''}>
                <Field
                  config={f}
                  value={(canvas[f.key] as string) || ''}
                  onChange={(v) => update(f.key, v)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
