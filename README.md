# SentinelWatch

**Geo-targeted news monitoring for journalists.** Track keywords with layered geographic filters and real-time alerts — Google Alerts on steroids.

![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/react-18-blue)
![PWA](https://img.shields.io/badge/PWA-ready-purple)

## What It Does

SentinelWatch lets you create **watchers** — each one combining:
- **Keywords** (e.g., "immigration", "detention", "ICE")
- **Geographic filters** (State → Region → County → City)
- **Date range**
- **Alert preferences** (instant, daily digest, breaking only)

When new articles match your watcher, you get notified via push, email, SMS, or Slack.

### Example Use Case

> "I want to see every article about **immigration detentions** in **Idaho**, narrowed to **Canyon County**, from the past 30 days — and get instant push notifications when new ones drop."

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/sentinel-watch.git
cd sentinel-watch

# Install
npm install

# Configure (required for live articles)
cp .env.example .env
# Edit .env with your API keys

# Run
npm start
```

The app will open at `http://localhost:3000`.

## Configuration

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_NEWS_PROVIDER` | Yes | `newsapi`, `gnews`, or `bing` |
| `REACT_APP_NEWS_API_KEY` | Yes | API key for your chosen provider |
| `REACT_APP_NOTIFY_API` | No | Backend URL for email/SMS delivery |
| `REACT_APP_ANTHROPIC_API_KEY` | No | For AI-powered geo-scoring & sentiment |

### News API Options

| Provider | Free Tier | Best For |
|---|---|---|
| [NewsAPI.org](https://newsapi.org) | 100 req/day (dev) | Keyword search, source metadata |
| [GNews](https://gnews.io) | 100 req/day | Native geo filtering |
| [Bing News](https://www.microsoft.com/en-us/bing/apis/bing-news-search-api) | 1,000 req/month | Broadest coverage |

## Project Structure

```
sentinel-watch/
├── public/
│   ├── index.html          # PWA-ready HTML shell
│   ├── manifest.json       # PWA manifest
│   ├── icon-192.png        # App icons
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   └── favicon.ico
├── src/
│   ├── App.jsx             # Main dashboard component
│   ├── index.js            # Entry point + SW registration
│   ├── components/
│   │   └── ChannelToggle.jsx
│   ├── data/
│   │   └── geography.js    # US states, Idaho regions, sentiment/source maps
│   ├── hooks/
│   │   └── usePolling.js   # Scheduled article fetching hook
│   ├── services/
│   │   ├── newsApi.js      # News API abstraction (plug in your provider)
│   │   ├── geoScoring.js   # Geographic relevance scoring (3-layer pipeline)
│   │   ├── matchingEngine.js # Core article filtering logic
│   │   └── notifications.js # Push/Email/SMS/Slack delivery
│   └── styles/
│       └── index.css       # Global styles (CSS variables)
├── .env.example
├── .gitignore
└── package.json
```

## Architecture

### Matching Pipeline

```
News API → Raw Articles
              ↓
     Keyword Matching (fast, always runs)
              ↓
     Geographic Scoring (3 layers):
       Layer 1: Text keyword match (built-in)
       Layer 2: NER extraction (TODO: spaCy / compromise.js)
       Layer 3: LLM scoring (TODO: Claude API)
              ↓
     Date Range Filter
              ↓
     Matched Articles → Feed + Notifications
```

### Notification Flow

```
New match detected
       ↓
  Check alert mode:
    instant  → dispatch immediately
    digest   → queue for daily batch
    breaking → dispatch only if high-urgency
       ↓
  Check quiet hours → suppress or send
       ↓
  Dispatch to enabled channels:
    🔔 Push (browser Notification API)
    ✉  Email (via backend → SendGrid)
    💬 SMS (via backend → Twilio)
    ⧉  Slack (direct webhook)
```

## Roadmap

- [ ] Wire up live News API
- [ ] Add Claude API for intelligent geo-scoring
- [ ] Add Claude API for sentiment analysis
- [ ] Build notification backend (SendGrid + Twilio proxy)
- [ ] Add source type auto-classification
- [ ] Add NER-based location extraction
- [ ] Add geocoding for coordinate-level filtering
- [ ] Build email digest template
- [ ] Add watcher sharing / export
- [ ] Mobile app (React Native or Capacitor)

## PWA Support

SentinelWatch is a Progressive Web App. After building for production:

```bash
npm run build
```

Deploy the `build/` folder to any static host (Vercel, Netlify, GitHub Pages). Users can install it as a standalone app on desktop and mobile.

## Development with Claude Code

This project is designed to be developed with [Claude Code](https://docs.anthropic.com/en/docs/claude-code). After cloning:

```bash
claude
# "Help me wire up NewsAPI to the fetchArticles function in src/services/newsApi.js"
# "Add Claude API geo-scoring to src/services/geoScoring.js"
# "Build a Node.js backend for email/SMS notifications"
```

## License

MIT
