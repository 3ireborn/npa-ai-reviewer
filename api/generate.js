export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { imageBase64, name, type, tone, referral } = req.body || {};

    const productName = name?.trim() || "Konten Kamu";
    const contentType = type?.trim()?.toLowerCase() || "umkm";
    const toneStyle = tone?.trim() || "Santai";
    const referralLink = referral?.trim() || "";

    // =====================================================================
    // 1. ANALISA FALLBACK (tanpa API key, tetap jalan)
    // =====================================================================

    let analysis = {
      theme: "mixed",
      emotion: "neutral",
      keywords: [],
      textsFound: []
    };

    // Deteksi tema dasar (tanpa AI Vision)
    if (productName.toLowerCase().includes("bangkit") || contentType === "motivasi") {
      analysis.theme = "motivation";
      analysis.emotion = "optimistic";
      analysis.keywords = ["semangat", "bangkit", "perubahan"];
    } 
    else if (contentType === "umkm" || productName.toLowerCase().includes("nasi") || productName.toLowerCase().includes("kopi")) {
      analysis.theme = "umkm";
      analysis.emotion = "proud";
      analysis.keywords = ["produk lokal", "kualitas", "rasa"];
    }
    else if (contentType === "personal") {
      analysis.theme = "personal";
      analysis.emotion = "confident";
      analysis.keywords = ["cerita", "perjalanan", "inspirasi"];
    }

    // =====================================================================
    // 2. TEMPLATE TEKS
    // =====================================================================

    function makeHook(theme, name) {
      if (theme === "motivation") return `Stop scroll dulu… ${name} punya pesan kuat hari ini.`;
      if (theme === "umkm") return `${name} — produk lokal yang layak lebih dikenal.`;
      if (theme === "personal") return `${name} punya perjalanan yang gak semua orang tahu.`;
      return `${name} — konten yang layak kamu lihat hari ini.`;
    }

    function makeProblem(theme) {
      if (theme === "motivation") return "Kadang kita ngerasa stuck, bingung harus mulai dari langkah mana.";
      if (theme === "umkm") return "Banyak produk bagus di luar sana, tapi belum terlihat karena kurang exposure.";
      if (theme === "personal") return "Gak semua proses itu mudah, tapi semua proses itu berarti.";
      return "Seringkali kita lupa bahwa langkah kecil pun sudah termasuk progres.";
    }

    function makeSolution(theme) {
      if (theme === "motivation") return "Perubahan dimulai dari keberanian untuk melangkah meski pelan.";
      if (theme === "umkm") return "Kualitas yang konsisten selalu menang di hati pelanggan.";
      if (theme === "personal") return "Bagikan perjalananmu, karena mungkin itu bisa menguatkan orang lain.";
      return "Lanjutkan langkah kecil itu — hasil besar datang dari kebiasaan kecil.";
    }

    function makeCTA(ref) {
      if (ref) return `Selengkapnya bisa cek di sini 👇\n${ref}`;
      return "Kalau kamu relate, tulis pendapatmu di komentar 👇";
    }

    // =====================================================================
    // 3. GENERATE 3 CAPTION
    // =====================================================================

    let captionVariants = [];

    for (let i = 0; i < 3; i++) {
      const hook   = makeHook(analysis.theme, productName);
      const prob   = makeProblem(analysis.theme);
      const sol    = makeSolution(analysis.theme);
      const cta    = makeCTA(referralLink);

      captionVariants.push(
        `${hook}\n\n${prob}\n\n${sol}\n\n${cta}\n\n#KontenLebihUtama #RuangNpaSmartSystem #SmartCreator2025`
      );
    }

    // =====================================================================
    // 4. GENERATE 3 KOMENTAR META-FRIENDLY
    // =====================================================================

    const commentVariants = [
      `${productName} — energinya kerasa banget 🔥\nProsesnya keliatan nyata, bukan sekadar gaya.`,
      `Keren! Konten kayak gini tuh nyentuh banget ✨\nBikin kita pengen ikut berkembang juga.`,
      `Ini tipe postingan yang bikin semangat naik lagi 💛\nTerus lanjutkan prosesnya!`
    ];

    // =====================================================================
    // 5. HASHTAG
    // =====================================================================

    const hashtags = [
      "#KontenLebihUtama",
      "#SmartCreator2025",
      "#UMKMBerproses",
      "#BangkitBersama",
      "#RuangNpaSmartSystem"
    ];

    // =====================================================================
    // 6. RETURN JSON
    // =====================================================================

    return res.status(200).json({
      analysis,
      captionVariants,
      commentVariants,
      hashtags,
      referralLink,
      metaAdvice:
        "Gunakan caption dengan pola HOOK → MASALAH → SOLUSI → CTA. Jangan spam ajakan. Pakai 3–6 hashtag relevan."
    });

  } catch (err) {
    console.log("ERR:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
      }
