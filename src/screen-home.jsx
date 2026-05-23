// SCREEN 1 — HOME
// Streak, daily progress, weekly challenge, skills catalog.

window.HomeScreen = function HomeScreen({ state, navigate }) {
  const { streak, xp, dailyMinutes, weeklyRetos, level } = state;
  const dailyPct = Math.min(100, Math.round((dailyMinutes / 20) * 100));
  const weeklyPct = Math.min(100, Math.round((weeklyRetos / 5) * 100));
  const xpInLevel = xp % 500;
  const nextLevelXp = 500 - xpInLevel;

  const skills = [
    { id: 'negociacion', name: 'Negociación', icon: 'handshake', tag: 'En curso',
      iconBg: 'var(--tide-100)', iconColor: 'var(--tide-700)',
      tagColor: 'var(--tide-700)', tagBg: 'var(--tide-100)',
      progress: 60, accent: true, accentColor: 'var(--tide-500)' },
    { id: 'comunicacion', name: 'Comunicación efectiva', icon: 'message', tag: 'Activo',
      iconBg: 'var(--azure-100)', iconColor: 'var(--azure-700)',
      tagColor: 'var(--azure-700)', tagBg: 'var(--azure-100)', progress: 85 },
    { id: 'feedback', name: 'Feedback', icon: 'feedback', tag: 'Activo',
      iconBg: 'var(--violet-100)', iconColor: 'var(--violet-700)',
      tagColor: 'var(--violet-700)', tagBg: 'var(--violet-100)', progress: 70 },
    { id: 'liderazgo', name: 'Liderazgo de equipos', icon: 'users', tag: 'Recomendado',
      iconBg: 'var(--amber-100)', iconColor: 'var(--amber-700)',
      tagColor: 'var(--paper-700)', tagBg: 'var(--paper-100)', progress: 55 },
    { id: 'decisiones', name: 'Toma de decisiones', icon: 'sliders', tag: 'Recomendado',
      iconBg: 'var(--teal-100)', iconColor: 'var(--teal-700)',
      tagColor: 'var(--paper-700)', tagBg: 'var(--paper-100)', progress: 60 },
    { id: 'conflictos', name: 'Gestión de conflictos', icon: 'sparkles', tag: 'Gap detectado',
      iconBg: 'var(--rose-100)', iconColor: 'var(--rose-700)',
      tagColor: 'var(--lift-700)', tagBg: 'var(--lift-100)', progress: 20 },
  ];

  return (
    <div className="screen-in" style={{ paddingBottom: 110 }}>
      {/* Hero — greeting + serif headline */}
      <div style={{ padding: '14px 20px 16px' }}>
        <h1 style={{
          margin: 0,
          fontFamily: 'var(--font-serif)',
          fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.03em',
          fontWeight: 500, color: 'var(--navy-900)',
        }}>
          ¡Hola, <span style={{ color: 'var(--tide-600)' }}>Ana!</span>
        </h1>
        <p style={{
          margin: '8px 0 0', fontSize: 14, lineHeight: 1.45, color: 'var(--fg-2)',
          maxWidth: 320,
        }}>Solo <strong style={{ color: 'var(--navy-900)' }}>15 minutos</strong> más para tu meta de hoy. ¡Tú puedes!</p>
      </div>

      {/* Daily progress + Streak hero card */}
      <div style={{ padding: '0 20px' }}>
        <div data-sticker="primary" data-card-radius style={{
          background: 'var(--paper-0)', border: '1px solid var(--border)',
          borderRadius: 28, padding: 20, position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 12, background: 'var(--lift-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div className="fire-pulse" style={{ display: 'inline-flex' }}>
                <Icon name="flame" size={18} color="var(--lift-500)" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <Eyebrow color="var(--fg-3)">Racha</Eyebrow>
              <div style={{
                fontSize: 18, fontWeight: 600, color: 'var(--navy-900)',
                letterSpacing: '-0.015em', lineHeight: 1.2,
              }}>{streak} días seguidos</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Eyebrow color="var(--fg-3)">Hoy</Eyebrow>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 500,
                color: 'var(--navy-900)', fontVariantNumeric: 'tabular-nums',
              }}>{dailyMinutes}<span style={{ color: 'var(--fg-3)', fontSize: 12 }}>/20 min</span></div>
            </div>
          </div>

          {/* streak circles — week L M M J V S D */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 14 }}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => {
              const todayIdx  = 3;                  // jueves
              const isWeekend = i >= 5;             // sábado y domingo
              const isPast    = i < todayIdx;
              const isToday   = i === todayIdx;
              const lessonDone = isPast && !isWeekend;

              // Weekends: círculo con borde discontinuo, sin relleno sólido
              if (isWeekend) {
                return (
                  <div key={i} style={{
                    width: '100%', aspectRatio: '1/1', borderRadius: 999,
                    border: '1.5px dashed var(--paper-300)',
                    background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
                      color: 'var(--fg-3)',
                    }}>{d}</span>
                  </div>
                );
              }

              return (
                <div key={i} style={{
                  width: '100%', aspectRatio: '1/1', borderRadius: 999,
                  background: lessonDone ? 'var(--lift-500)'
                             : isToday   ? 'var(--lift-100)'
                             :             'var(--paper-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                    color: lessonDone ? '#fff'
                          : (isPast || isToday) ? 'var(--lift-700)'
                          : 'var(--fg-3)',
                  }}>{d}</span>
                </div>
              );
            })}
          </div>

          {/* daily minutes bar */}
          <div className="bar-fill" style={{
            height: 6, background: 'var(--paper-100)',
            borderRadius: 999, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: dailyPct + '%',
              background: 'linear-gradient(90deg, var(--tide-700), var(--tide-500))',
              transition: 'width 600ms var(--ease-out)',
            }} />
          </div>
          <div style={{
            fontSize: 12, color: 'var(--fg-3)', marginTop: 8, lineHeight: 1.4,
          }}>¡<strong style={{ color: 'var(--navy-900)' }}>{20 - dailyMinutes} min</strong> y mantienes tu racha de hoy!</div>
        </div>
      </div>

      {/* Weekly challenge */}
      <div style={{ padding: '16px 20px 0' }}>
        <div data-sticker="dark" data-card-radius style={{
          background: 'var(--navy-900)', color: '#fff',
          borderRadius: 28, padding: 20, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Eyebrow color="var(--tide-300)">Reto semanal</Eyebrow>
            <span style={{
              marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'rgba(255,255,255,0.6)',
            }}>3 días restantes</span>
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 24, lineHeight: 1.15, letterSpacing: '-0.02em',
            fontWeight: 500,
            color: '#fff', marginBottom: 14,
          }}>¡Completa <span style={{ color: 'var(--tide-300)' }}>5 retos</span> de negociación esta semana!</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="bar-fill" style={{
              flex: 1, height: 8, background: 'rgba(255,255,255,0.12)',
              borderRadius: 999, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: weeklyPct + '%',
                background: 'linear-gradient(90deg, var(--tide-500), var(--tide-300))',
                transition: 'width 700ms var(--ease-out)',
              }} />
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500,
              color: '#fff', fontVariantNumeric: 'tabular-nums',
            }}>{weeklyRetos}<span style={{ color: 'rgba(255,255,255,0.5)' }}>/5</span></div>
          </div>
          <div style={{
            marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="zap" size={12} color="var(--tide-300)" />
            <span>Recompensa: <strong style={{ color: '#fff' }}>+150 XP</strong> y badge <em style={{ color: 'var(--tide-300)' }}>Negociadora L2</em></span>
          </div>
        </div>
      </div>

      {/* Catalog */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 12 }}>
          <Eyebrow>Tu catálogo de skills</Eyebrow>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
            {skills.length} activos
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {skills.map(s => (
            <button key={s.id} onClick={() => navigate('detalle', { skillId: s.id })}
              className="pressable" style={{
                textAlign: 'left', cursor: 'pointer',
                background: 'var(--paper-0)', border: s.accent ? '1px solid var(--tide-500)' : '1px solid var(--border)',
                borderRadius: 24, padding: 14,
                display: 'flex', alignItems: 'center', gap: 12,
                fontFamily: 'inherit',
                boxShadow: s.accent
                  ? '0 4px 12px -2px rgba(16,185,129,0.22), 0 2px 4px -1px rgba(16,185,129,0.10)'
                  : 'none',
              }}>
              <div style={{
                width: 40, height: 40, borderRadius: 14,
                background: s.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon name={s.icon} size={20} color={s.iconColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--navy-900)' }}>{s.name}</div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: s.tagColor, background: s.tagBg,
                    padding: '2px 6px', borderRadius: 999,
                  }}>{s.tag}</span>
                </div>
                <div style={{
                  height: 4, background: 'var(--paper-100)',
                  borderRadius: 999, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: s.progress + '%',
                    background: s.accent
                      ? 'linear-gradient(90deg, var(--tide-700), var(--tide-500))'
                      : 'var(--navy-900)',
                  }} />
                </div>
              </div>
              <Icon name="chevron" size={16} color="var(--fg-3)" />
            </button>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <div style={{
        padding: '24px 20px 8px',
        fontSize: 11, color: 'var(--fg-3)', textAlign: 'center',
        fontFamily: 'var(--font-mono)',
      }}>
        Te faltan <strong style={{ color: 'var(--navy-900)' }}>{nextLevelXp} XP</strong> para subir al nivel {level + 1}.
      </div>
    </div>
  );
};
