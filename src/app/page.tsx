'use client';

import { useState, useEffect, useCallback } from 'react';
import { CanvasData, PitchTemplate } from '@/types/pitch';
import { pitchTemplates, defaultCanvas } from '@/lib/templates';
import TemplateCard from '@/components/TemplateCard';
import CanvasForm from '@/components/CanvasForm';
import PitchDeckViewer from '@/components/PitchDeckViewer';
import { canvasToMarkdown, openInObsidian } from '@/lib/obsidian';

const CANVAS_STORAGE_KEY = 'pitch-canvas-v1';
const HISTORY_STORAGE_KEY = 'pitch-history-v1';

interface SentDeck {
  id: string;
  templateId: string;
  templateNaam: string;
  templateIcon: string;
  ontvanger: string;
  bedrijfsnaam: string;
  datum: string;
}

const COMPLETENESS_FIELDS: (keyof CanvasData)[] = [
  'bedrijfsnaam', 'tagline', 'contactpersoon', 'email',
  'waardeproposities', 'klantsegmenten', 'probleem', 'oplossing',
  'marktgrootte', 'inkomstenstromen', 'traction', 'team', 'vraag',
];

function calcVolledigheid(canvas: CanvasData): number {
  const filled = COMPLETENESS_FIELDS.filter((k) => (canvas[k] as string)?.trim().length > 0).length;
  return (filled / COMPLETENESS_FIELDS.length) * 100;
}

export default function Dashboard() {
  const [canvas, setCanvas] = useState<CanvasData>(defaultCanvas);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'canvas'>('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<PitchTemplate | null>(null);
  const [history, setHistory] = useState<SentDeck[]>([]);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CANVAS_STORAGE_KEY);
      if (saved) setCanvas(JSON.parse(saved));
      const hist = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (hist) setHistory(JSON.parse(hist));
    } catch {
      // ignore parse errors
    }
  }, []);

  const saveCanvas = useCallback((c: CanvasData) => {
    setCanvas(c);
    localStorage.setItem(CANVAS_STORAGE_KEY, JSON.stringify(c));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }, []);

  function handleSend(template: PitchTemplate, email: string) {
    const deck: SentDeck = {
      id: Date.now().toString(),
      templateId: template.id,
      templateNaam: template.naam,
      templateIcon: template.icon,
      ontvanger: email,
      bedrijfsnaam: canvas.bedrijfsnaam || 'Onbekend',
      datum: new Date().toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
    const newHistory = [deck, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
  }

  const volledigheid = calcVolledigheid(canvas);
  const isLeeg = volledigheid < 10;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              P
            </div>
            <span className="font-bold text-slate-800">Pitch Deck Dashboard</span>
          </div>

          <nav className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('canvas')}
              className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'canvas'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🧩 Mijn Canvas
              {isLeeg && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          </nav>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            {savedMsg && (
              <span className="text-green-600 font-medium">✓ Opgeslagen</span>
            )}
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${volledigheid}%` }}
                />
              </div>
              <span>{Math.round(volledigheid)}% canvas</span>
            </div>
          </div>
        </div>
      </header>

      {/* Canvas tab */}
      {activeTab === 'canvas' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Jouw Business Model Canvas</h1>
            <p className="text-slate-500 mt-1">
              Vul dit eenmalig in — al jouw pitchdecks worden hier automatisch mee gevuld.
            </p>
          </div>

          {isLeeg && (
            <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
              <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
              <div>
                <p className="font-semibold text-amber-800 text-sm">Canvas is nog leeg</p>
                <p className="text-amber-700 text-xs mt-0.5">
                  Vul je canvas in om de pitchdecks automatisch te genereren. Je hoeft dit maar één keer te doen!
                </p>
              </div>
            </div>
          )}

          <CanvasForm canvas={canvas} onChange={saveCanvas} />

          <div className="mt-6 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Wijzigingen worden automatisch opgeslagen in je browser
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const md = canvasToMarkdown(canvas);
                  openInObsidian(`Business Model Canvas - ${canvas.bedrijfsnaam || 'Onbekend'}`, md);
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
              >
                <span>🟣</span> Open in Obsidian
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Naar pitchdecks →
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Dashboard tab */}
      {activeTab === 'dashboard' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {canvas.bedrijfsnaam
                  ? `Pitchdecks voor ${canvas.bedrijfsnaam}`
                  : 'Kies een Pitchdeck Template'}
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Selecteer een template, bekijk de preview en verstuur direct.
              </p>
            </div>
            {isLeeg && (
              <button
                onClick={() => setActiveTab('canvas')}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition whitespace-nowrap"
              >
                🧩 Vul Canvas in
              </button>
            )}
          </div>

          {/* Template grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {pitchTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                canvas={canvas}
                canvasVolledigheid={volledigheid}
                onSelect={(t) => setSelectedTemplate(t)}
              />
            ))}
          </div>

          {/* Verstuurde decks */}
          {history.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-slate-700 mb-3">Recente Pitches</h2>
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Template</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Bedrijf</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ontvanger</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Datum</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((d, i) => {
                      const tmpl = pitchTemplates.find((t) => t.id === d.templateId);
                      return (
                        <tr
                          key={d.id}
                          className={`border-b border-slate-50 hover:bg-slate-50 transition ${
                            i === history.length - 1 ? 'border-0' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span>{d.templateIcon}</span>
                              <span className="font-medium text-slate-700">{d.templateNaam}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{d.bedrijfsnaam}</td>
                          <td className="px-4 py-3 text-slate-600">{d.ontvanger}</td>
                          <td className="px-4 py-3 text-slate-400 text-xs">{d.datum}</td>
                          <td className="px-4 py-3 text-right">
                            {tmpl && (
                              <button
                                onClick={() => setSelectedTemplate(tmpl)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Opnieuw →
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {history.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-sm">
              Nog geen pitches verstuurd. Selecteer een template hierboven!
            </div>
          )}
        </main>
      )}

      {/* Pitch Deck Viewer modal */}
      {selectedTemplate && (
        <PitchDeckViewer
          template={selectedTemplate}
          canvas={canvas}
          onClose={() => setSelectedTemplate(null)}
          onSend={(email) => handleSend(selectedTemplate, email)}
        />
      )}
    </div>
  );
}
