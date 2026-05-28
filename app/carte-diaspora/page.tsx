'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import Link from 'next/link'

type Volume = 'eleve' | 'moyen' | 'faible'

interface PaysInfo {
  flag: string
  name: string
  volume: Volume
  amount: string
  rate: string
  currency: string
  delay: string
  services: string[]
  tip: string
}

const paysData: Record<string, PaysInfo> = {
  SEN: { flag: '🇸🇳', name: 'Sénégal', volume: 'eleve', amount: '4,2 Mds €', rate: '1 € = 655 XOF', currency: 'XOF — Franc CFA', delay: 'Instantané', services: ['LemFi', 'Wave', 'Remitly'], tip: 'LemFi propose 0€ de frais pour les envois vers le Sénégal' },
  CIV: { flag: '🇨🇮', name: "Côte d'Ivoire", volume: 'eleve', amount: '3,8 Mds €', rate: '1 € = 655 XOF', currency: 'XOF — Franc CFA', delay: '< 7 min', services: ['LemFi', 'Orange Money', 'Wave'], tip: 'Orange Money très utilisé — disponible dans tout le pays' },
  MLI: { flag: '🇲🇱', name: 'Mali', volume: 'moyen', amount: '2,1 Mds €', rate: '1 € = 655 XOF', currency: 'XOF — Franc CFA', delay: '< 30 min', services: ['Western Union', 'Remitly', 'LemFi'], tip: 'Western Union reste le plus utilisé dans les zones rurales' },
  GIN: { flag: '🇬🇳', name: 'Guinée', volume: 'faible', amount: '0,8 Mds €', rate: '1 € = 9 650 GNF', currency: 'GNF — Franc Guinéen', delay: '< 1h', services: ['WorldRemit', 'Remitly', 'Western Union'], tip: 'Vérifie les frais — ils varient beaucoup selon le service' },
  CMR: { flag: '🇨🇲', name: 'Cameroun', volume: 'moyen', amount: '1,9 Mds €', rate: '1 € = 655 XAF', currency: 'XAF — Franc CFA', delay: 'Instantané', services: ['LemFi', 'MTN Mobile', 'Orange'], tip: 'MTN Mobile Money très répandu au Cameroun' },
  MAR: { flag: '🇲🇦', name: 'Maroc', volume: 'moyen', amount: '1,6 Mds €', rate: '1 € = 10,8 MAD', currency: 'MAD — Dirham', delay: '< 2h', services: ['Wise', 'Remitly', 'Western Union'], tip: 'Wise offre le meilleur taux de change vers le Maroc' },
  COD: { flag: '🇨🇩', name: 'Congo RDC', volume: 'faible', amount: '0,9 Mds €', rate: '1 € = 2 850 CDF', currency: 'CDF — Franc Congolais', delay: '< 2h', services: ['WorldRemit', 'Western Union', 'Remitly'], tip: 'Privilégie le cash dans les zones rurales' },
  NGA: { flag: '🇳🇬', name: 'Nigeria', volume: 'moyen', amount: '2,5 Mds €', rate: '1 € = 1 640 NGN', currency: 'NGN — Naira', delay: '< 30 min', services: ['Wise', 'LemFi', 'Remitly'], tip: 'Le taux du Naira fluctue — compare avant chaque envoi' },
  GHA: { flag: '🇬🇭', name: 'Ghana', volume: 'faible', amount: '0,7 Mds €', rate: '1 € = 15,8 GHS', currency: 'GHS — Cedi', delay: 'Instantané', services: ['LemFi', 'WorldRemit', 'Wave'], tip: 'Mobile Money très développé au Ghana' },
  MDG: { flag: '🇲🇬', name: 'Madagascar', volume: 'faible', amount: '0,3 Mds €', rate: '1 € = 4 950 MGA', currency: 'MGA — Ariary', delay: '< 4h', services: ['WorldRemit', 'Western Union'], tip: 'Western Union reste la référence à Madagascar' },
  BFA: { flag: '🇧🇫', name: 'Burkina Faso', volume: 'faible', amount: '0,6 Mds €', rate: '1 € = 655 XOF', currency: 'XOF — Franc CFA', delay: '< 1h', services: ['Remitly', 'Western Union', 'LemFi'], tip: 'Vérifier la disponibilité des services selon les zones' },
  TGO: { flag: '🇹🇬', name: 'Togo', volume: 'faible', amount: '0,4 Mds €', rate: '1 € = 655 XOF', currency: 'XOF — Franc CFA', delay: '< 30 min', services: ['LemFi', 'Remitly', 'Wave'], tip: 'Flooz et T-Money sont les wallets les plus utilisés' },
  BEN: { flag: '🇧🇯', name: 'Bénin', volume: 'faible', amount: '0,3 Mds €', rate: '1 € = 655 XOF', currency: 'XOF — Franc CFA', delay: '< 30 min', services: ['LemFi', 'Remitly', 'Western Union'], tip: 'MTN Mobile Money disponible dans tout le pays' },
}

