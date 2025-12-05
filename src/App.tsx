import { useState } from "react";
import {
  getHealth,
  getInfo,
  analyzeText,
  analyzePassword,
} from "./api/client";

type InfoResponse = {
  service: string;
  version: string;
  environment: string;
};

type AnalyzeTextResult = {
  text: string;
  length: number;
  word_count: number;
  has_numbers: boolean;
  has_uppercase: boolean;
};

type AnalyzePasswordResult = {
  score: number;
  length: number;
  has_numbers: boolean;
  has_uppercase: boolean;
  has_special_chars: boolean;
};



function App() {
  const [health, setHealth] = useState<string | null>(null);
  const [info, setInfo] = useState<InfoResponse | null>(null);

  const [textInput, setTextInput] = useState("");
  const [textResult, setTextResult] = useState<AnalyzeTextResult | null>(null);

  const [passwordInput, setPasswordInput] = useState("");
  const [passwordResult, setPasswordResult] = useState<AnalyzePasswordResult | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleHealth() {
    try {
      setError(null);
      setLoading(true);
      const data = await getHealth();
      setHealth(JSON.stringify(data));
    } catch (e) {
  if (e instanceof Error) {
    setError(e.message);
  } else {
    setError("Unexpected error");
  }
} finally {
      setLoading(false);
    }
  }

  async function handleInfo() {
    try {
      setError(null);
      setLoading(true);
      const data = await getInfo();
      setInfo(data);
    } catch (e) {
  if (e instanceof Error) {
    setError(e.message);
  } else {
    setError("Unexpected error");
  }
} finally {
      setLoading(false);
    }
  }

  async function handleAnalyzeText(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const data = await analyzeText(textInput);
      setTextResult(data);
    } catch (e) {
  if (e instanceof Error) {
    setError(e.message);
  } else {
    setError("Unexpected error");
  }
}finally {
      setLoading(false);
    }
  }

  async function handleAnalyzePassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const data = await analyzePassword(passwordInput);
      setPasswordResult(data);
    } catch (e) {
  if (e instanceof Error) {
    setError(e.message);
  } else {
    setError("Unexpected error");
  }
} finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
      <h1>DevOps Text Toolkit</h1>
      <p>Frontend sencillo para probar la API de análisis de texto y passwords.</p>

      {loading && <p>⏳ Cargando...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <section style={{ marginTop: "2rem" }}>
        <h2>System</h2>
        <button onClick={handleHealth}>Check /health</button>
        {health && <pre>{health}</pre>}
        <button onClick={handleInfo}>Get /info</button>
        {info && (
          <pre>{JSON.stringify(info, null, 2)}</pre>
        )}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Analyze text</h2>
        <form onSubmit={handleAnalyzeText}>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={4}
            style={{ width: "100%" }}
          />
          <button type="submit" style={{ marginTop: "0.5rem" }}>
            Analyze
          </button>
        </form>
        {textResult && (
          <pre>{JSON.stringify(textResult, null, 2)}</pre>
        )}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Analyze password</h2>
        <form onSubmit={handleAnalyzePassword}>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button type="submit" style={{ marginLeft: "0.5rem" }}>
            Analyze
          </button>
        </form>
        {passwordResult && (
          <pre>{JSON.stringify(passwordResult, null, 2)}</pre>
        )}
      </section>
    </div>
  );
}

export default App;

