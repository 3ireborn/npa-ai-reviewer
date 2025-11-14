// /api/generate.js
// NPA AI Reviewer - No API Key - MODE C3 (Motivasi 70% + Story 30%)
// Paste this file into your repo: /api/generate.js
export default async function handler(req, res) {
  try {
    const body = req.body || {};
    const {
      name = "",
      preset = "",
      nameManual = "",
      type = "",
      tone = "",
      referral = "",
      imageBase64 = null,
      ctaStyle = "B"
    } = body;

    // --- Helper small util ---
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function joinNonEmpty(lines) { return lines.filter(Boolean).join("\n\n"); }

    // --- Derive title (from manual or preset or name) ---
    const title = (nameManual || name || preset || "Konten Kamu").trim();

    // --- Simple "pseudo-image context" via filename (if provided filename in name or preset) ---
    // If imageBase64 present, we can't read filename here, but we can detect existence
    const labels = [];
    if (imageBase64) labels.push("gambar_diunggah");

    const lower = title.toLowerCase();
    if (lower.includes("kopi") || lower.includes("ngopi")) labels.push("kuliner");
    if (lower.includes("umkm") || lower.includes("produk")) labels.push("umkm");
    if (lower.includes("motiv") || lower.includes("semangat")) labels.push("motivasi");
    if (lower.includes("perjalanan") || lower.includes("hidup")) labels.push("life");
    if (!labels.length) labels.push("umum");

    // --- Preset templates (kepribadian tiap preset) ---
    const presetMap = {
      "Story-Selling UMKM": { hook: "Perjalanan kecil ini ternyata menyimpan pesan besar.", style: "hangat, jujur, proses" },
      "Motivasi Harian": { hook: "Stop scroll dulu sebentar...", style: "memotivasi, ringan" },
      "Bisnis & Income": { hook: "Kadang peluang itu datang diam-diam…", style: "visioner, optimis" },
      "Islami / Spiritual": { hook: "Ada hikmah yang sering luput kita lihat…", style: "tenang, penuh makna" },
      "Parenting / Keluarga": { hook: "Di balik momen kecil ini, ada pelajaran besar.", style: "hangat, emosional" },
      "Edukasi / Tips": { hook: "Tahukah kamu…", style: "informasi, praktis" },
      "Perjalanan Hidup": { hook: "Kadang hidup memberi tanda, bukan jawaban.", style: "reflektif, dalam" },
      "Konten Harian": { hook: "Sedikit cerita hari ini…", style: "ringan, personal" },
      "Soft Selling": { hook: "Sebelum kita bahas lebih jauh…", style: "halus, elegan" },
      "Personal Branding": { hook: "Setiap langkah kecil membentuk karakter besar.", style: "kuat, penuh suara" }
    };
    const presetObj = presetMap[preset] || presetMap["Soft Selling"];

    // --- C3 weighting: motivation 70% / story 30% ---
    // We'll create content pieces from "motivation" pools and "story" pools and mix them.
    const motivationHooks = [
      "Stop scroll dulu… mungkin ini yang kamu butuhkan hari ini.",
      "Sekilas pesan kecil yang mungkin mengubah harimu.",
      "Kalimat singkat ini bisa jadi pengingat kecil hari ini."
    ];
    const motivationProblems = [
      "Kadang langkah terasa berat dan kita bingung harus mulai dari mana.",
      "Banyak dari kita ngerasa stuck walau punya niat besar.",
      "Sering merasa ragu karena takut hasilnya belum kelihatan."
    ];
    const motivationSolutions = [
      "Mulailah dari langkah paling kecil — konsistensi kecil lebih ampuh dari usaha sekali besar.",
      "Fokus pada proses, bukan hasil. Hasil akan mengikuti waktu dan usaha.",
      "Buat target paling kecil hari ini — itu sudah kemenangan."
    ];

    const storyHooks = [
      "Ada cerita kecil di balik layar ini.",
      "Dari satu langkah sederhana, cerita ini bermula.",
      "Sejenak dengarkan kisah singkat ini."
    ];
    const storyProblems = [
      "Dulu tokoh ini juga merasa ragu, bahkan hampir menyerah.",
      "Prosesnya tidak mulus — ada hari yang terasa mustahil.",
      "Banyak hambatan yang harus dilalui sebelum terlihat perubahan."
    ];
    const storySolutions = [
      "Yang berubah bukan hari, tapi kebiasaan kecil yang konsisten.",
      "Cerita ini mengingatkan: maju sedikit demi sedikit lebih baik daripada tidak sama sekali.",
      "Dengan bertahan satu hari lagi, hal kecil berubah jadi awal yang besar."
    ];

    // mix function: more motivation than story
    function mixedPick(motivArr, storyArr) {
      // 70% motiv, 30% story
      return Math.random() < 0.7 ? pick(motivArr) : pick(storyArr);
    }

    // CTA builder (soft)
    function buildCTA(hasReferral) {
      if (ctaStyle === "A") {
        return hasReferral ? "Detail lengkapnya sudah aku taruh di komentar ya 👇" : "Kalau relate, tulis pendapatmu di komentar.";
      }
      if (ctaStyle === "C") {
        return hasReferral ? "Kalau penasaran, cek komentar — link aku letakkan di sana 👇" : "Share pendapatmu di komentar, yuk!";
      }
      // default B (netral)
      return hasReferral ? "Detail & catatan aku taruh di komentar bawah — silakan cek ya." : "Kalau relate, tinggal tulis pendapatmu di komentar.";
    }

    const hasReferral = !!referral;
    const cta = buildCTA(hasReferral);

    // Build 3 caption variants
    const captionVariants = [];
    for (let i=0;i<3;i++){
      const hook = i === 0 ? (presetObj.hook || mixedPick(motivationHooks, storyHooks)) : mixedPick(motivationHooks, storyHooks);
      const problem = mixedPick(motivationProblems, storyProblems);
      const solution = mixedPick(motivationSolutions, storySolutions);
      const tags = "#KontenLebihUtama #SmartCreator2025 #BangkitBersama";
      const extra = (labels.includes("umkm")) ? "Cerita prosesnya yang bikin orang percaya." : "";

      const caption = joinNonEmpty([
        hook,
        problem,
        solution + (extra ? "\n\n" + extra : ""),
        cta,
        tags
      ]);
      captionVariants.push(caption);
    }

    // Build 4 comment variants (meta-friendly)
    const commentPool = [
      "Kerasa banget value yang kamu bagi di sini ✨",
      "Postingan begini tuh hangat — bikin semangat orang lain.",
      "Energi dan kejujuran dari postingan ini kerasa banget.",
      "Prosesnya kerasa nyata, bukan sekadar gaya. Bagus terus ya!",
      "Ada vibe positif dari sini — semoga makin banyak yang dapat manfaat."
    ];
    // pick 4 (allow duplicates if small pool)
    const commentVariants = [];
    const order = [0,1,2,3];
    order.forEach(()=> {
      const base = pick(commentPool);
      const ending = hasReferral ? `\n\nCatatan lengkap & link dukungan aku taruh di komentar bawah.` : `\n\nKalau kamu setuju, tulis pendapatmu di komentar ya.`;
      commentVariants.push(base + ending);
    });

    // If referral exists, include a soft referral note that UI can place into comment
    const referralNote = hasReferral ? `Soft link: ${referral}` : "";

    // Hashtags + Advice
    const hashtags = ["#KontenLebihUtama", "#SmartCreator2025", "#BangkitBersama"];
    const metaAdvice = "Gunakan pola HOOK → MASALAH → SOLUSI → CTA → TAG. Letakkan link hanya di komentar dengan kata-kata halus, hindari hard-sell.";

    // analysis object (pseudo)
    const analysis = {
      labels,
      theme: labels.includes("motivasi") ? "motivasi" : (labels.includes("umkm") ? "umkm" : "general"),
      presetUsed: preset || "Soft Selling",
      tone: tone || "Inspiratif",
      imageProvided: !!imageBase64
    };

    // Return structured JSON (frontend expects these keys)
    return res.status(200).json({
      ok: true,
      analysis,
      captionVariants,
      commentVariants,
      hashtags,
      referralLink: referral || "",
      referralNote,
      metaAdvice
    });

  } catch (err) {
    console.error("generate error:", err);
    return res.status(500).json({ ok:false, error: err.message || String(err) });
  }
      }
