export interface DebugLogPayload {
  runId?: string;
  hypothesisId?: string;
  location?: string;
  message?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

export const sendDebugLog = (payload: DebugLogPayload) => {
  // #region agent log
  try {
    fetch('http://127.0.0.1:7242/ingest/b61cb6a1-9617-4038-9f66-cb919d1c5b4e', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        timestamp: Date.now(),
        ...payload,
      })
    }).catch(() => { });
  } catch (err) {
    console.warn('debug log failed', err);
  }
  // #endregion
};
