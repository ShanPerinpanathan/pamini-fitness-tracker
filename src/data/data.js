// data.js — All blueprint data for Pamini's tracker

export const PROFILE = {
  name: "Pamini",
  height: "5'6\"",
  weight: 156,
  goalWeight: 131,
  goalBF: 20,
  currentBF: 32,
  calories: { workout: 1650, rest: 1490 },
  macros: {
    workout: { carbs: 130, protein: 130, fat: 50, calories: 1490 },
    rest:    { carbs: 90,  protein: 130, fat: 50, calories: 1330 },
  },
  weeklyLossGoal: "1–2 lbs",
  timeline: "6 months",
};

export const SCHEDULE = {
  0: { day: "Sunday",    type: "cardio",   label: "Cardio Day",         color: "#c084fc" },
  1: { day: "Monday",    type: "active",   label: "OTF 2G 60 min",      color: "#f97316" },
  2: { day: "Tuesday",   type: "workout",  label: "OTF + Push",         color: "#f43f5e" },
  3: { day: "Wednesday", type: "workout",  label: "OTF Strength + Biceps", color: "#f43f5e" },
  4: { day: "Thursday",  type: "workout",  label: "OTF + Legs",         color: "#f43f5e" },
  5: { day: "Friday",    type: "active",   label: "OTF Strength Lower", color: "#f97316" },
  6: { day: "Saturday",  type: "workout",  label: "Arms & Shoulders",   color: "#f43f5e" },
};

