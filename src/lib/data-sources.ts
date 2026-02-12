import { GithubRepo, Protocol } from "./types";

// ============================================
// DATA SOURCE: DeFi Llama (TVL & Protocol Data)
// ============================================
export async function fetchSolanaTVL(): Promise<{ tvl: number; change24h: number }> {
  try {
    const res = await fetch("https://api.llama.fi/v2/chains", { next: { revalidate: 3600 } });
    const chains = await res.json();
    const solana = chains.find((c: any) => c.name === "Solana" || c.gecko_id === "solana");
    return {
      tvl: solana?.tvl || 0,
      change24h: solana?.change_1d || 0,
    };
  } catch {
    return { tvl: 0, change24h: 0 };
  }
}

export async function fetchSolanaProtocols(): Promise<Protocol[]> {
  try {
    const res = await fetch("https://api.llama.fi/protocols", { next: { revalidate: 3600 } });
    const protocols = await res.json();
    // Exclude CEXes, bridges, and non-DeFi categories
    const excludedCategories = new Set([
      "CEX", "Chain", "Bridge", "Cross Chain", "Payments",
      "Centralized Exchange", "CeFi", "Infrastructure",
    ]);
    const excludedNames = new Set([
      "Binance", "OKX", "Bybit", "Bitget", "Gate.io", "KuCoin",
      "Coinbase", "Kraken", "Huobi", "HTX", "MEXC", "Crypto.com",
      "Binance CEX", "OKX CEX",
    ]);
    return protocols
      .filter((p: any) =>
        p.chains?.includes("Solana") &&
        p.tvl > 1000000 &&
        !excludedCategories.has(p.category) &&
        !excludedNames.has(p.name)
      )
      .sort((a: any, b: any) => (b.tvl || 0) - (a.tvl || 0))
      .slice(0, 30)
      .map((p: any) => ({
        name: p.name,
        tvl: p.tvl || 0,
        tvlChange7d: p.change_7d || 0,
        category: p.category || "Unknown",
        chain: "Solana",
      }));
  } catch {
    return [];
  }
}

// ============================================
// DATA SOURCE: GitHub (Developer Activity)
// ============================================
const SOLANA_GITHUB_QUERIES = [
  "solana",
  "anchor-lang",
  "solana-program",
  "solana defi",
  "solana nft",
  "solana blink",
  "solana ai agent",
  "solana depin",
  "solana payments",
];

export async function fetchSolanaGithubActivity(): Promise<GithubRepo[]> {
  const repos: GithubRepo[] = [];
  const seen = new Set<string>();
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  for (const query of SOLANA_GITHUB_QUERIES.slice(0, 5)) {
    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+pushed:>${twoWeeksAgo}&sort=stars&order=desc&per_page=10`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
          },
          next: { revalidate: 3600 },
        }
      );
      const data = await res.json();
      if (data.items) {
        for (const item of data.items) {
          if (!seen.has(item.full_name)) {
            seen.add(item.full_name);
            repos.push({
              name: item.name,
              fullName: item.full_name,
              description: item.description || "",
              stars: item.stargazers_count,
              starsChange: 0,
              forks: item.forks_count,
              language: item.language || "Unknown",
              url: item.html_url,
              topics: item.topics || [],
              updatedAt: item.updated_at,
            });
          }
        }
      }
      // Rate limit courtesy
      await new Promise((r) => setTimeout(r, 500));
    } catch {
      continue;
    }
  }

  return repos.sort((a, b) => b.stars - a.stars).slice(0, 50);
}

// ============================================
// DATA SOURCE: CoinGecko (Market Data)
// ============================================
export async function fetchSolanaEcosystemTokens() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=solana-ecosystem&order=market_cap_desc&per_page=50&sparkline=false&price_change_percentage=7d",
      { next: { revalidate: 3600 } }
    );
    return await res.json();
  } catch {
    return [];
  }
}

// ============================================
// DATA SOURCE: Solana On-Chain Stats  
// ============================================
export async function fetchSolanaOnChainStats() {
  try {
    // Use Solana Beach / public APIs for basic stats
    const res = await fetch("https://api.coingecko.com/api/v3/coins/solana", {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return {
      price: data.market_data?.current_price?.usd || 0,
      priceChange7d: data.market_data?.price_change_percentage_7d || 0,
      marketCap: data.market_data?.market_cap?.usd || 0,
      volume24h: data.market_data?.total_volume?.usd || 0,
      developerScore: data.developer_score || 0,
      communityScore: data.community_score || 0,
    };
  } catch {
    return { price: 0, priceChange7d: 0, marketCap: 0, volume24h: 0, developerScore: 0, communityScore: 0 };
  }
}
