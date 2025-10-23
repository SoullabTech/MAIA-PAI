// hooks/useAkashicContext.ts
// 🜃 Hook for retrieving context from Akashic Records

import { useState, useCallback } from "react";

interface ContextItem {
  id: string;
  content: string;
  element: string;
  archetype: string;
  timestamp: string;
  relevance: number;
  keyPoints: string[];
}

interface ContextResponse {
  context: ContextItem[];
  summary: string;
  totalInsights: number;
}

interface UseAkashicContextOptions {
  userId?: string;
  lastN?: number;
  minRelevance?: number;
}

export function useAkashicContext(options: UseAkashicContextOptions = {}) {
  const [context, setContext] = useState<ContextItem[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContext = useCallback(
    async (topic: string) => {
      if (!topic || topic.trim().length === 0) {
        setError("Topic cannot be empty");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          topic,
          ...(options.userId && { userId: options.userId }),
          ...(options.lastN && { lastN: options.lastN.toString() }),
          ...(options.minRelevance && {
            minRelevance: options.minRelevance.toString(),
          }),
        });

        const response = await fetch(`/api/akashic/context?${params}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch context");
        }

        const data: ContextResponse = await response.json();

        setContext(data.context);
        setSummary(data.summary);

        return data;
      } catch (err: any) {
        console.error("Error fetching Akashic context:", err);
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options.userId, options.lastN, options.minRelevance]
  );

  const clearContext = useCallback(() => {
    setContext([]);
    setSummary("");
    setError(null);
  }, []);

  /**
   * Format context as a prompt injection for Claude
   */
  const formatAsPrompt = useCallback(() => {
    if (context.length === 0) return "";

    const contextText = context
      .map(
        (item, i) => `
### Context ${i + 1} (${item.element} • ${item.archetype})
**Date:** ${new Date(item.timestamp).toLocaleDateString()}
**Relevance:** ${(item.relevance * 100).toFixed(0)}%

${item.content}

**Key Points:**
${item.keyPoints.map((point) => `- ${point}`).join("\n")}
`
      )
      .join("\n---\n");

    return `
## 🜃 Context from Akashic Records

${summary}

${contextText}

---

Continue the conversation with awareness of these past insights.
`;
  }, [context, summary]);

  return {
    context,
    summary,
    loading,
    error,
    fetchContext,
    clearContext,
    formatAsPrompt,
    hasContext: context.length > 0,
  };
}
