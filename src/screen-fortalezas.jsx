// SCREEN 4 — FORTALEZAS Y DEBILIDADES
// Animated SVG radar, tab toggle, IA insight at bottom.

window.FortalezasScreen = function FortalezasScreen({ state, navigate }) {
  const [tab, setTab] = React.useState('fortalezas');
  const skills = state.skills;
  const labels = {
    comunicacion: 'Comunicación', negociacion: 'Negociación',
    feedback: 'Feedback', liderazgo: 'Liderazgo',
    decisiones: 'Decisiones', conflictos: 'Conflictos',
  };
  const order = ['comunicacion', 'feedback', 'liderazgo', 'decisiones', 'conflictos', 'negociacion'];

  const fortalezas = order
    .map(k => ({ key: k, label: labels[k], value: skills[k] }))
    .filter(s => s.value >= 60)
    .sort((a, b) => b.value - a.value);

  const debilidades = order
    .map(k => ({ key: k, label: labels[k], value: skills[k] }))
    .filter(s => s.value < 60)
    .sort((a, b) => a.value - b.value);

  return (
    <div className="screen-in" style={{ paddingBottom: 110 }}>
      <ScreenTitle eyebrow="Tu skill map" title="¡Mira dónde" accent="brillas!" />

      {/* Radar */}
      <div style={{ padding: '0 20px' }}>
        <div data-sticker="primary" data-card-radius style={{
          background: 'var(--paper-0)', border: '1px solid var(--border)',
          borderRadius: 20, padding: 20, position: 'relative', overflow: 'hidden',
        }}>
          <Radar skills={skills} order={order} labels={labels} />
          <div style={{
            display: 'flex', justifyContent: 'space-around', marginTop: 8,
            paddingTop: 14, borderTop: '1px solid var(--border)',
          }}>
            <RadarStat label="Skills medidos" value={order.length} />
            <RadarStat label="Promedio" value={Math.round(order.reduce((s, k) => s + skills[k], 0) / order.length)} suffix="%" />
            <RadarStat label="Esta semana" value="+8" delta />
          </div>
        </div>
      </div>

      {/* Tab toggle */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          background: 'var(--paper-100)', borderRadius: 12,
          padding: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
        }}>
          {[
            { id: 'fortalezas', label: 'Tus fortalezas' },
            { id: 'mejora',     label: 'Áreas de mejora' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="pressable" style={{
              background: tab === t.id ? 'var(--paper-0)' : 'transparent',
              color: tab === t.id ? 'var(--navy-900)' : 'var(--fg-3)',
              border: 0, borderRadius: 10, padding: '10px 8px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: tab === t.id ? 'var(--shadow-xs)' : 'none',
              fontFamily: 'inherit',
              transition: 'all 180ms var(--ease-out)',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Skill cards */}
      <div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(tab === 'fortalezas' ? fortalezas : debilidades).map(s => (
          <SkillRow key={s.key} skill={s} mode={tab} onPractice={() => navigate('detalle', { skillId: s.key })} />
        ))}
        {tab === 'fortalezas' && fortalezas.length === 0 && (
          <EmptyHint text="Aún no destacas en ninguna skill — sigue practicando esta semana." />
        )}
      </div>

      {/* IA insight — always visible */}
      <div style={{ padding: '22px 20px 0' }}>
        <div data-sticker="dark" data-card-radius style={{
          background: 'var(--navy-900)', color: '#fff',
          borderRadius: 16, padding: 18, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon name="sparkles" size={14} color="var(--tide-300)" />
            <Eyebrow color="var(--tide-300)">Lectura del motor</Eyebrow>
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 22, lineHeight: 1.15, letterSpacing: '-0.02em',
            fontWeight: 500,
            color: '#fff', marginBottom: 10,
          }}>
            ¡Tu <span style={{ color: 'var(--tide-300)' }}>comunicación</span> va genial! Vamos con los <span style={{ color: 'var(--tide-300)' }}>conflictos</span>.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            Detectado tras 18 retos. Te sugiero 2 sesiones cortas de conflictos esta semana — 12 min cada una.
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
function Radar({ skills, order, labels }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2 + 8;
  const r = 100;
  const n = order.length;
  const [animKey, setAnimKey] = React.useState(0);

  React.useEffect(() => { setAnimKey(k => k + 1); }, []);

  // angle for index i (start at -90deg)
  const angle = i => -Math.PI / 2 + (i / n) * Math.PI * 2;
  const pt = (i, ratio) => {
    const a = angle(i);
    return [cx + Math.cos(a) * r * ratio, cy + Math.sin(a) * r * ratio];
  };
  const labelPt = (i) => {
    const a = angle(i);
    const lr = r + 24;
    return [cx + Math.cos(a) * lr, cy + Math.sin(a) * lr];
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const polygon = order.map((k, i) => {
    const [x, y] = pt(i, skills[k] / 100);
    return x + ',' + y;
  }).join(' ');

  return (
    <svg key={animKey} viewBox={`-60 0 ${size + 120} ${size + 30}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--tide-500)" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="var(--tide-300)" stopOpacity="0.15"/>
        </linearGradient>
      </defs>
      {/* concentric polygons */}
      {gridLevels.map((lv, li) => {
        const pts = order.map((_, i) => {
          const [x, y] = pt(i, lv);
          return x + ',' + y;
        }).join(' ');
        return (
          <polygon key={li} points={pts}
            fill={li === gridLevels.length - 1 ? 'var(--paper-50)' : 'none'}
            stroke="var(--paper-200)" strokeWidth="1" />
        );
      })}
      {/* spokes */}
      {order.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--paper-200)" strokeWidth="1" />;
      })}
      {/* data polygon */}
      <polygon
        points={polygon}
        fill="url(#radarFill)"
        stroke="var(--tide-500)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 600, strokeDashoffset: 600,
          animation: 'dashDraw 1200ms var(--ease-out) forwards, fadeIn 800ms var(--ease-out) forwards',
        }}
      />
      <style>{`@keyframes fadeIn { from { fill-opacity: 0; } to { fill-opacity: 1; } }`}</style>
      {/* data points */}
      {order.map((k, i) => {
        const [x, y] = pt(i, skills[k] / 100);
        const isLow = skills[k] < 40;
        return (
          <g key={k} style={{ opacity: 0, animation: `fadeIn 400ms ${600 + i * 80}ms var(--ease-out) forwards` }}>
            <circle cx={x} cy={y} r="5" fill={isLow ? 'var(--lift-500)' : 'var(--tide-500)'} />
            <circle cx={x} cy={y} r="2" fill="#fff" />
          </g>
        );
      })}
      {/* labels */}
      {order.map((k, i) => {
        const [lx, ly] = labelPt(i);
        const anchor = lx < cx - 4 ? 'end' : lx > cx + 4 ? 'start' : 'middle';
        return (
          <g key={'l' + k}>
            <text x={lx} y={ly} fontSize="11" fill="var(--fg-2)"
              fontFamily="var(--font-sans)" fontWeight="500"
              textAnchor={anchor} dominantBaseline="middle">
              {labels[k]}
            </text>
            <text x={lx} y={ly + 12} fontSize="10" fill="var(--fg-3)"
              fontFamily="var(--font-mono)"
              textAnchor={anchor} dominantBaseline="middle">
              {skills[k]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RadarStat({ label, value, suffix, delta }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'var(--fg-3)', marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 500,
        color: delta ? 'var(--success-500)' : 'var(--navy-900)',
        fontVariantNumeric: 'tabular-nums',
      }}>{value}{suffix}</div>
    </div>
  );
}

function SkillRow({ skill, mode, onPractice }) {
  const isWeak = mode === 'mejora';
  return (
    <div style={{
      background: 'var(--paper-0)', border: '1px solid var(--border)',
      borderRadius: 14, padding: 14,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: isWeak ? 'var(--lift-100)' : 'var(--tide-100)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 500,
        color: isWeak ? 'var(--lift-700)' : 'var(--tide-700)',
        fontVariantNumeric: 'tabular-nums',
      }}>{skill.value}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--navy-900)', marginBottom: 4 }}>{skill.label}</div>
        <div style={{
          height: 4, background: 'var(--paper-100)',
          borderRadius: 999, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: skill.value + '%',
            background: isWeak ? 'var(--lift-500)' : 'linear-gradient(90deg, var(--tide-700), var(--tide-500))',
            transition: 'width 800ms var(--ease-out)',
          }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          {isWeak ? 'Gap detectado · subir antes de Q3' : 'Sólida · mantener práctica'}
        </div>
      </div>
      {isWeak && (
        <button onClick={onPractice} className="btn-3d btn-3d-tide" style={{
          borderRadius: 12, padding: '9px 14px',
          fontSize: 12,
          display: 'inline-flex', alignItems: 'center', gap: 4,
          flexShrink: 0,
        }}>
          ¡Practicar!
          <Icon name="arrow" size={12} color="#fff" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

function EmptyHint({ text }) {
  return (
    <div style={{
      background: 'var(--paper-100)', borderRadius: 12, padding: 14,
      fontSize: 13, color: 'var(--fg-3)', textAlign: 'center', lineHeight: 1.5,
    }}>{text}</div>
  );
}
