export default async function handler(req, res) {
  try {
    const { imageBase64, name, type, tone, referral } = req.body;

    // ===============================
    // 1. ANALISIS KONTEN (pseudo-vision)
    // ===============================
    let analysis = [];

    if (name.match(/ngopi|kopi|coffee/i)) {
      analysis.push("Suasana hangat, akrab, dan penuh obrolan bermakna.");
    }
    if (name.match(/bangkit|berproses|motivasi|semangat/i)) {
      analysis.push("Tema perjuangan, perjalanan proses, serta energi positif.");
    }
    if (!analysis.length) {
      analysis.push("Konten bernuansa personal dengan pesan yang membangun.");
    }

    // ===============================
    // 2. TONE GAYA BAHASA
    // ===============================
    const toneMap = {
      Inspiratif:
        "nada hangat, menguatkan, dan penuh dorongan untuk berubah.",
      Santai:
        "gaya ringan, tidak menggurui, seperti ngobrol bareng teman lama.",
      Profesional:
        "bahasa rapi, rapi, terstruktur, dan fokus pada value & manfaat.",
      Friendly:
        "ramah, dekat, memakai bahasa sehari-hari namun tetap sopan."
    };

    const toneStyle = toneMap[tone] || toneMap["Friendly"];

    // ===============================
    // 3. KOMENTAR META-FRIENDLY
    // ===============================
    const commentVariants = [
      `${name} — energinya kerasa banget 🔥  
Prosesnya keliatan nyata, bukan sekadar gaya.`,
      `${name} — baca ini beneran nyentuh ✨  
Bikin tambah semangat buat jalanin proses.`,
      `Suka banget vibe dari ${name} 💛  
Teruskan prosesnya, satu langkah kecil tiap hari.`
    ];

    // Jika ada referral → hanya variant 2 yg diberi CTA komentar
    if (referral) {
      commentVariants[1] += `\nCek detailnya di komentar, link sudah aku taruh di bawah 👇`;
    }

    // ===============================
    // 4. CAPTION POLA HOOK → PROBLEM → SOLUTION → CTA
    // ===============================
    const captionVariants = [];

    captionVariants.push(
`**HOOK:**  
${name} punya pesan kuat hari ini.  
Baca ini sebelum lanjut scroll 👇  

**MASALAH:**  
Seringkali kita ngerasa stuck… bingung harus mulai dari mana.  
Kadang takut melangkah, kadang ragu sama proses sendiri.  

**SOLUSI:**  
Tapi perubahan itu dimulai dari langkah kecil yang konsisten.  
Nggak perlu cepat—yang penting terus bergerak.  

**CTA:**  
Detail & dukungan ada di komentar (cek bagian bawah).  

**TAG:**  
#BangkitBersama #RuangNpaSmartSystem`
    );

    captionVariants.push(
`**HOOK:**  
Stop dulu… mungkin ini pesan yang kamu butuhkan hari ini.  

**MASALAH:**  
Semangat turun? Pikiran penuh? Merasa sendirian di perjalanan?  

**SOLUSI:**  
Tarik napas. Fokus satu langkah saja.  
Kadang langkah pelan itu lebih berarti daripada diam sama sekali.  

**CTA:**  
Cek info dan dukungan di komentar 👇  

**TAG:**  
#SmartCreator2025 #UMKMProses`
    );

    // ===============================
    // 5. HASHTAGS OTOMATIS
    // ===============================
    const hashtags = [
      "#KontenLebihUtama",
      "#SmartCreator2025",
      "#UMKMBerproses",
      "#BangkitBersama",
      "#RuangNpaSmartSystem"
    ];

    // ===============================
    // 6. RETURN JSON
    // ===============================
    return res.status(200).json({
      analysis,
      commentVariants,
      captionVariants,
      hashtags,
      referralLink: referral || "",
      metaAdvice: "Gunakan caption dengan pola HOOK → MASALAH → SOLUSI → CTA untuk memaksimalkan reach organik."
    });

  } catch (err) {
    console.log("ERR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