const AFRICA_ISO = new Set([
  'DZA','AGO','BEN','BWA','BFA','BDI','CPV','CMR','CAF','TCD',
  'COM','COG','COD','DJI','EGY','GNQ','ERI','ETH','GAB','GMB',
  'GHA','GIN','GNB','CIV','KEN','LSO','LBR','LBY','MDG','MWI',
  'MLI','MRT','MUS','MAR','MOZ','NAM','NER','NGA','RWA','STP',
  'SEN','SLE','SOM','ZAF','SSD','SDN','SWZ','TZA','TGO','TUN',
  'UGA','ZMB','ZWE','ESH',
])

const COLOR_MAP: Record<Volume, string> = { eleve: '#4ade80', moyen: '#2d5a3d', faible: '#1e3a2d' }
const W = 800
const H = 580

interface GeoFeature {
  type: string
  id: string
  properties: Record<string, string>
  geometry: object
}

interface TooltipState { x: number; y: number; code: string }

const LEGEND = [
  { color: '#4ade80', label: 'Volume élevé (+ 3 Mds €/an)' },
  { color: '#2d5a3d', label: 'Volume moyen (1-3 Mds €/an)' },
  { color: '#1e3a2d', label: 'Volume faible (- 1 Mds €/an)' },
  { color: '#2d3f55', label: 'Non couvert' },
]

const STATS = [
  { value: '26 Mds €', label: 'envoyés chaque année' },
  { value: '4,2 M', label: 'membres de la diaspora africaine en France' },
  { value: '6', label: 'services de transfert comparés' },
]

