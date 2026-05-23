// Shared chrome: app header (with streak + XP + level), bottom tab bar,
// floating XP burst, achievement toast, level-up modal, generic modal.

// ─────────────────────────────────────────────────────────────
// AppHeader — sits below status bar on every screen
// Compact: brand mark, streak chip, XP/level chip
// ─────────────────────────────────────────────────────────────
window.AppHeader = function AppHeader({ streak, xp, level, onProfileTap, showMascot }) {
  const xpInLevel = xp % 500;
  const pct = (xpInLevel / 500) * 100;
  return (
    <div style={{
      paddingTop: 54, paddingLeft: 20, paddingRight: 20, paddingBottom: 14,
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'var(--paper-50)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 30,
    }}>
      {/* logo mark / mascot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        {showMascot ? (
          <Mascot size={36} />
        ) : (
          <img src="design/mentoria-mark.png" alt="Mentor.ia"
            style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--fg-3)',
          }}>Mentor.ia</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-900)', lineHeight: 1.2 }}>
            Nivel <span style={{ fontFamily: 'var(--font-mono)' }}>{level}</span>
            <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>  ·  </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--tide-700)' }}>{xp.toLocaleString('es-ES')}</span>
            <span style={{ fontSize: 10, color: 'var(--fg-3)', fontWeight: 400 }}> XP</span>
          </div>
        </div>
      </div>

      {/* streak chip */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 10px 6px 8px',
        background: 'var(--lift-100)',
        border: '1px solid #FBC998',
        borderRadius: 999,
      }}>
        <div className="fire-pulse" style={{ display: 'inline-flex' }}>
          <Icon name="flame" size={14} color="var(--lift-700)" />
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500,
          color: 'var(--lift-700)', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
        }}>{streak}</span>
      </div>

      <button onClick={onProfileTap} className="pressable" style={{
        width: 36, height: 36, borderRadius: 999,
        background: 'var(--paper-100)', border: '1px solid var(--border)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--navy-900)',
        fontSize: 12, fontWeight: 600,
      }}>A</button>

      {/* level progress hairline */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: -1, height: 2,
        background: 'transparent',
      }}>
        <div style={{
          height: '100%', width: pct + '%',
          background: 'linear-gradient(90deg, var(--tide-500), var(--tide-300))',
          transition: 'width 600ms var(--ease-out)',
        }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// BottomNav — Home | Fortalezas | Ranking | Plan | Perfil
// ─────────────────────────────────────────────────────────────
window.BottomNav = function BottomNav({ active, onChange }) {
  const items = [
    { id: 'home',       label: 'Home',       icon: 'home',     color: 'var(--navy-900)' },
    { id: 'fortalezas', label: 'Fortalezas', icon: 'target',   color: 'var(--tide-700)' },
    { id: 'ranking',    label: 'Ranking',    icon: 'trophy',   color: 'var(--amber-700)' },
    { id: 'plan',       label: 'Plan',       icon: 'calendar', color: 'var(--azure-700)' },
    { id: 'perfil',     label: 'Perfil',     icon: 'user',     color: 'var(--violet-700)' },
  ];
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40,
      background: 'var(--paper-50)',
      borderTop: '1px solid var(--border)',
      paddingBottom: 28,
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
        padding: '8px 6px 4px',
      }}>
        {items.map(it => {
          const isActive = active === it.id;
          return (
            <button key={it.id} onClick={() => onChange(it.id)} className="pressable" style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              padding: '6px 4px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2,
              color: isActive ? it.color : 'var(--fg-3)',
            }}>
              <Icon name={it.icon} size={22}
                color={isActive ? it.color : 'var(--paper-500)'}
                strokeWidth={isActive ? 2 : 1.75} />
              <span style={{
                fontSize: 10, fontWeight: isActive ? 600 : 500,
                letterSpacing: 0.1,
                color: isActive ? it.color : 'var(--fg-3)',
              }}>{it.label}</span>
              {isActive && <div style={{
                width: 4, height: 4, borderRadius: 4,
                background: it.color, marginTop: -1,
              }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// XPBurst — floating +N XP pill, fades up & out
// ─────────────────────────────────────────────────────────────
window.XPBurst = function XPBurst({ bursts }) {
  return (
    <div style={{
      position: 'absolute', top: 110, left: '50%',
      pointerEvents: 'none', zIndex: 60,
    }}>
      {bursts.map(b => (
        <div key={b.id} className="xp-float" style={{
          position: 'absolute', left: 0, top: 0,
          transform: 'translate(-50%, 0)',
          background: 'var(--tide-500)', color: '#fff',
          padding: '6px 14px', borderRadius: 999,
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
          letterSpacing: '-0.01em',
          boxShadow: '0 8px 20px rgba(29,158,117,0.35), 0 0 0 4px rgba(29,158,117,0.15)',
          whiteSpace: 'nowrap',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="zap" size={12} color="#fff" />
          +{b.amount} XP
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Toast — achievement unlock at bottom of frame
// ─────────────────────────────────────────────────────────────
window.Toast = function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast-in" style={{
      position: 'absolute', left: '50%', transform: 'translateX(-50%)',
      bottom: 110, zIndex: 70, width: 'calc(100% - 32px)', maxWidth: 360,
      background: 'var(--navy-900)', color: '#fff',
      padding: '12px 14px', borderRadius: 14,
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 16px 32px -8px rgba(15,30,61,0.4)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'rgba(242,137,27,0.18)',
        border: '1px solid rgba(242,137,27,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name="award" size={18} color="var(--lift-300)" />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: 'var(--tide-300)', marginBottom: 2,
        }}>Nuevo logro</div>
        <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{toast.title}</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// LevelUpModal — celebratory overlay
// ─────────────────────────────────────────────────────────────
window.LevelUpModal = function LevelUpModal({ level, onClose }) {
  return (
    <div className="scrim-in" style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'rgba(15,30,61,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div className="modal-in" style={{
        background: 'var(--paper-0)', borderRadius: 24, padding: 28,
        width: '100%', maxWidth: 320, position: 'relative', overflow: 'hidden',
        boxShadow: '0 24px 48px -12px rgba(15,30,61,0.4)',
        textAlign: 'center',
      }}>
        {/* burst rings */}
        {[0, 1, 2].map(i => (
          <div key={i} className="burst" style={{
            position: 'absolute', top: 60, left: '50%',
            transform: 'translateX(-50%)',
            width: 80, height: 80, borderRadius: 999,
            border: '2px solid var(--tide-300)',
            animationDelay: (i * 0.4) + 's',
            pointerEvents: 'none',
          }} />
        ))}
        <div style={{
          position: 'relative', width: 80, height: 80, borderRadius: 999,
          background: 'linear-gradient(135deg, var(--tide-500), var(--navy-700))',
          margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 24px -6px rgba(29,158,117,0.45)',
        }}>
          <Icon name="crown" size={36} color="#fff" />
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--tide-700)', marginBottom: 6,
        }}>+1 Nivel</div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.02em',
          color: 'var(--navy-900)', marginBottom: 8,
        }}>Nivel {level}</div>
        <div style={{ fontSize: 14, color: 'var(--fg-2)', marginBottom: 22, lineHeight: 1.4 }}>
          ¡Bien hecho! Has desbloqueado<br/>
          un nuevo reto de práctica.
        </div>
        <button onClick={onClose} className="btn-3d btn-3d-tide" style={{
          width: '100%', borderRadius: 16, padding: '14px 18px', fontSize: 15,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          ¡Vamos! <Icon name="arrow" size={16} color="#fff" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Generic centered modal
// ─────────────────────────────────────────────────────────────
window.Modal = function Modal({ children, onClose, dark = false }) {
  return (
    <div className="scrim-in" onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'rgba(15,30,61,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div className="modal-in" onClick={e => e.stopPropagation()} style={{
        background: dark ? 'var(--navy-900)' : 'var(--paper-0)',
        color: dark ? '#fff' : 'inherit',
        borderRadius: 20, padding: 22,
        width: '100%', maxWidth: 340, position: 'relative',
        boxShadow: '0 24px 48px -12px rgba(15,30,61,0.4)',
      }}>{children}</div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Eyebrow — the brand's signature label style
// ─────────────────────────────────────────────────────────────
window.Eyebrow = function Eyebrow({ children, color = 'var(--fg-3)', style = {} }) {
  return <div style={{
    fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
    letterSpacing: '0.18em', textTransform: 'uppercase',
    color, ...style,
  }}>{children}</div>;
};

// ─────────────────────────────────────────────────────────────
// Section title (medium) used in screen bodies
// ─────────────────────────────────────────────────────────────
window.ScreenTitle = function ScreenTitle({ eyebrow, title, accent }) {
  return (
    <div style={{ padding: '4px 20px 14px' }}>
      {eyebrow && <Eyebrow style={{ marginBottom: 8 }}>{eyebrow}</Eyebrow>}
      <h1 style={{
        margin: 0,
        fontFamily: 'var(--font-serif)',
        fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.02em',
        fontWeight: 500, color: 'var(--navy-900)',
      }}>{title}{accent && <span style={{ color: 'var(--tide-700)' }}> {accent}</span>}</h1>
    </div>
  );
};
