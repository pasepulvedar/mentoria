// SCREEN 3 — SIMULACIÓN IA
// Chat with AI, timer, +XP per turn, tip & pause overlays, terminate → results.

window.SimulacionScreen = function SimulacionScreen({ state, navigate, back, addXP, awardToast }) {
  const initialMessages = [
    { role: 'ai',   text: 'Entiendo que valoras tu contribución al equipo. ¿Qué aspectos específicos de tu trabajo crees que justifican este incremento?' },
    { role: 'user', text: 'He liderado 3 proyectos clave este año y el equipo ha crecido un 40% en productividad bajo mi gestión.' },
    { role: 'ai',   text: 'Excelente punto. Ahora intentaré contraargumentar — el presupuesto es ajustado. ¿Estás listo?' },
  ];
  const aiPool = [
    'Entiendo tu punto, pero el presupuesto no permite más de un 10%. ¿Qué propones como alternativa?',
    '¿Estarías dispuesto a considerar beneficios no monetarios mientras revisamos el presupuesto en Q2?',
    'Valoro tu trabajo. ¿Podemos acordar un 12% ahora y revisarlo en 6 meses con métricas claras?',
    'Necesito llevarlo a dirección. ¿Puedes prepararme un documento con los logros que mencionas?',
  ];

  const [messages, setMessages] = React.useState(initialMessages);
  const [input, setInput] = React.useState('');
  const [timer, setTimer] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [xpEarned, setXpEarned] = React.useState(0);
  const [tipOpen, setTipOpen] = React.useState(false);
  const [pauseOpen, setPauseOpen] = React.useState(false);
  const [summaryOpen, setSummaryOpen] = React.useState(false);
  const [aiIdx, setAiIdx] = React.useState(0);

  const scrollRef = React.useRef(null);
  const turnRef = React.useRef(0); // counts user sends, used to vary AI response

  // Timer
  React.useEffect(() => {
    if (paused || summaryOpen) return;
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [paused, summaryOpen]);

  // Auto scroll on new message
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const fmt = (n) => {
    const mm = String(Math.floor(n / 60)).padStart(2, '0');
    const ss = String(n % 60).padStart(2, '0');
    return mm + ':' + ss;
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setMessages(m => [...m, { role: 'user', text }]);
    setInput('');
    turnRef.current += 1;

    // AI responds after delay
    setIsTyping(true);
    setTimeout(() => {
      const next = aiPool[aiIdx % aiPool.length];
      setAiIdx(i => i + 1);
      setMessages(m => [...m, { role: 'ai', text: next }]);
      setIsTyping(false);

      // award XP
      addXP(10);
      setXpEarned(x => x + 10);

      // first user message awards an achievement
      if (turnRef.current === 1) {
        awardToast('Primera simulación completada');
      }
    }, 1500);
  };

  const onPause = () => { setPaused(true); setPauseOpen(true); };
  const onResume = () => { setPaused(false); setPauseOpen(false); };
  const onContinueFromPause = () => {
    setPauseOpen(false);
    setPaused(false);
    // AI sends a nudge
    setIsTyping(true);
    setTimeout(() => {
      const next = aiPool[aiIdx % aiPool.length];
      setAiIdx(i => i + 1);
      setMessages(m => [...m, { role: 'ai', text: next }]);
      setIsTyping(false);
      addXP(10);
      setXpEarned(x => x + 10);
    }, 1200);
  };

  const onEnd = () => {
    setPaused(true);
    setSummaryOpen(true);
  };

  return (
    <div className="screen-in" style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--paper-50)',
    }}>
      {/* Header — context + timer + close */}
      <div style={{
        padding: '54px 16px 12px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--paper-0)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={back} className="pressable" style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'var(--paper-100)', border: 'none',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <Icon name="close" size={18} color="var(--navy-900)" />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Eyebrow color="var(--tide-700)">Simulación · Negociación</Eyebrow>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy-900)', marginTop: 1 }}>
            Pedir aumento de salario
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 10px', background: paused ? 'var(--lift-100)' : 'var(--paper-100)',
          borderRadius: 999, border: '1px solid var(--border)',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: 999,
            background: paused ? 'var(--lift-500)' : 'var(--success-500)',
            boxShadow: paused ? 'none' : '0 0 0 3px rgba(16,185,129,0.15)',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500,
            color: 'var(--navy-900)', fontVariantNumeric: 'tabular-nums',
          }}>{fmt(timer)}</span>
        </div>
      </div>

      {/* Sub-metrics strip */}
      <div style={{
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        background: 'var(--paper-0)',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--fg-3)',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Icon name="zap" size={12} color="var(--tide-700)" />
          <span style={{ color: 'var(--navy-900)' }}>+{xpEarned} XP</span> ganados
        </span>
        <span style={{ width: 1, height: 12, background: 'var(--border)' }} />
        <span>{Math.ceil(messages.filter(m => m.role === 'user').length)} intervenciones</span>
        <span style={{ marginLeft: 'auto', color: 'var(--tide-700)' }}>Medio</span>
      </div>

      {/* Conversation */}
      <div ref={scrollRef} style={{
        flex: 1, minHeight: 0, overflowY: 'auto',
        padding: '16px 14px 8px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{
          alignSelf: 'center', fontSize: 10, fontFamily: 'var(--font-mono)',
          color: 'var(--fg-3)', letterSpacing: '0.18em',
          textTransform: 'uppercase', margin: '4px 0',
        }}>Inicio · 09:41</div>

        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} text={m.text} />
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <Avatar />
            <div style={{
              background: 'var(--paper-0)', border: '1px solid var(--border)',
              borderRadius: '4px 16px 16px 16px',
              padding: '12px 14px',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} className="typing-dot" style={{
                  width: 6, height: 6, borderRadius: 999,
                  background: 'var(--paper-400)', display: 'inline-block',
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick-action chips */}
      <div style={{
        padding: '8px 14px 4px',
        display: 'flex', gap: 6, overflowX: 'auto',
      }}>
        <Chip icon="bulb" label="Dame un consejo" onClick={() => setTipOpen(true)} />
        <Chip icon="pause" label="Pausar" onClick={onPause} />
        <Chip icon="close" label="Terminar simulación" danger onClick={onEnd} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: '8px 14px 14px',
        background: 'var(--paper-0)',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'flex-end', gap: 8,
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); sendMessage();
            }
          }}
          placeholder="Escribe tu respuesta…"
          rows={1}
          style={{
            flex: 1, resize: 'none',
            border: '1px solid var(--border)', borderRadius: 12,
            padding: '12px 14px', fontSize: 14, lineHeight: 1.4,
            background: 'var(--paper-50)', color: 'var(--navy-900)',
            outline: 'none', maxHeight: 100,
            fontFamily: 'inherit',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--tide-500)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button onClick={sendMessage} className="pressable" disabled={!input.trim() || isTyping}
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: input.trim() && !isTyping ? 'var(--navy-900)' : 'var(--paper-200)',
            color: '#fff', border: 0, cursor: input.trim() && !isTyping ? 'pointer' : 'default',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 140ms var(--ease-out)',
          }}>
          <Icon name="send" size={18} color="#fff" />
        </button>
      </div>

      {/* TIP overlay */}
      {tipOpen && (
        <Modal onClose={() => setTipOpen(false)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: 'var(--tide-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="bulb" size={18} color="var(--tide-700)" />
            </div>
            <div>
              <Eyebrow color="var(--tide-700)">Consejo de Marina</Eyebrow>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy-900)' }}>¡Ancla un número!</div>
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--fg-2)', margin: '0 0 14px' }}>
            Antes de aceptar un %, propón tú un rango concreto. Por ejemplo: "<em style={{ color: 'var(--navy-900)', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>Con el 40% de productividad, un rango de 14-16% sería justo.</em>"
          </p>
          <button onClick={() => setTipOpen(false)} className="btn-3d btn-3d-navy" style={{
            width: '100%', borderRadius: 14, padding: '12px 14px', fontSize: 14,
          }}>¡Entendido!</button>
        </Modal>
      )}

      {/* PAUSE overlay */}
      {pauseOpen && (
        <Modal onClose={onResume}>
          <Eyebrow color="var(--fg-3)" style={{ marginBottom: 8 }}>Pausa</Eyebrow>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.02em',
            fontWeight: 500,
            color: 'var(--navy-900)', marginBottom: 12,
          }}>
            ¡Toma aire! La IA <span style={{ color: 'var(--tide-600)' }}>te espera</span>.
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', margin: '0 0 16px', lineHeight: 1.5 }}>
            Llevas <strong style={{ color: 'var(--navy-900)' }}>{fmt(timer)}</strong> y <strong style={{ color: 'var(--navy-900)' }}>+{xpEarned} XP</strong>. Cuando quieras seguimos.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onResume} className="btn-3d btn-3d-paper" style={{
              flex: 1, borderRadius: 14, padding: '12px 14px', fontSize: 13,
            }}>Reanudar</button>
            <button onClick={onContinueFromPause} className="btn-3d btn-3d-tide" style={{
              flex: 1.4, borderRadius: 14, padding: '12px 14px', fontSize: 13,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              ¡Sí, continuar! <Icon name="arrow" size={14} color="#fff" strokeWidth={2.5} />
            </button>
          </div>
        </Modal>
      )}

      {/* END / SUMMARY overlay */}
      {summaryOpen && (
        <Modal onClose={() => navigate('fortalezas', { sessionXP: xpEarned })}>
          <Eyebrow color="var(--tide-700)" style={{ marginBottom: 10 }}>¡Sesión completada!</Eyebrow>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.025em',
            fontWeight: 500,
            color: 'var(--navy-900)', marginBottom: 14,
          }}>
            ¡Genial! Ganaste <span style={{ color: 'var(--tide-600)' }}>+{xpEarned} XP</span>.
          </div>
          <div style={{
            background: 'var(--paper-50)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 14, marginBottom: 16,
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
          }}>
            <Metric label="Tiempo" value={fmt(timer)} />
            <Metric label="Turnos" value={messages.filter(m => m.role === 'user').length} />
            <Metric label="XP" value={'+' + xpEarned} accent />
          </div>
          <button onClick={() => navigate('fortalezas', { sessionXP: xpEarned })} className="btn-3d btn-3d-tide" style={{
            width: '100%', borderRadius: 16, padding: '14px 18px', fontSize: 15,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            ¡Ver mis fortalezas! <Icon name="arrow" size={16} color="#fff" strokeWidth={2.5} />
          </button>
        </Modal>
      )}
    </div>
  );
};

