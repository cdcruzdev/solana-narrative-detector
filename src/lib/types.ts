export interface Narrative {
  id: string;
  title: string;
  summary: string;
  signalStrength: number; // 0-100
  trend: "emerging" | "accelerating" | "peaking" | "declining";
  category: "defi" | "infrastructure" | "consumer" | "depin" | "ai" | "payments" | "gaming" | "social";
  signals: Signal[];
  buildIdeas: BuildIdea[];
  detectedAt: string;
  sources: string[];
}

export interface Signal {
  type: "onchain" | "github" | "social" | "market";
  description: string;
  metric?: string;
  value?: string;
  change?: string;
  url?: string;
}

export interface BuildIdea {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  narrative: string;
  potential: "high" | "medium" | "low";
  keyFeatures: string[];
}

export interface EcosystemMetrics {
  totalTVL: number;
  tvlChange24h: number;
  activeAddresses: number;
  dailyTransactions: number;
  newPrograms: number;
  topGithubRepos: GithubRepo[];
  topProtocols: Protocol[];
}

export interface GithubRepo {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  starsChange: number;
  forks: number;
  language: string;
  url: string;
  topics: string[];
  updatedAt: string;
}

export interface Protocol {
  name: string;
  tvl: number;
  tvlChange7d: number;
  category: string;
  chain: string;
}

export interface AnalysisReport {
  generatedAt: string;
  fortnightStart: string;
  fortnightEnd: string;
  narratives: Narrative[];
  metrics: EcosystemMetrics;
  methodology: string;
}
