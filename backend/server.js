import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const HARDCODED_API_KEY = "AIzaSyAt7N4vg0kVK_whSbBr1LhkfhlN-xkZuLo";
const ai = new GoogleGenAI({ apiKey: HARDCODED_API_KEY });

const SYSTEM_INSTRUCTION = `Anda adalah MOMOY, pakar siber OSINT. 
Analisis input untuk deteksi phishing, scam, malware, dan rekayasa sosial. 
Anda WAJIB memberikan output dalam format JSON murni tanpa pembuka/penutup markdown seperti berikut:
{
  "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "threat_type": "Nama Jenis Ancaman",
  "summary": "Rangkuman singkat bahasa awam",
  "details": ["array isi detail"],
  "recommendations": ["array isi rekomendasi"],
  "red_flags": ["array isi bendera merah kecurigaan"]
}`;

app.post("/api/analyze", async (req, res) => {
  console.log("📥 Menerima request analisis baru...");
  try {
    const { text, imageUrl } = req.body;
    const contents = [];

    if (text && text.trim() !== "") {
      contents.push(`Analisis kritis teks berikut: ${text}`);
    }
    
    if (imageUrl && imageUrl.includes(",")) {
      const base64Data = imageUrl.split(",")[1];
      if (base64Data) {
        contents.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        });
      }
    }

    if (contents.length === 0) {
      return res.status(200).json({ 
        risk_level: "LOW",
        threat_type: "Tidak Ada Input",
        summary: "Sistem tidak mendeteksi adanya input teks atau gambar.",
        details: ["Silakan masukkan teks atau screenshot terlebih dahulu."],
        recommendations: ["Buka tab screenshot dan masukkan file."],
        red_flags: []
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const responseText = response.text;
    return res.status(200).json(JSON.parse(responseText));
    
  } catch (err) {
    console.error("🔥 ERROR BACKEND:", err.message);
    
    return res.status(200).json({
      risk_level: "HIGH",
      threat_type: "Analisis Macet (API Error)",
      summary: `MOMOY Core gagal memproses data dari server AI Google: ${err.message}`,
      details: ["Koneksi berhasil terhubung ke pusat AI, tetapi server Google menolak permintaan Anda."],
      recommendations: ["Pastikan kuota API Key Gemini Anda tidak habis, atau coba pakai gambar screenshot yang berbeda."],
      red_flags: ["API Request Rejected"]
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n==============================================`);
  console.log(`🛡️  MOMOY HARDCODED API SERVER ACTIVE ON PORT ${PORT}`);
  console.log(`==============================================\n`);
});