'use client';

import { useState } from 'react';
import { PitchTemplate, CanvasData } from '@/types/pitch';
import SlideViewer from './SlideViewer';

interface Props {
  template: PitchTemplate;
  canvas: CanvasData;
  onClose: () => void;
  onSend: (email: string) => void;
}

export default function PitchDeckViewer({ template, canvas, onClose, onSend }: Props) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSendModal, setShowSendModal] = useState(false);
  const [ontvanger, setOntvanger] = useState('');
  const [verzonden, setVerzonden] = useState(false);

  const slide = template.slides[activeSlide];

  function handleSend() {
    if (ontvanger.trim()) {
      onSend(ontvanger.trim());
      setVerzonden(true);
      setTimeout(() => {
        setShowSendModal(false);
        setVerzonden(false);
        setOntvanger('');
      }, 2000);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/60 text-white">
        <div className="flex items-center gap-3">
          <span className="text-lg">{template.icon}</span>
          <div>
            <h2 className="font-bold text-sm">{template.naam}</h2>
            <p className="text-xs opacity-60">{canvas.bedrijfsnaam || 'Bedrijfsnaam'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-50">
            {activeSlide + 1} / {template.slides.length}
          </span>
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: template.accentKleur }}
          >
            <span>✉️</span> Verstuur
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            ✕ Sluiten
          </button>
        </div>
      </div>

      {/* Main slide area */}
      <div className="flex-1 flex items-center justify-center px-8 py-4 relative">
        <button
          onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
          disabled={activeSlide === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
        >
          ‹
        </button>

        <div className="w-full max-w-5xl">
          <SlideViewer
            slide={slide}
            canvas={canvas}
            accentKleur={template.accentKleur}
            bgKleur={template.kleur}
          />
        </div>

        <button
          onClick={() => setActiveSlide(Math.min(template.slides.length - 1, activeSlide + 1))}
          disabled={activeSlide === template.slides.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
        >
          ›
        </button>
      </div>

      {/* Slide thumbnails */}
      <div className="flex items-center gap-2 px-6 py-3 bg-black/60 overflow-x-auto">
        {template.slides.map((s, i) => (
          <SlideViewer
            key={s.id}
            slide={s}
            canvas={canvas}
            accentKleur={template.accentKleur}
            bgKleur={template.kleur}
            isActive={i === activeSlide}
            onClick={() => setActiveSlide(i)}
            mini
          />
        ))}
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            {verzonden ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-bold text-slate-800 text-lg">Verstuurd!</h3>
                <p className="text-slate-500 text-sm mt-1">
                  De pitch deck is verstuurd naar {ontvanger}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-lg">Pitch Deck Versturen</h3>
                  <button
                    onClick={() => setShowSendModal(false)}
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>{template.icon}</span>
                    <span className="font-medium">{template.naam}</span>
                    <span className="text-slate-400">—</span>
                    <span>{canvas.bedrijfsnaam || 'Bedrijfsnaam'}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {template.slides.length} slides
                  </p>
                </div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  E-mailadres ontvanger
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 mb-4"
                  placeholder="naam@bedrijf.nl"
                  value={ontvanger}
                  onChange={(e) => setOntvanger(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSendModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!ontvanger.trim()}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    style={{ background: template.accentKleur }}
                  >
                    Verstuur Pitch →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
