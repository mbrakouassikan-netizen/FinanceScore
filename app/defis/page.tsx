'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface DefiData {
  type: string
  objectif: string
  montantCible: number
  montantEpargne: number
  semainesCompletees: number[]
  dateDebut: string
  nomObjectif: string
}

interface DefiComplete extends DefiData {
  dateCompletion: string
}

interface DefiMeta {
  id: string
  titre: string
  description: string
  objectifLabel: string
  montantCible: number | null
  dureeLabel: string
  pts: number
  badgeLabel: string
  badgeBg: string
  iconColor: string
  iconPath: string
  objectifsImmo?: number[]
}

const DEFIS: DefiMeta[] = [
  {
    id: '52semaines',
    titre: 'Défi 52 semaines',
    description: '10€ la semaine 1, +10€ chaque semaine. Pour financer ton projet au pays.',
    objectifLabel: '2 730€',
    montantCible: 2730,
    dureeLabel: '52 semaines',
    pts: 50,
    badgeLabel: 'Populaire',
    badgeBg: '#4c1d95',
    iconColor: '#a78bfa',
    iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  },
  {
    id: 'immo',
    titre: 'Apport immobilier',
    description: "Épargne mensuelle pour atteindre ton apport. Lié à ton simulateur crédit.",
    objectifLabel: 'Personnalisable',
    montantCible: null,
    dureeLabel: 'Calculée selon objectif',
    pts: 40,
    badgeLabel: 'Immobilier',
    badgeBg: '#052e16',
    iconColor: '#4ade80',
    iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    objectifsImmo: [5000, 10000, 20000, 30000],
  },
  {
    id: 'mensuel',
    titre: 'Défi mensuel 2 000€',
    description: '167€ par mois pendant 12 mois. Simple, régulier, efficace.',
    objectifLabel: '2 000€',
    montantCible: 2000,
    dureeLabel: '12 mois — 167€/mois',
    pts: 30,
    badgeLabel: '12 mois',
    badgeBg: '#1e3a5f',
    iconColor: '#60a5fa',
    iconPath: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  },
  {
    id: 'transfert',
    titre: 'Zéro frais transfert',
    description: '3 mois avec LemFi ou Wave uniquement. Réinvestis tes économies de frais en épargne.',
    objectifLabel: '~180€ économisés',
    montantCible: 180,
    dureeLabel: '3 mois',
    pts: 20,
    badgeLabel: 'Diaspora',
    badgeBg: '#052e16',
    iconColor: '#4ade80',
    iconPath: 'M22 2L11 13 M22 2L15 22 9 13 2 9z',
  },
]

function getMontantSemaine(type: string, semaine: number, montantCible: number): number {
  if (type === '52semaines') return semaine * 10
  if (type === 'mensuel') return 167
  if (type === 'immo') return Math.ceil(montantCible / 24)
  if (type === 'transfert') return 60
  return 0
}

function getTotalPeriodes(type: string) {
  if (type === 'mensuel' || type === 'transfert') return 12
  if (type === 'immo') return 24
  return 52
}

function getPtsFin(type: string) {
  if (type === '52semaines') return 50
  if (type === 'immo') return 40
  if (type === 'mensuel') return 30
  return 20
}