export const WORKOUTS = {
  tuesday: {
    label: "Push Day Finisher",
    subtitle: "After OTF 2G 60 min",
    duration: "20–25 min",
    muscles: "Chest · Shoulders · Triceps",
    exercises: [
      {
        id: "db-bench-press",
        name: "Dumbbell Bench Press",
        sets: 3, reps: "12", rest: "60s",
        notes: "Flat bench, full range of motion",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-bench-press.jpg",
        url: "https://liftmanual.com/dumbbell-bench-press/",
        muscles: "Chest, Shoulders, Triceps",
      },
      {
        id: "db-incline-press",
        name: "Dumbbell Incline Bench Press",
        sets: 3, reps: "12", rest: "60s",
        notes: "Incline bench, upper chest focus",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-incline-bench-press.jpg",
        url: "https://liftmanual.com/dumbbell-incline-bench-press/",
        muscles: "Upper Chest, Shoulders",
      },
      {
        id: "db-shoulder-press",
        name: "Dumbbell Seated Shoulder Press",
        sets: 3, reps: "12", rest: "60s",
        notes: "Seated, controlled movement",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-seated-shoulder-press.jpg",
        url: "https://liftmanual.com/dumbbell-seated-shoulder-press/",
        muscles: "Deltoids",
      },
      {
        id: "db-lateral-raise",
        name: "Dumbbell Lateral Raise",
        sets: 3, reps: "15", rest: "45s",
        notes: "Control on the way down",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-lateral-raise.jpg",
        url: "https://liftmanual.com/dumbbell-lateral-raise/",
        muscles: "Medial Deltoid",
      },
      {
        id: "db-tricep-ext",
        name: "Dumbbell Lying Triceps Extension",
        sets: 3, reps: "12", rest: "45s",
        notes: "Elbows in, full stretch",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-lying-triceps-extension.jpg",
        url: "https://liftmanual.com/dumbbell-lying-triceps-extension/",
        muscles: "Triceps",
      },
    ],
  },

  wednesday: {
    label: "Bicep Pump",
    subtitle: "After OTF Strength 50 Total",
    duration: "15–20 min",
    muscles: "Biceps · Forearms",
    exercises: [
      {
        id: "db-bicep-curl",
        name: "Dumbbell Biceps Curl",
        sets: 4, reps: "12", rest: "45s",
        notes: "Full extension at bottom, squeeze at top",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-biceps-curl.jpg",
        url: "https://liftmanual.com/dumbbell-biceps-curl/",
        muscles: "Biceps",
      },
      {
        id: "db-hammer-curl",
        name: "Dumbbell Hammer Curl",
        sets: 3, reps: "12", rest: "45s",
        notes: "Neutral grip, controlled tempo",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-hammer-curl.jpg",
        url: "https://liftmanual.com/dumbbell-hammer-curl/",
        muscles: "Brachialis, Forearms",
      },
      {
        id: "db-concentration-curl",
        name: "Dumbbell Concentration Curl",
        sets: 3, reps: "10 each", rest: "30s",
        notes: "Elbow on inner thigh, peak contraction",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-concentration-curl.jpg",
        url: "https://liftmanual.com/dumbbell-concentration-curl/",
        muscles: "Biceps Peak",
      },
      {
        id: "db-incline-curl",
        name: "Dumbbell Incline Curl",
        sets: 3, reps: "10", rest: "45s",
        notes: "Incline bench, long head stretch",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-incline-curl.jpg",
        url: "https://liftmanual.com/dumbbell-incline-curl/",
        muscles: "Long Head Bicep",
      },
    ],
  },

  thursday: {
    label: "Leg Day Finisher",
    subtitle: "After OTF 2G 60 min",
    duration: "20–25 min",
    muscles: "Quads · Hamstrings · Glutes · Calves",
    exercises: [
      {
        id: "leg-extension",
        name: "Leg Extension (Machine)",
        sets: 4, reps: "15", rest: "60s",
        notes: "Full extension, squeeze quads at top",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/lever-leg-extension.jpg",
        url: "https://liftmanual.com/lever-leg-extension/",
        muscles: "Quadriceps",
      },
      {
        id: "db-rdl",
        name: "Dumbbell Romanian Deadlift",
        sets: 4, reps: "12", rest: "60s",
        notes: "Hinge at hips, soft knees, feel the stretch",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-romanian-deadlift.jpg",
        url: "https://liftmanual.com/dumbbell-romanian-deadlift/",
        muscles: "Hamstrings, Glutes",
      },
      {
        id: "db-bulgarian",
        name: "Dumbbell Bulgarian Split Squat",
        sets: 3, reps: "10 each", rest: "60s",
        notes: "Rear foot elevated, front knee tracks toes",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-bulgarian-split-squat.jpg",
        url: "https://liftmanual.com/dumbbell-bulgarian-split-squat/",
        muscles: "Glutes, Quads",
      },
      {
        id: "db-hip-thrust",
        name: "Dumbbell Hip Thrust",
        sets: 3, reps: "15", rest: "45s",
        notes: "Shoulders on bench, drive hips up, squeeze glutes",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-hip-thrust.jpg",
        url: "https://liftmanual.com/dumbbell-hip-thrust/",
        muscles: "Glutes",
      },
      {
        id: "db-calf-raise",
        name: "Dumbbell Standing Calf Raise",
        sets: 3, reps: "20", rest: "30s",
        notes: "Full range, pause at top",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-standing-calf-raise.jpg",
        url: "https://liftmanual.com/dumbbell-standing-calf-raise/",
        muscles: "Calves",
      },
    ],
  },

  saturday: {
    label: "Arms & Shoulders",
    subtitle: "Full session — no OTF today",
    duration: "35–40 min",
    muscles: "Shoulders · Biceps · Triceps",
    exercises: [
      {
        id: "sat-shoulder-press",
        name: "Dumbbell Seated Shoulder Press",
        sets: 4, reps: "12", rest: "60s",
        notes: "Seated, full range overhead",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-seated-shoulder-press.jpg",
        url: "https://liftmanual.com/dumbbell-seated-shoulder-press/",
        muscles: "Deltoids",
      },
      {
        id: "sat-lateral-raise",
        name: "Dumbbell Lateral Raise",
        sets: 3, reps: "15", rest: "45s",
        notes: "Slight forward lean, lead with elbows",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-lateral-raise.jpg",
        url: "https://liftmanual.com/dumbbell-lateral-raise/",
        muscles: "Medial Deltoid",
      },
      {
        id: "sat-rear-delt",
        name: "Dumbbell Rear Delt Fly",
        sets: 3, reps: "15", rest: "45s",
        notes: "Hinged forward, elbows slightly bent",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.jpg",
        url: "https://liftmanual.com/dumbbell-rear-delt-fly/",
        muscles: "Rear Deltoid, Posture",
      },
      {
        id: "sat-bicep-curl",
        name: "Dumbbell Biceps Curl",
        sets: 3, reps: "12", rest: "45s",
        notes: "Supinated grip, full squeeze",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-biceps-curl.jpg",
        url: "https://liftmanual.com/dumbbell-biceps-curl/",
        muscles: "Biceps",
      },
      {
        id: "sat-hammer",
        name: "Dumbbell Hammer Curl",
        sets: 3, reps: "12", rest: "45s",
        notes: "Neutral grip, brachialis focus",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-hammer-curl.jpg",
        url: "https://liftmanual.com/dumbbell-hammer-curl/",
        muscles: "Brachialis",
      },
      {
        id: "sat-tricep-ext",
        name: "Dumbbell Lying Triceps Extension",
        sets: 3, reps: "12", rest: "45s",
        notes: "Elbows pointed up, long head stretch",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-lying-triceps-extension.jpg",
        url: "https://liftmanual.com/dumbbell-lying-triceps-extension/",
        muscles: "Triceps Long Head",
      },
      {
        id: "sat-kickback",
        name: "Dumbbell Kickback",
        sets: 3, reps: "15 each", rest: "30s",
        notes: "Upper arm parallel to floor, full extension",
        img: "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-kickback.jpg",
        url: "https://liftmanual.com/dumbbell-kickback/",
        muscles: "Triceps",
      },
    ],
  },
};

