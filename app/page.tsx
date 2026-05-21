"use client";
import { useState } from "react";

export default function Home() {
  const [syllabus, setSyllabus] = useState("");
  const [profession, setProfession] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!syllabus || !profession) {
      alert("Please fill both inputs!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ syllabus, profession }),
        },
      );
      const data = await res.json();

      if (data.status === "error") {
        alert(data.message);
      } else {
        setResult(data);
      }
    } catch (error) {
      console.error("Connection failed", error);
      alert("Ensure your Flask backend is running!");
    }
    setLoading(false);
  };

  // Naya function: Jab user input clear karna chahe manually
  const handleReset = () => {
    setSyllabus("");
    setProfession("");
    setResult(null);
  };

  return (
    <main className="p-8 max-w-4xl mx-auto bg-slate-900 text-white min-h-screen rounded-xl mt-10 shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-indigo-400">
            ⚡ SyllabusX
          </h1>
          <p className="text-sm text-slate-400">
            AI-Powered Academic Gap Analyser
          </p>
        </div>

        {/* Naya Reset Button */}
        <button
          onClick={handleReset}
          className="text-xs font-bold text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded transition-all"
        >
          Clear All
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
            College Syllabus
          </label>
          <textarea
            placeholder="e.g. DBMS, C, C++, Python, Computer Networks"
            className="w-full p-4 bg-slate-800 rounded-lg border border-slate-700 h-40 text-sm focus:border-indigo-500 focus:outline-none"
            value={syllabus}
            onChange={(e) => {
              setSyllabus(e.target.value);
              setResult(null); // JAISE HI TYPE KAREGA, PURANA RESULT GAYAB!
            }}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
            Target Profession
          </label>
          <textarea
            placeholder="e.g. Full Stack Web Developer"
            className="w-full p-4 bg-slate-800 rounded-lg border border-slate-700 h-40 text-sm focus:border-indigo-500 focus:outline-none"
            value={profession}
            onChange={(e) => {
              setProfession(e.target.value);
              setResult(null); // JAISE HI TYPE KAREGA, PURANA RESULT GAYAB!
            }}
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 p-4 rounded-lg font-bold transition-all disabled:opacity-50"
      >
        {loading ? "Running AI Pipeline..." : "Analyze Structural Gap"}
      </button>

      {result && result.status === "success" && (
        <div className="mt-8 p-6 bg-slate-800 rounded-xl border border-slate-700 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-700 pb-4">
            <span className="text-lg font-medium text-slate-300">
              Alignment Score
            </span>
            <span
              className={`text-4xl font-black ${result.matchScore > 50 ? "text-green-400" : "text-amber-400"}`}
            >
              {result.matchScore}%
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-red-400 mb-3">
                ❌ Missing Skills (10 Crucial Gaps)
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 rounded text-xs capitalize"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-green-400 mb-3">
                ✅ Covered in Syllabus
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matchingSkills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="bg-green-500/10 border border-green-500/20 text-green-300 px-3 py-1 rounded text-xs capitalize"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <h3 className="text-sm font-bold text-sky-400 mb-3">
              🚀 AI Industry Trends (Groq Llama-3.3)
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.marketTrendsAdvice.map((trend: string, i: number) => (
                <span
                  key={i}
                  className="bg-sky-500/10 border border-sky-500/30 text-sky-300 px-3 py-1.5 rounded-md text-xs font-mono"
                >
                  {trend}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
