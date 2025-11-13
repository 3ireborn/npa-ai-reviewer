// api/generate.js
// Viral Booster final — CTA style: B (Netral & Halus). No external API required (fallback pseudo-vision).

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { imageBase64, name, type, tone, referral } = req.body || {};
    const title = (name || "Konten Kamu").trim();
    const contentType = (type || "campuran").toLowerCase();
    const toneChoice = (tone || "Inspiratif").trim();
    const referralLink = (referral || "").trim();

    // ----------------
    // PSEUDO-VISION & LABELS
    // ----------------
    const labels = [];
    const low = title.toLowerCase();
    if (imageBase64) labels.push("image_uploaded");
    if (low.match(/ngopi|kopi|coffee|warung|cafe|kuliner|makanan/)) labels.push("kuliner");
    if (low.match(/nasi|mie|bakso|kue/)) labels.push("kuliner");
    if (low.match(/bangkit|berproses|motivasi|semangat|perjalanan/)) labels.push("motivasi");
    if (low.match(/testimoni|review|hasil|jualan|produk|usaha/)) labels.push("produk");
    if (contentType.includes("umkm")) labels.push("umkm");
    if (contentType.includes("motiv")) labels.push("motivasi");
    if (contentType.includes("personal")) labels.push("personal");
    if (!labels.length) labels.push("general");

    const theme = labels.includes("motivasi") ? "motivation" :
                  labels.includes("umkm") ? "umkm" :
                  labels.includes("personal") ? "personal" : "mixed";

    // ----------------
    // Tone mapping
    // ----------------
    const toneMap = {
      "Inspiratif": "hangat, menguatkan, dan puitis",
      "Santai": "ringan, akrab, seperti ngobrol",
      "Profesional": "rapi, fokus pada manfaat",
      "Friendly": "ramah dan dekat"
    };
    const toneDesc = toneMap[toneChoice] || toneMap["Friendly"];

    // ----------------
    // Helpers: story-selling builders
    // ----------------
    function hook(theme, t){
      if (theme === "motivation") return `${t} — sebentar, ini pesan yang mungkin mengubah harimu.`;
      if (theme === "umkm") return `${t} — kisah kecil, rasa yang besar.`;
      if (theme === "personal") return `${t} — cerita jujur dari perjalanan nyata.`;
      return `${t} — ini layak kamu baca.`;
    }
    function problem(theme){
      if (theme === "motivation") return "Kita sering merasa stuck, bingung harus mulai dari mana.";
      if (theme === "umkm") return "Banyak produk hebat yang belum ditemukan karena exposure terbatas.";
      if (theme === "personal") return "Proses sering tak terlihat padahal itulah yang paling berharga.";
      return "Kadang langkah kecil terasa berat, padahal itu awal dari perubahan.";
    }
    function solution(theme){
      if (theme === "motivation") return "Mulai dari langkah paling kecil—konsistensi yang membentuk hasil.";
      if (theme === "umkm") return "Fokus pada kualitas + cerita; orang membeli karena terhubung dengan cerita.";
      if (theme === "personal") return "Bagikan proses, bukan hanya hasil; itu membuat orang terhubung.";
      return "Ambil satu langkah hari ini, sekecil apa pun.";
    }
    function cta_netral(hasRef){
      // CTA style B: Netral & Halus
      if (hasRef) return "Info lengkap dan dukungan aku taruh di komentar — silakan cek di sana.";
      return "Kalau kamu relate, tulis pengalamanmu di komentar — aku baca semuanya.";
    }

    // ----------------
    // Build caption variants (3) — HOOK -> PROBLEM -> SOLUTION -> CTA -> TAG
    // ----------------
    const tagsBase = ["#BangkitBersama","#KontenLebihUtama","#RuangNpaSmartSystem","#SmartCreator2025"];
    const captionVariants = [];
    for (let i=0;i<3;i++){
      const opener = i===1 ? "Jangan lewatkan..." : i===2 ? "Baca ini dulu." : "";
      const cap = `${opener ? opener + "\n\n" : ""}${hook(theme, title)}

${problem(theme)}

${solution(theme)}

${cta_netral(!!referralLink)}

${tagsBase.join(' ')}${i===2 ? " #UMKMBerproses" : ""}`;
      captionVariants.push(cap);
    }

    // ----------------
    // Build comment variants (3 strong meta-friendly + 1 extra)
    // referral only for variant index 1 (frontend will append link in UI)
    // ----------------
    const commentVariants = [];

    commentVariants.push(
`${title} — energinya kerasa banget 🔥
Prosesnya terlihat nyata, bukan sekadar gaya.`
    );

    commentVariants.push(
`${title} — baca ini beneran menguatkan ✨
Jika ingin dukung atau lihat detail, cek komentar — aku taruh link di sana.`
    );

    commentVariants.push(
`Suka sama vibe ini 💛
Kalau kamu, langkah kecil apa yang hari ini kamu ambil?`
    );

    // optional 4th variant (credibility)
    commentVariants.push(
`Keren banget—jenis konten yang ngasih semangat.
Terus bagikan prosesnya supaya lebih banyak yang terhubung.`
    );

    // ----------------
    // Hashtags & metaAdvice
    // ----------------
    const hashtags = ["#KontenLebihUtama","#SmartCreator2025","#UMKMBerproses","#BangkitBersama","#DukungLokal"].slice(0,6);
    const metaAdvice = "Gunakan pola HOOK→MASALAH→SOLUSI→CTA. Letakkan link di komentar (soft). Hindari hard-sell agar reach tetap baik.";

    // ----------------
    // Return
    // ----------------
    return res.status(200).json({
      ok: true,
      analysis: { labels, theme, tone: toneChoice, toneDesc },
      captionVariants,
      commentVariants,
      hashtags,
      referralLink: referralLink, // frontend will show soft link only in comment variant 2
      metaAdvice
    });

  } catch (err) {
    console.error('ERR generate:', err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
