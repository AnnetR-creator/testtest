import { CanvasData, PitchTemplate } from '@/types/pitch';

export function canvasToMarkdown(canvas: CanvasData): string {
  const lines: string[] = [
    `# Business Model Canvas — ${canvas.bedrijfsnaam || 'Onbekend bedrijf'}`,
    '',
    canvas.tagline ? `> ${canvas.tagline}` : '',
    '',
    '## Bedrijfsinfo',
    canvas.contactpersoon ? `- **Contactpersoon:** ${canvas.contactpersoon}` : '',
    canvas.email ? `- **Email:** ${canvas.email}` : '',
    canvas.website ? `- **Website:** ${canvas.website}` : '',
    '',
    '## Business Model Canvas',
    '',
    canvas.waardeproposities ? `### Waardeproposities\n${canvas.waardeproposities}\n` : '',
    canvas.klantsegmenten ? `### Klantsegmenten\n${canvas.klantsegmenten}\n` : '',
    canvas.klantrelaties ? `### Klantrelaties\n${canvas.klantrelaties}\n` : '',
    canvas.kanalen ? `### Kanalen\n${canvas.kanalen}\n` : '',
    canvas.kernactiviteiten ? `### Kernactiviteiten\n${canvas.kernactiviteiten}\n` : '',
    canvas.kernmiddelen ? `### Kernmiddelen\n${canvas.kernmiddelen}\n` : '',
    canvas.keypartners ? `### Key Partners\n${canvas.keypartners}\n` : '',
    canvas.kostenstructuur ? `### Kostenstructuur\n${canvas.kostenstructuur}\n` : '',
    canvas.inkomstenstromen ? `### Inkomstenstromen\n${canvas.inkomstenstromen}\n` : '',
    '## Pitch Informatie',
    '',
    canvas.probleem ? `### Probleem\n${canvas.probleem}\n` : '',
    canvas.oplossing ? `### Oplossing\n${canvas.oplossing}\n` : '',
    canvas.marktgrootte ? `### Marktgrootte\n${canvas.marktgrootte}\n` : '',
    canvas.concurrentievoordeel ? `### Concurrentievoordeel\n${canvas.concurrentievoordeel}\n` : '',
    canvas.traction ? `### Traction\n${canvas.traction}\n` : '',
    canvas.team ? `### Team\n${canvas.team}\n` : '',
    canvas.financiering ? `### Financiering\n${canvas.financiering}\n` : '',
    canvas.vraag ? `### Vraag\n${canvas.vraag}\n` : '',
  ];

  return lines.filter(Boolean).join('\n');
}

export function pitchDeckToMarkdown(template: PitchTemplate, canvas: CanvasData): string {
  const lines: string[] = [
    `# ${template.naam} — ${canvas.bedrijfsnaam || 'Onbekend bedrijf'}`,
    '',
    `*${template.beschrijving}*`,
    `**Doelgroep:** ${template.doelgroep}`,
    '',
  ];

  template.slides.forEach((slide, i) => {
    const content = slide.inhoud(canvas);
    lines.push(`## Slide ${i + 1}: ${slide.titel}`);
    lines.push('');
    lines.push(`**${content.heading}**`);
    if (content.subheading) lines.push(`> ${content.subheading}`);
    if (content.highlight) lines.push(`> **${content.highlight}**`);
    if (content.bullets?.length) {
      content.bullets.forEach((b) => lines.push(`- ${b}`));
    }
    if (content.columns?.length) {
      content.columns.forEach((col) => lines.push(`- **${col.titel}:** ${col.tekst}`));
    }
    if (content.footer) lines.push(`*${content.footer}*`);
    lines.push('');
  });

  return lines.join('\n');
}

export function openInObsidian(name: string, content: string): void {
  const url = `obsidian://new?name=${encodeURIComponent(name)}&content=${encodeURIComponent(content)}`;
  window.open(url, '_blank');
}
