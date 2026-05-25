// SCREEN 1 — HOME
// Streak, daily progress, weekly challenge, skills catalog.

window.HomeScreen = function HomeScreen({ state, navigate }) {
  const { streak, xp, dailyMinutes, weeklyRetos, level } = state;
  const dailyPct = Math.min(100, Math.round((dailyMinutes / 20) * 100));
  const weeklyPct = Math.min(100, Math.round((weeklyRetos / 5) * 100));
  const xpInLevel = xp % 500;
  const nextLevelXp = 500 - xpInLevel;

  const [activeCard, setActiveCard] = React.useState(0);
  const [selectedCat, setSelectedCat] = React.useState('negociacion');

  const courses = [
    {
      id: 'negociacion', icon: 'handshake',
      iconBg: 'var(--tide-100)', iconColor: 'var(--tide-700)',
      tag: 'En curso', tagBg: 'var(--tide-100)', tagColor: 'var(--tide-700)',
      title: 'Negociación',
      desc: 'Aprende a negociar tu salario y cerrar acuerdos en contextos B2B.',
      progress: 60, xp: 40, cta: 'Continuar',
    },
    {
      id: 'comunicacion', icon: 'message',
      iconBg: 'var(--azure-100)', iconColor: 'var(--azure-700)',
      tag: 'En curso', tagBg: 'var(--azure-100)', tagColor: 'var(--azure-700)',
      title: 'Comunicación efectiva',
      desc: 'Transmite tus ideas con claridad y adapta tu mensaje a cada audiencia.',
      progress: 85, xp: 30, cta: 'Continuar',
    },
    {
      id: 'feedback', icon: 'feedback',
      iconBg: 'var(--violet-100)', iconColor: 'var(--violet-700)',
      tag: 'Recomendado', tagBg: 'var(--paper-100)', tagColor: 'var(--paper-700)',
      title: 'Dar feedback',
      desc: 'Aprende a dar y recibir feedback constructivo para mejorar a tu equipo.',
      progress: 0, xp: 35, cta: 'Empezar',
    },
  ];

  const diffColor = {
    'Básico':      { tagBg: 'var(--tide-100)',   tagColor: 'var(--tide-700)'   },
    'Intermedio':  { tagBg: 'var(--amber-100)',  tagColor: 'var(--amber-700)'  },
    'Avanzado':    { tagBg: 'var(--rose-100)',   tagColor: 'var(--rose-700)'   },
  };

  const catalog = {
    comunicacion: [
      { id: 'comunicacion', name: 'Comunicación efectiva', icon: 'message',
        iconBg: 'var(--azure-100)', iconColor: 'var(--azure-700)',
        tag: 'Básico', progress: 85, xp: 30 },
      { id: 'influir', name: 'Influir sin autoridad', icon: 'users',
        iconBg: 'var(--paper-100)', iconColor: 'var(--fg-2)',
        tag: 'Intermedio', progress: 0, xp: 45 },
      { id: 'conversaciones', name: 'Gestionar conversaciones difíciles', icon: 'message',
        iconBg: 'var(--paper-100)', iconColor: 'var(--fg-2)',
        tag: 'Avanzado', progress: 0, xp: 65 },
    ],
    liderazgo: [
      { id: 'feedback', name: 'Dar feedback', icon: 'feedback',
        iconBg: 'var(--violet-100)', iconColor: 'var(--violet-700)',
        tag: 'Básico', progress: 70, xp: 35 },
      { id: 'liderazgo', name: 'Liderazgo de equipos', icon: 'users',
        iconBg: 'var(--paper-100)', iconColor: 'var(--fg-2)',
        tag: 'Intermedio', progress: 0, xp: 50 },
      { id: 'delegar', name: 'Delegar con confianza', icon: 'sparkles',
        iconBg: 'var(--paper-100)', iconColor: 'var(--fg-2)',
        tag: 'Avanzado', progress: 0, xp: 70 },
    ],
    negociacion: [
      { id: 'negociacion', name: 'Negociación', icon: 'handshake',
        iconBg: 'var(--tide-100)', iconColor: 'var(--tide-700)',
        tag: 'Básico', progress: 60, xp: 40, accent: true },
      { id: 'anclaje', name: 'Anclaje y framing', icon: 'sliders',
        iconBg: 'var(--paper-100)', iconColor: 'var(--fg-2)',
        tag: 'Intermedio', progress: 0, xp: 50 },
      { id: 'cierre', name: 'Cerrar acuerdos B2B', icon: 'handshake',
        iconBg: 'var(--paper-100)', iconColor: 'var(--fg-2)',
        tag: 'Avanzado', progress: 0, xp: 75 },
    ],
    conflictos: [
      { id: 'feedback', name: 'Dar feedback', icon: 'feedback',
        iconBg: 'var(--violet-100)', iconColor: 'var(--violet-700)',
        tag: 'Básico', progress: 70, xp: 35 },
      { id: 'conflictos', name: 'Gestión de conflictos', icon: 'sparkles',
        iconBg: 'var(--rose-100)', iconColor: 'var(--rose-700)',
        tag: 'Intermedio', progress: 20, xp: 50 },
      { id: 'mediar', name: 'Mediar entre partes', icon: 'users',
        iconBg: 'var(--paper-100)', iconColor: 'var(--fg-2)',
        tag: 'Avanzado', progress: 0, xp: 65 },
    ],
    decisiones: [
      { id: 'decisiones', name: 'Toma de decisiones', icon: 'sliders',
        iconBg: 'var(--teal-100)', iconColor: 'var(--teal-700)',
        tag: 'Básico', progress: 0, xp: 30 },
      { id: 'presion', name: 'Decidir bajo presión', icon: 'timer',
        iconBg: 'var(--paper-100)', iconColor: 'var(--fg-2)',
        tag: 'Intermedio', progress: 0, xp: 45 },
      { id: 'priorizacion', name: 'Priorización estratégica', icon: 'trending',
        iconBg: 'var(--paper-100)', iconColor: 'var(--fg-2)',
        tag: 'Avanzado', progress: 0, xp: 70 },
    ],
  };

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
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 8,
          }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.4 }}>
              ¡<strong style={{ color: 'var(--navy-900)' }}>{20 - dailyMinutes} min</strong> y mantienes tu racha!
            </div>
            <button onClick={() => navigate('simulacion')}
              className="btn-3d btn-3d-tide"
              style={{ borderRadius: 999, padding: '8px 14px', fontSize: 12,
                display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              ¡Practicar!
              <Icon name="arrow" size={12} color="#fff" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Course recommendations carousel */}
      <div style={{ padding: '20px 0 0' }}>
        <div style={{ padding: '0 20px', marginBottom: 12 }}>
          <Eyebrow>Cursos recomendados</Eyebrow>
        </div>

        {/* Scrollable cards */}
        <div
          className="scroll-hide"
          onScroll={e => {
            const { scrollLeft, scrollWidth, clientWidth } = e.target;
            const max = scrollWidth - clientWidth;
            if (max <= 0) return;
            setActiveCard(Math.round((scrollLeft / max) * (courses.length - 1)));
          }}
          style={{
            display: 'flex', gap: 12,
            overflowX: 'auto', overflowY: 'hidden',
            padding: '4px 0',
            scrollPaddingLeft: 20,
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div style={{ flexShrink: 0, width: 20 }} />
          {courses.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => navigate('detalle', { skillId: c.id })}
              className="pressable"
              style={{
                flex: '0 0 44%', scrollSnapAlign: 'start',
                background: 'var(--navy-900)',
                borderRadius: 28, padding: 14,
                boxShadow: '0 12px 32px -8px rgba(15,30,61,0.35)',
                border: 0, cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column',
                fontFamily: 'inherit',
              }}
            >
              <Eyebrow color="var(--tide-400)">{c.tag}</Eyebrow>
              <div style={{
                fontSize: 15, fontWeight: 600, color: '#fff',
                marginTop: 2, marginBottom: 12, letterSpacing: '-0.01em',
              }}>{c.title}</div>

              <p style={{
                fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,0.6)',
                margin: '0 0 14px',
              }}>{c.desc}</p>

              <div style={{ marginTop: 'auto' }}>
                <div className="bar-fill" style={{
                  height: 5, background: 'rgba(255,255,255,0.1)',
                  borderRadius: 999, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: c.tag === 'En curso' ? c.progress + '%' : '100%',
                    background: c.tag === 'En curso'
                      ? 'linear-gradient(90deg, var(--tide-500), var(--tide-300))'
                      : 'rgba(255,255,255,0.12)',
                  }} />
                </div>
                {c.tag === 'En curso' && (
                  <div style={{
                    fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 5,
                    fontFamily: 'var(--font-mono)',
                  }}>{c.progress}% completado</div>
                )}
              </div>
            </button>
          ))}
          {/* right edge spacer — padding-right unreliable in overflow-x flex */}
          <div style={{ flexShrink: 0, width: 20 }} />
        </div>

        {/* Dot indicators */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 5, marginTop: 12,
        }}>
          {courses.map((_, i) => (
            <div key={i} style={{
              height: 6, borderRadius: 999,
              width: i === activeCard ? 18 : 6,
              background: i === activeCard ? 'var(--navy-900)' : 'var(--paper-300)',
              transition: 'all 220ms var(--ease-out)',
            }} />
          ))}
        </div>
      </div>

      {/* Explore by skill */}
      <div style={{ padding: '24px 20px 0' }}>
        <Eyebrow style={{ marginBottom: 12 }}>Explora por habilidad</Eyebrow>
        <div className="scroll-hide" style={{
          display: 'flex', flexDirection: 'row', gap: 10,
          overflowX: 'auto', paddingBottom: 4,
        }}>
          {[
            { label: 'Negociación',           icon: 'handshake', id: 'negociacion' },
            { label: 'Comunicación',          icon: 'message',   id: 'comunicacion' },
            { label: 'Liderazgo',             icon: 'users',     id: 'liderazgo' },
            { label: 'Gestión de conflictos', icon: 'sparkles',  id: 'conflictos' },
            { label: 'Toma de decisiones',    icon: 'sliders',   id: 'decisiones' },
          ].map((cat, i) => {
            const selected = cat.id === selectedCat;
            return (
              <button key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className="pressable"
                style={{
                  flex: '0 0 88px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                  background: selected ? 'var(--navy-900)' : 'var(--paper-0)',
                  border: selected ? '1px solid var(--navy-900)' : '1px solid var(--border)',
                  borderRadius: 20, padding: '16px 8px',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: selected ? 'rgba(255,255,255,0.12)' : 'var(--tide-100)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={cat.icon} size={18} color={selected ? '#fff' : 'var(--tide-700)'} />
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  color: selected ? '#fff' : 'var(--tide-700)',
                  textAlign: 'center', lineHeight: 1.3,
                }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog filtered by category */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {catalog[selectedCat].map(s => (
            <div key={s.id} onClick={() => navigate('detalle', { skillId: s.id })}
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
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--navy-900)', marginBottom: 6 }}>{s.name}</div>
                <div style={{ height: 4, background: 'var(--paper-100)', borderRadius: 999, overflow: 'hidden', marginBottom: 4 }}>
                  {s.progress > 0 ? (
                    <div style={{
                      height: '100%', width: s.progress + '%',
                      background: s.accent
                        ? 'linear-gradient(90deg, var(--tide-700), var(--tide-500))'
                        : 'var(--navy-900)',
                    }} />
                  ) : (
                    <div style={{ height: '100%', width: '100%', background: 'var(--paper-200)' }} />
                  )}
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: 'var(--tide-700)', fontWeight: 500,
                }}>
                  <Icon name="zap" size={11} color="var(--tide-700)" />
                  +{s.xp} XP
                </span>
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                justifyContent: 'space-between', flexShrink: 0, alignSelf: 'stretch',
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: diffColor[s.tag]?.tagColor, background: diffColor[s.tag]?.tagBg,
                  padding: '2px 6px', borderRadius: 999,
                }}>{s.tag}</span>
                <button
                  onClick={e => { e.stopPropagation(); navigate('detalle', { skillId: s.id }); }}
                  className={s.progress > 0 ? 'btn-3d btn-3d-tide' : 'btn-3d btn-3d-paper'}
                  style={{ borderRadius: 999, padding: '7px 12px', fontSize: 11,
                    display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {s.progress > 0 ? 'Continuar' : 'Empezar'}
                  <Icon name="arrow" size={11} color={s.progress > 0 ? '#fff' : 'var(--navy-900)'} strokeWidth={2.5} />
                </button>
              </div>
            </div>
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
