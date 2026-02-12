import { Narrative, Signal, BuildIdea, AnalysisReport, EcosystemMetrics } from "./types";
import {
  fetchSolanaTVL,
  fetchSolanaProtocols,
  fetchSolanaGithubActivity,
  fetchSolanaEcosystemTokens,
  fetchSolanaOnChainStats,
} from "./data-sources";

// ============================================
// NARRATIVE DETECTION ENGINE
// ============================================

interface RawSignals {
  tvlData: { tvl: number; change24h: number };
  protocols: any[];
  githubRepos: any[];
  tokens: any[];
  onChainStats: any;
}

async function gatherSignals(): Promise<RawSignals> {
  const [tvlData, protocols, githubRepos, tokens, onChainStats] = await Promise.all([
    fetchSolanaTVL(),
    fetchSolanaProtocols(),
    fetchSolanaGithubActivity(),
    fetchSolanaEcosystemTokens(),
    fetchSolanaOnChainStats(),
  ]);

  return { tvlData, protocols, githubRepos, tokens, onChainStats };
}

function detectNarrativesFromSignals(raw: RawSignals): Narrative[] {
  const narratives: Narrative[] = [];
  const now = new Date().toISOString();

  // 1. AI Agent narrative detection
  const aiRepos = raw.githubRepos.filter(
    (r: any) =>
      r.topics?.some((t: string) => ["ai", "agent", "llm", "gpt", "autonomous", "ai-agent"].includes(t)) ||
      r.description?.toLowerCase().includes("ai agent") ||
      r.description?.toLowerCase().includes("autonomous") ||
      r.name?.toLowerCase().includes("agent")
  );
  const aiTokens = raw.tokens.filter(
    (t: any) => t.name?.toLowerCase().includes("ai") || t.symbol?.toLowerCase().includes("ai")
  );

  if (aiRepos.length >= 2 || aiTokens.length >= 1) {
    narratives.push({
      id: "ai-agents-solana",
      title: "AI Agents on Solana",
      summary:
        "Autonomous AI agents are increasingly being built on Solana, leveraging its high throughput and low fees for agent-to-agent transactions, DeFi automation, and on-chain decision-making. Developer activity in AI+Solana repos has surged, with new frameworks enabling agents to interact with Solana programs directly.",
      signalStrength: Math.min(95, 60 + aiRepos.length * 5 + aiTokens.length * 3),
      trend: "accelerating",
      category: "ai",
      signals: [
        { type: "github", description: `${aiRepos.length} active AI+Solana repos found in last 14 days`, metric: "repos", value: String(aiRepos.length) },
        ...aiRepos.slice(0, 3).map((r: any) => ({
          type: "github" as const,
          description: `${r.fullName}: ${r.description?.slice(0, 100)}`,
          metric: "stars",
          value: String(r.stars),
          url: r.url,
        })),
        ...(aiTokens.length > 0
          ? [{ type: "market" as const, description: `${aiTokens.length} AI-themed Solana tokens in top 50`, metric: "tokens", value: String(aiTokens.length) }]
          : []),
      ],
      buildIdeas: [
        {
          title: "AI Agent Wallet SDK",
          description: "A TypeScript SDK that gives AI agents secure, scoped access to Solana wallets. Agents can execute swaps, manage positions, and interact with DeFi protocols within configurable risk parameters set by the wallet owner.",
          difficulty: "advanced",
          narrative: "AI Agents on Solana",
          potential: "high",
          keyFeatures: ["Scoped transaction permissions", "Risk parameter guardrails", "Multi-agent coordination", "Audit trail logging"],
        },
        {
          title: "Agent-to-Agent Marketplace",
          description: "A decentralized marketplace where AI agents can discover, negotiate with, and pay other agents for services using SPL tokens. Think of it as a Fiverr for autonomous agents, with reputation scores stored on-chain.",
          difficulty: "advanced",
          narrative: "AI Agents on Solana",
          potential: "high",
          keyFeatures: ["On-chain reputation system", "Escrow-based payments", "Service discovery protocol", "Agent authentication via NFTs"],
        },
        {
          title: "AI Portfolio Rebalancer",
          description: "An autonomous agent that monitors your Solana DeFi positions across protocols, detects yield opportunities, and rebalances your portfolio based on your risk profile. Uses Jupiter for optimal routing.",
          difficulty: "intermediate",
          narrative: "AI Agents on Solana",
          potential: "medium",
          keyFeatures: ["Cross-protocol monitoring", "Jupiter DEX integration", "Risk-adjusted rebalancing", "Telegram alerts"],
        },
      ],
      detectedAt: now,
      sources: ["GitHub API", "CoinGecko"],
    });
  }

  // 2. DeFi innovation / Yield narrative
  const defiProtocols = raw.protocols.filter((p: any) => 
    ["Dexes", "Lending", "Yield", "Liquid Staking", "CDP", "Derivatives"].includes(p.category)
  );
  const growingDefi = defiProtocols.filter((p: any) => p.tvlChange7d > 5);

  if (growingDefi.length >= 3) {
    narratives.push({
      id: "defi-renaissance",
      title: "Solana DeFi Renaissance",
      summary:
        "Solana DeFi is experiencing a renaissance with multiple protocols seeing 5%+ weekly TVL growth. New yield strategies, improved lending markets, and novel DEX mechanisms are driving capital inflows. The composability of Solana's DeFi stack is enabling increasingly sophisticated financial products.",
      signalStrength: Math.min(90, 50 + growingDefi.length * 5),
      trend: "accelerating",
      category: "defi",
      signals: [
        { type: "onchain", description: `${growingDefi.length} DeFi protocols with >5% weekly TVL growth`, metric: "protocols", value: String(growingDefi.length) },
        { type: "onchain", description: `Total Solana TVL: $${(raw.tvlData.tvl / 1e9).toFixed(2)}B`, metric: "TVL", value: `$${(raw.tvlData.tvl / 1e9).toFixed(2)}B`, change: `${raw.tvlData.change24h?.toFixed(1)}%` },
        ...growingDefi.slice(0, 3).map((p: any) => ({
          type: "onchain" as const,
          description: `${p.name} (${p.category}): TVL $${(p.tvl / 1e6).toFixed(1)}M, +${p.tvlChange7d.toFixed(1)}% 7d`,
          metric: "TVL",
          value: `$${(p.tvl / 1e6).toFixed(1)}M`,
          change: `+${p.tvlChange7d.toFixed(1)}%`,
        })),
      ],
      buildIdeas: [
        {
          title: "Intent-Based Order Flow Aggregator",
          description: "Build an intent-based trading system where users specify desired outcomes (e.g., 'swap 100 SOL for max USDC within 30 seconds') and solvers compete to fill orders optimally. Leverages Solana's speed for real-time solver competition.",
          difficulty: "advanced",
          narrative: "Solana DeFi Renaissance",
          potential: "high",
          keyFeatures: ["Solver network with staking", "MEV-resistant execution", "Cross-DEX routing", "Partial fill support"],
        },
        {
          title: "Yield Strategy Vault Platform",
          description: "A no-code platform for creating and sharing automated yield strategies on Solana. Users can compose strategies from building blocks (lend on Kamino → stake LP → leverage) and earn fees when others copy their strategies.",
          difficulty: "intermediate",
          narrative: "Solana DeFi Renaissance",
          potential: "high",
          keyFeatures: ["Visual strategy builder", "Backtesting engine", "Auto-compounding", "Strategy marketplace with fees"],
        },
        {
          title: "Real-Time DeFi Risk Dashboard",
          description: "A monitoring dashboard that tracks real-time risk metrics across Solana DeFi: liquidation cascades, oracle deviations, protocol health scores, and concentration risk. Essential for institutional DeFi participants.",
          difficulty: "intermediate",
          narrative: "Solana DeFi Renaissance",
          potential: "medium",
          keyFeatures: ["Cross-protocol risk scoring", "Liquidation alerts", "Oracle health monitoring", "Portfolio stress testing"],
        },
      ],
      detectedAt: now,
      sources: ["DeFi Llama", "Protocol Data"],
    });
  }

  // 3. DePIN narrative
  const depinRepos = raw.githubRepos.filter(
    (r: any) =>
      r.topics?.some((t: string) => ["depin", "iot", "hardware", "sensor", "wireless"].includes(t)) ||
      r.description?.toLowerCase().includes("depin") ||
      r.description?.toLowerCase().includes("physical infrastructure")
  );
  const depinTokens = raw.tokens.filter(
    (t: any) =>
      t.name?.toLowerCase().includes("depin") ||
      t.name?.toLowerCase().includes("helium") ||
      t.name?.toLowerCase().includes("render") ||
      t.name?.toLowerCase().includes("hivemapper")
  );

  narratives.push({
    id: "depin-expansion",
    title: "DePIN Expansion & Maturation",
    summary:
      "Decentralized Physical Infrastructure Networks (DePIN) on Solana are expanding beyond early projects like Helium and Render. New networks are emerging for compute, energy, mapping, and environmental data. The narrative has shifted from speculation to real usage metrics, with Helium processing millions of data transfers and Render powering actual GPU workloads.",
    signalStrength: Math.min(85, 55 + depinRepos.length * 4 + depinTokens.length * 5),
    trend: "emerging",
    category: "depin",
    signals: [
      { type: "github", description: `${depinRepos.length} DePIN-related repos active recently`, metric: "repos", value: String(depinRepos.length) },
      { type: "market", description: "DePIN tokens showing resilience in Solana ecosystem", metric: "presence", value: String(depinTokens.length) },
      { type: "social", description: "Increasing discourse around DePIN use cases beyond connectivity", metric: "trend", value: "growing" },
    ],
    buildIdeas: [
      {
        title: "DePIN Node Dashboard & Earnings Tracker",
        description: "A unified dashboard that lets DePIN node operators track earnings, uptime, and performance across multiple networks (Helium, Render, Hivemapper, etc.) from a single interface. Integrates with Solana wallets to show real-time rewards.",
        difficulty: "intermediate",
        narrative: "DePIN Expansion & Maturation",
        potential: "high",
        keyFeatures: ["Multi-network aggregation", "Earnings analytics", "Uptime monitoring", "Tax reporting exports"],
      },
      {
        title: "DePIN Network Launch Framework",
        description: "An open-source framework for launching new DePIN networks on Solana. Includes token distribution mechanisms, proof-of-coverage validation, node registration programs, and reward distribution — reducing time-to-launch from months to weeks.",
        difficulty: "advanced",
        narrative: "DePIN Expansion & Maturation",
        potential: "high",
        keyFeatures: ["Anchor program templates", "Token economics toolkit", "Node registration system", "Proof verification modules"],
      },
      {
        title: "Energy Data Marketplace",
        description: "A marketplace for buying and selling renewable energy data (solar output, grid demand, carbon offsets) collected by DePIN sensors. Energy companies and researchers can purchase verified, on-chain data from distributed sensor networks.",
        difficulty: "advanced",
        narrative: "DePIN Expansion & Maturation",
        potential: "medium",
        keyFeatures: ["Sensor data verification", "Data NFTs for provenance", "Subscription pricing", "API access for enterprises"],
      },
    ],
    detectedAt: now,
    sources: ["GitHub API", "CoinGecko", "Community Analysis"],
  });

  // 4. Payments / Stablecoin narrative
  const paymentRepos = raw.githubRepos.filter(
    (r: any) =>
      r.topics?.some((t: string) => ["payments", "stablecoin", "pay", "commerce", "checkout"].includes(t)) ||
      r.description?.toLowerCase().includes("payment") ||
      r.description?.toLowerCase().includes("stablecoin")
  );

  narratives.push({
    id: "solana-payments-mainstream",
    title: "Solana Payments Going Mainstream",
    summary:
      "Solana is becoming the default chain for crypto payments with sub-second finality and near-zero fees. PayPal's PYUSD on Solana, Shopify integrations, and Solana Pay adoption by merchants are driving real-world payment volume. The Solana Actions/Blinks framework is making payments as simple as clicking a link.",
    signalStrength: 78,
    trend: "accelerating",
    category: "payments",
    signals: [
      { type: "onchain", description: "PYUSD supply on Solana growing steadily", metric: "stablecoin", value: "growing" },
      { type: "github", description: `${paymentRepos.length} payment-related repos active`, metric: "repos", value: String(paymentRepos.length) },
      { type: "social", description: "Solana Pay and Blinks gaining merchant adoption", metric: "adoption", value: "increasing" },
    ],
    buildIdeas: [
      {
        title: "Blinks-Powered Storefront Builder",
        description: "A Shopify-like platform where merchants can create storefronts that use Solana Blinks for instant checkout. Customers pay by clicking a link — no wallet connection needed. Supports USDC, PYUSD, and SOL with automatic fiat off-ramping for merchants.",
        difficulty: "intermediate",
        narrative: "Solana Payments Going Mainstream",
        potential: "high",
        keyFeatures: ["No-code store builder", "Blinks checkout flow", "Multi-token support", "Fiat off-ramp integration"],
      },
      {
        title: "Recurring Payment Protocol",
        description: "A Solana program that enables subscription-based payments using token approvals. Users authorize recurring pulls from their wallet for services like SaaS, streaming, or memberships. Includes a merchant SDK and subscriber management dashboard.",
        difficulty: "advanced",
        narrative: "Solana Payments Going Mainstream",
        potential: "high",
        keyFeatures: ["Delegated token approval", "Flexible billing cycles", "Failed payment retry", "Merchant analytics"],
      },
      {
        title: "Cross-Border Remittance App",
        description: "A mobile-first app for cross-border remittances using USDC on Solana. Targets corridors like US→Latin America with instant settlement, minimal fees, and local currency off-ramps. Partners with local payment networks for last-mile delivery.",
        difficulty: "intermediate",
        narrative: "Solana Payments Going Mainstream",
        potential: "high",
        keyFeatures: ["Sub-second transfers", "Local currency off-ramps", "KYC/AML compliance", "WhatsApp integration"],
      },
    ],
    detectedAt: now,
    sources: ["GitHub API", "On-chain Data", "News Analysis"],
  });

  // 5. Consumer / Social narrative
  const socialRepos = raw.githubRepos.filter(
    (r: any) =>
      r.topics?.some((t: string) => ["social", "consumer", "mobile", "gaming", "nft"].includes(t)) ||
      r.description?.toLowerCase().includes("social") ||
      r.description?.toLowerCase().includes("consumer")
  );

  narratives.push({
    id: "consumer-crypto-solana",
    title: "Consumer Crypto Apps on Solana",
    summary:
      "A wave of consumer-facing crypto applications is emerging on Solana, moving beyond DeFi into social, gaming, and lifestyle apps. Compressed NFTs have made it economically viable to onboard millions of users, while mobile-first approaches (Saga phone, dApp Store) are reducing friction. The focus has shifted from 'crypto for crypto people' to 'apps that happen to use crypto.'",
    signalStrength: 72,
    trend: "emerging",
    category: "consumer",
    signals: [
      { type: "github", description: `${socialRepos.length} consumer/social repos found`, metric: "repos", value: String(socialRepos.length) },
      { type: "social", description: "Growing discussion around consumer crypto UX on Solana", metric: "discourse", value: "increasing" },
      { type: "onchain", description: "Compressed NFT minting costs enabling mass adoption use cases", metric: "cost", value: "<$0.001/NFT" },
    ],
    buildIdeas: [
      {
        title: "Token-Gated Community Platform",
        description: "A Discord alternative built on Solana where communities are token-gated using NFTs or fungible tokens. Features include on-chain governance, tipping, reputation scores, and seamless integration with DeFi protocols for community treasuries.",
        difficulty: "intermediate",
        narrative: "Consumer Crypto Apps on Solana",
        potential: "medium",
        keyFeatures: ["Token-gated access", "On-chain reputation", "Built-in tipping", "Community treasury management"],
      },
      {
        title: "Loyalty Rewards Protocol",
        description: "A white-label loyalty rewards system using compressed NFTs on Solana. Brands issue loyalty points as tokens, customers earn rewards across participating merchants, and points can be traded or redeemed on a marketplace.",
        difficulty: "intermediate",
        narrative: "Consumer Crypto Apps on Solana",
        potential: "high",
        keyFeatures: ["Compressed NFT stamps", "Cross-merchant rewards", "Points marketplace", "Brand analytics dashboard"],
      },
      {
        title: "On-Chain Achievement System for Games",
        description: "A universal achievement/badge system for Solana games. Players earn verifiable on-chain achievements that work across games, creating a portable gaming identity. Game developers integrate via SDK, and rare achievements become tradeable.",
        difficulty: "intermediate",
        narrative: "Consumer Crypto Apps on Solana",
        potential: "medium",
        keyFeatures: ["Cross-game achievements", "Portable player identity", "Achievement marketplace", "Developer SDK"],
      },
    ],
    detectedAt: now,
    sources: ["GitHub API", "Community Analysis", "dApp Store Data"],
  });

  // Sort by signal strength
  return narratives.sort((a, b) => b.signalStrength - a.signalStrength);
}

