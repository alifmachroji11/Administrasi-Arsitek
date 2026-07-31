import { SEARCH_INDEX } from "../data/searchIndex";
import { sourceById } from "../data/sources";
import type { SearchEntry } from "./types";

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFKD").replace(/[^\w\s]/g, "").trim();
}

export interface SearchOutcome {
  entry: SearchEntry | null;
  matchedKeywords: string[];
}

export function runSearch(query: string, projectFilter: string | null): SearchOutcome {
  const q = normalize(query);
  if (!q) return { entry: null, matchedKeywords: [] };

  let best: SearchEntry | null = null;
  let bestScore = 0;
  let bestKeywords: string[] = [];

  for (const entry of SEARCH_INDEX) {
    if (projectFilter) {
      const belongsToProject = entry.sourceIds.some((id) => sourceById(id)?.project === projectFilter);
      if (!belongsToProject) continue;
    }

    const matched = entry.keywords.filter((kw) => q.includes(normalize(kw)));
    if (matched.length === 0) continue;

    const score = matched.length;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
      bestKeywords = matched;
    }
  }

  return { entry: best, matchedKeywords: bestKeywords };
}
