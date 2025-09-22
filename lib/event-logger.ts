export function createNamedLogger(throttleMs: number = 3000) {
  const lastLogTime: { [key: string]: number } = {};

  return async (
    type: string,
    message: string,
    sessionId: string,
    candidateName: string,
    extraData: Record<string, unknown> = {}
  ) => {
    const now = Date.now();

    // Throttle per type
    if (lastLogTime[type] && now - lastLogTime[type] < throttleMs) return;
    lastLogTime[type] = now;

    console.log(`[${type}] ${message}`);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          type,
          metadata: {
            message,
            candidateName,
            timestamp: new Date().toISOString(),
            ...extraData,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Failed to log event:", errData.error);
      }
    } catch (err) {
      console.error("Failed to log event:", err);
    }
  };
}
