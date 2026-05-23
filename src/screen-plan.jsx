// SCREEN 6 — PLAN
// Week calendar strip + scrollable session cards.

window.PlanScreen = function PlanScreen({ state, navigate }) {
  const todayIdx = 1; // Tuesday
  const [selected, setSelected] = React.useState(todayIdx);
  const cardRefs = React.useRef({});

  const days = [
    { i: 0, d: 'L', dn: 17 },
    { i: 1, d: 'M', dn: 18 },
    { i: 2, d: 'X', dn: 19 },
    { i: 3, d: 'J', dn: 20 },
    { i: 4, d: 'V', dn: 21 },
    { i: 5, d: 'S', dn: 22 },
    { i: 6, d: 'D', dn: 23 },
  ];

  const tagColors = {
    'Negociación': { bg: 'var(--tide-100)',   fg: 'var(--tide-700)'   },
    'Feedback':    { bg: 'var(--violet-100)', fg: 'var(--violet-700)' },
    'Decisiones':  { bg: 'var(--teal-100)',   fg: 'var(--teal-700)'   },
    'Conflictos':  { bg: 'var(--rose-100)',   fg: 'var(--rose-700)'   },
    'Síntesis':    { bg: 'var(--azure-100)',  fg: 'var(--azure-700)'  },
    'Descanso':    { bg: 'var(--paper-100)',  fg: 'var(--fg-3)'       },
  };

  const sessions = [
    { i: 0, day: 'Lunes',     title: 'Anclaje numérico en negociación', duration: '8 min', tag: 'Negociación',  status: 'completed', target: 'detalle', xp: 25 },
    { i: 1, day: 'Martes',    title: 'Pedir aumento — simulación IA',  duration: '12 min',tag: 'Negociación',  status: 'current',   target: 'simulacion', xp: 40 },
    { i: 2, day: 'Miércoles', title: 'Feedback constructivo a junior', duration: '7 min', tag: 'Feedback',     status: 'upcoming',  target: 'detalle', xp: 30 },
    { i: 3, day: 'Jueves',    title: 'Decisión bajo presión',          duration: '6 min', tag: 'Decisiones',   status: 'upcoming',  target: 'detalle', xp: 25 },
    { i: 4, day: 'Viernes',   title: 'Conflicto con cliente difícil',  duration: '10 min',tag: 'Conflictos',   status: 'upcoming',  target: 'detalle', xp: 35 },
    { i: 5, day: 'Sábado',    title: 'Revisión semanal · 2 min',       duration: '2 min', tag: 'Síntesis',     status: 'upcoming',  target: 'fortalezas', xp: 10 },
    { i: 6, day: 'Domingo',   title: 'Descanso activo',                duration: '—',     tag: 'Descanso',     status: 'rest',      target: null, xp: 0 },
  ];

  const onDayTap = (i) => {
    setSelected(i);
    const el = cardRefs.current[i];
    if (el && el.scrollIntoView) {
      // not allowed per env rules — use scroll math via parent
      const parent = el.closest('[data-plan-list]');
      if (parent) {
        parent.scrollTo({ top: el.offsetTop - parent.offsetTop - 8, behavior: 'smooth' });
      }
    }
  };

  const insights = [
    { icon: 'sparkles',   label: 'Mejor hora · 09:30' },
    { icon: 'trending',   label: '+45% vs semana ant.' },
    { icon: 'timer',      label: 'Ritmo: 8 min/día' },
  ];

  return (
    <div className="screen-in" style={{ paddingBottom: 110 }}>
      <ScreenTitle eyebrow="Tu plan · semana 21" title="¡Tu semana" accent="de práctica!" />

      {/* Calendar strip */}
      <div style={{ padding: '0 20px' }}>
        <div style={{
          background: 'var(--paper-0)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 12,
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4,
        }}>
          {days.map(d => {
            const isSelected = selected === d.i;
            const isToday = d.i === todayIdx;
            const session = sessions[d.i];
            const done = session.status === 'completed';
            return (
              <button key={d.i} onClick={() => onDayTap(d.i)} className="pressable" style={{
                background: isSelected ? 'var(--navy-900)' : 'transparent',
                color: isSelected ? '#fff' : 'var(--navy-900)',
                border: 0, borderRadius: 10, padding: '8px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: isSelected ? 'rgba(255,255,255,0.6)' : 'var(--fg-3)',
                }}>{d.d}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                }}>{d.dn}</span>
                <div style={{
                  width: 5, height: 5, borderRadius: 999,
                  background: done ? 'var(--tide-500)'
                            : isToday ? 'var(--lift-500)'
                            : session.status === 'rest' ? 'transparent'
                            : (isSelected ? 'rgba(255,255,255,0.4)' : 'var(--paper-300)'),
                }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* IA insight chips */}
      <div style={{ padding: '14px 20px 0' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {insights.map((s, i) => (
            <div key={i} style={{
              flexShrink: 0,
              background: 'var(--paper-0)', border: '1px solid var(--border)',
              borderRadius: 999, padding: '6px 12px',
              fontSize: 11, color: 'var(--fg-2)', fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name={s.icon} size={12} color="var(--tide-700)" />
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Session cards */}
      <div data-plan-list style={{ padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sessions.map(s => {
          const isCurrent = s.status === 'current';
          const isSelected = selected === s.i;
          return (
            <div key={s.i}
              ref={el => cardRefs.current[s.i] = el}
              style={{
                background: 'var(--paper-0)',
                border: isCurrent || isSelected ? '1px solid var(--tide-500)' : '1px solid var(--border)',
                borderRadius: 14, padding: 14,
                display: 'flex', flexDirection: 'column', gap: 10,
                position: 'relative',
                boxShadow: isSelected ? '0 4px 12px -2px rgba(29,158,117,0.18)' : 'none',
                opacity: s.status === 'rest' ? 0.65 : 1,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--fg-3)', letterSpacing: '0.14em',
                  textTransform: 'uppercase', fontWeight: 600,
                }}>{s.day} · {s.duration}</span>
                {isCurrent && (
                  <span style={{
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'var(--tide-700)',
                    background: 'var(--tide-100)', padding: '2px 6px', borderRadius: 999,
                  }}>Hoy</span>
                )}
                {s.status === 'completed' && (
                  <span style={{
                    marginLeft: 'auto',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 11, color: 'var(--success-500)', fontWeight: 500,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    <Icon name="checkCircle" size={14} color="var(--success-500)" />
                    Hecho · +{s.xp} XP
                  </span>
                )}
                {s.status === 'rest' && (
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
                    sin reto
                  </span>
                )}
              </div>
              <div style={{
                fontSize: 16, fontWeight: 500, color: 'var(--navy-900)',
                lineHeight: 1.3, letterSpacing: '-0.01em',
              }}>{s.title}</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, paddingTop: 6,
                borderTop: '1px solid var(--border)',
              }}>
                <span style={{
                  fontSize: 11, color: tagColors[s.tag]?.fg || 'var(--fg-3)',
                  fontFamily: 'var(--font-mono)',
                  background: tagColors[s.tag]?.bg || 'var(--paper-100)',
                  padding: '3px 8px', borderRadius: 999,
                }}>{s.tag}</span>
                {s.xp > 0 && s.status !== 'completed' && (
                  <span style={{
                    fontSize: 11, color: 'var(--tide-700)', fontFamily: 'var(--font-mono)',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <Icon name="zap" size={11} color="var(--tide-700)" />
                    +{s.xp} XP
                  </span>
                )}
                {s.target && s.status !== 'completed' && (
                  <button onClick={() => navigate(s.target, { skillId: 'negociacion', difficulty: 'Medio' })}
                    className={isCurrent ? 'btn-3d btn-3d-tide' : 'btn-3d btn-3d-paper'}
                    style={{
                      marginLeft: 'auto',
                      borderRadius: 999, padding: '8px 14px',
                      fontSize: 12,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                    {isCurrent ? '¡Empezar!' : 'Empezar'}
                    <Icon name="arrow" size={12} color={isCurrent ? '#fff' : 'var(--navy-900)'} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
