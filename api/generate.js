export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { imageBase64, name, type, tone, referral } = req.body || {};
    const productName = (name || "Konten Kamu").trim();
    const contentType = (type || "campuran").toLowerCase();
    const toneChoice = (tone || "Inspiratif").trim();
    const referralLink = (referral || "").trim();

    // Basic fallback analysis (no external API)
    let analysis = { theme: "mixed", emotion: "neutral", keywords: [] };

    const low = productName.toLowerCase();
    if (low.includes("bangkit") || contentType.includes("motiva")) {
      analysis.theme = "motivation"; analysis.emotion = "optimistic"; analysis.keywords = ["semangat","bangkit"];
    } else if (contentType.includes("umkm") || low.includes("kopi") || low.includes("nasi")) {
      analysis.theme = "umkm"; analysis.emotion = "proud"; analysis.keywords = ["lokal","kualitas"];
    } else if (contentType.includes("personal")) {
      analysis.theme = "personal"; analysis.emotion = "confident"; analysis.keywords = ["cerita","perjalanan"];
    } else {
      analysis.theme = "mixed"; analysis.emotion = "neutral"; analysis.keywords = ["cerita","konten"];
    }

    // small helper templates
    function hook(theme, name) {
      if (theme === "motivation") return `Stop scroll dulu… ${name} punya pesan kuat hari ini.`;
      if (theme === "umkm") return `${name} — produk lokal yang layak lebih dikenal.`;
      if (theme === "personal") return `${name} punya perjalanan yang mungkin menginspirasi kamu.`;
      return `${name} — konten yang layak kamu lihat hari ini.`;
    }
    function problem(theme) {
      if (theme === "motivation") return "Seringkali kita butuh dorongan, tapi bingung harus mulai dari mana.";
      if (theme === "umkm") return "Banyak produk enak tapi susah dikenal karena exposure terbatas.";
      if (theme === "personal") return "Gak semua proses terekam, padahal nilainya besar.";
      return "Kadang langkah kecil terasa mustahil, padahal itu permulaan.";
    }
    function solution(theme) {
      if (theme === "motivation") return "Langkah kecil konsisten setiap hari—itu yang mengubah segalanya.";
      if (theme === "umkm") return "Bangun cerita di balik produk, jaga kualitas, konsisten berkarya.";
      if (theme === "personal") return "Bagikan proses, bukan sekadar hasil — orang akan terhubung.";
      return "Terus bergerak, bahkan pelan, lebih baik dari diam.";
    }
    function cta(ref) {
      if (ref) return `Lihat detail & dukung di komentar — link sudah saya taruh di sana 👇`;
      return "Tulis pengalamanmu di komentar — aku baca semuanya 👇";
    }

    // Build caption variants (HOOK - PROBLEM - SOLUTION - CTA - TAGS) -> NO direct referral link inside
    const captionVariants = [];
    for (let i=0;i<3;i++){
      captionVariants.push(
        `${hook(analysis.theme, productName)}\n\n${problem(analysis.theme)}\n\n${solution(analysis.theme)}\n\n${cta(referralLink)}\n\n#BangkitBersama #KontenLebihUtama #RuangNpaSmartSystem`
      );
    }

    // Build comment variants (we will include link only in variant 2 if referral exists)
    const commentVariants = [
      `${productName} — energinya kerasa banget 🔥\nProsesnya keliatan nyata, bukan sekadar gaya.`,
      `${productName} — baca ini beneran ngasih dorongan ✨\nKalau mau lihat detail & dukung, cek link di komentar ya.`,
      `Suka sama vibe ini 💛\nTeruskan prosesnya, satu langkah kecil tiap hari.`
    ];

    // If referral exists, we keep it in response so frontend can append it to comment variant 2
    const hashtags = ["#KontenLebihUtama","#SmartCreator2025","#UMKMBerproses","#BangkitBersama"].slice(0,5);

    const metaAdvice = "Gunakan caption HOOK→MASALAH→SOLUSI→CTA. Jangan hard-sell; letakkan link di komentar agar lebih aman untuk reach.";

    return res.status(200).json({
      analysis,
      captionVariants,
      commentVariants,
      hashtags,
      referralLink,
      metaAdvice
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal error", details: err.message });
  }
}
