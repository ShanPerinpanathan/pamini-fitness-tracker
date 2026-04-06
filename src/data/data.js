import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const PROFILE = {
  name: "Pamini",
  height: "5'6\"",
  startWeight: 156,
  goalWeight: 131,
  goalBF: 20,
  currentBF: 32,
  calorieGoal: { workout: 1650, rest: 1490 },
  macros: {
    workout: { carbs: 130, protein: 130, fat: 50 },
    rest:    { carbs: 90,  protein: 130, fat: 50  },
  },
  timeline: "6 months",
  weeklyGoal: "1–2 lbs/week",
};

export const SCHEDULE = {
  0: { label: "Cardio + Steps",        type: "cardio",   color: "#a78bfa", otf: null,                        note: "20 min incline walk + 10K steps" },
  1: { label: "OTF 2G 60 min",         type: "active",   color: "#f97316", otf: "2G — 60 min",              note: "Active recovery. No extra workout." },
  2: { label: "OTF 2G + Push",         type: "workout",  color: "#e11d48", otf: "2G — 60 min",              note: "Push finisher after OTF." },
  3: { label: "OTF Strength + Biceps", type: "workout",  color: "#e11d48", otf: "Strength 50 Total",        note: "Back covered. Add bicep pump." },
  4: { label: "OTF 2G + Legs",         type: "workout",  color: "#e11d48", otf: "2G — 60 min",              note: "Leg finisher after OTF." },
  5: { label: "OTF Strength Lower",    type: "active",   color: "#f97316", otf: "Strength 50 Lower",        note: "Full lower body. No extra needed." },
  6: { label: "Arms & Shoulders",      type: "workout",  color: "#e11d48", otf: null,                        note: "Full session at home." },
};

