// SCREEN 5 — RANKING
// Leaderboard with tabs, team challenge, tappable achievement badges.

window.RankingScreen = function RankingScreen({ state }) {
  const [tab, setTab] = React.useState('semana');
  const [tooltip, setTooltip] = React.useState(null);

  // base data — Ana's row reflects current global state
  const baseLeaderboard = [
    { rank: 1, name: 'Carlos M.',  xp: 1890, streak: 12 },
    { rank: 2, name: 'Laura G.',   xp: 1654, streak: 9 },
    { rank: 3, name: 'Sergio P.',  xp: 1421, streak: 7 },
    { rank: 4, name: 'Ana (Tú)',   xp: state.xp, streak: state.streak, isUser: true },
    { rank: 5, name: 'María T.',   xp: 980,  streak: 3 },
    { rank: 6, name: 'Javier R.',  xp: 756,  streak: 1 },
  ];

  // resort by xp & re-rank
  const sorted = [...baseLeaderboard].sort((a, b) => b.xp - a.xp)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  // detect if Ana's rank improved vs initial (rank 4)
  const ana = sorted.find(r => r.isUser);
  const improved = ana && ana.rank < 4;

  const tabs = [
    { id: 'semana', label: 'Semana' },
    { id: 'mes',    label: 'Mes' },
    { id: 'global', label: 'Global' },
  ];

  // For "mes" and "global" we apply a soft scaling so the UI feels alive
  const display = sorted.map(r => {
    let xp = r.xp;
    if (tab === 'mes') xp = Math.round(r.xp * 3.4);
    if (tab === 'global') xp = Math.round(r.xp * 11.2);
    return { ...r, xpDisplay: xp };
  });

  const badges = [
    { id: 'b1', icon: 'fire',      label: 'Encendida', desc: 'Racha de 7 días sin saltarte un reto.',     unlocked: true },
    { id: 'b2', icon: 'handshake', label: 'Negociadora L1', desc: 'Completa 5 retos de negociación.',     unlocked: true },
    { id: 'b3', icon: 'sparkles',  label: 'Primera IA', desc: 'Termina tu primera simulación con IA.',   unlocked: true },
    { id: 'b4', icon: 'medal',     label: 'Top 3', desc: 'Llega al podio en el ranking semanal.',        unlocked: improved },
    { id: 'b5', icon: 'star',      label: 'Constante', desc: 'Mantén la racha hasta 14 días.',           unlocked: false },
    { id: 'b6', icon: 'crown',     label: 'Negociadora L2', desc: 'Completa el módulo "Negociación".',   unlocked: false },
  ];

  return (
    <div className="screen-in" style={{ paddingBottom: 110 }}>
      <ScreenTitle eyebrow="Ranking" title="¡A por el" accent="podio!" />

      {/* Tabs */}
      <div style={{ padding: '0 20px' }}>
        <div style={{
          background: 'var(--paper-100)', borderRadius: 16,
          padding: 4, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="pressable" style={{
              background: tab === t.id ? 'var(--paper-0)' : 'transparent',
              color: tab === t.id ? 'var(--navy-900)' : 'var(--fg-3)',
              border: 0, borderRadius: 12, padding: '9px 8px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: tab === t.id ? 'var(--shadow-xs)' : 'none',
              fontFamily: 'inherit',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Team challenge */}
      <div style={{ padding: '18px 20px 0' }}>
        <div data-sticker="warm" data-card-radius style={{
          background: 'var(--paper-0)', border: '1px solid var(--border)',
          borderRadius: 24, padding: 16, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 12, background: 'var(--lift-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="users" size={16} color="var(--lift-700)" />
            </div>
            <div style={{ flex: 1 }}>
              <Eyebrow color="var(--fg-3)">Reto de equipo</Eyebrow>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-900)' }}>
                People · 50 retos esta semana
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500,
              color: 'var(--navy-900)', fontVariantNumeric: 'tabular-nums',
            }}>31<span style={{ color: 'var(--fg-3)' }}>/50</span></div>
          </div>
          <div className="bar-fill" style={{
            height: 8, background: 'var(--paper-100)',
            borderRadius: 999, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: (31/50*100) + '%',
              background: 'linear-gradient(90deg, var(--lift-500), var(--lift-300))',
              transition: 'width 900ms var(--ease-out)',
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
            Si lo lográis, todo el equipo desbloquea el badge <strong style={{ color: 'var(--navy-900)' }}>Pulso colectivo</strong>.
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ padding: '22px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <Eyebrow>Clasificación</Eyebrow>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
            6 personas
          </span>
        </div>
        <div style={{
          background: 'var(--paper-0)', border: '1px solid var(--border)',
          borderRadius: 20, overflow: 'hidden',
        }}>
          {display.map((r, i) => {
            const isPodium = r.rank <= 3;
            return (
              <div key={r.name} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px',
                borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                background: r.isUser ? 'var(--tide-100)' : 'transparent',
                position: 'relative',
              }}>
                <div style={{
                  width: 24, fontFamily: 'var(--font-mono)', fontSize: 13,
                  fontWeight: 500,
                  color: isPodium ? 'var(--navy-900)' : 'var(--fg-3)',
                  fontVariantNumeric: 'tabular-nums', textAlign: 'center',
                }}>
                  {r.rank}
                  {isPodium && r.rank === 1 && (
                    <div style={{ marginTop: -4 }}>
                      <Icon name="crown" size={10} color="var(--lift-500)" />
                    </div>
                  )}
                </div>
                <div style={{
                  width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                  background: r.isUser ? 'var(--tide-500)' : isPodium ? 'var(--navy-900)' : 'var(--paper-200)',
                  color: r.isUser || isPodium ? '#fff' : 'var(--navy-900)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600,
                }}>
                  {r.name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: r.isUser ? 600 : 500,
                    color: 'var(--navy-900)',
                  }}>{r.name}</div>
                  <div style={{
                    fontSize: 11, color: 'var(--fg-3)',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Icon name="flame" size={10} color="var(--lift-500)" />
                    {r.streak} días
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500,
                    color: 'var(--navy-900)', fontVariantNumeric: 'tabular-nums',
                  }}>{r.xpDisplay.toLocaleString('es-ES')}</div>
                  <div style={{
                    fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)',
                  }}>XP</div>
                </div>
                {r.isUser && improved && (
                  <div className="rank-rise" style={{
                    position: 'absolute', right: 60, top: 16,
                    color: 'var(--success-500)', fontSize: 12, fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: 2,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    <Icon name="arrowUp" size={12} color="var(--success-500)" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div style={{ padding: '22px 20px 0' }}>
        <Eyebrow style={{ marginBottom: 10 }}>Logros</Eyebrow>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
        }}>
          {badges.map(b => (
            <button key={b.id}
              onClick={() => setTooltip(tooltip === b.id ? null : b.id)}
              className="pressable"
              style={{
                background: b.unlocked ? 'var(--paper-0)' : 'var(--paper-100)',
                border: b.unlocked ? '1px solid var(--border)' : '1px dashed var(--paper-300)',
                borderRadius: 20, padding: '14px 8px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                position: 'relative', cursor: 'pointer',
                opacity: b.unlocked ? 1 : 0.55,
                fontFamily: 'inherit',
              }}>
              <div style={{
                width: 40, height: 40, borderRadius: 999,
                background: b.unlocked ? 'var(--tide-100)' : 'var(--paper-200)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={b.icon} size={20}
                  color={b.unlocked ? 'var(--tide-700)' : 'var(--fg-3)'} />
              </div>
              <div style={{
                fontSize: 11, fontWeight: 500, color: 'var(--navy-900)',
                textAlign: 'center', lineHeight: 1.2,
              }}>{b.label}</div>
              {!b.unlocked && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 16, height: 16, borderRadius: 999,
                  background: 'var(--paper-0)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="lock" size={8} color="var(--fg-3)" />
                </div>
              )}
              {tooltip === b.id && (
                <div onClick={(e) => { e.stopPropagation(); setTooltip(null); }} style={{
                  position: 'absolute', top: '-8px', left: '50%',
                  transform: 'translate(-50%, -100%)',
                  background: 'var(--navy-900)', color: '#fff',
                  padding: '8px 10px', borderRadius: 12,
                  fontSize: 11, lineHeight: 1.4, zIndex: 5,
                  width: 160, textAlign: 'center',
                  boxShadow: 'var(--shadow-lg)',
                }}>
                  {b.desc}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