export const MEALS = {
  workout: {
    label: "Workout Day",
    calories: 1650,
    macros: "130C / 130P / 50F",
    meals: [
      {
        id: "wk-breakfast",
        label: "Breakfast",
        items: [
          { id: "wk-b1", text: "3 whole Eggs", cal: 210, p: 18, c: 2, f: 14 },
          { id: "wk-b2", text: "30g Quaker Whole Grain Oats (dry)", cal: 113, p: 4, c: 20, f: 2 },
          { id: "wk-b3", text: "Optional: mushrooms, spinach, onions & peppers", cal: 20, p: 1, c: 3, f: 0 },
        ],
      },
      {
        id: "wk-lunch",
        label: "Lunch",
        items: [
          { id: "wk-l1", text: "130g Ground Beef 93% (or steak or salmon)", cal: 217, p: 27, c: 0, f: 11 },
          { id: "wk-l2", text: "160g White Rice (cooked)", cal: 208, p: 4, c: 46, f: 0 },
          { id: "wk-l3", text: "1–2 Cups Green Vegetables", cal: 30, p: 2, c: 6, f: 0 },
        ],
      },
      {
        id: "wk-dinner",
        label: "Dinner",
        items: [
          { id: "wk-d1", text: "150g Chicken Breast", cal: 165, p: 31, c: 0, f: 3 },
          { id: "wk-d2", text: "250g Sweet Potatoes", cal: 215, p: 4, c: 50, f: 0 },
          { id: "wk-d3", text: "½ Avocado", cal: 120, p: 1, c: 6, f: 11 },
          { id: "wk-d4", text: "1–2 Cups Green Vegetables", cal: 30, p: 2, c: 6, f: 0 },
        ],
      },
      {
        id: "wk-snack",
        label: "Late Night Snack",
        items: [
          { id: "wk-s1", text: "250g Fage 2% Greek Yogurt", cal: 163, p: 23, c: 9, f: 4 },
          { id: "wk-s2", text: "300g Strawberries (or 400g Blackberries)", cal: 96, p: 2, c: 23, f: 1 },
          { id: "wk-s3", text: "Stevia to taste", cal: 0, p: 0, c: 0, f: 0 },
        ],
      },
    ],
  },
  rest: {
    label: "Rest Day",
    calories: 1490,
    macros: "90C / 130P / 50F",
    meals: [
      {
        id: "rs-breakfast",
        label: "Breakfast",
        items: [
          { id: "rs-b1", text: "3 whole Eggs", cal: 210, p: 18, c: 2, f: 14 },
          { id: "rs-b2", text: "30g Quaker Whole Grain Oats (dry)", cal: 113, p: 4, c: 20, f: 2 },
          { id: "rs-b3", text: "Optional: mushrooms, spinach, onions & peppers", cal: 20, p: 1, c: 3, f: 0 },
        ],
      },
      {
        id: "rs-lunch",
        label: "Lunch",
        items: [
          { id: "rs-l1", text: "130g Ground Beef 93% (or steak or salmon)", cal: 217, p: 27, c: 0, f: 11 },
          { id: "rs-l2", text: "1–2 Cups Green Vegetables", cal: 30, p: 2, c: 6, f: 0 },
        ],
      },
      {
        id: "rs-dinner",
        label: "Dinner",
        items: [
          { id: "rs-d1", text: "150g Chicken Breast", cal: 165, p: 31, c: 0, f: 3 },
          { id: "rs-d2", text: "280g Sweet Potatoes", cal: 241, p: 4, c: 56, f: 0 },
          { id: "rs-d3", text: "½ Avocado", cal: 120, p: 1, c: 6, f: 11 },
          { id: "rs-d4", text: "1–2 Cups Green Vegetables", cal: 30, p: 2, c: 6, f: 0 },
        ],
      },
      {
        id: "rs-snack",
        label: "Late Night Snack",
        items: [
          { id: "rs-s1", text: "250g Fage 2% Nonfat Greek Yogurt", cal: 163, p: 23, c: 9, f: 4 },
          { id: "rs-s2", text: "300g Strawberries (or 400g Blackberries)", cal: 96, p: 2, c: 23, f: 1 },
          { id: "rs-s3", text: "Stevia to taste", cal: 0, p: 0, c: 0, f: 0 },
        ],
      },
    ],
  },
};

