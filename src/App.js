import React, { useState, useEffect, useRef } from 'react';
import { PROFILE, SCHEDULE, WORKOUTS, MEALS, SUPPLEMENTS, BONUS_ACTIVITIES, MEASUREMENTS_FIELDS } from './data/data';

/* ── storage ── */
const ls = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const ss = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const todayStr = () => new Date().toISOString().split('T')[0];

/* ── tiny icon ── */
const Ic = ({ d, size = 20, stroke = 'currentColor', sw = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const IC = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  dumb:    ["M6 5h2M16 5h2M3 8h18M3 16h18M6 19h2M16 19h2","M5 8v8M19 8v8"],
  food:    "M3 11l19-9-9 19-2-8-8-2z",
  pill:    ["M10.5 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v5","M8 12h8","M16 19h6","M19 16v6"],
  chart:   "M18 20V10M12 20V4M6 20v-6",
  ruler:   "M2 20h20M6 20V8l4 4 4-8 4 4v12",
  check:   "M20 6L9 17l-5-5",
  plus:    "M12 5v14M5 12h14",
  trash:   "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  fire:    "M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-6-6-8-6-14z",
  run:     "M13 4h3a2 2 0 012 2v14M8 4H5a2 2 0 00-2 2v14M4 20h16M4 10h16M4 15h16",
  x:       "M18 6L6 18M6 6l12 12",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  arrow:   "M5 12h14M12 5l7 7-7 7",
};

/* ── ring ── */
const Ring = ({ pct, size = 76, stroke = 6, color = '#e11d48', label, sub }) => {
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const d = c * Math.min(pct / 100, 1);
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${d} ${c}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray .5s ease' }} />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
};

/* ── checkbox row ── */
const CB = ({ checked, onChange, label, sub, accent = '#e11d48', strike = true }) => (
  <button onClick={onChange} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'none', border: 'none', padding: '9px 0', cursor: 'pointer', textAlign: 'left' }}>
    <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checked ? accent : 'rgba(255,255,255,.18)'}`, background: checked ? accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .18s' }}>
      {checked && <Ic d={IC.check} size={13} sw={3} stroke="#fff" />}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ color: checked && strike ? 'rgba(255,255,255,.35)' : '#f5f5f5', fontSize: 14, textDecoration: checked && strike ? 'line-through' : 'none', transition: 'all .18s', wordBreak: 'break-word' }}>{label}</div>
      {sub && <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, marginTop: 2 }}>{sub}</div>}
    </div>
  </button>
);

/* ── section header ── */
const Sh = ({ label, right }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
    <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase' }}>{label}</div>
    {right}
  </div>
);

/* ── card ── */
const Card = ({ children, style }) => (
  <div style={{ background: '#161616', borderRadius: 14, border: '1px solid rgba(255,255,255,.07)', padding: 16, ...style }}>{children}</div>
);

/* ── input ── */
const Inp = ({ value, onChange, placeholder, type = 'text', style }) => (
  <input value={value} onChange={onChange} placeholder={placeholder} type={type}
    style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 9, padding: '10px 12px', color: '#f5f5f5', fontSize: 14, outline: 'none', width: '100%', ...style }} />
);

/* ── set logger ── */
const SetLogger = ({ exId, sets, date }) => {
  const key = `sets_${date}_${exId}`;
  const [logged, setLogged] = useState(() => ls(key, []));
  const [w, setW] = useState(''); const [r, setR] = useState('');
  const add = () => {
    if (!r) return;
    const u = [...logged, { w: w || 'BW', r, t: Date.now() }];
    setLogged(u); ss(key, u); setW(''); setR('');
  };
  const del = i => { const u = logged.filter((_, j) => j !== i); setLogged(u); ss(key, u); };
  return (
    <div style={{ marginTop: 10, background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Inp value={w} onChange={e => setW(e.target.value)} placeholder="Weight (lbs / BW)" style={{ flex: 1 }} />
        <Inp value={r} onChange={e => setR(e.target.value)} placeholder="Reps" type="number" style={{ width: 72 }} />
        <button onClick={add} style={{ background: '#e11d48', border: 'none', borderRadius: 9, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <Ic d={IC.plus} size={16} stroke="#fff" />
        </button>
      </div>
      {logged.map((s, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,.05)', borderRadius: 7, padding: '7px 10px', marginBottom: 4 }}>
          <span style={{ color: '#f5f5f5', fontSize: 13 }}>Set {i + 1} — <span style={{ color: '#e11d48', fontWeight: 700 }}>{s.r} reps</span> × <span style={{ color: 'rgba(255,255,255,.55)' }}>{s.w}</span></span>
          <button onClick={() => del(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><Ic d={IC.trash} size={14} stroke="rgba(255,255,255,.3)" /></button>
        </div>
      ))}
      {logged.length > 0 && <div style={{ color: 'rgba(255,255,255,.25)', fontSize: 11, marginTop: 4 }}>{logged.length}/{sets} sets logged</div>}
    </div>
  );
};

/* ── exercise card ── */
const ExCard = ({ ex, date }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, overflow: 'hidden', marginBottom: 10 }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'none', border: 'none', padding: 14, cursor: 'pointer', textAlign: 'left' }}>
        <img src={ex.img} alt={ex.name} onError={e => { e.target.style.display = 'none'; }}
          style={{ width: 54, height: 54, borderRadius: 10, objectFit: 'cover', background: 'rgba(255,255,255,.06)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: '#f5f5f5', fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
          <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginTop: 2 }}>{ex.muscles}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {[`${ex.sets} sets`, `${ex.reps} reps`, `Rest ${ex.rest}`].map(t => (
              <span key={t} style={{ background: 'rgba(225,29,72,.12)', color: '#e11d48', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
        <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 20, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>›</span>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px' }}>
          {ex.notes && <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 13, marginBottom: 8, fontStyle: 'italic' }}>💡 {ex.notes}</div>}
          <a href={ex.url} target="_blank" rel="noreferrer" style={{ color: '#e11d48', fontSize: 12, textDecoration: 'none', display: 'block', marginBottom: 8 }}>View on liftmanual.com ↗</a>
          <SetLogger exId={ex.id} sets={ex.sets} date={date} />
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   HOME TAB
════════════════════════════════════════════════════════════ */
const HomeTab = ({ date, dow, dayInfo }) => {
  const isRest = dow === 0 || dow === 6 ? false : dayInfo.type === 'active';
  const planKey = (dow === 0 || dow === 6) ? 'rest' : 'workout';
  const plan = MEALS[planKey];
  const goalCal = plan.calories;

  // calc eaten
  const foodChecked = ls(`food_${date}`, {});
  const allItems = plan.groups.flatMap(g => g.items);
  const customFoods = ls(`custom_food_${date}`, []);
  const checkedItems = allItems.filter(i => foodChecked[i.id]);
  const calEaten = checkedItems.reduce((a, i) => a + i.cal, 0) + customFoods.filter(f => f.checked).reduce((a, f) => a + (f.cal || 0), 0);

  // bonus cal
  const bonusChecked = ls(`bonus_${date}`, {});
  const bonusCal = BONUS_ACTIVITIES.filter(b => bonusChecked[b.id]).reduce((a, b) => a + b.cal, 0);
  const netCal = calEaten - bonusCal;
  const deficit = goalCal - netCal;

  // supps
  const suppChecked = ls(`supps_${date}`, {});
  const allSupps = [...SUPPLEMENTS.morning, ...SUPPLEMENTS.preworkout, ...SUPPLEMENTS.night];
  const suppDone = allSupps.filter(s => suppChecked[s.id]).length;

  // workout
  const workout = WORKOUTS[dow];
  const allSets = workout ? workout.exercises.reduce((a, e) => a + e.sets, 0) : 0;
  let loggedSets = 0;
  if (workout) workout.exercises.forEach(e => { loggedSets += ls(`sets_${date}_${e.id}`, []).length; });

  // weight progress
  const weights = ls('measurements', []);
  const latest = weights.length ? weights[weights.length - 1].weight : PROFILE.startWeight;
  const lost = (PROFILE.startWeight - latest).toFixed(1);
  const progressPct = Math.max(0, Math.min(100, ((PROFILE.startWeight - latest) / (PROFILE.startWeight - PROFILE.goalWeight)) * 100));

  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div>
      {/* greeting */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'rgba(255,255,255,.5)', marginBottom: 2 }}>{greet},</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: '#f5f5f5', lineHeight: 1.1 }}>Pamini <span style={{ color: '#e11d48' }}>✨</span></div>
        <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 12, marginTop: 6 }}>
          {new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* day badge */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{ background: dayInfo.color, color: '#fff', fontWeight: 700, fontSize: 13, padding: '6px 20px', borderRadius: 20, letterSpacing: .5 }}>{dayInfo.label}</span>
      </div>

      {/* rings row */}
      <Card style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 14, padding: '18px 10px' }}>
        <div style={{ textAlign: 'center' }}>
          <Ring pct={(calEaten / goalCal) * 100} color="#e11d48" label={calEaten} sub="eaten" />
          <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, marginTop: 6 }}>Calories</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Ring pct={(suppDone / allSupps.length) * 100} color="#a78bfa" label={`${suppDone}/${allSupps.length}`} sub="taken" />
          <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, marginTop: 6 }}>Supps</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Ring pct={progressPct} color="#34d399" label={`${lost}`} sub="lbs lost" />
          <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, marginTop: 6 }}>Progress</div>
        </div>
      </Card>

      {/* calorie breakdown */}
      <Card style={{ marginBottom: 14 }}>
        <Sh label="Calorie Summary" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {[
            ['Goal',    goalCal,   '#f5f5f5'],
            ['Eaten',   calEaten,  '#e11d48'],
            ['Burned',  bonusCal,  '#34d399'],
            ['Net Def', deficit > 0 ? deficit : 0, '#fbbf24'],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ color: c, fontWeight: 700, fontSize: 16 }}>{v}</div>
              <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 10, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: calEaten > goalCal ? '#f97316' : '#e11d48', borderRadius: 3, width: `${Math.min((calEaten / goalCal) * 100, 100)}%`, transition: 'width .4s' }} />
          </div>
          <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, marginTop: 4, textAlign: 'right' }}>
            {calEaten > goalCal ? `${calEaten - goalCal} cal over` : `${goalCal - calEaten} cal remaining`}
          </div>
        </div>
      </Card>

      {/* workout progress */}
      {workout && (
        <Card style={{ marginBottom: 14 }}>
          <Sh label="Today's Workout" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#f5f5f5', fontWeight: 600, fontSize: 15 }}>{workout.label}</div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginTop: 2 }}>{workout.muscles}</div>
            </div>
            <div style={{ color: '#e11d48', fontWeight: 700, fontSize: 18 }}>{loggedSets}/{allSets}</div>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 3, overflow: 'hidden', marginTop: 10 }}>
            <div style={{ height: '100%', background: '#e11d48', borderRadius: 3, width: `${(loggedSets / allSets) * 100}%`, transition: 'width .4s' }} />
          </div>
        </Card>
      )}

      {/* steps */}
      <Card style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ background: 'rgba(225,29,72,.12)', borderRadius: 10, padding: 10, flexShrink: 0 }}>
          <Ic d={IC.run} size={22} stroke="#e11d48" />
        </div>
        <div>
          <div style={{ color: '#f5f5f5', fontWeight: 600, fontSize: 14 }}>10,000 Steps Daily</div>
          <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12 }}>Every day — no exceptions 🚶‍♀️</div>
        </div>
      </Card>

      {/* week strip */}
      <Card>
        <Sh label="This Week" />
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {Object.entries(SCHEDULE).map(([d, s]) => {
            const isToday = new Date().getDay() === parseInt(d);
            return (
              <div key={d} style={{ flex: '0 0 auto', textAlign: 'center', padding: '8px 10px', borderRadius: 10, background: isToday ? s.color : 'rgba(255,255,255,.04)', border: isToday ? 'none' : '1px solid rgba(255,255,255,.06)', minWidth: 44 }}>
                <div style={{ color: isToday ? '#fff' : 'rgba(255,255,255,.4)', fontSize: 10, fontWeight: 700 }}>{['S','M','T','W','T','F','S'][parseInt(d)]}</div>
                <div style={{ color: isToday ? '#fff' : 'rgba(255,255,255,.25)', fontSize: 9, marginTop: 3, lineHeight: 1.2 }}>{s.label.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   WORKOUT TAB
════════════════════════════════════════════════════════════ */
const WorkoutTab = ({ date, dow, dayInfo }) => {
  const workout = WORKOUTS[dow];
  const sched = SCHEDULE[dow];

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#f5f5f5', marginBottom: 4 }}>{dayInfo.label}</div>
      <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 12, marginBottom: 20 }}>
        {new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>

      {/* OTF block */}
      {sched.otf && (
        <div style={{ background: 'rgba(249,115,22,.1)', border: '1px solid rgba(249,115,22,.2)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Ic d={IC.fire} size={18} stroke="#f97316" />
            <span style={{ color: '#f97316', fontWeight: 700, fontSize: 14 }}>Orange Theory Fitness</span>
          </div>
          <div style={{ color: '#f5f5f5', fontWeight: 600, fontSize: 15 }}>{sched.otf}</div>
          <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 13, marginTop: 4 }}>{sched.note}</div>
        </div>
      )}

      {/* cardio (Sunday) */}
      {dow === 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Cardio Session</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[['Incline', '8.0'], ['Speed', '2.0 mph'], ['Duration', '20 min']].map(([k, v]) => (
              <div key={k} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 9, padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 10 }}>{k}</div>
                <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: 15 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* steps reminder */}
      <div style={{ background: 'rgba(52,211,153,.07)', border: '1px solid rgba(52,211,153,.15)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>🚶‍♀️</span>
        <span style={{ color: '#34d399', fontSize: 13, fontWeight: 500 }}>10,000 steps today — every day, no exceptions</span>
      </div>

      {/* exercises */}
      {workout ? (
        <>
          <div style={{ background: 'rgba(225,29,72,.08)', border: '1px solid rgba(225,29,72,.15)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
            <div style={{ color: '#e11d48', fontWeight: 700, fontSize: 16 }}>{workout.label}</div>
            <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 13, marginTop: 2 }}>{workout.subtitle}</div>
            <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 12, marginTop: 2 }}>{workout.muscles}</div>
          </div>
          {workout.exercises.map(ex => <ExCard key={ex.id} ex={ex} date={date} />)}
        </>
      ) : !sched.otf && dow !== 0 && (
        <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{dow === 1 || dow === 5 ? '🧘‍♀️' : '🌙'}</div>
          <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 14 }}>
            {dow === 1 ? 'Active recovery day — OTF covers it all 💪' : dow === 5 ? 'Strength 50 Lower is your full session today 🔥' : 'Rest up — you earned it'}
          </div>
        </Card>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   FOOD TAB
════════════════════════════════════════════════════════════ */
const FoodTab = ({ date, dow }) => {
  const planKey = (dow === 0 || dow === 6) ? 'rest' : 'workout';
  const plan = MEALS[planKey];
  const [checked, setChecked] = useState(() => ls(`food_${date}`, {}));
  const [customFoods, setCustomFoods] = useState(() => ls(`custom_food_${date}`, []));
  const [addName, setAddName] = useState('');
  const [addCal, setAddCal] = useState('');
  const [addP, setAddP] = useState('');
  const [addC, setAddC] = useState('');
  const [addF, setAddF] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const toggle = id => {
    const u = { ...checked, [id]: !checked[id] };
    setChecked(u); ss(`food_${date}`, u);
  };
  const toggleCustom = idx => {
    const u = customFoods.map((f, i) => i === idx ? { ...f, checked: !f.checked } : f);
    setCustomFoods(u); ss(`custom_food_${date}`, u);
  };
  const deleteCustom = idx => {
    const u = customFoods.filter((_, i) => i !== idx);
    setCustomFoods(u); ss(`custom_food_${date}`, u);
  };
  const addCustomFood = () => {
    if (!addName || !addCal) return;
    const entry = { id: `cf_${Date.now()}`, name: addName, cal: parseInt(addCal) || 0, p: parseInt(addP) || 0, c: parseInt(addC) || 0, f: parseInt(addF) || 0, checked: false };
    const u = [...customFoods, entry];
    setCustomFoods(u); ss(`custom_food_${date}`, u);
    setAddName(''); setAddCal(''); setAddP(''); setAddC(''); setAddF(''); setShowAdd(false);
  };

  // totals
  const allItems = plan.groups.flatMap(g => g.items);
  const checkedItems = allItems.filter(i => checked[i.id]);
  const checkedCustom = customFoods.filter(f => f.checked);
  const calEaten = checkedItems.reduce((a, i) => a + i.cal, 0) + checkedCustom.reduce((a, f) => a + f.cal, 0);
  const pEaten   = checkedItems.reduce((a, i) => a + i.p, 0)   + checkedCustom.reduce((a, f) => a + f.p, 0);
  const cEaten   = checkedItems.reduce((a, i) => a + i.c, 0)   + checkedCustom.reduce((a, f) => a + f.c, 0);
  const fEaten   = checkedItems.reduce((a, i) => a + i.f, 0)   + checkedCustom.reduce((a, f) => a + f.f, 0);
  const goalCal  = plan.calories;
  const { c: gC, p: gP, f: gF } = plan.macros;

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f5f5f5', marginBottom: 4 }}>
        {planKey === 'rest' ? 'Rest Day' : 'Workout Day'} Meals
      </div>
      <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 12, marginBottom: 16 }}>
        {gC}C · {gP}P · {gF}F · {goalCal} cal target
      </div>

      {/* macro summary */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 12 }}>
          {[['Cal', calEaten, goalCal, '#e11d48'], ['Protein', `${pEaten}g`, `${gP}g`, '#a78bfa'], ['Carbs', `${cEaten}g`, `${gC}g`, '#fbbf24'], ['Fat', `${fEaten}g`, `${gF}g`, '#34d399']].map(([l, v, g, c]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ color: c, fontWeight: 700, fontSize: 16 }}>{v}</div>
              <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 10, marginTop: 1 }}>/ {g}</div>
              <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 10, marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: calEaten > goalCal ? '#f97316' : '#e11d48', borderRadius: 3, width: `${Math.min((calEaten / goalCal) * 100, 100)}%`, transition: 'width .4s' }} />
        </div>
        <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, marginTop: 5, textAlign: 'right' }}>
          {calEaten > goalCal ? `⚠️ ${calEaten - goalCal} over goal` : `${goalCal - calEaten} cal remaining`}
        </div>
      </Card>

      {/* meals */}
      {plan.groups.map(group => (
        <div key={group.id} style={{ marginBottom: 14 }}>
          <Sh label={`${group.icon} ${group.label}`} />
          <Card style={{ padding: '4px 16px' }}>
            {group.items.map((item, i) => (
              <div key={item.id} style={{ borderBottom: i < group.items.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                <CB checked={!!checked[item.id]} onChange={() => toggle(item.id)} label={item.text}
                  sub={`${item.cal} cal · ${item.p}g P · ${item.c}g C · ${item.f}g F`} />
              </div>
            ))}
          </Card>
        </div>
      ))}

      {/* custom foods */}
      {customFoods.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <Sh label="➕ Custom Foods Added" />
          <Card style={{ padding: '4px 16px' }}>
            {customFoods.map((f, i) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', borderBottom: i < customFoods.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <CB checked={f.checked} onChange={() => toggleCustom(i)} label={f.name}
                    sub={`${f.cal} cal · ${f.p}g P · ${f.c}g C · ${f.f}g F`} />
                </div>
                <button onClick={() => deleteCustom(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                  <Ic d={IC.trash} size={15} stroke="rgba(255,255,255,.25)" />
                </button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* add custom food */}
      <Card style={{ marginBottom: 14 }}>
        <button onClick={() => setShowAdd(!showAdd)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', width: '100%', padding: 0 }}>
          <div style={{ background: 'rgba(225,29,72,.12)', borderRadius: 8, padding: 6 }}>
            <Ic d={IC.plus} size={16} stroke="#e11d48" />
          </div>
          <span style={{ color: '#e11d48', fontWeight: 600, fontSize: 14 }}>Add Custom Food</span>
        </button>
        {showAdd && (
          <div style={{ marginTop: 14 }}>
            <Inp value={addName} onChange={e => setAddName(e.target.value)} placeholder="Food name (e.g. Protein bar)" style={{ marginBottom: 8 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <Inp value={addCal} onChange={e => setAddCal(e.target.value)} placeholder="Calories" type="number" />
              <Inp value={addP} onChange={e => setAddP(e.target.value)} placeholder="Protein (g)" type="number" />
              <Inp value={addC} onChange={e => setAddC(e.target.value)} placeholder="Carbs (g)" type="number" />
              <Inp value={addF} onChange={e => setAddF(e.target.value)} placeholder="Fat (g)" type="number" />
            </div>
            <button onClick={addCustomFood} style={{ background: '#e11d48', border: 'none', borderRadius: 9, padding: '10px 20px', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
              Add Food
            </button>
          </div>
        )}
      </Card>

      {/* restaurant protocol */}
      <Card style={{ background: 'rgba(251,191,36,.06)', border: '1px solid rgba(251,191,36,.15)' }}>
        <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>🍽 Restaurant Protocol (max 1x/week)</div>
        <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 13, lineHeight: 1.7 }}>
          Only restaurants with calorie counts on menu.<br />
          Meal out: <strong style={{ color: '#fff' }}>600 cal or less.</strong><br />
          <span style={{ color: '#e11d48', fontWeight: 600 }}>No pizza, fried foods, or dessert.</span><br />
          Good picks: Longhorn, Sushi, Five Guys, Cheesecake Factory (steak, burgers, potatoes).
        </div>
      </Card>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   SUPPLEMENTS TAB
════════════════════════════════════════════════════════════ */
const SuppTab = ({ date, dow }) => {
  const isTraining = [1, 2, 3, 4, 5].includes(dow);
  const [checked, setChecked] = useState(() => ls(`supps_${date}`, {}));
  const toggle = id => { const u = { ...checked, [id]: !checked[id] }; setChecked(u); ss(`supps_${date}`, u); };

  const allS = [...SUPPLEMENTS.morning, ...(isTraining ? SUPPLEMENTS.preworkout : []), ...SUPPLEMENTS.night];
  const done = allS.filter(s => checked[s.id]).length;

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f5f5f5', marginBottom: 4 }}>Supplements</div>
      <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 12, marginBottom: 20 }}>{done}/{allS.length} taken today</div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ height: 8, background: 'rgba(255,255,255,.07)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: done === allS.length ? '#34d399' : '#a78bfa', borderRadius: 4, width: `${(done / allS.length) * 100}%`, transition: 'width .4s' }} />
        </div>
        <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, marginTop: 6, textAlign: 'right' }}>{Math.round((done / allS.length) * 100)}% complete</div>
      </Card>

      {[
        { key: 'morning', label: '☀️ Morning', accent: '#fbbf24', items: SUPPLEMENTS.morning },
        ...(isTraining ? [{ key: 'preworkout', label: '⚡ Pre-Workout', accent: '#f97316', items: SUPPLEMENTS.preworkout }] : []),
        { key: 'night', label: '🌙 Night', accent: '#a78bfa', items: SUPPLEMENTS.night },
      ].map(group => (
        <div key={group.key} style={{ marginBottom: 16 }}>
          <Sh label={group.label} />
          <Card style={{ padding: '4px 16px' }}>
            {group.items.map((s, i) => (
              <div key={s.id} style={{ borderBottom: i < group.items.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                <CB checked={!!checked[s.id]} onChange={() => toggle(s.id)} label={s.name} sub={`${s.dose} · ${s.note}`} accent={group.accent} />
              </div>
            ))}
          </Card>
        </div>
      ))}

      <Card>
        <Sh label="Amazon Links" />
        {[
          ["Women's Multivitamin", 'https://www.amazon.com/Nutricost-Multivitamin-Women-120-Capsules/dp/B06WP6KR4X/'],
          ['Creatine Monohydrate',  'https://www.amazon.com/Nutricost-Creatine-Monohydrate-500g-Unflavored/dp/B07ZZB4S3H/'],
          ['L-Carnitine Tartrate',  'https://www.amazon.com/Nutricost-L-Carnitine-Tartrate-500mg-Capsules/dp/B06Y1BTLGK/'],
          ['Omega-3 Fish Oil',      'https://www.amazon.com/Nutricost-Fish-Oil-Omega-3-Softgels/dp/B01N7YUC6I/'],
          ['Vitamin D3 + K2',       'https://www.amazon.com/Nutricost-Vitamin-100mcg-5000-Softgels/dp/B07K3VFVJC/'],
          ['Vitamin C',             'https://www.amazon.com/Nutricost-Vitamin-Rose-1025mg-Capsules/dp/B074GCB1ND/'],
          ['Magnesium Glycinate',   'https://www.amazon.com/Nutricost-Magnesium-Glycinate-400mg-Capsules/dp/B07FS2WV77/'],
          ['Magnesium Calm Powder', 'https://www.amazon.com/Natural-Vitality-Anti-Stress-Supplement-Raspberry/dp/B00BPUY3W0/'],
        ].map(([name, url]) => (
          <a key={name} href={url} target="_blank" rel="noreferrer"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.05)', textDecoration: 'none' }}>
            <span style={{ color: 'rgba(255,255,255,.65)', fontSize: 13 }}>{name}</span>
            <span style={{ color: '#e11d48', fontSize: 12 }}>↗</span>
          </a>
        ))}
      </Card>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   BONUS ACTIVITIES TAB
════════════════════════════════════════════════════════════ */
const BonusTab = ({ date }) => {
  const [checked, setChecked] = useState(() => ls(`bonus_${date}`, {}));
  const [customList, setCustomList] = useState(() => ls(`bonus_custom_${date}`, []));
  const [addLabel, setAddLabel] = useState('');
  const [addCal, setAddCal] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const toggle = id => { const u = { ...checked, [id]: !checked[id] }; setChecked(u); ss(`bonus_${date}`, u); };
  const toggleCustom = idx => {
    const u = customList.map((a, i) => i === idx ? { ...a, checked: !a.checked } : a);
    setCustomList(u); ss(`bonus_custom_${date}`, u);
  };
  const deleteCustom = idx => {
    const u = customList.filter((_, i) => i !== idx);
    setCustomList(u); ss(`bonus_custom_${date}`, u);
  };
  const addActivity = () => {
    if (!addLabel) return;
    const u = [...customList, { id: `ba_${Date.now()}`, label: addLabel, cal: parseInt(addCal) || 0, checked: false }];
    setCustomList(u); ss(`bonus_custom_${date}`, u);
    setAddLabel(''); setAddCal(''); setShowAdd(false);
  };

  const totalBonusCal =
    BONUS_ACTIVITIES.filter(b => checked[b.id]).reduce((a, b) => a + b.cal, 0) +
    customList.filter(a => a.checked).reduce((a, b) => a + b.cal, 0);

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f5f5f5', marginBottom: 4 }}>Bonus Activities</div>
      <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 12, marginBottom: 16 }}>Extra calories burned beyond your main workout</div>

      <Card style={{ marginBottom: 16, textAlign: 'center' }}>
        <div style={{ color: '#34d399', fontWeight: 700, fontSize: 32 }}>{totalBonusCal}</div>
        <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginTop: 2 }}>extra calories burned today</div>
        {totalBonusCal > 0 && <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 12, marginTop: 6 }}>This reduces your net calorie intake — great for the deficit 🔥</div>}
      </Card>

      <Sh label="Preset Activities" />
      <Card style={{ padding: '4px 16px', marginBottom: 16 }}>
        {BONUS_ACTIVITIES.map((b, i) => (
          <div key={b.id} style={{ borderBottom: i < BONUS_ACTIVITIES.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
            <CB checked={!!checked[b.id]} onChange={() => toggle(b.id)} label={b.label} sub={`~${b.cal} cal burned`} accent="#34d399" />
          </div>
        ))}
      </Card>

      {customList.length > 0 && (
        <>
          <Sh label="Custom Activities" />
          <Card style={{ padding: '4px 16px', marginBottom: 16 }}>
            {customList.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', borderBottom: i < customList.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <CB checked={a.checked} onChange={() => toggleCustom(i)} label={a.label} sub={`~${a.cal} cal burned`} accent="#34d399" />
                </div>
                <button onClick={() => deleteCustom(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Ic d={IC.trash} size={15} stroke="rgba(255,255,255,.25)" />
                </button>
              </div>
            ))}
          </Card>
        </>
      )}

      <Card>
        <button onClick={() => setShowAdd(!showAdd)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', width: '100%', padding: 0 }}>
          <div style={{ background: 'rgba(52,211,153,.12)', borderRadius: 8, padding: 6 }}>
            <Ic d={IC.plus} size={16} stroke="#34d399" />
          </div>
          <span style={{ color: '#34d399', fontWeight: 600, fontSize: 14 }}>Add Custom Activity</span>
        </button>
        {showAdd && (
          <div style={{ marginTop: 14 }}>
            <Inp value={addLabel} onChange={e => setAddLabel(e.target.value)} placeholder="Activity (e.g. Beach volleyball)" style={{ marginBottom: 8 }} />
            <Inp value={addCal} onChange={e => setAddCal(e.target.value)} placeholder="Calories burned (approx)" type="number" style={{ marginBottom: 8 }} />
            <button onClick={addActivity} style={{ background: '#34d399', border: 'none', borderRadius: 9, padding: '10px 20px', color: '#000', fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
              Add Activity
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   PROGRESS TAB (weight + measurements)
════════════════════════════════════════════════════════════ */
const ProgressTab = () => {
  const [measurements, setMeasurements] = useState(() => ls('measurements', []));
  const [form, setForm] = useState({});
  const [note, setNote] = useState('');
  const [view, setView] = useState('weight'); // 'weight' | 'body'

  const saveEntry = () => {
    if (!form.weight) return;
    const entry = { date: todayStr(), ts: Date.now(), note, ...form };
    const updated = [...measurements.filter(e => e.date !== todayStr()), entry].sort((a, b) => a.ts - b.ts);
    setMeasurements(updated); ss('measurements', updated);
    setForm({}); setNote('');
  };

  const startW = PROFILE.startWeight;
  const goalW = PROFILE.goalWeight;
  const latest = measurements.length ? measurements[measurements.length - 1] : null;
  const latestW = latest?.weight || startW;
  const lost = (startW - latestW).toFixed(1);
  const toGo = (latestW - goalW).toFixed(1);
  const pct = Math.max(0, Math.min(100, ((startW - latestW) / (startW - goalW)) * 100));

  // sparkline
  const wPts = [{ weight: startW, date: 'Start' }, ...measurements].slice(-12);
  const wMin = Math.min(...wPts.map(p => p.weight || 0)) - 2;
  const wMax = Math.max(...wPts.map(p => p.weight || 0)) + 2;
  const wR = wMax - wMin || 1;
  const SW = 300, SH = 80;

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f5f5f5', marginBottom: 4 }}>Progress</div>
      <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 12, marginBottom: 16 }}>Log weekly — Sunday mornings</div>

      {/* toggle */}
      <div style={{ display: 'flex', background: '#1a1a1a', borderRadius: 10, padding: 4, marginBottom: 16 }}>
        {[['weight', '⚖️ Weight'], ['body', '📏 Measurements']].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} style={{ flex: 1, background: view === k ? '#e11d48' : 'transparent', border: 'none', borderRadius: 8, padding: '8px 0', color: view === k ? '#fff' : 'rgba(255,255,255,.4)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>{l}</button>
        ))}
      </div>

      {view === 'weight' && (
        <>
          {/* stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[['Start', `${startW}`, '#f5f5f5'], ['Current', `${latestW}`, '#e11d48'], ['Goal', `${goalW}`, '#34d399']].map(([l, v, c]) => (
              <Card key={l} style={{ textAlign: 'center', padding: 14 }}>
                <div style={{ color: c, fontWeight: 700, fontSize: 20 }}>{v}</div>
                <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, marginTop: 2 }}>lbs</div>
                <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginTop: 2 }}>{l}</div>
              </Card>
            ))}
          </div>

          {/* progress bar */}
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#f5f5f5', fontWeight: 700, fontSize: 15 }}>🔥 {lost} lbs lost</span>
              <span style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>{toGo} lbs to go</span>
            </div>
            <div style={{ height: 10, background: 'rgba(255,255,255,.07)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg,#e11d48,#f97316)', borderRadius: 5, width: `${pct}%`, transition: 'width .5s' }} />
            </div>
            <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, marginTop: 5, textAlign: 'right' }}>{pct.toFixed(1)}% of goal reached</div>
          </Card>

          {/* sparkline */}
          {wPts.length > 1 && (
            <Card style={{ marginBottom: 14, overflowX: 'auto' }}>
              <Sh label="Weight Chart" />
              <svg width={SW} height={SH} style={{ display: 'block', overflow: 'visible' }}>
                {wPts.map((p, i) => {
                  if (i === 0) return null;
                  const x1 = ((i - 1) / (wPts.length - 1)) * SW, y1 = SH - ((wPts[i - 1].weight - wMin) / wR) * SH;
                  const x2 = (i / (wPts.length - 1)) * SW, y2 = SH - ((p.weight - wMin) / wR) * SH;
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e11d48" strokeWidth={2} strokeLinecap="round" />;
                })}
                {wPts.map((p, i) => {
                  const x = (i / (wPts.length - 1)) * SW, y = SH - ((p.weight - wMin) / wR) * SH;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={4} fill="#e11d48" />
                      <text x={x} y={y - 8} fill="rgba(255,255,255,.55)" fontSize={9} textAnchor="middle">{p.weight}</text>
                    </g>
                  );
                })}
              </svg>
            </Card>
          )}

          {/* log */}
          <Card style={{ marginBottom: 14 }}>
            <Sh label="Log This Week" />
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Inp value={form.weight || ''} onChange={e => setForm({ ...form, weight: parseFloat(e.target.value) })} placeholder="Weight (lbs)" type="number" style={{ flex: 1 }} />
              <button onClick={saveEntry} style={{ background: '#e11d48', border: 'none', borderRadius: 9, padding: '10px 18px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>Save</button>
            </div>
            <Inp value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)" />
          </Card>

          {/* history */}
          {measurements.length > 0 && (
            <Card>
              <Sh label="History" />
              {[...measurements].reverse().map((e, i) => {
                const prev = measurements[measurements.length - 2 - i];
                const delta = prev && e.weight && prev.weight ? (e.weight - prev.weight).toFixed(1) : null;
                return (
                  <div key={e.ts} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                    <div>
                      <div style={{ color: '#f5f5f5', fontSize: 14, fontWeight: 600 }}>{e.weight} lbs</div>
                      <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 12 }}>{e.date}{e.note ? ' · ' + e.note : ''}</div>
                    </div>
                    {delta && (
                      <span style={{ color: parseFloat(delta) < 0 ? '#34d399' : '#e11d48', fontWeight: 700, fontSize: 13 }}>
                        {parseFloat(delta) < 0 ? '▼' : '▲'} {Math.abs(delta)} lbs
                      </span>
                    )}
                  </div>
                );
              })}
            </Card>
          )}
        </>
      )}

      {view === 'body' && (
        <>
          {/* log measurements */}
          <Card style={{ marginBottom: 14 }}>
            <Sh label="Log Measurements" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
              {MEASUREMENTS_FIELDS.map(f => (
                <div key={f.id}>
                  <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginBottom: 4 }}>{f.icon} {f.label} ({f.unit})</div>
                  <Inp value={form[f.id] || ''} onChange={e => setForm({ ...form, [f.id]: parseFloat(e.target.value) })} placeholder={`0 ${f.unit}`} type="number" />
                </div>
              ))}
            </div>
            <Inp value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)" style={{ marginBottom: 8 }} />
            <button onClick={saveEntry} style={{ background: '#e11d48', border: 'none', borderRadius: 9, padding: '11px 20px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
              Save All Measurements
            </button>
          </Card>

          {/* measurements history */}
          {measurements.length > 0 && (
            <Card>
              <Sh label="Measurements History" />
              {[...measurements].reverse().filter(e => Object.keys(e).some(k => MEASUREMENTS_FIELDS.map(f => f.id).includes(k))).map(e => (
                <div key={e.ts} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                  <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginBottom: 8 }}>{e.date}{e.note ? ' · ' + e.note : ''}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {MEASUREMENTS_FIELDS.map(f => e[f.id] ? (
                      <div key={f.id} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 10 }}>{f.icon} {f.label}</div>
                        <div style={{ color: '#f5f5f5', fontWeight: 600, fontSize: 14, marginTop: 2 }}>{e[f.id]} {f.unit}</div>
                      </div>
                    ) : null)}
                  </div>
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════════════ */
const TABS = [
  { id: 'home',    icon: IC.home,  label: 'Home'    },
  { id: 'workout', icon: IC.dumb,  label: 'Workout' },
  { id: 'food',    icon: IC.food,  label: 'Food'    },
  { id: 'supps',   icon: IC.pill,  label: 'Supps'   },
  { id: 'bonus',   icon: IC.fire,  label: 'Bonus'   },
  { id: 'progress',icon: IC.ruler, label: 'Progress'},
];

export default function App() {
  const [tab, setTab] = useState('home');
  const date = todayStr();
  const dow = new Date().getDay();
  const dayInfo = SCHEDULE[dow];

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: '#0a0a0a', fontFamily: 'var(--font-body)', position: 'relative' }}>
      <div style={{ padding: '20px 18px 100px', overflowY: 'auto' }}>
        {tab === 'home'     && <HomeTab     date={date} dow={dow} dayInfo={dayInfo} />}
        {tab === 'workout'  && <WorkoutTab  date={date} dow={dow} dayInfo={dayInfo} />}
        {tab === 'food'     && <FoodTab     date={date} dow={dow} />}
        {tab === 'supps'    && <SuppTab     date={date} dow={dow} />}
        {tab === 'bonus'    && <BonusTab    date={date} />}
        {tab === 'progress' && <ProgressTab />}
      </div>

      {/* bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'rgba(10,10,10,.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,.07)', display: 'flex', padding: '6px 0 max(6px,env(safe-area-inset-bottom))', zIndex: 100 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tab === t.id ? 'rgba(225,29,72,.15)' : 'transparent', transition: 'background .18s' }}>
              <Ic d={t.icon} size={19} stroke={tab === t.id ? '#e11d48' : 'rgba(255,255,255,.3)'} sw={tab === t.id ? 2 : 1.6} />
            </div>
            <span style={{ fontSize: 9, color: tab === t.id ? '#e11d48' : 'rgba(255,255,255,.3)', fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
