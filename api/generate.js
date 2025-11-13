// api/generate.js — Viral Booster (final, meta-friendly comments, referral only in comment variant 2)
// Paste / overwrite this file in your repo -> Commit -> Vercel will auto deploy.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { imageBase64, name, type, tone, referral } = req.body || {};
    const title = (name || "Konten Kamu").trim();
    const contentType = (type || "campuran").toLowerCase();
    const toneChoice = (tone || "Inspiratif").trim();
    const referralLink = (referral || "").trim();

    // -----------------------
    // 1) PSEUDO-VISION: quick labels from inputs
    // -----------------------
    const labels = [];
    const low = title.toLowerCase();

    if (imageBase64) labels.push("image_uploaded");
    if (low.match(/ngopi|kopi|coffee|warung|cafe/)) labels.push("kuliner");
    if (low.match(/nasi|mie|bakso|kue|makanan/)) labels.push("kuliner");
    if (low.match(/bangkit|berproses|motivasi|semangat|perjalanan/)) labels.push("motivasi");
    if (low.match(/testimoni|review|hasil|jualan|produk/)) labels.push("produk");
    if (contentType.includes("umkm")) labels.push("umkm");
    if (contentType.includes("motiv")) labels.push("motivasi");
    if (contentType.includes("personal")) labels.push("personal");
    if (!labels.length) labels.push("general");

    // derive theme
    const theme =
      labels.includes("motivasi") ? "motivation" :
      labels.includes("umkm") ? "umkm" :
      labels.includes("kuliner") ? "umkm" :
      labels.includes("personal") ? "personal" : "mixed";

    // -----------------------
    // 2) Tone mapping
    // -----------------------
    const toneMap = {
      "Inspiratif": "hangat, menguatkan, dan puitis",
      "Santai": "ringan, akrab, seperti ngobrol",
      "Profesional": "rapi, bernilai, fokus manfaat",
      "Friendly": "ramah, dekat, sehari-hari"
    };
    const toneDesc = toneMap[toneChoice] || toneMap["Friendly"];

    // -----------------------
    // 3) Helper text builders
    // -----------------------
    function buildHook(theme, t) {
      if (theme === "motivation") return `${t} — sebentar, ini mungkin pesan yang kamu butuhkan hari ini.`;
      if (theme === "umkm") return `${t} — kisah kecil dengan rasa besar.`;
      if (theme === "personal") return `${t} — cerita yang hangat dan nyata.`;
      return `${t} — konten yang layak kamu baca.`;
    }
    function buildProblem(theme) {
      if (theme === "motivation") return "Seringkali kita ngerasa stuck, bingung harus mulai dari mana.";
      if (theme === "umkm") return "Banyak produk berkualitas tapi sulit ditemukan karena exposure terbatas.";
      if (theme === "personal") return "Proses jarang terekam, padahal itu bagian penting dari perjalanan.";
      return "Kadang langkah kecil terasa mustahil, padahal itu permulaan.";
    }
    function buildSolution(theme) {
      if (theme === "motivation") return "Mulai dari langkah kecil, konsisten hari demi hari — itu yang mengubah semuanya.";
      if (theme === "umkm") return "Bangun cerita di balik produk, jaga kualitas, konsisten komunikasi.";
      if (theme === "personal") return "Bagikan prosesmu; kejujuran itu magnet bagi orang yang butuh inspirasi.";
      return "Lakukan sesuatu hari ini, sekecil apa pun, supaya besok jadi lebih ringan.";
    }
    function buildCTA(hasReferral) {
      if (hasReferral) return "Info lengkap & dukungan ada di komentar — cek di sana ya 👇";
      return "Kalau relate, tulis pengalamanmu di komentar — aku baca semuanya 👇";
    }

    // -----------------------
    // 4) Caption Variants (HOOK → PROBLEM → SOLUTION → CTA → TAG) — NO DIRECT LINK
    // -----------------------
    const captionVariants = [];
    const tagsDefault = ["#BangkitBersama", "#KontenLebihUtama", "#RuangNpaSmartSystem"];

    for (let i=0;i<3;i++) {
      const hook = buildHook(theme, title);
      const problem = buildProblem(theme);
      const solution = buildSolution(theme);
      const cta = buildCTA(!!referralLink);
      // small stylistic variations by i
      const opener = i===1 ? "Jangan skip ini." : (i===2 ? "Baca dulu, sebelum lanjut scroll." : "");
      const caption =
`${opener ? opener + "\n\n" : ""}${hook}

${problem}

${solution}

${cta}

${tagsDefault.join(' ')}${i===2 ? " #SmartCreator2025" : ""}`;
      captionVariants.push(caption);
    }

    // -----------------------
    // 5) Comment Variants (META-FRIENDLY, SOFT CTA, NATURAL) — referral only appended to variant 2
    //    We'll create 4 comment variants to give more options (user can pick)
    // -----------------------
    const commentVariants = [];

    // Variant 1: Emotional + short
    commentVariants.push(
`${title} — energinya kerasa banget 🔥
Prosesnya nyata, bukan sekadar gaya.`
    );

    // Variant 2: Soft CTA + referral placeholder (frontend will append link)
    commentVariants.push(
`${title} — baca ini beneran ngasih dorongan ✨
Bikin tambah semangat buat jalanin proses.`
    );

    // Variant 3: Conversational question (encourages replies)
    commentVariants.push(
`Suka sama vibe ini 💛
Kalau kamu, langkah kecil apa yang kamu ambil hari ini?`
    );

    // Variant 4: Credibility + soft push
    commentVariants.push(
`Keren banget, ini tipe konten yang menguatkan orang lain.
Terus bagi prosesnya — orang bakal terhubung.`
    );

    // If referral exists, we keep it in response so frontend can append it to comment variant 2
    // (frontend will append as harmless soft link text; not forced in caption)
    const metaAdvice = `Tips: gunakan caption HOOK→MASALAH→SOLUSI→CTA. Letakkan link di komentar (soft), jangan hard-sell. Gunakan 3–5 hashtag relevan.`;

    // -----------------------
    // 6) Response
    // -----------------------
    return res.status(200).json({
      ok: true,
      analysis: {
        labels,
        theme,
        tone: toneChoice,
        toneDesc
      },
      captionVariants,
      commentVariants,
      hashtags: tagsDefault,
      referralLink: referralLink, // frontend will show it only in comment variant 2
      metaAdvice
    });

  } catch (err) {
    console.error("generate err:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
