# MOMOY AI - OSINT Cyber Security Analyzer

MOMOY AI adalah aplikasi berbasis web yang dirancang untuk mendeteksi dan menganalisis potensi ancaman keamanan siber seperti **phishing, scam, malware, dan rekayasa sosial (social engineering)** menggunakan teknologi kecerdasan buatan (Artificial Intelligence) dari Google Gemini. 

Aplikasi ini menerima input berupa teks (link, pesan mencurigakan) maupun gambar (screenshot bukti chat/email) untuk dianalisis secara mendalam melalui metode OSINT (Open Source Intelligence), lalu menyajikan hasilnya dalam bentuk skor tingkat risiko dan rekomendasi mitigasi yang mudah dipahami oleh pengguna awam.

---

## Fitur Utama
- **Deteksi Teks & Link:** Menganalisis indikasi penipuan pada teks pesan atau tautan mencurigakan yang dikirim pelaku.
- **Analisis Screenshot:** Memindai gambar bukti chat, email, atau halaman web palsu menggunakan kapabilitas multimodal AI.
- **Skor Risiko Real-time:** Menyajikan tingkat ancaman secara transparan mulai dari *LOW*, *MEDIUM*, *HIGH*, hingga *CRITICAL*.
- **Rekomendasi Keamanan:** Memberikan langkah-langkah konkret dan taktis untuk menghindari ancaman yang terdeteksi.

---

## Arsitektur & Teknologi
- **Frontend:** React.js / Vite (Tailwind CSS)
- **Backend:** Node.js, Express.js
- **AI Engine:** `@google/genai` (SDK Resmi Google Gemini)
- **Model AI:** `gemini-2.5-flash` (Jalur cepat, stabil, dan responsif)

---

## Panduan Instalasi & Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan MOMOY AI di komputer lokal Anda:

### 1. Kloning Repositori
```bash
git clone [https://github.com/muhammadryga936/Momoy-AI.git](https://github.com/muhammadryga936/Momoy-AI.git)
cd Momoy-AI