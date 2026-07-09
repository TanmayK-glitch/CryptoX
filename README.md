# CryptoX 🚀
> A modern, real-time cryptocurrency tracking dashboard.

[![Live Demo](https://img.shields.io/badge/Demo-Live-green?style=for-the-badge&logo=vercel)](https://crypto-x-kohl.vercel.app)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)]()
[![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()

## 🌟 Features

- **Real-Time Data**: Live cryptocurrency prices, market caps, and 24h changes.
- **Coin Details & Analytics**: Dedicated pages for each coin featuring interactive 10-day historical price charts.
- **Multi-Currency Support**: Instantly switch pricing between USD, INR, and EUR.
- **Search Capabilities**: Fast, client-side filtering to find specific coins.
- **Fully Responsive**: Beautiful, mobile-first design that adapts seamlessly from small screens to large desktops.

## 💻 Tech Stack

- **Frontend**: React 19, Vite, React Router v7
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Backend/API**: Vercel Serverless Functions (`/api/*`)
- **Deployment**: Vercel

## 🏗️ Architecture Note (Security)

To ensure the CoinGecko API key is **never exposed** to the client-side JavaScript bundle, all fetch calls are proxied through Vercel serverless functions (located in the `/api` directory). 

The frontend requests data from local endpoints (e.g., `/api/coins`), and the Vercel serverless function injects the `COINGECKO_API_KEY` header server-side before securely communicating with the CoinGecko API.

## 🚀 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd CryptoX
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your CoinGecko API key. You can get a free demo key from [coingecko.com](https://www.coingecko.com/).
   ```env
   COINGECKO_API_KEY=your_api_key_here
   ```
   *(Note: Do **not** prefix the variable with `VITE_` to ensure it stays strictly server-side).*

4. **Run Locally**:
   Because the project relies on Vercel Serverless Functions for API proxying, a standard `npm run dev` (Vite dev server) will not work for fetching data. Instead, use the Vercel CLI:
   ```bash
   npx vercel dev
   ```
   Your app will be available at `http://localhost:3000`.

## 📁 Folder Structure

```text
CryptoX/
├── api/                   # Vercel Serverless proxy functions
│   ├── coins.js           # Market data proxy
│   └── coin/
│       ├── [id].js        # Single coin proxy
│       └── [id]/chart.js  # Historical chart data proxy
├── src/
│   ├── Components/        # Reusable UI components (Navbar, LineChart, etc.)
│   ├── Context/           # Global state (CoinContext)
│   ├── Pages/             # Route components (Home, Coin)
│   ├── utils/             # Helpers (logger, throttledFetch)
│   ├── App.jsx            # Main application layout & router
│   └── main.jsx           # React DOM entry point
├── .env                   # Environment variables (ignored in git)
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration
```

## ⚠️ Known Limitations

- **Rate Limits**: This project uses the free tier of the CoinGecko API, which is subject to strict rate limits (usually ~30 calls/minute). The app implements a global queue (`throttledFetch`) to enforce a minimum delay between requests and handles rate-limit retries automatically, but you may occasionally see rate-limit warnings if you navigate too rapidly.
