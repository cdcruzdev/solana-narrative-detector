# Solana Narrative Detection Tool

A live intelligence dashboard that detects emerging narratives in the Solana ecosystem by aggregating data from multiple sources and surfacing trends, signals, and actionable build ideas.

**Live:** [solana-narrative-detector.vercel.app](https://solana-narrative-detector.vercel.app)

## What It Does

- **Narrative Detection** -- Identifies emerging themes (AI x Solana, DePIN, Social/Commerce, etc.) by cross-referencing on-chain activity, GitHub repos, and token market data
- **Signal Aggregation** -- Pulls live data from DeFi Llama (TVL/protocols), GitHub API (developer activity), CoinGecko (token trends), and Solana on-chain stats
- **Build Ideas** -- Generates concrete project concepts based on detected narratives, complete with tech stacks and key features
- **Fortnight Analysis** -- Provides a 14-day ecosystem overview with metrics and trend summaries

## Data Sources

| Source | Data |
|--------|------|
| DeFi Llama | Solana TVL, protocol rankings, TVL changes |
| GitHub API | Solana-related repos, star/fork trends, language breakdown |
| CoinGecko | Ecosystem token prices, market cap, 7d trends |
| Solana RPC | Transaction counts, active programs, on-chain stats |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Optionally set a `GITHUB_TOKEN` in `.env.local` to increase GitHub API rate limits.

## Architecture

```
src/
  app/
    page.tsx          # Dashboard UI
    api/report/       # Report generation endpoint
  lib/
    data-sources.ts   # API integrations (DeFi Llama, GitHub, CoinGecko, Solana)
    narrative-engine.ts  # Signal processing and narrative detection logic
    types.ts          # TypeScript interfaces
```

The narrative engine gathers raw signals from all data sources, then runs detection algorithms to identify patterns. Each narrative is scored by signal strength and backed by specific data points.
