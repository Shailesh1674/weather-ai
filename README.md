# WeatherAI 🌤️

WeatherAI is a production-ready SaaS weather platform built with Next.js 14. It offers interactive weather maps, precise geolocation tracking, real-time live rain radar animations, a 24-hour forecast with beautiful graphs, AI-generated natural language summaries, and user accounts.

## Features ✨
- **Next.js 14 App Router** + React Server Components.
- **Tailwind CSS** with custom glassmorphism, dynamic gradients, and modern UI.
- **Framer Motion** for beautiful page and card transitions.
- **WeatherAPI** integration for current weather, forecast, and map tiles.
- **RainViewer** integration for live animated precipitation radar.
- **Leaflet & OpenStreetMap** for smooth interactive, 100% free weather maps.
- **Pollinations.ai** integration for intelligent 1-2 sentence AI weather summaries (Free, NO KEY REQUIRED).
- **NextAuth.js** integration for quick Email + Google signups.
- **MongoDB** integration for storing users and their favored locations.
- **PWA Ready**: Enjoy an installable app experience cross-device.

## Environment Variables 🔐

Duplicate `.env.example` as `.env.local` and populate the keys:
```env
WEATHERAPI_KEY=your_weatherapi_key
MONGODB_URI=mongodb+srv://admin:wGZYUidyyuNb2wQC@basicproject.xzuetqw.mongodb.net/?appName=BasicProject
NEXTAUTH_SECRET=generate_a_random_jwt_secret
NEXTAUTH_URL=http://localhost:3001
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

## Installation & Setup 🚀

1. Clone or navigate to the repository:
   ```bash
   cd weather-ai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3001](http://localhost:3001)

## Deployment (Vercel) 🌍

This Next.js app is optimized for seamless deployment on Vercel.
1. Push your code to a GitHub/GitLab repository.
2. Go to your Vercel Dashboard, click **Add New...** > **Project**, and select the repo.
3. Once imported, click **Environment Variables** and securely paste all keys from your `.env.local`.
4. Hit **Deploy**. Vercel will build and launch your production-ready Weather SaaS.
