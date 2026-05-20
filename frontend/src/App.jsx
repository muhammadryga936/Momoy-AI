import React, { useState, useRef } from "react";
import { Upload, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [activeTab, setActiveTab] = useState("text");
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const runAnalysis = async () => {
    if (!inputText && !selectedImage) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const resp = await fetch("https://momoy-backend-632647169363.asia-southeast2.run.app/api/analyze", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ text: inputText, imageUrl: selectedImage })
      });
      
      const data = await resp.json();
      setResult(data);
    } catch (err) {
      console.error("ERROR FRONTEND:", err);
      setResult({
        risk_level: "HIGH",
        threat_type: "Koneksi Gagal",
        summary: "Frontend gagal terhubung ke server backend Momoy Cloud.",
        details: ["Pastikan laptop Anda terhubung ke internet."],
        recommendations: ["Coba refresh halaman dan ulangi beberapa saat lagi."],
        red_flags: ["FETCH_FAILED"]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "CRITICAL": return "text-red-500 border-red-500/30 bg-red-500/10";
      case "HIGH": return "text-orange-500 border-orange-500/30 bg-orange-500/10";
      case "MEDIUM": return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10";
      default: return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
    }
  };

  return (
    <div className="min-h-screen technical-grid pb-20 text-slate-200">
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-5xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-mono font-black text-xl tracking-wider text-white">MOMOY</h1>
              <p className="text-[10px] font-mono opacity-50 tracking-tight">MONITORING & MODERATION SYSTEM</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ENGINE_ACTIVE
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-12 max-w-5xl">
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex border-b border-white/5 font-mono text-xs tracking-wider">
            <button 
              onClick={() => setActiveTab("text")} 
              className={`py-4 flex-1 font-bold uppercase transition-all ${activeTab === "text" ? "bg-white/[0.04] text-indigo-400 border-b-2 border-indigo-500" : "opacity-60 hover:opacity-100"}`}
            >
              Analisis Teks / URL
            </button>
            <button 
              onClick={() => setActiveTab("upload")} 
              className={`py-4 flex-1 font-bold uppercase transition-all ${activeTab === "upload" ? "bg-white/[0.04] text-indigo-400 border-b-2 border-indigo-500" : "opacity-60 hover:opacity-100"}`}
            >
              Screenshot
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === "text" ? (
              <textarea 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                placeholder="Tempel pesan SMS, chat WhatsApp, atau tautan mencurigakan di sini..." 
                className="w-full h-40 bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-sm focus:outline-none focus:border-indigo-500/40 transition-colors resize-none placeholder:opacity-30" 
              />
            ) : (
              <div 
                onClick={() => fileInputRef.current.click()} 
                className="w-full h-40 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-black/20 hover:bg-white/[0.02] transition-all group"
              >
                {selectedImage ? (
                  <div className="h-full p-2">
                    <img src={selectedImage} className="h-full object-contain rounded-lg" alt="Upload preview" />
                  </div>
                ) : (
                  <>
                    <Upload className="text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors" size={28}/>
                    <span className="text-xs font-mono opacity-50">Unggah screenshot</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef} 
                  hidden 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setSelectedImage(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
              </div>
            )}
            
            <button 
              onClick={runAnalysis} 
              disabled={isAnalyzing || (!inputText && !selectedImage)}
              className="mt-6 w-full py-4 bg-indigo-600 disabled:bg-indigo-800/40 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-mono font-bold text-sm tracking-widest text-white hover:bg-indigo-500 transition-all"
            >
              {isAnalyzing ? "Scanning..." : "MULAI PINDAI ANCAMAN"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              className="mt-8 p-6 glass-card rounded-2xl border border-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono opacity-50 block tracking-widest">HASIL DETEKSI SISTEM</span>
                  <h3 className="text-xl font-mono font-bold text-white mt-1">{result.threat_type || "Ancaman Siber"}</h3>
                </div>
                <div className={`px-4 py-1.5 border rounded-full text-xs font-mono font-bold tracking-wider ${getRiskColor(result.risk_level)}`}>
                  ⚠️ {result.risk_level || "UNKNOWN"} RISK
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono text-indigo-400 tracking-wider uppercase mb-2">Hasil Analisis:</h4>
                  <p className="text-sm leading-relaxed text-slate-300 bg-white/[0.01] border border-white/5 p-4 rounded-xl font-mono">{result.summary}</p>
                </div>

                {result.details && result.details.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono text-amber-400 tracking-wider uppercase mb-2">Tanda-tanda Kecurigaan:</h4>
                    <ul className="space-y-2">
                      {result.details.map((detail, idx) => (
                        <li key={idx} className="text-xs font-mono text-slate-400 flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">▪</span> {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="border-t border-white/5 pt-4">
                    <h4 className="text-xs font-mono text-emerald-400 tracking-wider uppercase mb-2">Solusi yang diberikan:</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-xs font-mono text-slate-300 flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg">
                          <CheckCircle className="text-emerald-400 w-4 h-4 shrink-0 mt-0.5"/> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}