function Avatar() {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 8, flexShrink: 0,
      background: 'var(--navy-900)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-serif)', fontStyle: 'italic',
      fontSize: 14, lineHeight: 1, letterSpacing: '-0.02em',
    }}>m</div>
  );
}

function Bubble({ role, text }) {
  const isUser = role === 'user';
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      alignItems: 'flex-end', gap: 8,
    }}>
      {!isUser && <Avatar />}
      <div style={{
        maxWidth: '78%',
        background: isUser ? 'var(--navy-900)' : 'var(--paper-0)',
        color: isUser ? '#fff' : 'var(--navy-900)',
        border: isUser ? 'none' : '1px solid var(--border)',
        borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
        padding: '10px 14px',
        fontSize: 14, lineHeight: 1.45,
        boxShadow: isUser ? 'none' : 'var(--shadow-xs)',
      }}>{text}</div>
    </div>
  );
}

function Chip({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick} className="pressable" style={{
      flexShrink: 0, cursor: 'pointer',
      background: danger ? 'transparent' : 'var(--paper-0)',
      color: danger ? 'var(--lift-700)' : 'var(--fg-2)',
      border: danger ? '1px solid #FBC998' : '1px solid var(--border)',
      borderRadius: 999, padding: '7px 12px',
      fontSize: 12, fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'inherit',
    }}>
      <Icon name={icon} size={13} color={danger ? 'var(--lift-700)' : 'var(--fg-2)'} />
      {label}
    </button>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'var(--fg-3)', marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 500,
        color: accent ? 'var(--tide-700)' : 'var(--navy-900)',
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
    </div>
  );
}
