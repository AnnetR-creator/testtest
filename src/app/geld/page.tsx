'use client';

import { useState, useEffect, useCallback } from 'react';

interface FinancialCategory {
  label: string;
  doel: number;
  resultaat: number;
  color: string;
}

const CATEGORIES = [
  { label: 'Salaris HvA', doel: 3370, color: '#3b82f6' },
  { label: 'Opdrachten Platformen', doel: 500, color: '#8b5cf6' },
  { label: 'Opdrachten Freelance', doel: 150, color: '#06b6d4' },
  { label: 'The Detective Company', doel: 100, color: '#f59e0b' },
  { label: 'Sidehustle Detective', doel: 150, color: '#10b981' },
  { label: 'Extra', doel: 0, color: '#ec4899' },
];

const AIRTABLE_STORAGE_KEY = 'geld-dashboard-airtable-config';

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

async function fetchAirtableData(config: AirtableConfig): Promise<FinancialCategory[]> {
  const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiKey}` },
  });

  if (!res.ok) {
    throw new Error(`Airtable fout: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  return CATEGORIES.map((cat) => {
    const record = json.records?.find(
      (r: { fields: { Categorie?: string } }) =>
        r.fields.Categorie?.toLowerCase().trim() === cat.label.toLowerCase().trim()
    );
    return {
      label: cat.label,
      doel: cat.doel,
      resultaat: record?.fields?.Resultaat ?? 0,
      color: cat.color,
    };
  });
}

function PieChart({ data, title }: { data: { label: string; value: number; color: string }[]; title: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 80;

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">{title}</h3>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[220px] mx-auto">
          <circle cx={cx} cy={cy} r={radius} fill="#e2e8f0" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="14">
            Geen data
          </text>
        </svg>
        <div className="mt-4 space-y-1.5">
          {data.map((d, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600">{d.label}</span>
              </div>
              <span className="font-semibold text-slate-400">&euro;0</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
  maxValue,
}: {
  data: { label: string; value: number; color: string }[];
  title: string;
  maxValue: number;
}) {
  const barHeight = 40;
  const gap = 14;
  const chartHeight = data.length * (barHeight + gap) - gap;
  const labelWidth = 160;
  const valueWidth = 90;
  const chartWidth = 250;
  const svgWidth = labelWidth + chartWidth + valueWidth;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">{title}</h3>
      <svg viewBox={`0 0 ${svgWidth} ${chartHeight}`} className="w-full">
        {data.map((d, i) => {
          const y = i * (barHeight + gap);
          const barWidth = maxValue > 0 ? (d.value / maxValue) * chartWidth : 0;
          return (
            <g key={i}>
              <text
                x={labelWidth - 8}
                y={y + barHeight / 2}
                textAnchor="end"
                dominantBaseline="central"
                fill="#475569"
                fontSize="12"
                fontWeight="500"
              >
                {d.label}
              </text>
              <rect
                x={labelWidth}
                y={y + 6}
                width={Math.max(barWidth, 2)}
                height={barHeight - 12}
                rx={6}
                fill={d.value > 0 ? d.color : '#e2e8f0'}
              />
              <text
                x={labelWidth + Math.max(barWidth, 2) + 8}
                y={y + barHeight / 2}
                dominantBaseline="central"
                fill="#1e293b"
                fontSize="12"
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
  const [data, setData] = useState<FinancialCategory[]>(
    CATEGORIES.map((c) => ({ ...c, resultaat: 0 }))
  );
  const [config, setConfig] = useState<AirtableConfig>({ apiKey: '', baseId: '', tableName: '' });
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AIRTABLE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
        if (!parsed.apiKey || !parsed.baseId || !parsed.tableName) {
          setShowSettings(true);
        }
      } else {
        setShowSettings(true);
      }
    } catch {
      setShowSettings(true);
    }
  }, []);

  const saveConfig = useCallback((c: AirtableConfig) => {
    setConfig(c);
    localStorage.setItem(AIRTABLE_STORAGE_KEY, JSON.stringify(c));
  }, []);

  const handleRefresh = useCallback(async () => {
    if (!config.apiKey || !config.baseId || !config.tableName) {
      setError('Vul eerst je Airtable-instellingen in.');
      setShowSettings(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchAirtableData(config);
      setData(result);
      setLastUpdate(new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout bij ophalen data');
    } finally {
      setLoading(false);
    }
  }, [config]);

  const pieDataDoel = data.map((d) => ({ label: d.label, value: d.doel, color: d.color }));
  const pieDataResultaat = data.map((d) => ({ label: d.label, value: d.resultaat, color: d.color }));
  const barDataDoel = data.map((d) => ({ label: d.label, value: d.doel, color: d.color }));
  const barDataResultaat = data.map((d) => ({ label: d.label, value: d.resultaat, color: d.color }));

  const allValues = [...data.map((d) => d.doel), ...data.map((d) => d.resultaat)];
  const barMaxValue = Math.max(...allValues, 1);

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
            {lastUpdate && (
              <span className="text-xs text-slate-400">Laatst ververst: {lastUpdate}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? 'Laden...' : 'Ververs data'}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Instellingen
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Airtable settings */}
        {showSettings && (
          <div className="mb-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-1">Airtable Koppeling</h2>
            <p className="text-sm text-slate-500 mb-4">
              Maak een Airtable-tabel aan met kolommen: <strong>Categorie</strong> (tekst) en <strong>Resultaat</strong> (getal).
              Voeg 6 rijen toe met de categorieen: Salaris HvA, Opdrachten Platformen, Opdrachten Freelance, The Detective Company, Sidehustle Detective, Extra.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">API Key (Personal Access Token)</label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => saveConfig({ ...config, apiKey: e.target.value })}
                  placeholder="pat..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Base ID</label>
                <input
                  type="text"
                  value={config.baseId}
                  onChange={(e) => saveConfig({ ...config, baseId: e.target.value })}
                  placeholder="app..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tabel Naam</label>
                <input
                  type="text"
                  value={config.tableName}
                  onChange={(e) => saveConfig({ ...config, tableName: e.target.value })}
                  placeholder="Inkomsten"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {loading ? 'Laden...' : 'Test verbinding'}
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Sluiten
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Doel (maand)</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              &euro;{totaalDoel.toLocaleString('nl-NL')}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Resultaat (maand)</p>
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
          <PieChart data={pieDataDoel} title="Inkomen Doel" />
          <PieChart data={pieDataResultaat} title="Inkomen Resultaat" />
          <BarChart data={barDataDoel} title="Doel per categorie" maxValue={barMaxValue} />
          <BarChart data={barDataResultaat} title="Status per categorie" maxValue={barMaxValue} />
        </div>
      </main>
    </div>
  );
}