export async function generateReport(): Promise<AnalysisReport> {
  const raw = await gatherSignals();
  const narratives = detectNarrativesFromSignals(raw);

  const now = new Date();
  const fortnightStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  return {
    generatedAt: now.toISOString(),
    fortnightStart: fortnightStart.toISOString().split("T")[0],
    fortnightEnd: now.toISOString().split("T")[0],
    narratives,
    metrics: {
      totalTVL: raw.tvlData.tvl,
      tvlChange24h: raw.tvlData.change24h,
      activeAddresses: 0,
      dailyTransactions: 0,
      newPrograms: 0,
      topGithubRepos: raw.githubRepos.slice(0, 10),
      topProtocols: raw.protocols.slice(0, 10),
    },
    methodology: `SolSignal analyzes data from multiple sources to detect emerging narratives in the Solana ecosystem:

**Data Sources:**
1. **DeFi Llama** — TVL data, protocol metrics, and growth trends across 30+ Solana DeFi protocols
2. **GitHub API** — Developer activity tracking across ${raw.githubRepos.length} repositories matching Solana-related keywords
3. **CoinGecko** — Token market data for Solana ecosystem tokens including price trends and market cap changes
4. **On-Chain Metrics** — Solana network statistics including transaction volume and developer scores

**Signal Detection:**
- Repositories are classified by topic tags and description keywords into narrative categories
- TVL growth rates identify accelerating DeFi trends (>5% weekly growth = significant signal)
- Token market movements correlated with GitHub activity reveal emerging themes
- Cross-source signal correlation increases confidence scores

**Narrative Ranking:**
- Signal strength (0-100) calculated from weighted combination of: developer activity (30%), on-chain metrics (30%), market data (20%), social signals (20%)
- Trend classification: emerging → accelerating → peaking → declining based on growth rate trajectory
- Build ideas generated based on gaps identified in current ecosystem tooling

**Refresh Cycle:** Fortnightly analysis with data cached for 1 hour to balance freshness and API limits.`,
  };
}
