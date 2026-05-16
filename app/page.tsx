"use client";
import { useState } from "react";

export default function Home() {
  const [syllabus, setSyllabus] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // Yeh direct hamare local Python Backend ko hit karega
      const res = await fetch("http://127.0.0.1:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syllabus, jd }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Connection failed", error);
    }
    setLoading(false);
  };

  return (
    <main className="p-8 max-w-xl mx-auto bg-slate-900 text-white min-h-screen rounded-xl mt-10">
      <h1 className="text-xl font-bold mb-4 text-indigo-400">
        ⚡ SyllabusX - Template Core
      </h1>
      <div className="space-y-4">
        <textarea
          placeholder="Paste College Syllabus Text..."
          className="w-full p-2 bg-slate-800 rounded border border-slate-700 h-24 text-sm"
          value={syllabus}
          onChange={(e) => setSyllabus(e.target.value)}
        />
        <textarea
          placeholder="Paste Job Description..."
          className="w-full p-2 bg-slate-800 rounded border border-slate-700 h-24 text-sm"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          className="w-full bg-indigo-600 p-2 rounded font-semibold"
        >
          {loading ? "Connecting Backend..." : "Test Analysis"}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-slate-800 rounded border border-green-600">
            <p className="text-green-400 font-bold">Status: {result.status}</p>
            <p>Mock Match Score: {result.matchScore}%</p>
            <p className="text-sm text-slate-400 mt-1">{result.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