export default function CarteDiasporaPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedPays, setSelectedPays] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [loading, setLoading] = useState(true)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const projection = d3.geoMercator()
    const pathGen = d3.geoPath().projection(projection)

    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(r => r.json())
      .then((world: { features: GeoFeature[] }) => {
        const africaFeatures = world.features.filter(f => AFRICA_ISO.has(f.id))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projection.fitExtent([[20, 20], [W - 20, H - 20]], { type: 'FeatureCollection', features: africaFeatures } as any)

        svg.selectAll<SVGPathElement, GeoFeature>('path')
          .data(africaFeatures)
          .enter()
          .append('path')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .attr('d', (d) => pathGen(d as any) ?? '')
          .attr('fill', (d) => d.id in paysData ? COLOR_MAP[paysData[d.id].volume] : '#2d3f55')
          .attr('stroke', '#162032')
          .attr('stroke-width', 0.8)
          .style('cursor', (d) => d.id in paysData ? 'pointer' : 'default')
          .on('mouseover', function(event: MouseEvent, d: GeoFeature) {
            if (!(d.id in paysData)) return
            d3.select(this).attr('fill', '#6ee7a0')
            const rect = containerRef.current?.getBoundingClientRect()
            setTooltip({ x: event.clientX - (rect?.left ?? 0), y: event.clientY - (rect?.top ?? 0), code: d.id })
          })
          .on('mousemove', function(event: MouseEvent, d: GeoFeature) {
            if (!(d.id in paysData)) return
            const rect = containerRef.current?.getBoundingClientRect()
            setTooltip(prev => prev ? { ...prev, x: event.clientX - (rect?.left ?? 0), y: event.clientY - (rect?.top ?? 0) } : null)
          })
          .on('mouseout', function(_: MouseEvent, d: GeoFeature) {
            if (!(d.id in paysData)) return
            d3.select(this).attr('fill', COLOR_MAP[paysData[d.id].volume])
            setTooltip(null)
          })
          .on('click', function(_: MouseEvent, d: GeoFeature) {
            if (d.id in paysData) setSelectedPays(d.id)
          })

        setLoading(false)
      })
      .catch(() => { setLoading(false); setMapError(true) })
  }, [])

  const selected = selectedPays ? paysData[selectedPays] : null

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#0d0f1a' }}>

      {/* ── Header ── */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-green-400/30 text-green-400 text-sm font-medium mb-6">
            🌍 Diaspora africaine en France
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            Carte des transferts diaspora
          </h1>
          <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto mb-10">
            La diaspora africaine en France envoie plus de{' '}
            <span className="text-[#4ade80] font-semibold">26 milliards €</span>{' '}
            chaque année vers l&apos;Afrique
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="p-6 rounded-2xl border border-[#1e293b]" style={{ backgroundColor: '#0f172a' }}>
                <div className="text-3xl font-bold text-[#4ade80] mb-1">{s.value}</div>
                <div className="text-[#94a3b8] text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Carte D3 ── */}
      <section className="px-4 pb-6">
        <div className="max-w-5xl mx-auto">
          <div
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden border border-[#1e293b]"
            style={{ backgroundColor: '#162032' }}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <p className="text-[#4ade80] text-sm animate-pulse">Chargement de la carte…</p>
              </div>
            )}
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <p className="text-[#94a3b8] text-sm">Impossible de charger la carte. Vérifie ta connexion.</p>
              </div>
            )}
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            {tooltip && tooltip.code in paysData && (
              <div
                className="absolute pointer-events-none z-20 px-3 py-2 rounded-lg shadow-xl"
                style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #4ade80',
                  left: tooltip.x + 14,
                  top: tooltip.y - 20,
                  color: 'white',
                }}
              >
                <div className="font-semibold text-sm">{paysData[tooltip.code].flag} {paysData[tooltip.code].name}</div>
                <div className="text-[#4ade80] text-xs">{paysData[tooltip.code].amount}/an</div>
              </div>
            )}
          </div>

          {/* Légende */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm text-[#94a3b8]">
            {LEGEND.map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Panneau détail ── */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          {selected ? (
            <div className="p-8 rounded-2xl border border-[#1e293b]" style={{ backgroundColor: '#0f172a' }}>
              <h2 className="text-2xl font-bold text-white mb-6">
                {selected.flag} {selected.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Envois annuels', value: selected.amount },
                  { label: 'Taux EUR → devise', value: selected.rate },
                  { label: 'Devise locale', value: selected.currency },
                  { label: 'Délai moyen', value: selected.delay },
                ].map(item => (
                  <div key={item.label} className="p-4 rounded-xl" style={{ backgroundColor: '#162032' }}>
                    <div className="text-[#94a3b8] text-xs mb-1">{item.label}</div>
                    <div className="text-white font-semibold text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <div className="text-[#94a3b8] text-sm mb-2">Meilleurs services</div>
                <div className="flex flex-wrap gap-2">
                  {selected.services.map(s => (
                    <span key={s} className="px-3 py-1 bg-[#052e16] text-[#4ade80] text-sm rounded-full border border-[#4ade80]/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[#94a3b8] italic text-sm mb-6">💡 {selected.tip}</p>
              <Link
                href="/simulateurs/transfert"
                className="inline-flex items-center gap-2 bg-[#4ade80] text-[#052e16] font-semibold px-6 py-3 rounded-full hover:bg-[#22c55e] transition-colors"
              >
                Comparer les services →
              </Link>
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-[#1e293b] text-center" style={{ backgroundColor: '#0f172a' }}>
              <div className="text-5xl mb-4">🌍</div>
              <p className="text-[#94a3b8]">
                Clique sur un pays pour voir les détails des transferts et les meilleurs services
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
