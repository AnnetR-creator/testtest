'use client';

import { PitchTemplate, CanvasData } from '@/types/pitch';
import SlideViewer from './SlideViewer';

interface Props {
  template: PitchTemplate;
  canvas: CanvasData;
  onSelect: (template: PitchTemplate) => void;
  canvasVolledigheid: number;
}

export default function TemplateCard({ template, canvas, onSelect, canvasVolledigheid }: Props) {
  const firstSlide = template.slides[0];

  return (
    <div
      className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer"
      onClick={() => onSelect(template)}
    >
      {/* Preview van eerste slide */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <SlideViewer
          slide={firstSlide}
          canvas={canvas}
          accentKleur={template.accentKleur}
          bgKleur={template.kleur}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-all bg-white text-slate-800 font-semibold text-sm px-4 py-2 rounded-full shadow-lg">
            Bekijk & Aanpassen →
          </span>
        </div>
        {/* Slide count badge */}
        <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
          {template.slides.length} slides
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{template.icon}</span>
              <h3 className="font-bold text-slate-800">{template.naam}</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">{template.doelgroep}</span>
          </div>
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: template.accentKleur }}
          >
            {Math.round(canvasVolledigheid)}%
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{template.beschrijving}</p>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Canvas volledigheid</span>
            <span>{Math.round(canvasVolledigheid)}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${canvasVolledigheid}%`,
                background: template.accentKleur,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
