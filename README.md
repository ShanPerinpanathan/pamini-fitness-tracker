# Pamini's Blueprint Tracker

Mobile-first PWA for tracking workouts, meals, supplements, and weight progress.

## Deploy to Vercel (10 minutes)

```bash
# 1. Unzip and install
unzip pamini-tracker.zip && cd pamini-tracker
npm install

# 2. Push to GitHub (create a new repo first at github.com)
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/pamini-tracker.git
git push -u origin main
```

3. Go to **vercel.com** → Import that GitHub repo → hit **Deploy**. Done.

## Add to iPhone Home Screen

Open your Vercel URL in Safari → **Share** → **Add to Home Screen** → name it "Pamini" → it launches full-screen like a native app.

## Features

- **Home** — Today's schedule, macro rings, progress summary, step goal
- **Workout** — OTF class info + supplemental exercises with set/rep logger and liftmanual.com links
- **Food** — Workout/rest day meal plan with checkboxes and live macro tracking
- **Supps** — Morning / pre-workout / night supplements with checkboxes
- **Progress** — Weekly weigh-in log with sparkline chart and history

All data is saved locally on the device.
