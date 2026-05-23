// SCREEN 2 — NEGOCIACIÓN DETALLE
// Module progress, difficulty chips, warm-up pills, start simulation CTA.

window.DetalleScreen = function DetalleScreen({ state, navigate, back }) {
  const [difficulty, setDifficulty] = React.useState('Medio');
  const [warmup, setWarmup] = React.useState(null);
  const [tooltip, setTooltip] = React.useState(false);

  const modules = [
    {
      id: 'm1', label: 'Fundamentos del anclaje',
      meta: '4 retos · ~22 min', status: 'completed',
    },
    {
      id: 'm2', label: 'Negociación de salario',
      meta: '5 retos · ~30 min', status: 'inProgress', progress: 60,
    },
    {
      id: 'm3', label: 'Conflictos con clientes',
      meta: '6 retos · ~35 min', status: 'locked',
    },
  ];

  const difficulties = [
    { id: 'Fácil',   sub: 'IA cooperativa' },
    { id: 'Medio',   sub: 'IA realista' },
    { id: 'Difícil', sub: 'IA exigente' },
  ];

  const warmups = [
    'Repasar BATNA',
    'Marco anclaje',
    'Tonos de voz',
    'Frases de cierre',
    'Manejo objeciones',
  ];

  return (
    <div className="screen-in" style={{ paddingBottom: 130 }}>
      {/* Top — back + breadcrumb */}
      <div style={{
        padding: '8px 20px 0',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={back} className="pressable" style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'var(--paper-0)', border: '1px solid var(--border)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <Icon name="arrowLeft" size={18} color="var(--navy-900)" />
        </button>
        <Eyebrow color="var(--fg-3)">Skill · Habilidad blanda</Eyebrow>
      </div>

      {/* Title */}
      <div style={{ padding: '14px 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 18,
            background: 'var(--tide-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="handshake" size={26} color="var(--tide-700)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.02em',
              fontWeight: 500, color: 'var(--navy-900)',
            }}>Negociación</h1>
            <div style={{
              fontSize: 13, color: 'var(--fg-3)', marginTop: 2,
              fontFamily: 'var(--font-mono)',
            }}>Nivel intermedio · 9 retos</div>
          </div>
        </div>
        <p style={{
          fontSize: 14, lineHeight: 1.5, color: 'var(--fg-2)', margin: 0,
        }}>Practica conversaciones reales con tu coach IA. ¡Cada simulación se adapta a ti — Account Exec · SaaS B2B!</p>
      </div>

      {/* Modules */}
      <div style={{ padding: '0 20px 8px' }}>
        <Eyebrow style={{ marginBottom: 10 }}>Progreso del módulo</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {modules.map((m, i) => (
            <div key={m.id}
              onClick={() => m.status === 'locked' && setTooltip(m.id)}
              style={{
                background: 'var(--paper-0)',
                border: '1px solid var(--border)',
                borderRadius: 16, padding: 14,
                display: 'flex', alignItems: 'center', gap: 12,
                position: 'relative',
                cursor: m.status === 'locked' ? 'help' : 'default',
                opacity: m.status === 'locked' ? 0.7 : 1,
              }}>
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                background: m.status === 'completed' ? 'var(--tide-500)'
                          : m.status === 'inProgress' ? 'var(--paper-0)'
                          : 'var(--paper-100)',
                border: m.status === 'inProgress' ? '2px solid var(--tide-500)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                color: m.status === 'inProgress' ? 'var(--tide-700)' : '#fff',
              }}>
                {m.status === 'completed' && <Icon name="check" size={14} color="#fff" />}
                {m.status === 'inProgress' && (i + 1)}
                {m.status === 'locked' && <Icon name="lock" size={12} color="var(--fg-3)" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--navy-900)', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{m.meta}</div>
                {m.status === 'inProgress' && (
                  <div style={{
                    marginTop: 8, height: 3, background: 'var(--paper-100)',
                    borderRadius: 999, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', width: m.progress + '%',
                      background: 'linear-gradient(90deg, var(--tide-700), var(--tide-500))',
                    }} />
                  </div>
                )}
              </div>
              {m.status === 'inProgress' && (
                <span style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tide-700)',
                }}>{m.progress}%</span>
              )}
              {m.status === 'locked' && tooltip === m.id && (
                <div onClick={(e) => { e.stopPropagation(); setTooltip(false); }} style={{
                  position: 'absolute', top: '-10px', left: 20, right: 20,
                  transform: 'translateY(-100%)',
                  background: 'var(--navy-900)', color: '#fff',
                  padding: '10px 12px', borderRadius: 14,
                  fontSize: 12, lineHeight: 1.4, zIndex: 10,
                  boxShadow: 'var(--shadow-lg)',
                }}>
                  Completa el módulo anterior para desbloquear.
                  <div style={{
                    position: 'absolute', bottom: -6, left: 30,
                    width: 0, height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid var(--navy-900)',
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div style={{ padding: '20px 20px 0' }}>
        <Eyebrow style={{ marginBottom: 10 }}>Dificultad</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {difficulties.map(d => {
            const active = difficulty === d.id;
            return (
              <button key={d.id} onClick={() => setDifficulty(d.id)}
                className="pressable" style={{
                  cursor: 'pointer',
                  background: active ? 'var(--navy-900)' : 'var(--paper-0)',
                  color: active ? '#fff' : 'var(--navy-900)',
                  border: active ? '1px solid var(--navy-900)' : '1px solid var(--border)',
                  borderRadius: 16, padding: '10px 8px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  fontFamily: 'inherit',
                }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{d.id}</span>
                <span style={{
                  fontSize: 10, color: active ? 'rgba(255,255,255,0.7)' : 'var(--fg-3)',
                  fontFamily: 'var(--font-mono)',
                }}>{d.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Warm-up pills */}
      <div style={{ padding: '20px 20px 0' }}>
        <Eyebrow style={{ marginBottom: 10 }}>Calentamiento (opcional)</Eyebrow>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {warmups.map(w => {
            const active = warmup === w;
            return (
              <button key={w} onClick={() => setWarmup(active ? null : w)}
                className="pressable" style={{
                  cursor: 'pointer',
                  background: active ? 'var(--tide-100)' : 'var(--paper-0)',
                  color: active ? 'var(--tide-900)' : 'var(--fg-2)',
                  border: active ? '1px solid var(--tide-500)' : '1px solid var(--border)',
                  borderRadius: 999, padding: '6px 12px',
                  fontSize: 12, fontWeight: 500,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: 'inherit',
                }}>
                {active && <Icon name="check" size={11} color="var(--tide-700)" />}
                {w}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario preview */}
      <div style={{ padding: '22px 20px 0' }}>
        <Eyebrow style={{ marginBottom: 10 }}>Escenario · {difficulty}</Eyebrow>
        <div style={{
          background: 'var(--paper-0)', border: '1px solid var(--border)',
          borderRadius: 20, padding: 16,
        }}>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 20, lineHeight: 1.2, letterSpacing: '-0.015em',
            color: 'var(--navy-900)', marginBottom: 10,
          }}>
            Pides a tu manager un <span style={{ color: 'var(--tide-700)' }}>+15%</span> de salario.
          </div>
          <p style={{
            fontSize: 13, lineHeight: 1.5, color: 'var(--fg-2)', margin: 0,
          }}>El equipo ha crecido 40% bajo tu gestión, has liderado 3 proyectos clave. Convence a la IA — que jugará un manager con presupuesto ajustado — de aprobar el aumento.</p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, marginTop: 14,
            paddingTop: 14, borderTop: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Icon name="timer" size={12} /> ~8 min
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Icon name="zap" size={12} color="var(--tide-700)" /> +40 XP máx
            </span>
            <span style={{ marginLeft: 'auto', color: 'var(--tide-700)' }}>Texto · IA conversacional</span>
          </div>
        </div>
      </div>

      {/* Sticky CTA — placed in-flow so it scrolls naturally but with extra bottom space */}
      <div style={{ padding: '22px 20px 0' }}>
        <button onClick={() => navigate('simulacion', { skillId: 'negociacion', difficulty, warmup })}
          className="btn-3d btn-3d-tide" style={{
            width: '100%',
            borderRadius: 20, padding: '16px 18px',
            fontSize: 16,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
          <Icon name="play" size={18} color="#fff" strokeWidth={2.5} />
          ¡A practicar!
        </button>
      </div>
    </div>
  );
};
