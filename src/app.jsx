// App root — global state, screen routing, animations.

function App() {
  // ───── Tweaks ─────
  const [tweaks, setTweak] = useAppTweaks();

  // ───── Global state ─────
  const [xp, setXp] = React.useState(1240);
  const [streak, setStreak] = React.useState(7);
  const [dailyMinutes, setDailyMinutes] = React.useState(47);
  const [weeklyRetos, setWeeklyRetos] = React.useState(4);
  const level = Math.floor(xp / 500) + 1;

  const [skills, setSkills] = React.useState({
    comunicacion: 85, negociacion: 35, feedback: 70,
    liderazgo: 55, decisiones: 60, conflictos: 20,
  });

  // ───── Routing ─────
  // tab = which bottom nav screen is "home base"
  // route = current view ('home' | 'detalle' | 'simulacion' | 'fortalezas' | 'ranking' | 'plan' | 'perfil')
  const [tab, setTab] = React.useState('home');
  const [route, setRoute] = React.useState('home');
  const [params, setParams] = React.useState({});

  // ───── XP bursts ─────
  const [bursts, setBursts] = React.useState([]);
  const burstId = React.useRef(0);

  // ───── Confetti trigger ─────
  const [confettiKey, setConfettiKey] = React.useState(0);

  // ───── Toast ─────
  const [toast, setToast] = React.useState(null);

  // ───── Level up ─────
  const prevLevel = React.useRef(level);
  const [levelUp, setLevelUp] = React.useState(null);

  React.useEffect(() => {
    if (level > prevLevel.current) {
      setLevelUp(level);
    }
    prevLevel.current = level;
  }, [level]);

  // ───── Actions ─────
  const addXP = (amount) => {
    setXp(x => x + amount);
    // micro-progress: every XP gain bumps daily minutes a little, and skill
    setDailyMinutes(m => Math.min(60, m + 1));
    setSkills(s => ({ ...s, negociacion: Math.min(100, s.negociacion + 2) }));

    // float a +XP pill
    const id = ++burstId.current;
    setBursts(b => [...b, { id, amount }]);
    setTimeout(() => {
      setBursts(b => b.filter(x => x.id !== id));
    }, 1700);

    // trigger confetti
    setConfettiKey(k => k + 1);
  };

  const awardToast = (title) => {
    setToast({ title, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  const navigate = (target, p = {}) => {
    setParams(p);
    // simulation has its own "end" hook
    if (target === 'simulacion') {
      // mark weekly challenge ticking up when starting
      setRoute('simulacion');
      return;
    }
    if (target === 'fortalezas') {
      // returning from simulation completes a reto
      if (p && p.sessionXP) {
        setWeeklyRetos(r => Math.min(5, r + 1));
        // briefly toast that the weekly challenge progressed
        setTimeout(() => awardToast('Reto semanal: 5/5 completado'), 600);
      }
      setTab('fortalezas');
      setRoute('fortalezas');
      return;
    }
    setRoute(target);
    if (['home', 'fortalezas', 'ranking', 'plan', 'perfil'].includes(target)) {
      setTab(target);
    }
  };

  const onTabChange = (t) => {
    setTab(t);
    setRoute(t);
    setParams({});
  };

  const back = () => {
    // sensible defaults
    if (route === 'simulacion') { setRoute('detalle'); return; }
    if (route === 'detalle')    { setRoute('home'); setTab('home'); return; }
    setRoute(tab);
  };

  // ───── Render screens ─────
  const sharedState = { xp, streak, dailyMinutes, weeklyRetos, level, skills };

  let screen = null;
  if (route === 'home')        screen = <HomeScreen state={sharedState} navigate={navigate} />;
  if (route === 'detalle')     screen = <DetalleScreen state={sharedState} navigate={navigate} back={back} />;
  if (route === 'simulacion')  screen = <SimulacionScreen state={sharedState} navigate={navigate} back={back}
                                          addXP={addXP} awardToast={awardToast} />;
  if (route === 'fortalezas')  screen = <FortalezasScreen state={sharedState} navigate={navigate} />;
  if (route === 'ranking')     screen = <RankingScreen state={sharedState} />;
  if (route === 'plan')        screen = <PlanScreen state={sharedState} navigate={navigate} />;
  if (route === 'perfil')      screen = <PerfilScreen state={sharedState} />;

  // Layout: iOS frame + custom in-app chrome (header + bottom nav).
  // Header is hidden during simulación (it has its own header with timer).
  const showHeader = route !== 'simulacion';
  const showBottomNav = route !== 'simulacion' && route !== 'detalle';

  return (
    <ThemeWrap tweaks={tweaks}>
      <div data-screen-label={'Mentor.ia · ' + route} style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        background: 'var(--paper-50)',
      }}>
        {showHeader && (
          <AppHeader streak={streak} xp={xp} level={level}
            showMascot={tweaks.mascot}
            onProfileTap={() => onTabChange('perfil')} />
        )}

        <div className="app-scroll" key={route /* re-mount → re-animate */}>
          {screen}
        </div>

        {showBottomNav && <BottomNav active={tab} onChange={onTabChange} />}

        {/* Floating overlays */}
        <XPBurst bursts={bursts} />
        {tweaks.confetti && <Confetti trigger={confettiKey} />}
        <Toast toast={toast} />
        {levelUp !== null && (
          <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />
        )}
      </div>
      <MentorTweaks tweaks={tweaks} setTweak={setTweak} />
    </ThemeWrap>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN — PERFIL (lightweight, but fully styled)
// ─────────────────────────────────────────────────────────────
function PerfilScreen({ state }) {
  const stats = [
    { label: 'Nivel',  value: state.level },
    { label: 'XP',     value: state.xp.toLocaleString('es-ES') },
    { label: 'Racha',  value: state.streak + ' días' },
  ];
  const items = [
    { icon: 'sliders',  label: 'Tu rol · Account Exec, SaaS B2B' },
    { icon: 'message',  label: 'Conectar Slack' },
    { icon: 'bell',     label: 'Recordatorios diarios' },
    { icon: 'refresh',  label: 'Reiniciar progreso de simulación' },
    { icon: 'info',     label: 'Sobre Mentor.ia' },
  ];
  return (
    <div className="screen-in" style={{ paddingBottom: 110 }}>
      <ScreenTitle eyebrow="Tu perfil" title="Ana" accent="· People Ops." />

      <div style={{ padding: '0 20px' }}>
        <div style={{
          background: 'var(--paper-0)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 18,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999,
            background: 'var(--tide-500)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em',
            boxShadow: '0 8px 20px -4px rgba(29,158,117,0.4)',
          }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--navy-900)' }}>Ana Martínez</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
              ana.martinez@acme.io · 4 meses
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 12,
          background: 'var(--paper-0)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 18,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--fg-3)', marginBottom: 4,
              }}>{s.label}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 500,
                color: 'var(--navy-900)', fontVariantNumeric: 'tabular-nums',
              }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '22px 20px 0' }}>
        <Eyebrow style={{ marginBottom: 10 }}>Ajustes</Eyebrow>
        <div style={{
          background: 'var(--paper-0)', border: '1px solid var(--border)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          {items.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderTop: i === 0 ? 'none' : '1px solid var(--border)',
            }}>
              <Icon name={it.icon} size={18} color="var(--navy-700)" />
              <div style={{ flex: 1, fontSize: 14, color: 'var(--navy-900)' }}>{it.label}</div>
              <Icon name="chevron" size={16} color="var(--fg-3)" />
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: '20px 20px 0', textAlign: 'center',
        fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)',
      }}>
        Mentor.ia · Beta · v0.4
      </div>
    </div>
  );
}

window.PerfilScreen = PerfilScreen;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
