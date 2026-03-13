'use client';

import { Slide, SlideContent, CanvasData } from '@/types/pitch';

interface Props {
  slide: Slide;
  canvas: CanvasData;
  accentKleur: string;
  bgKleur: string;
  isActive?: boolean;
  onClick?: () => void;
  mini?: boolean;
}

function SlideRenderer({
  content,
  accentKleur,
  bgKleur,
  type,
  mini,
}: {
  content: SlideContent;
  accentKleur: string;
  bgKleur: string;
  type: string;
  mini?: boolean;
}) {
  const scale = mini ? 'scale-[0.28] origin-top-left' : '';
  const containerSize = mini
    ? 'w-[357px] h-[201px] overflow-hidden'
    : 'w-full h-full';

  if (type === 'cover') {
    return (
      <div
        className={`${containerSize} flex flex-col items-center justify-center text-white relative overflow-hidden`}
        style={{ background: bgKleur }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 70% 30%, ${accentKleur}, transparent 60%)`,
          }}
        />
        <div className={`relative z-10 text-center px-8 ${scale}`}>
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 opacity-80"
            style={{ background: accentKleur }}
          >
            PITCH DECK
          </div>
          <h1 className={`font-bold leading-tight mb-3 ${mini ? 'text-2xl' : 'text-5xl'}`}>
            {content.heading}
          </h1>
          {content.subheading && (
            <p className={`opacity-80 ${mini ? 'text-xs' : 'text-xl'}`}>{content.subheading}</p>
          )}
          {content.footer && (
            <p className={`mt-6 opacity-50 ${mini ? 'text-[8px]' : 'text-sm'}`}>{content.footer}</p>
          )}
        </div>
      </div>
    );
  }

  if (type === 'contact') {
    return (
      <div
        className={`${containerSize} flex flex-col items-center justify-center text-white relative overflow-hidden`}
        style={{ background: bgKleur }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 30% 70%, ${accentKleur}, transparent 60%)`,
          }}
        />
        <div className={`relative z-10 text-center px-8`}>
          <h2
            className={`font-bold mb-2 ${mini ? 'text-base' : 'text-4xl'}`}
            style={{ color: accentKleur }}
          >
            {content.heading}
          </h2>
          {content.subheading && (
            <p className={`opacity-60 mb-4 ${mini ? 'text-[8px]' : 'text-lg'}`}>
              {content.subheading}
            </p>
          )}
          <div className={`space-y-1 ${mini ? 'space-y-0.5' : 'space-y-3'}`}>
            {content.bullets?.map((b, i) => (
              <p key={i} className={`opacity-90 ${mini ? 'text-[7px]' : 'text-base'}`}>
                {b}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'vraag') {
    return (
      <div
        className={`${containerSize} flex flex-col items-center justify-center relative overflow-hidden`}
        style={{ background: bgKleur }}
      >
        <div className="absolute inset-0 bg-white opacity-5" />
        <div className="relative z-10 text-center px-8 max-w-2xl">
          <h2 className={`font-bold text-white mb-4 ${mini ? 'text-sm' : 'text-4xl'}`}>
            {content.heading}
          </h2>
          {content.highlight && (
            <div
              className={`rounded-xl text-white font-semibold ${mini ? 'text-[8px] p-2' : 'text-xl p-6'}`}
              style={{ background: accentKleur }}
            >
              {content.highlight}
            </div>
          )}
          {content.subheading && (
            <p className={`text-white opacity-60 mt-3 ${mini ? 'text-[7px]' : 'text-sm'}`}>
              {content.subheading}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default layout with columns
  if (content.columns) {
    return (
      <div
        className={`${containerSize} flex flex-col text-white overflow-hidden`}
        style={{ background: bgKleur }}
      >
        <div
          className={`${mini ? 'px-4 py-2' : 'px-10 py-6'} border-b border-white/10`}
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <h2 className={`font-bold ${mini ? 'text-sm' : 'text-3xl'}`}>{content.heading}</h2>
          {content.subheading && (
            <p className={`opacity-60 mt-1 ${mini ? 'text-[8px]' : 'text-base'}`}>
              {content.subheading}
            </p>
          )}
        </div>
        <div className={`flex-1 grid grid-cols-${content.columns.length} ${mini ? 'gap-2 p-3' : 'gap-6 p-10'}`}>
          {content.columns.map((col, i) => (
            <div
              key={i}
              className={`rounded-lg ${mini ? 'p-2' : 'p-5'}`}
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <h3
                className={`font-semibold mb-1 ${mini ? 'text-[8px]' : 'text-sm'}`}
                style={{ color: accentKleur }}
              >
                {col.titel}
              </h3>
              <p className={`opacity-80 ${mini ? 'text-[7px]' : 'text-sm'} leading-relaxed`}>
                {col.tekst}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default bullets layout
  return (
    <div
      className={`${containerSize} flex flex-col text-white overflow-hidden`}
      style={{ background: bgKleur }}
    >
      <div
        className={`${mini ? 'px-4 py-2' : 'px-10 py-6'} border-b border-white/10`}
        style={{ background: 'rgba(0,0,0,0.2)' }}
      >
        <h2 className={`font-bold ${mini ? 'text-sm' : 'text-3xl'}`}>{content.heading}</h2>
        {content.subheading && (
          <p className={`opacity-70 mt-1 ${mini ? 'text-[8px]' : 'text-base'}`}>
            {content.subheading}
          </p>
        )}
      </div>
      <div className={`flex-1 ${mini ? 'px-4 py-2' : 'px-10 py-6'}`}>
        {content.highlight && (
          <div
            className={`rounded-lg font-semibold mb-3 ${mini ? 'text-[7px] p-1.5' : 'text-base p-4'}`}
            style={{ background: accentKleur }}
          >
            {content.highlight}
          </div>
        )}
        {content.bullets && content.bullets.length > 0 && (
          <ul className={`space-y-1 ${mini ? 'space-y-0.5' : 'space-y-3'}`}>
            {content.bullets.slice(0, 6).map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className={`flex-shrink-0 rounded-full ${mini ? 'w-1.5 h-1.5 mt-0.5' : 'w-2 h-2 mt-1.5'}`}
                  style={{ background: accentKleur }}
                />
                <span className={`opacity-85 ${mini ? 'text-[7px]' : 'text-sm'} leading-snug`}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
        )}
        {content.footer && (
          <p
            className={`absolute bottom-4 ${mini ? 'text-[6px]' : 'text-xs'} opacity-50`}
          >
            {content.footer}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SlideViewer({
  slide,
  canvas,
  accentKleur,
  bgKleur,
  isActive,
  onClick,
  mini,
}: Props) {
  const content = slide.inhoud(canvas);

  if (mini) {
    return (
      <button
        onClick={onClick}
        className={`relative rounded-lg overflow-hidden transition-all border-2 ${
          isActive ? 'border-blue-500 shadow-lg shadow-blue-200' : 'border-transparent hover:border-slate-300'
        }`}
        style={{ width: 100, height: 56 }}
        title={slide.titel}
      >
        <div style={{ width: 357, height: 201, transform: 'scale(0.28)', transformOrigin: 'top left' }}>
          <SlideRenderer
            content={content}
            accentKleur={accentKleur}
            bgKleur={bgKleur}
            type={slide.type}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[7px] px-1 py-0.5 truncate text-center">
          {slide.titel}
        </div>
      </button>
    );
  }

  return (
    <div className="slide-preview w-full rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
      <SlideRenderer
        content={content}
        accentKleur={accentKleur}
        bgKleur={bgKleur}
        type={slide.type}
      />
    </div>
  );
}
