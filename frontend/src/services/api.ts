const API_BASE_URL = "http://localhost:8000/api";
const API_ROOT = "http://localhost:8000";

export interface MoveResponse {
  best_move: string;
}

export interface TopMove {
  from: string;
  to: string;
  notation?: string;
}

export interface AnalysisResponse {
  evaluation: {
    type: string;
    value: number;
  };
  best_move: string;
  top_moves: TopMove[];
}

export interface EngineListResponse {
  available_engines: string[];
  current_engine: string;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_ROOT}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function getAvailableEngines(): Promise<EngineListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/engines`);

    if (!response.ok) {
      throw new Error("Backend is not running");
    }

    return response.json();
  } catch {
    throw new Error("Backend is not running");
  }
}

export async function selectEngine(engineName: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/engines/select`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ engine: engineName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to select engine: ${engineName}`);
    }
  } catch {
    throw new Error(`Failed to select engine: ${engineName}`);
  }
}

export async function getBestMove(fen: string): Promise<MoveResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fen }),
    });

    if (!response.ok) {
      throw new Error("Backend is not running");
    }

    return response.json();
  } catch {
    throw new Error("Backend is not running");
  }
}

export async function analyzePosition(fen: string): Promise<AnalysisResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fen }),
    });

    if (!response.ok) {
      throw new Error("Backend is not running");
    }

    return response.json();
  } catch {
    throw new Error("Backend is not running");
  }
}