export default function DefisPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [defi, setDefi] = useState<DefiData | null>(null)
  const [completes, setCompletes] = useState<DefiComplete[]>([])
  const [loading, setLoading] = useState(true)
  const [modalDefi, setModalDefi] = useState<DefiMeta | null>(null)
  const [nomObjectif, setNomObjectif] = useState('')
  const [immoObjectif, setImmoObjectif] = useState(10000)
  const [validating, setValidating] = useState(false)
  const [starting, setStarting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchDefi = useCallback((mail: string) => {
    fetch(`/api/defis?email=${encodeURIComponent(mail)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setDefi(d.defi ? (typeof d.defi === 'string' ? JSON.parse(d.defi) : d.defi) : null)
          setCompletes((d.completes ?? []).map((c: string | DefiComplete) => typeof c === 'string' ? JSON.parse(c) : c))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('cf_email')
    setEmail(saved)
    if (saved) fetchDefi(saved)
    else setLoading(false)
  }, [fetchDefi])

  const demarrerDefi = async () => {
    if (!email || !modalDefi) return
    setStarting(true)
    const montantCible = modalDefi.id === 'immo' ? immoObjectif : (modalDefi.montantCible ?? 0)
    const res = await fetch('/api/defis/demarrer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type: modalDefi.id, objectif: modalDefi.titre, montantCible, nomObjectif }),
    }).then(r => r.json()).catch(() => null)
    if (res?.success) {
      setDefi(res.defi)
      setModalDefi(null)
      setNomObjectif('')
      setSuccessMsg('Défi démarré ! Bonne chance 💪')
      setTimeout(() => setSuccessMsg(''), 4000)
    }
    setStarting(false)
  }

  const validerSemaine = async () => {
    if (!email || !defi) return
    setValidating(true)
    const periodes = getTotalPeriodes(defi.type)
    const currentSemaine = defi.semainesCompletees.length + 1
    if (currentSemaine > periodes) { setValidating(false); return }
    const montant = getMontantSemaine(defi.type, currentSemaine, defi.montantCible)

    const res = await fetch('/api/defis/valider-semaine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, semaine: currentSemaine, montant }),
    }).then(r => r.json()).catch(() => null)

    if (res?.success) {
      await fetch('/api/gamification/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'defi_semaine', details: { montant: String(montant), semaine: String(currentSemaine) } }),
      }).catch(() => {})

      if (res.isComplete) {
        await fetch('/api/gamification/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, action: 'defi_complete', details: { type: defi.type, montant: String(defi.montantCible) } }),
        }).catch(() => {})
        setDefi(null)
        setSuccessMsg(`🎉 Défi complété ! +${getPtsFin(defi.type)} pts gagnés`)
        fetchDefi(email)
      } else {
        setDefi(res.defi)
        setSuccessMsg(`✅ Semaine ${currentSemaine} validée ! +5 pts`)
      }
      setTimeout(() => setSuccessMsg(''), 4000)
    }
    setValidating(false)
  }

  const periodes = defi ? getTotalPeriodes(defi.type) : 52
  const progression = defi ? Math.round((defi.montantEpargne / defi.montantCible) * 100) : 0
  const currentSemaine = defi ? defi.semainesCompletees.length + 1 : 1
  const periodLabel = defi?.type === 'mensuel' || defi?.type === 'transfert' ? 'mois' : defi?.type === 'immo' ? 'mois' : 'sem.'

  return (
    <div className="min-h-screen pt-16 pb-16 px-4" style={{ backgroundColor: '#0d0f1a' }}>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Back */}
        <div><Link href="/" className="text-[#94a3b8] hover:text-white transition-colors text-sm">← Accueil</Link></div>

        {/* Header */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: '#4c1d95', color: '#c4b5fd' }}>Défis d&apos;épargne</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">Tes défis d&apos;épargne</h1>
          <p className="text-[#94a3b8] max-w-xl mx-auto">Des objectifs concrets pour construire ton épargne étape par étape</p>
        </div>

        {/* Success msg */}
        {successMsg && (
          <div className="p-4 rounded-xl border border-[#4ade80]/30 text-center text-[#4ade80] font-semibold" style={{ backgroundColor: '#052e16' }}>
            {successMsg}
          </div>
        )}

        {/* No email */}
        {!loading && !email && (
          <div className="p-8 rounded-2xl border border-white/10 text-center" style={{ backgroundColor: '#1a1d2d' }}>
            <p className="text-[#94a3b8] mb-6">Fais le quiz pour accéder à tes défis et suivre ta progression.</p>
            <Link href="/quiz" className="inline-block px-8 py-3 bg-[#4ade80] text-black font-bold rounded-full hover:bg-[#4ade80]/90 transition-all">Faire le quiz</Link>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Défi actif */}
        {!loading && email && defi && (
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: '#052e16', borderColor: '#166534' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#166534', color: '#4ade80' }}>En cours</span>
              <span className="text-[#4ade80] text-sm font-medium">{periodLabel === 'sem.' ? `Semaine ${currentSemaine}` : `Mois ${currentSemaine}`} / {periodes}</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{defi.objectif}</h2>
            {defi.nomObjectif && <p className="text-[#4ade80] text-sm mb-3">🎯 {defi.nomObjectif}</p>}

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-[#94a3b8] mb-1">
                <span>{defi.montantEpargne.toLocaleString('fr-FR')}€ épargnés</span>
                <span>Objectif : {defi.montantCible.toLocaleString('fr-FR')}€</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#0a1f0f' }}>
                <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(progression, 100)}%`, backgroundColor: '#4ade80' }} />
              </div>
              <p className="text-right text-xs text-[#4ade80] mt-1">{progression}%</p>
            </div>

            {/* Grid */}
            <div className="mb-5">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${periodes <= 12 ? periodes : 13}, minmax(0, 1fr))` }}>
                {Array.from({ length: periodes }, (_, i) => {
                  const n = i + 1
                  const done = defi.semainesCompletees.includes(n)
                  const current = n === currentSemaine
                  return (
                    <div
                      key={n}
                      title={`${periodLabel === 'sem.' ? 'Semaine' : 'Mois'} ${n}`}
                      className="rounded aspect-square"
                      style={{
                        backgroundColor: done ? '#4ade80' : current ? '#166534' : '#0a1f0f',
                        border: current ? '1px solid #4ade80' : 'none',
                        minHeight: 8,
                      }}
                    />
                  )
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#0a1f0f' }}>
                <div className="text-[#4ade80] font-bold text-lg">{defi.montantEpargne.toLocaleString('fr-FR')}€</div>
                <div className="text-[#94a3b8] text-xs">Épargné</div>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#0a1f0f' }}>
                <div className="text-white font-bold text-lg">{periodes - defi.semainesCompletees.length}</div>
                <div className="text-[#94a3b8] text-xs">{periodLabel === 'sem.' ? 'Semaines' : 'Mois'} restant(e)s</div>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#0a1f0f' }}>
                <div className="text-[#a78bfa] font-bold text-lg">+{(periodes - defi.semainesCompletees.length) * 5} pts</div>
                <div className="text-[#94a3b8] text-xs">Bonus restants</div>
              </div>
            </div>

            {currentSemaine <= periodes && (
              <button
                onClick={validerSemaine}
                disabled={validating}
                className="w-full py-3 font-bold rounded-full transition-all disabled:opacity-50"
                style={{ backgroundColor: '#4ade80', color: '#052e16' }}
              >
                {validating ? 'Validation…' : `Marquer ${periodLabel === 'sem.' ? `la semaine ${currentSemaine}` : `le mois ${currentSemaine}`} comme fait${periodLabel === 'sem.' ? 'e' : ''}`}
              </button>
            )}
          </div>
        )}

        {/* Défis disponibles */}
        {!loading && email && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">{defi ? 'Autres défis' : 'Défis disponibles'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEFIS.filter(d => !defi || d.id !== defi.type).map(d => (
                <div key={d.id} className="p-5 rounded-2xl border border-white/10 flex flex-col gap-3" style={{ backgroundColor: '#1a1d2d' }}>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0d0f1a' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={d.iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {d.iconPath.split(' M').map((seg, i) => (
                          <path key={i} d={i === 0 ? seg : 'M' + seg} />
                        ))}
                      </svg>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: d.badgeBg, color: '#fff' }}>{d.badgeLabel}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{d.titre}</h3>
                    <p className="text-[#94a3b8] text-sm">{d.description}</p>
                  </div>

                  {d.id === 'immo' && (
                    <div className="flex flex-wrap gap-2">
                      {(d.objectifsImmo ?? []).map(o => (
                        <button key={o} onClick={() => setImmoObjectif(o)} className="px-3 py-1 rounded-full text-xs font-semibold border transition-all" style={{ backgroundColor: immoObjectif === o ? '#4ade80' : 'transparent', color: immoObjectif === o ? '#052e16' : '#94a3b8', borderColor: immoObjectif === o ? '#4ade80' : '#334155' }}>
                          {o.toLocaleString('fr-FR')}€
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <span>🎯 {d.id === 'immo' ? `${immoObjectif.toLocaleString('fr-FR')}€` : d.objectifLabel}</span>
                    <span>⏱ {d.id === 'immo' ? `${Math.ceil(immoObjectif / (immoObjectif <= 5000 ? 209 : immoObjectif <= 10000 ? 417 : immoObjectif <= 20000 ? 834 : 1250))} mois` : d.dureeLabel}</span>
                    <span className="text-[#a78bfa]">+{d.pts} pts</span>
                  </div>

                  <button
                    onClick={() => { setModalDefi(d); setNomObjectif('') }}
                    className="w-full py-2.5 rounded-full font-semibold text-sm border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/10 transition-all"
                  >
                    Démarrer ce défi
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Défis complétés */}
        {completes.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Défis complétés 🏆</h2>
            <div className="space-y-3">
              {completes.map((c, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/10 flex items-center justify-between" style={{ backgroundColor: '#1a1d2d' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#052e16' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{c.objectif}{c.nomObjectif ? ` — ${c.nomObjectif}` : ''}</div>
                      <div className="text-[#94a3b8] text-xs">{new Date(c.dateCompletion).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#4ade80] font-bold">{c.montantEpargne.toLocaleString('fr-FR')}€</div>
                    <div className="text-[#a78bfa] text-xs">+{getPtsFin(c.type)} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalDefi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 border border-white/10" style={{ backgroundColor: '#1a1d2d' }}>
            <h3 className="text-xl font-bold text-white mb-2">Lancer le défi</h3>
            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#0d0f1a' }}>
              <p className="text-[#4ade80] font-semibold mb-1">{modalDefi.titre}</p>
              <p className="text-[#94a3b8] text-sm mb-2">{modalDefi.description}</p>
              <div className="text-xs text-[#94a3b8] flex gap-4">
                <span>🎯 {modalDefi.id === 'immo' ? `${immoObjectif.toLocaleString('fr-FR')}€` : modalDefi.objectifLabel}</span>
                <span>⏱ {modalDefi.dureeLabel}</span>
                <span className="text-[#a78bfa]">+{modalDefi.pts} pts</span>
              </div>
            </div>

            <label className="block text-sm text-[#94a3b8] mb-2">Nom de mon objectif (optionnel)</label>
            <input
              type="text"
              placeholder="ex: Maison au Sénégal, Apport appartement Paris…"
              value={nomObjectif}
              onChange={e => setNomObjectif(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm border border-white/10 mb-5 outline-none focus:border-[#4ade80]/50"
              style={{ backgroundColor: '#0d0f1a' }}
            />

            <div className="flex gap-3">
              <button onClick={() => setModalDefi(null)} className="flex-1 py-2.5 rounded-full text-sm text-[#94a3b8] border border-white/10 hover:bg-white/5 transition-all">Annuler</button>
              <button
                onClick={demarrerDefi}
                disabled={starting}
                className="flex-1 py-2.5 rounded-full text-sm font-bold transition-all disabled:opacity-50"
                style={{ backgroundColor: '#4ade80', color: '#052e16' }}
              >
                {starting ? 'Démarrage…' : 'Je relève le défi !'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
