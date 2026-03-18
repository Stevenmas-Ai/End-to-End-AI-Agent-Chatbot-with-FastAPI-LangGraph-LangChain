import { useState } from "react";
import axios from "axios";
import "./App.css";
import ReactMarkdown from "react-markdown";

const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama3-70b-8192", "mixtral-8x7b-32768"];
const OPENAI_MODELS = ["gpt-4o-mini"];

function App() {
  const [provider, setProvider] = useState("Groq");
  const [modelName, setModelName] = useState(GROQ_MODELS[0]);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [query, setQuery] = useState("");
  const [allowSearch, setAllowSearch] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProviderChange = (e) => {
    const selectedProvider = e.target.value;
    setProvider(selectedProvider);
    setModelName(selectedProvider === "Groq" ? GROQ_MODELS[0] : OPENAI_MODELS[0]);
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const res = await axios.post("http://127.0.0.1:9999/chat", {
        model_name: modelName,
        model_provider: provider,
        system_prompt: systemPrompt,
        messages: [query],
        allow_search: allowSearch,
      });
      setResponse(res.data);
    } catch (err) {
      setError("Something went wrong. Make sure your backend is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🤖 AI Chatbot Agent</h1>
      <p className="subtitle">Create and interact with AI Agents</p>

      <div className="form-group">
        <label>Define your AI Agent</label>
        <textarea
          rows={3}
          placeholder="e.g. Act as a financial analyst..."
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Select Provider</label>
        <select value={provider} onChange={handleProviderChange}>
          <option value="Groq">Groq</option>
          <option value="OpenAI">OpenAI</option>
        </select>
      </div>

      <div className="form-group">
        <label>Select Model</label>
        <select value={modelName} onChange={(e) => setModelName(e.target.value)}>
          {(provider === "Groq" ? GROQ_MODELS : OPENAI_MODELS).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group checkbox">
        <input
          type="checkbox"
          id="allowSearch"
          checked={allowSearch}
          onChange={(e) => setAllowSearch(e.target.checked)}
        />
        <label htmlFor="allowSearch">Allow Web Search</label>
      </div>

      <div className="form-group">
        <label>Ask anything</label>
        <textarea
          rows={4}
          placeholder="Enter your query here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Thinking..." : "Ask Agent"}
      </button>

      {error && <div className="error">{error}</div>}

      {response && (
        <div className="response">
          <h3>Agent Response</h3>
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default App;