export const WORKOUTS = {
  2: {
    label: "Push Finisher",
    subtitle: "After OTF 2G · 20–25 min",
    muscles: "Chest · Shoulders · Triceps",
    exercises: [
      { id:"db-bp",   name:"Dumbbell Bench Press",          sets:3, reps:"12",      rest:"60s", muscles:"Chest, Shoulders, Triceps", notes:"Flat bench, full ROM",             img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-bench-press.jpg",            url:"https://liftmanual.com/dumbbell-bench-press/" },
      { id:"db-ibp",  name:"Dumbbell Incline Bench Press",  sets:3, reps:"12",      rest:"60s", muscles:"Upper Chest, Shoulders",    notes:"Incline bench, upper chest focus", img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-incline-bench-press.jpg",    url:"https://liftmanual.com/dumbbell-incline-bench-press/" },
      { id:"db-ssp",  name:"Seated Shoulder Press",         sets:3, reps:"12",      rest:"60s", muscles:"Deltoids",                  notes:"Controlled overhead press",        img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-seated-shoulder-press.jpg", url:"https://liftmanual.com/dumbbell-seated-shoulder-press/" },
      { id:"db-lr",   name:"Dumbbell Lateral Raise",        sets:3, reps:"15",      rest:"45s", muscles:"Medial Deltoid",            notes:"Lead with elbows, control down",   img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-lateral-raise.jpg",         url:"https://liftmanual.com/dumbbell-lateral-raise/" },
      { id:"db-lte",  name:"Lying Triceps Extension",       sets:3, reps:"12",      rest:"45s", muscles:"Triceps",                   notes:"Elbows in, full stretch",          img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-lying-triceps-extension.jpg",url:"https://liftmanual.com/dumbbell-lying-triceps-extension/" },
    ],
  },
  3: {
    label: "Bicep Pump",
    subtitle: "After OTF Strength 50 · 15–20 min",
    muscles: "Biceps · Forearms",
    exercises: [
      { id:"db-bc",   name:"Dumbbell Biceps Curl",          sets:4, reps:"12",      rest:"45s", muscles:"Biceps",           notes:"Full extension, squeeze top",     img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-biceps-curl.jpg",          url:"https://liftmanual.com/dumbbell-biceps-curl/" },
      { id:"db-hc",   name:"Dumbbell Hammer Curl",          sets:3, reps:"12",      rest:"45s", muscles:"Brachialis",       notes:"Neutral grip, controlled tempo",  img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-hammer-curl.jpg",         url:"https://liftmanual.com/dumbbell-hammer-curl/" },
      { id:"db-cc",   name:"Concentration Curl",            sets:3, reps:"10 each", rest:"30s", muscles:"Biceps Peak",      notes:"Elbow on inner thigh",            img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-concentration-curl.jpg",  url:"https://liftmanual.com/dumbbell-concentration-curl/" },
      { id:"db-ic",   name:"Incline Curl",                  sets:3, reps:"10",      rest:"45s", muscles:"Long Head Bicep",  notes:"Incline bench, long head stretch",img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-incline-curl.jpg",         url:"https://liftmanual.com/dumbbell-incline-curl/" },
    ],
  },
  4: {
    label: "Leg Finisher",
    subtitle: "After OTF 2G · 20–25 min",
    muscles: "Quads · Hamstrings · Glutes · Calves",
    exercises: [
      { id:"le",      name:"Leg Extension (Machine)",       sets:4, reps:"15",      rest:"60s", muscles:"Quadriceps",       notes:"Full extension, squeeze quads",   img:"https://liftmanual.com/wp-content/uploads/2023/04/lever-leg-extension.jpg",          url:"https://liftmanual.com/lever-leg-extension/" },
      { id:"db-rdl",  name:"Dumbbell Romanian Deadlift",    sets:4, reps:"12",      rest:"60s", muscles:"Hamstrings, Glutes",notes:"Hinge at hips, soft knees",       img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-romanian-deadlift.jpg",   url:"https://liftmanual.com/dumbbell-romanian-deadlift/" },
      { id:"db-bss",  name:"Bulgarian Split Squat",         sets:3, reps:"10 each", rest:"60s", muscles:"Glutes, Quads",    notes:"Rear foot elevated",              img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-bulgarian-split-squat.jpg",url:"https://liftmanual.com/dumbbell-bulgarian-split-squat/" },
      { id:"db-ht",   name:"Dumbbell Hip Thrust",           sets:3, reps:"15",      rest:"45s", muscles:"Glutes",           notes:"Shoulders on bench, drive hips",  img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-hip-thrust.jpg",          url:"https://liftmanual.com/dumbbell-hip-thrust/" },
      { id:"db-cr",   name:"Standing Calf Raise",           sets:3, reps:"20",      rest:"30s", muscles:"Calves",           notes:"Full range, pause at top",        img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-standing-calf-raise.jpg", url:"https://liftmanual.com/dumbbell-standing-calf-raise/" },
    ],
  },
  6: {
    label: "Arms & Shoulders",
    subtitle: "Full home session · 35–40 min",
    muscles: "Shoulders · Biceps · Triceps",
    exercises: [
      { id:"s-ssp",   name:"Seated Shoulder Press",         sets:4, reps:"12",      rest:"60s", muscles:"Deltoids",         notes:"Full range overhead",             img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-seated-shoulder-press.jpg",url:"https://liftmanual.com/dumbbell-seated-shoulder-press/" },
      { id:"s-lr",    name:"Lateral Raise",                 sets:3, reps:"15",      rest:"45s", muscles:"Medial Deltoid",   notes:"Control on the way down",         img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-lateral-raise.jpg",        url:"https://liftmanual.com/dumbbell-lateral-raise/" },
      { id:"s-rdf",   name:"Rear Delt Fly",                 sets:3, reps:"15",      rest:"45s", muscles:"Rear Deltoid",     notes:"Hinged forward, elbows bent",     img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.jpg",        url:"https://liftmanual.com/dumbbell-rear-delt-fly/" },
      { id:"s-bc",    name:"Biceps Curl",                   sets:3, reps:"12",      rest:"45s", muscles:"Biceps",           notes:"Supinated grip, full squeeze",    img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-biceps-curl.jpg",         url:"https://liftmanual.com/dumbbell-biceps-curl/" },
      { id:"s-hc",    name:"Hammer Curl",                   sets:3, reps:"12",      rest:"45s", muscles:"Brachialis",       notes:"Neutral grip",                    img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-hammer-curl.jpg",          url:"https://liftmanual.com/dumbbell-hammer-curl/" },
      { id:"s-lte",   name:"Lying Triceps Extension",       sets:3, reps:"12",      rest:"45s", muscles:"Triceps",          notes:"Long head stretch",               img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-lying-triceps-extension.jpg",url:"https://liftmanual.com/dumbbell-lying-triceps-extension/" },
      { id:"s-kb",    name:"Dumbbell Kickback",             sets:3, reps:"15 each", rest:"30s", muscles:"Triceps",          notes:"Upper arm parallel to floor",     img:"https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-kickback.jpg",            url:"https://liftmanual.com/dumbbell-kickback/" },
    ],
  },
};

export const MEALS = {
  workout: {
    calories: 1650,
    macros: { c:130, p:130, f:50 },
    groups: [
      { id:"wk-b", label:"Breakfast", icon:"🌅", items:[
        { id:"wk-b1", text:"3 whole Eggs",                           cal:210, p:18, c:2,  f:14 },
        { id:"wk-b2", text:"30g Quaker Whole Grain Oats (dry)",      cal:113, p:4,  c:20, f:2  },
        { id:"wk-b3", text:"Veggies: mushrooms, spinach, peppers",   cal:20,  p:1,  c:3,  f:0  },
      ]},
      { id:"wk-l", label:"Lunch", icon:"☀️", items:[
        { id:"wk-l1", text:"130g Ground Beef 93% / steak / salmon",  cal:217, p:27, c:0,  f:11 },
        { id:"wk-l2", text:"160g White Rice (cooked)",               cal:208, p:4,  c:46, f:0  },
        { id:"wk-l3", text:"1–2 Cups Green Vegetables",              cal:30,  p:2,  c:6,  f:0  },
      ]},
      { id:"wk-d", label:"Dinner", icon:"🌙", items:[
        { id:"wk-d1", text:"150g Chicken Breast",                    cal:165, p:31, c:0,  f:3  },
        { id:"wk-d2", text:"250g Sweet Potatoes",                    cal:215, p:4,  c:50, f:0  },
        { id:"wk-d3", text:"½ Avocado",                              cal:120, p:1,  c:6,  f:11 },
        { id:"wk-d4", text:"1–2 Cups Green Vegetables",              cal:30,  p:2,  c:6,  f:0  },
      ]},
      { id:"wk-s", label:"Late Night Snack", icon:"🌙", items:[
        { id:"wk-s1", text:"250g Fage 2% Greek Yogurt",              cal:163, p:23, c:9,  f:4  },
        { id:"wk-s2", text:"300g Strawberries / 400g Blackberries",  cal:96,  p:2,  c:23, f:1  },
      ]},
    ],
  },
  rest: {
    calories: 1490,
    macros: { c:90, p:130, f:50 },
    groups: [
      { id:"rs-b", label:"Breakfast", icon:"🌅", items:[
        { id:"rs-b1", text:"3 whole Eggs",                           cal:210, p:18, c:2,  f:14 },
        { id:"rs-b2", text:"30g Quaker Whole Grain Oats (dry)",      cal:113, p:4,  c:20, f:2  },
        { id:"rs-b3", text:"Veggies: mushrooms, spinach, peppers",   cal:20,  p:1,  c:3,  f:0  },
      ]},
      { id:"rs-l", label:"Lunch", icon:"☀️", items:[
        { id:"rs-l1", text:"130g Ground Beef 93% / steak / salmon",  cal:217, p:27, c:0,  f:11 },
        { id:"rs-l2", text:"1–2 Cups Green Vegetables",              cal:30,  p:2,  c:6,  f:0  },
      ]},
      { id:"rs-d", label:"Dinner", icon:"🌙", items:[
        { id:"rs-d1", text:"150g Chicken Breast",                    cal:165, p:31, c:0,  f:3  },
        { id:"rs-d2", text:"280g Sweet Potatoes",                    cal:241, p:4,  c:56, f:0  },
        { id:"rs-d3", text:"½ Avocado",                              cal:120, p:1,  c:6,  f:11 },
        { id:"rs-d4", text:"1–2 Cups Green Vegetables",              cal:30,  p:2,  c:6,  f:0  },
      ]},
      { id:"rs-s", label:"Late Night Snack", icon:"🌙", items:[
        { id:"rs-s1", text:"250g Fage 2% Greek Yogurt",              cal:163, p:23, c:9,  f:4  },
        { id:"rs-s2", text:"300g Strawberries / 400g Blackberries",  cal:96,  p:2,  c:23, f:1  },
      ]},
    ],
  },
};

export const SUPPLEMENTS = {
  morning: [
    { id:"sm1", name:"Multivitamin (Women's)",   dose:"1 serving", note:"With first meal" },
    { id:"sm2", name:"Vitamin D3",               dose:"5,000 IU",  note:"With first meal" },
    { id:"sm3", name:"Vitamin C",                dose:"1,000 mg",  note:"With first meal" },
    { id:"sm4", name:"Creatine Monohydrate",     dose:"5g",        note:"Every day" },
    { id:"sm5", name:"Omega-3 Fish Oil",         dose:"2,000 mg",  note:"With first meal" },
  ],
  preworkout: [
    { id:"sp1", name:"L-Carnitine Tartrate",     dose:"2,000 mg",  note:"30 min before training" },
  ],
  night: [
    { id:"sn1", name:"Magnesium Glycinate",      dose:"400 mg",    note:"With last meal" },
    { id:"sn2", name:"Vitamin D3",               dose:"5,000 IU",  note:"With last meal" },
    { id:"sn3", name:"Magnesium Calm Powder",    dose:"1 scoop",   note:"Before bed" },
  ],
};

export const BONUS_ACTIVITIES = [
  { id:"ba1", label:"Extra 20 min walk",        cal:80  },
  { id:"ba2", label:"20 min yoga / stretching", cal:60  },
  { id:"ba3", label:"Extra 5,000 steps",        cal:175 },
  { id:"ba4", label:"Swimming — 30 min",        cal:200 },
  { id:"ba5", label:"Cycling — 30 min",         cal:220 },
  { id:"ba6", label:"Dancing — 30 min",         cal:165 },
  { id:"ba7", label:"Hiking — 1 hour",          cal:280 },
];

export const MEASUREMENTS_FIELDS = [
  { id:"weight",  label:"Weight",       unit:"lbs", icon:"⚖️"  },
  { id:"waist",   label:"Waist",        unit:"in",  icon:"📏"  },
  { id:"hips",    label:"Hips",         unit:"in",  icon:"📐"  },
  { id:"chest",   label:"Chest",        unit:"in",  icon:"💪"  },
  { id:"thighs",  label:"Thighs (L)",   unit:"in",  icon:"🦵"  },
  { id:"arms",    label:"Arms (L)",     unit:"in",  icon:"💪"  },
  { id:"bf",      label:"Body Fat",     unit:"%",   icon:"🔥"  },
];
