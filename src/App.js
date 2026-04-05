import React, { useState, useEffect, useCallback } from 'react';
import { PROFILE, SCHEDULE, WORKOUTS, MEALS, SUPPLEMENTS, CARDIO } from './data/data';
import './index.css';

// ── Storage helpers ────────────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0];
const store = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} };
const load  = (key, def) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch(e){ return def; } };

// ── Icons ─────────────────────────────────────────────────────────
const Icon = ({ d, size=20, stroke='currentColor', fill='none', strokeWidth=1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const icons = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  dumbbell:"M6.5 6.5h11M6.5 17.5h11M3 9.5h2M19 9.5h2M3 14.5h2M19 14.5h2M5 8v8M19 8v8",
  food:    "M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  pill:    "M10.5 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v5M8 12h8M16 19h6M19 16v6",
  chart:   "M18 20V10M12 20V4M6 20v-6",
  check:   "M20 6L9 17l-5-5",
  plus:    "M12 5v14M5 12h14",
  trash:   "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  fire:    "M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-6-6-8-6-14z",
  steps:   "M13 4h3a2 2 0 012 2v14M8 4H5a2 2 0 00-2 2v14M4 20h16M4 10h16M4 15h16",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  lock:    "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
};

// ── Progress Ring ─────────────────────────────────────────────────
const Ring = ({ pct, size=80, stroke=7, color='#f43f5e', label, sub }) => {
  const r = (size - stroke*2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct/100, 1);
  return (
    <div style={{position:'relative',width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <svg width={size} height={size} style={{position:'absolute',transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{transition:'stroke-dasharray .6s ease'}}/>
      </svg>
      <div style={{textAlign:'center',zIndex:1}}>
        <div style={{fontSize:16,fontWeight:600,color:'#fff',lineHeight:1}}>{label}</div>
        {sub && <div style={{fontSize:10,color:'rgba(255,255,255,.5)',marginTop:2}}>{sub}</div>}
      </div>
    </div>
  );
};

// ── Checkbox ──────────────────────────────────────────────────────
const Checkbox = ({ checked, onChange, label, sub, accent='#f43f5e' }) => (
  <button onClick={onChange} style={{
    display:'flex',alignItems:'center',gap:12,width:'100%',background:'none',border:'none',
    padding:'10px 0',cursor:'pointer',textAlign:'left',
  }}>
    <div style={{
      width:22,height:22,borderRadius:6,border:`2px solid ${checked?accent:'rgba(255,255,255,.2)'}`,
      background:checked?accent:'transparent',display:'flex',alignItems:'center',justifyContent:'center',
      flexShrink:0,transition:'all .2s',
    }}>
      {checked && <Icon d={icons.check} size={13} strokeWidth={3} stroke="#fff"/>}
    </div>
    <div>
      <div style={{color:checked?'rgba(255,255,255,.45)':'#fff',fontSize:14,textDecoration:checked?'line-through':'none',transition:'all .2s'}}>{label}</div>
      {sub && <div style={{color:'rgba(255,255,255,.35)',fontSize:12,marginTop:1}}>{sub}</div>}
    </div>
  </button>
);

// ── Set Logger ────────────────────────────────────────────────────
const SetLogger = ({ exerciseId, sets, dateKey }) => {
  const storageKey = `sets_${dateKey}_${exerciseId}`;
  const [logged, setLogged] = useState(() => load(storageKey, []));
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const addSet = () => {
    if (!reps) return;
    const updated = [...logged, { weight: weight||'BW', reps, ts: Date.now() }];
    setLogged(updated); store(storageKey, updated);
    setWeight(''); setReps('');
  };
  const removeSet = (i) => {
    const updated = logged.filter((_,idx)=>idx!==i);
    setLogged(updated); store(storageKey, updated);
  };

  return (
    <div style={{marginTop:12,background:'rgba(255,255,255,.04)',borderRadius:10,padding:12}}>
      <div style={{display:'flex',gap:8,marginBottom:8}}>
        <input value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Weight (lbs)"
          style={{flex:1,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'8px 10px',color:'#fff',fontSize:13,outline:'none'}}/>
        <input value={reps} onChange={e=>setReps(e.target.value)} placeholder="Reps" type="number"
          style={{width:70,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'8px 10px',color:'#fff',fontSize:13,outline:'none'}}/>
        <button onClick={addSet} style={{background:'#f43f5e',border:'none',borderRadius:8,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
          <Icon d={icons.plus} size={16} stroke="#fff"/>
        </button>
      </div>
      {logged.length > 0 && (
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {logged.map((s,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,.05)',borderRadius:6,padding:'6px 10px'}}>
              <span style={{color:'#fff',fontSize:13}}>Set {i+1} &nbsp;<span style={{color:'#f43f5e',fontWeight:600}}>{s.reps} reps</span> × <span style={{color:'rgba(255,255,255,.6)'}}>{s.weight}</span></span>
              <button onClick={()=>removeSet(i)} style={{background:'none',border:'none',cursor:'pointer',padding:2}}>
                <Icon d={icons.trash} size={14} stroke="rgba(255,255,255,.3)"/>
              </button>
            </div>
          ))}
          <div style={{color:'rgba(255,255,255,.3)',fontSize:11,marginTop:2}}>{logged.length} / {sets} sets logged</div>
        </div>
      )}
    </div>
  );
};

// ── Exercise Card ─────────────────────────────────────────────────
const ExCard = ({ ex, dateKey }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{background:'rgba(255,255,255,.04)',borderRadius:14,overflow:'hidden',marginBottom:10}}>
      <button onClick={()=>setOpen(!open)} style={{
        display:'flex',alignItems:'center',gap:12,width:'100%',background:'none',border:'none',
        padding:14,cursor:'pointer',textAlign:'left',
      }}>
        <img src={ex.img} alt={ex.name} onError={e=>{e.target.style.display='none'}}
          style={{width:52,height:52,borderRadius:10,objectFit:'cover',background:'rgba(255,255,255,.07)',flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{color:'#fff',fontWeight:500,fontSize:14,lineHeight:1.2}}>{ex.name}</div>
          <div style={{color:'rgba(255,255,255,.4)',fontSize:12,marginTop:3}}>{ex.muscles}</div>
          <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}>
            {[`${ex.sets} sets`,`${ex.reps} reps`,`Rest ${ex.rest}`].map(tag=>(
              <span key={tag} style={{background:'rgba(244,63,94,.12)',color:'#f43f5e',fontSize:11,padding:'2px 8px',borderRadius:20}}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{color:'rgba(255,255,255,.3)',fontSize:18,transform:open?'rotate(180deg)':'none',transition:'transform .2s'}}>›</div>
      </button>
      {open && (
        <div style={{padding:'0 14px 14px'}}>
          {ex.notes && <div style={{color:'rgba(255,255,255,.5)',fontSize:13,marginBottom:8,fontStyle:'italic'}}>💡 {ex.notes}</div>}
          <a href={ex.url} target="_blank" rel="noreferrer"
            style={{color:'#f43f5e',fontSize:12,textDecoration:'none',display:'block',marginBottom:8}}>
            View on liftmanual.com ↗
          </a>
          <SetLogger exerciseId={ex.id} sets={ex.sets} dateKey={dateKey}/>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────────────

// ── Home Tab ──────────────────────────────────────────────────────
const HomeTab = ({ dateKey, dayInfo }) => {
  const isWorkoutDay = ['workout','active'].includes(dayInfo.type) || dayInfo.type==='cardio';
  const isRestDay = dayInfo.type==='active' || dayInfo.type==='rest';
  const macros = PROFILE.macros[isRestDay && dayInfo.type==='rest' ? 'rest':'workout'];
  const meals = MEALS[isRestDay && dayInfo.type==='rest'?'rest':'workout'];

  const totalCal = meals.meals.reduce((a,m)=>a+m.items.reduce((b,i)=>b+i.cal,0),0);
  const goalCal = isRestDay && dayInfo.type==='rest' ? 1490 : 1650;
  const pct = Math.min((totalCal/goalCal)*100,100);

  const startWeight = 156;
  const weights = load('weights', []);
  const latest = weights.length ? weights[weights.length-1].w : startWeight;
  const lost = (startWeight - latest).toFixed(1);

  return (
    <div>
      {/* Greeting */}
      <div style={{textAlign:'center',marginBottom:24}}>
        <div style={{fontFamily:"'DM Serif Display', serif",fontSize:28,color:'#fff',lineHeight:1.1}}>
          Good {new Date().getHours()<12?'Morning':new Date().getHours()<17?'Afternoon':'Evening'},
        </div>
        <div style={{fontFamily:"'DM Serif Display', serif",fontSize:36,color:'#f43f5e',lineHeight:1.1}}>Pamini ✨</div>
        <div style={{color:'rgba(255,255,255,.4)',fontSize:13,marginTop:8}}>
          {new Date().toLocaleDateString('en-CA',{weekday:'long',month:'long',day:'numeric'})}
        </div>
      </div>

      {/* Day badge */}
      <div style={{textAlign:'center',marginBottom:20}}>
        <span style={{background:dayInfo.color,color:'#fff',fontWeight:600,fontSize:14,padding:'6px 20px',borderRadius:20,letterSpacing:.5}}>
          {dayInfo.label}
        </span>
      </div>

      {/* Rings row */}
      <div style={{display:'flex',justifyContent:'space-around',background:'rgba(255,255,255,.04)',borderRadius:18,padding:'20px 10px',marginBottom:16}}>
        <div style={{textAlign:'center'}}>
          <Ring pct={pct} color='#f43f5e' label={`${goalCal}`} sub="cal target"/>
          <div style={{color:'rgba(255,255,255,.4)',fontSize:11,marginTop:6}}>Calories</div>
        </div>
        <div style={{textAlign:'center'}}>
          <Ring pct={(macros.protein/130)*100} color='#a78bfa' label={`${macros.protein}g`} sub="target"/>
          <div style={{color:'rgba(255,255,255,.4)',fontSize:11,marginTop:6}}>Protein</div>
        </div>
        <div style={{textAlign:'center'}}>
          <Ring pct={((startWeight-latest)/25)*100} color='#34d399' label={`${lost} lbs`} sub="lost"/>
          <div style={{color:'rgba(255,255,255,.4)',fontSize:11,marginTop:6}}>Progress</div>
        </div>
      </div>

      {/* Steps */}
      <div style={{background:'rgba(255,255,255,.04)',borderRadius:14,padding:16,marginBottom:12,display:'flex',alignItems:'center',gap:12}}>
        <div style={{background:'rgba(244,63,94,.15)',borderRadius:10,padding:10}}>
          <Icon d={icons.steps} size={22} stroke='#f43f5e'/>
        </div>
        <div>
          <div style={{color:'#fff',fontWeight:500,fontSize:14}}>10,000 Steps Daily</div>
          <div style={{color:'rgba(255,255,255,.4)',fontSize:12}}>No exceptions — every single day</div>
        </div>
        <div style={{marginLeft:'auto',color:'#f43f5e',fontSize:22}}>🚶‍♀️</div>
      </div>

      {/* Weekly schedule preview */}
      <div style={{background:'rgba(255,255,255,.04)',borderRadius:14,padding:16}}>
        <div style={{color:'rgba(255,255,255,.5)',fontSize:11,letterSpacing:1,textTransform:'uppercase',marginBottom:12}}>This Week</div>
        <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4}}>
          {Object.entries(SCHEDULE).map(([dow,s])=>{
            const isToday = new Date().getDay()===parseInt(dow);
            return (
              <div key={dow} style={{
                flex:'0 0 auto',textAlign:'center',padding:'8px 10px',borderRadius:10,
                background:isToday?s.color:'rgba(255,255,255,.05)',
                border:isToday?'none':'1px solid rgba(255,255,255,.06)',
                minWidth:44,
              }}>
                <div style={{color:isToday?'#fff':'rgba(255,255,255,.4)',fontSize:10,fontWeight:isToday?700:400}}>{s.day.slice(0,3).toUpperCase()}</div>
                <div style={{color:isToday?'#fff':'rgba(255,255,255,.3)',fontSize:9,marginTop:3,lineHeight:1.2}}>{s.label.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Workout Tab ───────────────────────────────────────────────────
const WorkoutTab = ({ dateKey, dayInfo }) => {
  const dow = new Date().getDay();
  const dayKey = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][dow];
  const workout = WORKOUTS[dayKey];
  const isOTFDay = ['monday','tuesday','wednesday','thursday','friday'].includes(dayKey);

  const otfInfo = {
    monday:    { class: 'OTF 2G — 60 min', note: 'Active recovery. No extra workout today.' },
    tuesday:   { class: 'OTF 2G — 60 min', note: 'Complete OTF first, then Push Finisher below.' },
    wednesday: { class: 'OTF Strength 50 Total', note: 'Back is covered. Add Bicep Pump below.' },
    thursday:  { class: 'OTF 2G — 60 min', note: 'Complete OTF first, then Leg Finisher below.' },
    friday:    { class: 'OTF Strength 50 Lower', note: 'Full lower body covered. No extra needed.' },
    saturday:  { class: null, note: 'No OTF today. Full session below.' },
    sunday:    { class: null, note: '20 min incline treadmill walk + step goal.' },
  };

  const otf = otfInfo[dayKey];

  return (
    <div>
      <div style={{fontFamily:"'DM Serif Display', serif",fontSize:24,color:'#fff',marginBottom:4}}>
        {dayInfo.label}
      </div>
      <div style={{color:'rgba(255,255,255,.4)',fontSize:13,marginBottom:20}}>
        {new Date().toLocaleDateString('en-CA',{weekday:'long',month:'long',day:'numeric'})}
      </div>

      {/* OTF block */}
      {otf && (
        <div style={{background:'linear-gradient(135deg,rgba(249,115,22,.15),rgba(249,115,22,.05))',border:'1px solid rgba(249,115,22,.2)',borderRadius:14,padding:16,marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
            <Icon d={icons.fire} size={18} stroke='#f97316' fill='rgba(249,115,22,.2)'/>
            <span style={{color:'#f97316',fontWeight:600,fontSize:14}}>Orange Theory Fitness</span>
          </div>
          {otf.class && <div style={{color:'#fff',fontWeight:500,fontSize:15,marginBottom:4}}>{otf.class}</div>}
          <div style={{color:'rgba(255,255,255,.5)',fontSize:13}}>{otf.note}</div>
        </div>
      )}

      {/* Cardio day (Sunday) */}
      {dayKey === 'sunday' && (
        <div style={{background:'rgba(192,132,252,.08)',border:'1px solid rgba(192,132,252,.2)',borderRadius:14,padding:16,marginBottom:16}}>
          <div style={{color:'#c084fc',fontWeight:600,fontSize:14,marginBottom:8}}>Cardio Session</div>
          <div style={{color:'#fff',fontSize:14}}>Treadmill Incline Walk — 20 min</div>
          <div style={{display:'flex',gap:12,marginTop:10}}>
            {[['Incline','8.0'],['Speed','2.0 mph'],['Duration','20 min']].map(([k,v])=>(
              <div key={k} style={{background:'rgba(255,255,255,.06)',borderRadius:8,padding:'8px 12px',textAlign:'center'}}>
                <div style={{color:'rgba(255,255,255,.4)',fontSize:10}}>{k}</div>
                <div style={{color:'#c084fc',fontWeight:600,fontSize:14}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Steps reminder */}
      <div style={{background:'rgba(52,211,153,.07)',border:'1px solid rgba(52,211,153,.15)',borderRadius:12,padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:16}}>🚶‍♀️</span>
        <span style={{color:'#34d399',fontSize:13,fontWeight:500}}>10,000 steps today — every day, no exceptions</span>
      </div>

      {/* Workout exercises */}
      {workout ? (
        <>
          <div style={{background:'rgba(244,63,94,.08)',border:'1px solid rgba(244,63,94,.15)',borderRadius:14,padding:14,marginBottom:14}}>
            <div style={{color:'#f43f5e',fontWeight:700,fontSize:16}}>{workout.label}</div>
            <div style={{color:'rgba(255,255,255,.5)',fontSize:13,marginTop:2}}>{workout.subtitle} · {workout.duration}</div>
            <div style={{color:'rgba(255,255,255,.35)',fontSize:12,marginTop:2}}>{workout.muscles}</div>
          </div>
          {workout.exercises.map(ex => <ExCard key={ex.id} ex={ex} dateKey={dateKey}/>)}
        </>
      ) : (
        <div style={{textAlign:'center',padding:'30px 0',color:'rgba(255,255,255,.3)',fontSize:14}}>
          {dayKey === 'monday' ? 'Active recovery day — let your body rest 💆‍♀️' : 
           dayKey === 'friday' ? 'Strength 50 Lower is your session today 💪' :
           'Rest and recover — you earned it 🌙'}
        </div>
      )}
    </div>
  );
};

// ── Food Tab ──────────────────────────────────────────────────────
const FoodTab = ({ dateKey, dayInfo }) => {
  const dow = new Date().getDay();
  const isRestDay = dow === 0 || dow === 6;
  const plan = MEALS[isRestDay ? 'rest' : 'workout'];
  const storageKey = `food_${dateKey}`;
  const [checked, setChecked] = useState(() => load(storageKey, {}));

  const toggle = (id) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated); store(storageKey, updated);
  };

  const allItems = plan.meals.flatMap(m => m.items);
  const checkedItems = allItems.filter(i => checked[i.id]);
  const calEaten = checkedItems.reduce((a,i)=>a+i.cal,0);
  const pEaten   = checkedItems.reduce((a,i)=>a+i.p,0);
  const cEaten   = checkedItems.reduce((a,i)=>a+i.c,0);
  const fEaten   = checkedItems.reduce((a,i)=>a+i.f,0);
  const goalCal  = isRestDay ? 1490 : 1650;

  return (
    <div>
      <div style={{fontFamily:"'DM Serif Display', serif",fontSize:22,color:'#fff',marginBottom:4}}>
        {isRestDay ? 'Rest Day Meals' : 'Workout Day Meals'}
      </div>
      <div style={{color:'rgba(255,255,255,.4)',fontSize:13,marginBottom:16}}>{plan.macros} · {goalCal} cal target</div>

      {/* Macro summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:20}}>
        {[
          ['Cals', calEaten, goalCal, '#f43f5e'],
          ['Protein', `${pEaten}g`, `${plan.macros.split('/')[1].trim().replace('P','')}g`, '#a78bfa'],
          ['Carbs',   `${cEaten}g`, `${plan.macros.split('/')[0].trim().replace('C','')}g`, '#fbbf24'],
          ['Fat',     `${fEaten}g`, `${plan.macros.split('/')[2].trim().replace('F','')}g`, '#34d399'],
        ].map(([label,val,goal,color])=>(
          <div key={label} style={{background:'rgba(255,255,255,.04)',borderRadius:12,padding:'12px 8px',textAlign:'center'}}>
            <div style={{color,fontWeight:700,fontSize:16}}>{val}</div>
            <div style={{color:'rgba(255,255,255,.3)',fontSize:10,marginTop:2}}>/ {goal}</div>
            <div style={{color:'rgba(255,255,255,.4)',fontSize:10,marginTop:2}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Meals */}
      {plan.meals.map(meal => (
        <div key={meal.id} style={{marginBottom:16}}>
          <div style={{color:'rgba(255,255,255,.5)',fontSize:11,letterSpacing:1,textTransform:'uppercase',marginBottom:8,paddingLeft:4}}>
            {meal.label}
          </div>
          <div style={{background:'rgba(255,255,255,.04)',borderRadius:14,padding:'4px 14px'}}>
            {meal.items.map(item => (
              <div key={item.id} style={{borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                <Checkbox
                  checked={!!checked[item.id]}
                  onChange={()=>toggle(item.id)}
                  label={item.text}
                  sub={item.cal ? `${item.cal} cal · ${item.p}g P · ${item.c}g C · ${item.f}g F` : null}
                  accent='#f43f5e'
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Restaurant protocol */}
      <div style={{background:'rgba(251,191,36,.07)',border:'1px solid rgba(251,191,36,.15)',borderRadius:14,padding:14,marginTop:8}}>
        <div style={{color:'#fbbf24',fontWeight:600,fontSize:13,marginBottom:6}}>🍽 Restaurant Protocol</div>
        <div style={{color:'rgba(255,255,255,.5)',fontSize:12,lineHeight:1.6}}>
          Max 1x per week. Only restaurants with calorie counts on menu.<br/>
          Meal out: <strong style={{color:'#fff'}}>600 cal or less.</strong><br/>
          <span style={{color:'rgba(255,0,0,.6)'}}>No pizza, fried foods, or dessert.</span><br/>
          Good picks: Longhorn, Sushi, Five Guys, Cheesecake Factory (steak/real food).
        </div>
      </div>
    </div>
  );
};

// ── Supplements Tab ───────────────────────────────────────────────
const SuppTab = ({ dateKey, dayInfo }) => {
  const dow = new Date().getDay();
  const isTrainingDay = [1,2,3,4,5].includes(dow); // Mon–Fri has OTF
  const hasHomeWorkout = [2,3,4,6].includes(dow);   // Tue,Wed,Thu,Sat has supplemental
  const showPreWorkout = isTrainingDay || hasHomeWorkout;

  const storageKey = `supps_${dateKey}`;
  const [checked, setChecked] = useState(() => load(storageKey, {}));
  const toggle = (id) => { const u={...checked,[id]:!checked[id]}; setChecked(u); store(storageKey,u); };

  const allSupps = [
    ...SUPPLEMENTS.morning,
    ...(showPreWorkout ? SUPPLEMENTS.preworkout : []),
    ...SUPPLEMENTS.night,
  ];
  const total = allSupps.length;
  const done  = allSupps.filter(s=>checked[s.id]).length;

  return (
    <div>
      <div style={{fontFamily:"'DM Serif Display', serif",fontSize:22,color:'#fff',marginBottom:4}}>Supplements</div>
      <div style={{color:'rgba(255,255,255,.4)',fontSize:13,marginBottom:20}}>
        {done}/{total} taken today
      </div>

      {/* Progress */}
      <div style={{background:'rgba(255,255,255,.04)',borderRadius:12,padding:'6px 14px',marginBottom:20}}>
        <div style={{height:6,background:'rgba(255,255,255,.08)',borderRadius:3,overflow:'hidden'}}>
          <div style={{height:'100%',background:'#f43f5e',borderRadius:3,width:`${(done/total)*100}%`,transition:'width .4s'}}/>
        </div>
        <div style={{color:'rgba(255,255,255,.3)',fontSize:11,marginTop:6,textAlign:'right'}}>{Math.round((done/total)*100)}% complete</div>
      </div>

      {/* Morning */}
      <div style={{marginBottom:16}}>
        <div style={{color:'rgba(255,255,255,.5)',fontSize:11,letterSpacing:1,textTransform:'uppercase',marginBottom:8,paddingLeft:4}}>
          ☀️ Morning — with first meal
        </div>
        <div style={{background:'rgba(255,255,255,.04)',borderRadius:14,padding:'4px 14px'}}>
          {SUPPLEMENTS.morning.map(s=>(
            <div key={s.id} style={{borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <Checkbox checked={!!checked[s.id]} onChange={()=>toggle(s.id)} label={s.name} sub={`${s.dose} · ${s.note}`} accent='#fbbf24'/>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-workout */}
      {showPreWorkout && (
        <div style={{marginBottom:16}}>
          <div style={{color:'rgba(255,255,255,.5)',fontSize:11,letterSpacing:1,textTransform:'uppercase',marginBottom:8,paddingLeft:4}}>
            ⚡ Pre-Workout — 30 min before training
          </div>
          <div style={{background:'rgba(255,255,255,.04)',borderRadius:14,padding:'4px 14px'}}>
            {SUPPLEMENTS.preworkout.map(s=>(
              <div key={s.id} style={{borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                <Checkbox checked={!!checked[s.id]} onChange={()=>toggle(s.id)} label={s.name} sub={`${s.dose} · ${s.note}`} accent='#f97316'/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Night */}
      <div style={{marginBottom:16}}>
        <div style={{color:'rgba(255,255,255,.5)',fontSize:11,letterSpacing:1,textTransform:'uppercase',marginBottom:8,paddingLeft:4}}>
          🌙 Night — with last meal
        </div>
        <div style={{background:'rgba(255,255,255,.04)',borderRadius:14,padding:'4px 14px'}}>
          {SUPPLEMENTS.night.map(s=>(
            <div key={s.id} style={{borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <Checkbox checked={!!checked[s.id]} onChange={()=>toggle(s.id)} label={s.name} sub={`${s.dose} · ${s.note}`} accent='#c084fc'/>
            </div>
          ))}
        </div>
      </div>

      {/* Supplement links */}
      <div style={{background:'rgba(255,255,255,.03)',borderRadius:14,padding:14,marginTop:4}}>
        <div style={{color:'rgba(255,255,255,.4)',fontSize:11,letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>Amazon Links</div>
        {[
          ['Multivitamin (Women\'s)', 'https://www.amazon.com/Nutricost-Multivitamin-Women-120-Capsules/dp/B06WP6KR4X/'],
          ['L-Carnitine Tartrate',   'https://www.amazon.com/Nutricost-L-Carnitine-Tartrate-500mg-Capsules/dp/B06Y1BTLGK/'],
          ['Creatine Monohydrate',   'https://www.amazon.com/Nutricost-Creatine-Monohydrate-500g-Unflavored/dp/B07ZZB4S3H/'],
          ['Omega-3 Fish Oil',       'https://www.amazon.com/Nutricost-Fish-Oil-Omega-3-Softgels/dp/B01N7YUC6I/'],
          ['Vitamin D3 + K2',        'https://www.amazon.com/Nutricost-Vitamin-100mcg-5000-Softgels/dp/B07K3VFVJC/'],
          ['Vitamin C',              'https://www.amazon.com/Nutricost-Vitamin-Rose-1025mg-Capsules/dp/B074GCB1ND/'],
          ['Magnesium Glycinate',    'https://www.amazon.com/Nutricost-Magnesium-Glycinate-400mg-Capsules/dp/B07FS2WV77/'],
          ['Magnesium Calm Powder',  'https://www.amazon.com/Natural-Vitality-Anti-Stress-Supplement-Raspberry/dp/B00BPUY3W0/'],
        ].map(([name,url])=>(
          <a key={name} href={url} target="_blank" rel="noreferrer"
            style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)',textDecoration:'none'}}>
            <span style={{color:'rgba(255,255,255,.7)',fontSize:13}}>{name}</span>
            <span style={{color:'#f43f5e',fontSize:12}}>Amazon ↗</span>
          </a>
        ))}
      </div>
    </div>
  );
};

// ── Progress Tab ──────────────────────────────────────────────────
const ProgressTab = () => {
  const [weights, setWeights] = useState(() => load('weights', []));
  const [input, setInput] = useState('');
  const [note, setNote] = useState('');

  const addWeight = () => {
    const w = parseFloat(input);
    if (!w || w < 80 || w > 300) return;
    const entry = { date: today(), w, note, ts: Date.now() };
    const updated = [...weights.filter(e=>e.date!==today()), entry].sort((a,b)=>a.ts-b.ts);
    setWeights(updated); store('weights', updated);
    setInput(''); setNote('');
  };

  const startW = PROFILE.weight;
  const goalW  = 131;
  const latest = weights.length ? weights[weights.length-1].w : startW;
  const lost   = (startW - latest).toFixed(1);
  const toGo   = (latest - goalW).toFixed(1);
  const pct    = Math.max(0,Math.min(100,((startW-latest)/(startW-goalW))*100));

  // Mini sparkline
  const pts = [{ w: startW, date: 'Start' }, ...weights].slice(-12);
  const wMin = Math.min(...pts.map(p=>p.w)) - 2;
  const wMax = Math.max(...pts.map(p=>p.w)) + 2;
  const wRange = wMax - wMin || 1;
  const W = 280, H = 80;

  return (
    <div>
      <div style={{fontFamily:"'DM Serif Display', serif",fontSize:22,color:'#fff',marginBottom:4}}>Progress</div>
      <div style={{color:'rgba(255,255,255,.4)',fontSize:13,marginBottom:20}}>Weekly weigh-in · Sunday mornings</div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:20}}>
        {[
          ['Start', `${startW} lbs`, '#fff'],
          ['Current', `${latest} lbs`, '#f43f5e'],
          ['Goal', `${goalW} lbs`, '#34d399'],
        ].map(([l,v,c])=>(
          <div key={l} style={{background:'rgba(255,255,255,.04)',borderRadius:12,padding:14,textAlign:'center'}}>
            <div style={{color:c,fontWeight:700,fontSize:18}}>{v}</div>
            <div style={{color:'rgba(255,255,255,.4)',fontSize:11,marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{background:'rgba(255,255,255,.04)',borderRadius:14,padding:16,marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <span style={{color:'#fff',fontWeight:600,fontSize:15}}>🔥 {lost} lbs lost</span>
          <span style={{color:'rgba(255,255,255,.4)',fontSize:13}}>{toGo} lbs to go</span>
        </div>
        <div style={{height:10,background:'rgba(255,255,255,.08)',borderRadius:5,overflow:'hidden'}}>
          <div style={{height:'100%',background:'linear-gradient(90deg,#f43f5e,#f97316)',borderRadius:5,width:`${pct}%`,transition:'width .5s'}}/>
        </div>
        <div style={{color:'rgba(255,255,255,.3)',fontSize:11,marginTop:6,textAlign:'right'}}>{pct.toFixed(1)}% of goal reached</div>
      </div>

      {/* Sparkline */}
      {pts.length > 1 && (
        <div style={{background:'rgba(255,255,255,.04)',borderRadius:14,padding:16,marginBottom:16,overflowX:'auto'}}>
          <div style={{color:'rgba(255,255,255,.4)',fontSize:11,letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>Weight Chart</div>
          <svg width={W} height={H} style={{display:'block',overflow:'visible'}}>
            {pts.map((p,i)=>{
              const x = (i/(pts.length-1))*W;
              const y = H - ((p.w-wMin)/wRange)*H;
              return i===0?null:(
                <line key={i}
                  x1={(((i-1)/(pts.length-1))*W)} y1={H-((pts[i-1].w-wMin)/wRange)*H}
                  x2={x} y2={y}
                  stroke='#f43f5e' strokeWidth={2} strokeLinecap='round'/>
              );
            })}
            {pts.map((p,i)=>{
              const x = (i/(pts.length-1))*W;
              const y = H - ((p.w-wMin)/wRange)*H;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={4} fill='#f43f5e'/>
                  <text x={x} y={y-8} fill='rgba(255,255,255,.6)' fontSize={9} textAnchor='middle'>{p.w}</text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Log weight */}
      <div style={{background:'rgba(255,255,255,.04)',borderRadius:14,padding:16,marginBottom:16}}>
        <div style={{color:'rgba(255,255,255,.5)',fontSize:11,letterSpacing:1,textTransform:'uppercase',marginBottom:12}}>Log This Week's Weight</div>
        <div style={{display:'flex',gap:8,marginBottom:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Weight in lbs" type="number"
            style={{flex:1,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:14,outline:'none'}}/>
          <button onClick={addWeight} style={{background:'#f43f5e',border:'none',borderRadius:8,padding:'10px 16px',color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer'}}>
            Save
          </button>
        </div>
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Note (optional)" 
          style={{width:'100%',boxSizing:'border-box',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',borderRadius:8,padding:'8px 12px',color:'#fff',fontSize:13,outline:'none'}}/>
      </div>

      {/* History */}
      {weights.length > 0 && (
        <div style={{background:'rgba(255,255,255,.04)',borderRadius:14,padding:16}}>
          <div style={{color:'rgba(255,255,255,.4)',fontSize:11,letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>History</div>
          {[...weights].reverse().map((e,i)=>{
            const prev = weights[weights.length-1-i-1];
            const delta = prev ? (e.w - prev.w).toFixed(1) : null;
            return (
              <div key={e.ts} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                <div>
                  <div style={{color:'#fff',fontSize:14,fontWeight:500}}>{e.w} lbs</div>
                  <div style={{color:'rgba(255,255,255,.3)',fontSize:12}}>{e.date}{e.note?' · '+e.note:''}</div>
                </div>
                {delta && (
                  <span style={{color:parseFloat(delta)<0?'#34d399':'#f43f5e',fontSize:13,fontWeight:600}}>
                    {parseFloat(delta)<0?'▼':'▲'} {Math.abs(delta)} lbs
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'home',     icon: icons.home,    label: 'Home' },
  { id: 'workout',  icon: icons.dumbbell,label: 'Workout' },
  { id: 'food',     icon: icons.food,    label: 'Food' },
  { id: 'supps',    icon: icons.pill,    label: 'Supps' },
  { id: 'progress', icon: icons.chart,   label: 'Progress' },
];

export default function App() {
  const [tab, setTab] = useState('home');
  const dateKey = today();
  const dow = new Date().getDay();
  const dayInfo = SCHEDULE[dow];

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: '#0d0d0d', position: 'relative', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Content */}
      <div style={{ padding: '52px 18px 90px', overflowY: 'auto' }}>
        {tab === 'home'     && <HomeTab     dateKey={dateKey} dayInfo={dayInfo}/>}
        {tab === 'workout'  && <WorkoutTab  dateKey={dateKey} dayInfo={dayInfo}/>}
        {tab === 'food'     && <FoodTab     dateKey={dateKey} dayInfo={dayInfo}/>}
        {tab === 'supps'    && <SuppTab     dateKey={dateKey} dayInfo={dayInfo}/>}
        {tab === 'progress' && <ProgressTab/>}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: 'rgba(13,13,13,.96)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,.06)',
        display: 'flex', padding: '8px 0 max(8px,env(safe-area-inset-bottom))', zIndex: 100,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: tab === t.id ? 'rgba(244,63,94,.15)' : 'transparent',
              transition: 'background .2s',
            }}>
              <Icon d={t.icon} size={20} stroke={tab === t.id ? '#f43f5e' : 'rgba(255,255,255,.3)'} strokeWidth={tab===t.id?2:1.6}/>
            </div>
            <span style={{ fontSize: 10, color: tab === t.id ? '#f43f5e' : 'rgba(255,255,255,.3)', fontWeight: tab===t.id?600:400 }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
