# LiftLog - Workout Tracker

A mobile-first workout tracking app for you and your partner.

## Features

- 📱 Mobile-optimized interface
- 👫 Track workouts for two people (Naomi & Pedro)
- 💪 4-day Push/Pull/Legs program
- 📊 Progress charts and personal records
- 🔄 Swap exercises from a library
- ➕ Add exercises with smart recommendations
- 💾 Data persists in browser storage

## Deploy to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. Create a new GitHub repository
2. Push this code to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/liftlog.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com)
4. Click "Add New Project"
5. Import your GitHub repository
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Run in this directory:
   ```bash
   vercel
   ```
3. Follow the prompts

## After Deployment

1. Open your Vercel URL on your phone
2. **Add to Home Screen** (iOS: Share → Add to Home Screen, Android: Menu → Add to Home Screen)
3. The app will work like a native app!

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Note on Data Storage

Data is stored in your browser's localStorage. This means:
- ✅ Data persists between sessions on the same device/browser
- ⚠️ Data is NOT synced between devices
- ⚠️ Clearing browser data will erase your workouts

For shared data between you and Naomi, you'll both need to use the same device, or I can add a cloud database if you need sync across devices.
