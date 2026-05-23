// Tweaks UI + theme system for Mentor.ia
// Exposes:
//   - window.MENTOR_TWEAK_DEFAULTS
//   - window.useAppTweaks(defaults)
//   - <MentorTweaks tweaks setTweak />  — the panel
//   - <ThemeWrap tweaks>{children}</ThemeWrap>  — applies CSS-var overrides + global injected CSS
//   - <Mascot />  — dolphin character for the header
//   - <Confetti trigger />  — particle burst tied to XP gains

// ─────────────────────────────────────────────────────────────
// PALETTE PRESETS
// Each preset overrides the BDP design tokens at scope.
// ─────────────────────────────────────────────────────────────
const PALETTES = {
  mentoria: {
    name: 'Mentor.ia',
    swatches: ['#0F1E3D', '#1D9E75', '#F2891B'],
    vars: {}, // identity — use system defaults
  },
  arcade: {
    name: 'Arcade',
    swatches: ['#5B21B6', '#A855F7', '#F472B6'],
    vars: {
      // navy → deep indigo
      '--navy-900': '#2E1065',
      '--navy-800': '#3B1080',
      '--navy-700': '#5B21B6',
      '--navy-600': '#7C3AED',
      '--navy-500': '#A78BFA',
      '--navy-400': '#C4B5FD',
      '--navy-300': '#DDD6FE',
      '--navy-200': '#EDE9FE',
      '--navy-100': '#F5F3FF',
      '--navy-50':  '#FAF5FF',
      // accent (tide) → vibrant purple/magenta
      '--tide-900': '#581C87',
      '--tide-700': '#9333EA',
      '--tide-600': '#A855F7',
      '--tide-500': '#C026D3',
      '--tide-400': '#E879F9',
      '--tide-300': '#F0ABFC',
      '--tide-200': '#FAE8FF',
      '--tide-100': '#FDF4FF',
      // lift → hot pink
      '--lift-700': '#9D174D',
      '--lift-500': '#EC4899',
      '--lift-300': '#F9A8D4',
      '--lift-100': '#FCE7F3',
    },
  },
  sunset: {
    name: 'Sunset',
    swatches: ['#9A3412', '#F97316', '#FBBF24'],
    vars: {
      '--navy-900': '#7C2D12',
      '--navy-800': '#9A3412',
      '--navy-700': '#C2410C',
      '--navy-600': '#EA580C',
      '--navy-500': '#F97316',
      '--navy-400': '#FB923C',
      '--navy-300': '#FDBA74',
      '--navy-200': '#FED7AA',
      '--navy-100': '#FFEDD5',
      '--navy-50':  '#FFF7ED',
      '--tide-900': '#7C2D12',
      '--tide-700': '#C2410C',
      '--tide-600': '#EA580C',
      '--tide-500': '#F97316',
      '--tide-400': '#FB923C',
      '--tide-300': '#FDBA74',
      '--tide-200': '#FED7AA',
      '--tide-100': '#FFEDD5',
      '--lift-700': '#92400E',
      '--lift-500': '#F59E0B',
      '--lift-300': '#FCD34D',
      '--lift-100': '#FEF3C7',
    },
  },
  neon: {
    name: 'Neón',
    swatches: ['#0A0E27', '#22D3EE', '#A3E635'],
    vars: {
      '--navy-900': '#0A0E27',
      '--navy-800': '#111638',
      '--navy-700': '#1E2348',
      '--navy-600': '#2E3560',
      '--navy-500': '#4F5688',
      '--navy-400': '#7C82B0',
      '--navy-300': '#B0B5D2',
      '--navy-200': '#D6D8E8',
      '--navy-100': '#EAEBF3',
      '--navy-50':  '#F4F5F9',
      '--tide-900': '#083344',
      '--tide-700': '#0E7490',
      '--tide-600': '#0891B2',
      '--tide-500': '#06B6D4',
      '--tide-400': '#22D3EE',
      '--tide-300': '#67E8F9',
      '--tide-200': '#A5F3FC',
      '--tide-100': '#CFFAFE',
      '--lift-700': '#3F6212',
      '--lift-500': '#84CC16',
      '--lift-300': '#BEF264',
      '--lift-100': '#ECFCCB',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// TWEAK DEFAULTS — game-y by default
// ─────────────────────────────────────────────────────────────
window.MENTOR_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "mentoria",
  "fontStyle": "editorial",
  "mascot": true,
  "confetti": true,
  "bubbly": false,
  "stickerCards": true,
  "bgPattern": true
}/*EDITMODE-END*/;

// ─────────────────────────────────────────────────────────────
// useAppTweaks — re-exports the panel's hook but seeded
// ─────────────────────────────────────────────────────────────
window.useAppTweaks = function useAppTweaks() {
  return useTweaks(window.MENTOR_TWEAK_DEFAULTS);
};

// ─────────────────────────────────────────────────────────────
// ThemeWrap — applies palette vars to children scope
// and injects global CSS for the playful bits.
// ─────────────────────────────────────────────────────────────
window.ThemeWrap = function ThemeWrap({ tweaks, children }) {
  const palette = PALETTES[tweaks.palette] || PALETTES.mentoria;

  // Build injected style block based on tweaks
  const injectedCSS = React.useMemo(() => {
    let css = '';

    // Playful display font swap
    if (tweaks.fontStyle === 'playful') {
      css += `.theme-wrap { --font-serif: "Fredoka", "Geist", system-ui, sans-serif; --font-display: "Fredoka", "Geist", system-ui, sans-serif; }
      .theme-wrap *[style*="font-serif"], .theme-wrap *[style*="Instrument Serif"] { font-style: normal !important; font-weight: 600 !important; letter-spacing: -0.02em !important; }
      `;
    }

    // Bubbly: bigger radii on everything
    if (tweaks.bubbly) {
      css += `.theme-wrap button { border-radius: 999px !important; }
      .theme-wrap [data-card-radius] { border-radius: 24px !important; }
      `;
    }

    // Sticker cards: extra ringed shadow on cards
    if (tweaks.stickerCards) {
      const accent = palette.vars['--tide-500'] || '#1D9E75';
      const warm   = palette.vars['--lift-500'] || '#F2891B';
      css += `.theme-wrap [data-sticker="primary"] {
        box-shadow:
          0 0 0 3px ${hexA(accent, 0.15)},
          0 8px 0 -2px ${hexA(accent, 0.12)},
          0 14px 28px -10px ${hexA(accent, 0.35)} !important;
      }
      .theme-wrap [data-sticker="warm"] {
        box-shadow:
          0 0 0 3px ${hexA(warm, 0.18)},
          0 6px 0 -2px ${hexA(warm, 0.14)} !important;
      }
      .theme-wrap [data-sticker="dark"] {
        box-shadow:
          0 0 0 3px rgba(255,255,255,0.06),
          0 10px 30px -8px rgba(0,0,0,0.35),
          inset 0 1px 0 rgba(255,255,255,0.08) !important;
      }
      `;
    }

    // Background gradient — soft radial tints from accent + warm corners
    if (tweaks.bgPattern) {
      const accent = palette.vars['--tide-100'] || '#D1FAE5';
      const warm   = palette.vars['--lift-100'] || '#FFEDD5';
      css += `.theme-wrap .app-scroll {
        background:
          radial-gradient(ellipse 90% 50% at 85% -10%, ${hexA(accent, 0.7)}, transparent 55%),
          radial-gradient(ellipse 80% 40% at 15% 110%, ${hexA(warm, 0.55)}, transparent 60%),
          var(--paper-50);
      }`;
    }

    return css;
  }, [tweaks, palette]);

  return (
    <div className="theme-wrap" style={palette.vars}>
      <style dangerouslySetInnerHTML={{ __html: injectedCSS }} />
      {children}
    </div>
  );
};

function hexA(hex, alpha) {
  if (!hex || hex[0] !== '#') return hex;
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─────────────────────────────────────────────────────────────
// Mascot — Marina the dolphin (SVG)
// ─────────────────────────────────────────────────────────────
window.Mascot = function Mascot({ size = 36, mood = 'happy' }) {
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      animation: 'mascotBob 2.4s ease-in-out infinite',
    }}>
      <style>{`@keyframes mascotBob { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-3px) rotate(3deg); } }`}</style>
      <svg viewBox="0 0 64 64" width={size} height={size}>
        {/* body */}
        <ellipse cx="34" cy="34" rx="22" ry="14" fill="var(--tide-500)" />
        <ellipse cx="34" cy="34" rx="22" ry="14" fill="none" stroke="var(--navy-900)" strokeWidth="2" />
        {/* belly */}
        <ellipse cx="34" cy="38" rx="16" ry="7" fill="#fff" opacity="0.55" />
        {/* tail */}
        <path d="M12 34 L2 26 L4 36 L2 46 L12 38 Z" fill="var(--tide-500)" stroke="var(--navy-900)" strokeWidth="2" strokeLinejoin="round" />
        {/* fin */}
        <path d="M34 22 L40 14 L44 24 Z" fill="var(--tide-700)" stroke="var(--navy-900)" strokeWidth="2" strokeLinejoin="round" />
        {/* nose ridge */}
        <path d="M48 32 Q56 30 58 34" fill="none" stroke="var(--navy-900)" strokeWidth="2" strokeLinecap="round" />
        {/* eye */}
        <circle cx="46" cy="30" r="2.6" fill="var(--navy-900)" />
        <circle cx="47" cy="29" r="0.8" fill="#fff" />
        {/* smile */}
        <path d={mood === 'happy' ? "M50 36 Q52 38 54 36" : "M50 37 L54 37"}
          fill="none" stroke="var(--navy-900)" strokeWidth="1.6" strokeLinecap="round" />
        {/* sparkle */}
        <g style={{ transformOrigin: '54px 18px', animation: 'sparkleSpin 3s linear infinite' }}>
          <path d="M54 14 L55 17 L58 18 L55 19 L54 22 L53 19 L50 18 L53 17 Z"
            fill="var(--lift-500)" />
        </g>
        <style>{`@keyframes sparkleSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Confetti — spawn N colored particles, animate up/out
// ─────────────────────────────────────────────────────────────
window.Confetti = function Confetti({ trigger }) {
  const [pieces, setPieces] = React.useState([]);
  const idRef = React.useRef(0);

  React.useEffect(() => {
    if (!trigger) return;
    const colors = ['var(--tide-500)', 'var(--tide-300)', 'var(--lift-500)', 'var(--lift-300)', '#fff'];
    const batch = Array.from({ length: 18 }).map(() => {
      const id = ++idRef.current;
      return {
        id,
        x: 40 + Math.random() * 20, // % from center
        dx: (Math.random() - 0.5) * 220,
        dy: -80 - Math.random() * 160,
        rot: Math.random() * 720 - 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 6,
        shape: Math.random() > 0.5 ? 'square' : 'circle',
      };
    });
    setPieces(p => [...p, ...batch]);
    const t = setTimeout(() => {
      setPieces(p => p.filter(x => !batch.find(b => b.id === x.id)));
    }, 1400);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div style={{
      position: 'absolute', top: 130, left: 0, right: 0, height: 0,
      pointerEvents: 'none', zIndex: 65,
    }}>
      <style>{`@keyframes confettiFly {
        0% { opacity: 1; transform: translate(0,0) rotate(0); }
        100% { opacity: 0; transform: translate(var(--dx),var(--dy)) rotate(var(--rot)); }
      }`}</style>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: p.x + '%', top: 0,
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: p.shape === 'circle' ? 999 : 2,
          animation: 'confettiFly 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
          ['--dx']: p.dx + 'px',
          ['--dy']: p.dy + 'px',
          ['--rot']: p.rot + 'deg',
        }} />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MentorTweaks — the panel
// ─────────────────────────────────────────────────────────────
window.MentorTweaks = function MentorTweaks({ tweaks, setTweak }) {
  const paletteOptions = Object.keys(PALETTES).map(id => ({
    id, label: PALETTES[id].name, swatches: PALETTES[id].swatches,
  }));

  return (
    <TweaksPanel title="Tweaks · Mentor.ia">
      <TweakSection label="Vibe" />

      {/* Custom palette picker — swatches in a row */}
      <div className="twk-row">
        <div className="twk-lbl"><span>Paleta</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {paletteOptions.map(o => {
            const active = tweaks.palette === o.id;
            return (
              <button key={o.id} onClick={() => setTweak('palette', o.id)} style={{
                appearance: 'none', cursor: 'pointer', textAlign: 'left',
                background: active ? 'rgba(0,0,0,0.06)' : 'transparent',
                border: active ? '1.5px solid #29261b' : '1px solid rgba(0,0,0,0.12)',
                borderRadius: 8, padding: '6px 8px',
                display: 'flex', alignItems: 'center', gap: 6,
                font: 'inherit', color: 'inherit',
              }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {o.swatches.map((s, i) => (
                    <div key={i} style={{
                      width: 10, height: 14, background: s,
                      borderRadius: i === 0 ? '3px 0 0 3px' : i === o.swatches.length - 1 ? '0 3px 3px 0' : 0,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, fontWeight: active ? 600 : 500 }}>{o.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <TweakRadio
        label="Tipografía"
        value={tweaks.fontStyle}
        options={[
          { value: 'editorial', label: 'Editorial' },
          { value: 'playful',   label: 'Playful' },
        ]}
        onChange={(v) => setTweak('fontStyle', v)}
      />

      <TweakSection label="Game feel" />

      <TweakToggle
        label="Mascota"
        value={tweaks.mascot}
        onChange={(v) => setTweak('mascot', v)}
      />

      <TweakToggle
        label="Confeti al ganar XP"
        value={tweaks.confetti}
        onChange={(v) => setTweak('confetti', v)}
      />

      <TweakToggle
        label="Bordes burbuja"
        value={tweaks.bubbly}
        onChange={(v) => setTweak('bubbly', v)}
      />

      <TweakToggle
        label="Tarjetas con halo"
        value={tweaks.stickerCards}
        onChange={(v) => setTweak('stickerCards', v)}
      />

      <TweakToggle
        label="Fondo con gradiente"
        value={tweaks.bgPattern}
        onChange={(v) => setTweak('bgPattern', v)}
      />
    </TweaksPanel>
  );
};
