'use client';

import { useState } from 'react';

interface FinancialCategory {
  label: string;
  doel: number;
  resultaat: number;
  color: string;
}

const defaultData: FinancialCategory[] = [
  { label: 'Omzet', doel: 50000, resultaat: 42000, color: '#3b82f6' },
  { label: 'Marketing', doel: 8000, resultaat: 9500, color: '#8b5cf6' },
  { label: 'Personeel', doel: 20000, resultaat: 18000, color: '#06b6d4' },
  { label: 'Operationeel', doel: 5000, resultaat: 6200, color: '#f59e0b' },
  { label: 'Overig', doel: 3000, resultaat: 2800, color: '#10b981' },
];

function PieChart({ data, title }: { data: { label: string; value: number; color: string }[]; title: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 80;

  let currentAngle = -Math.PI / 2;

  const slices = data.map((d) => {
    const sliceAngle = (d.value / total) * 2 * Math.PI;
    const startX = cx + radius * Math.cos(currentAngle);
    const startY = cy + radius * Math.sin(currentAngle);
    const endX = cx + radius * Math.cos(currentAngle + sliceAngle);
    const endY = cy + radius * Math.sin(currentAngle + sliceAngle);
    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const path = `M ${cx} ${cy} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;

    const midAngle = currentAngle + sliceAngle / 2;
    const labelRadius = radius * 0.6;
    const labelX = cx + labelRadius * Math.cos(midAngle);
    const labelY = cy + labelRadius * Math.sin(midAngle);
    const percentage = Math.round((d.value / total) * 100);

    currentAngle += sliceAngle;

    return { ...d, path, labelX, labelY, percentage };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">{title}</h3>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[220px] mx-auto">
        {slices.map((s, i) => (
          <g key={i}>
            <path d={s.path} fill={s.color} stroke="white" strokeWidth="2" />
            {s.percentage >= 8 && (
              <text
                x={s.labelX}
                y={s.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="11"
                fontWeight="bold"
              >
                {s.percentage}%
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="mt-4 space-y-1.5">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-slate-600">{s.label}</span>
            </div>
            <span className="font-semibold text-slate-800">
              &euro;{s.value.toLocaleString('nl-NL')}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-sm font-bold">
        <span className="text-slate-500">Totaal</span>
        <span className="text-slate-800">&euro;{total.toLocaleString('nl-NL')}</span>
      </div>
    </div>
  );
}

function BarChart({
  data,
  title,
}: {
  data: { label: string; value: number; color: string }[];
  title: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const barHeight = 36;
  const gap = 12;
  const chartHeight = data.length * (barHeight + gap) - gap;
  const labelWidth = 100;
  const valueWidth = 80;
  const chartWidth = 300;
  const svgWidth = labelWidth + chartWidth + valueWidth;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">{title}</h3>
      <svg viewBox={`0 0 ${svgWidth} ${chartHeight}`} className="w-full">
        {data.map((d, i) => {
          const y = i * (barHeight + gap);
          const barWidth = (d.value / maxValue) * chartWidth;
          return (
            <g key={i}>
              <text
                x={labelWidth - 8}
                y={y + barHeight / 2}
                textAnchor="end"
                dominantBaseline="central"
                fill="#475569"
                fontSize="13"
                fontWeight="500"
              >
                {d.label}
              </text>
              <rect
                x={labelWidth}
                y={y + 4}
                width={barWidth}
                height={barHeight - 8}
                rx={6}
                fill={d.color}
              />
              <text
                x={labelWidth + barWidth + 8}
                y={y + barHeight / 2}
                dominantBaseline="central"
                fill="#1e293b"
                fontSize="13"
                fontWeight="bold"
              >
                &euro;{d.value.toLocaleString('nl-NL')}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function GeldDashboard() {
  const [data] = useState<FinancialCategory[]>(defaultData);

  const pieDataDoel = data.map((d) => ({ label: d.label, value: d.doel, color: d.color }));
  const pieDataResultaat = data.map((d) => ({ label: d.label, value: d.resultaat, color: d.color }));
  const barDataDoel = data.map((d) => ({ label: d.label, value: d.doel, color: d.color }));
  const barDataResultaat = data.map((d) => ({ label: d.label, value: d.resultaat, color: d.color }));

  const totaalDoel = data.reduce((s, d) => s + d.doel, 0);
  const totaalResultaat = data.reduce((s, d) => s + d.resultaat, 0);
  const verschil = totaalResultaat - totaalDoel;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              G
            </div>
            <span className="font-bold text-slate-800">Geld Dashboard</span>
          </div>
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700 transition"
          >
            Terug naar Pitch Deck
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Doel (totaal)</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              &euro;{totaalDoel.toLocaleString('nl-NL')}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Resultaat (totaal)</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              &euro;{totaalResultaat.toLocaleString('nl-NL')}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Verschil</p>
            <p
              className={`text-2xl font-bold mt-1 ${
                verschil >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {verschil >= 0 ? '+' : ''}
              &euro;{verschil.toLocaleString('nl-NL')}
            </p>
          </div>
        </div>

        {/* Charts grid: pie charts + bar charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PieChart data={pieDataDoel} title="Doel (cirkel)" />
          <PieChart data={pieDataResultaat} title="Resultaat (cirkel)" />
          <BarChart data={barDataDoel} title="Doel (staaf)" />
          <BarChart data={barDataResultaat} title="Resultaat (staaf)" />
        </div>
      </main>
    </div>
  );
}
