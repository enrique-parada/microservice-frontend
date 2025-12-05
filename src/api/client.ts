const API_URL = import.meta.env.VITE_API_URL;

export async function getHealth() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error("Error calling /health");
  return res.json();
}

export async function getInfo() {
  const res = await fetch(`${API_URL}/info`);
  if (!res.ok) throw new Error("Error calling /info");
  return res.json();
}

export async function analyzeText(text: string) {
  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Error calling /analyze");
  return res.json();
}

export async function analyzePassword(password: string) {
  const res = await fetch(`${API_URL}/analyze/password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Error calling /analyze/password");
  return res.json();
}