export const SUPPLEMENTS = {
  morning: [
    { id: "sup-multi",    name: "Multivitamin (Women's)",      dose: "1 serving",  note: "With first meal" },
    { id: "sup-vitd-am",  name: "Vitamin D3",                  dose: "5,000 IU",   note: "With first meal" },
    { id: "sup-vitc",     name: "Vitamin C",                   dose: "1,000 mg",   note: "With first meal" },
    { id: "sup-creatine", name: "Creatine Monohydrate",        dose: "5g",         note: "With first meal — every day" },
    { id: "sup-omega3",   name: "Omega-3 Fish Oil",            dose: "2,000 mg",   note: "With first meal" },
  ],
  preworkout: [
    { id: "sup-carnitine", name: "L-Carnitine Tartrate", dose: "2,000 mg", note: "30 min before OTF or home workout" },
  ],
  night: [
    { id: "sup-mag-gly",  name: "Magnesium Glycinate",   dose: "400 mg",   note: "With last meal" },
    { id: "sup-vitd-pm",  name: "Vitamin D3",            dose: "5,000 IU", note: "With last meal" },
    { id: "sup-mag-calm", name: "Magnesium Calm Powder", dose: "1 scoop",  note: "Before bed" },
  ],
};

export const CARDIO = {
  standard: { label: "Treadmill Incline Walk", incline: "8.0", speed: "2.0", duration: "20 min" },
  steps: { label: "10,000 Steps", note: "Every single day — no exceptions" },
};
