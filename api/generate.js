// ================================
//  NPA AI Reviewer - NO API KEY VERSION
//  Fallback Ultra Pro Generator
//  Tidak memanggil API luar
//  Menggunakan prompt builder internal
// ================================

export default async function handler(req, res) {
  try {
    const {
      name,
      preset,
      nameManual,
      type,
      tone,
      referral,
      imageBase64,
      ctaStyle
    } = req.body || {};

    // -----------------------------
    // 1. Title / Nama
    // -----------------------------
    const title = (nameManual || name || preset || "Konten Kamu").trim();

    // -----------------------------
    // 2. Pseudo Analisis Gambar (Tanpa API)
    // -----------------------------
    const labels = [];

    if (imageBase64) labels.push("gambar_diunggah");

    const lower = title.toLowerCase();
    if (lower.includes("kopi") || lower.includes("ngopi")) labels.push("kuliner");
    if (lower.includes("umkm") || lower.includes("produk")) labels.push("umkm");
    if (lower.includes("motiv") || lower.includes("semangat")) labels.push("motivasi");
    if (!labels.length) labels.push("umum");

    const theme = labels.includes("motivasi")
      ? "motivation"
      : labels.includes("umkm")
      ? "umkm"
      : "general";

    // -----------------------------
    // 3. 10 PRESET TEMA (Tanpa API)
    // -----------------------------
    const presetThemes = {
      "Story-Selling UMKM": {
        hook: "Perjalanan kecil ini ternyata menyimpan pesan besar.",
        style: "hangat, jujur, proses, humanis"
      },
      "Motivasi Harian": {
        hook: "Stop scroll dulu sebentar...",
        style: "memotivasi, ringan, menguatkan"
      },
      "Bisnis & Income": {
        hook: "Kadang peluang itu datang diam-diam...",
        style: "visioner, penuh harapan"
      },
      "Islami / Spiritual": {
        hook: "Ada hikmah yang sering luput kita lihat…",
        style: "tenang, lembut, penuh makna"
      },
      "Parenting / Keluarga": {
        hook: "Di balik momen kecil ini, ada pelajaran besar.",
        style: "hangat, emosional"
      },
      "Edukasi / Tips": {
        hook: "Tahukah kamu…",
        style: "informasi, ringan, bernilai"
      },
      "Perjalanan Hidup": {
        hook: "Kadang hidup memberi tanda, bukan jawaban.",
        style: "dalam, reflektif"
      },
      "Konten Harian": {
        hook: "Sedikit cerita hari ini…",
        style: "ringan, dekat, personal"
      },
      "Soft Selling": {
        hook: "Sebelum kita bahas lebih jauh…",
        style: "halus, elegan"
      },
      "Personal Branding": {
        hook: "Setiap langkah kecil membentuk karakter besar.",
        style: "kuat, percaya diri"
      }
    };

    const presetSelected = presetThemes[preset] || presetThemes["Soft Selling"];

    // -----------------------------
    // 4. CTA Style (A/B/C)
    // -----------------------------
    function buildCTA(hasLink) {
      if (ctaStyle === "A") {
        return hasLink
          ? "Detail lengkapnya sudah aku taruh pelan-pelan di komentar ya 👇"
          : "Kalau kamu relate, ceritakan di komentar — aku baca kok.";
      }
      if (ctaStyle === "C") {
        return hasLink
          ? "Kalau penasaran, cek komentar ya — linknya aku letakkan di sana 👇"
          : "Share pendapatmu di komentar, yuk!";
      }
      // Default B (Netral)
      return hasLink
        ? "Info lengkapnya aku taruh di komentar bawah — silakan cek ya."
        : "Kalau relate, tinggal tulis pendapatmu di komentar.";
    }

    // -----------------------------
    // 5. KOMENTAR META-FRIENDLY (10 varian)
    // -----------------------------
    const commentPool = [
      "Kerasa banget value yang kamu bagi di sini ✨ Detailnya aku taruh di komentar ya 👇",
      "Postingan begini tuh hangat banget. Lanjutannya ada di komentar bawah.",
      "Energinya kerasa! Insight lanjut aku taruh di komentar ya 👇",
      "Keren… vibes-nya ngena. Tambahan catatannya ada di komentar.",
      "Ini tipe konten yang bikin banyak orang relate ✨ Cek komentar ya.",
      "Ada rasa tenang dari postingan ini. Lanjutan insight ada di komentar.",
      "Prosesnya kerasa nyata. Catatan kecilnya aku taruh di komentar bawah.",
      "Suka banget sama penyampaiannya. Detail ada di komentar ya 👇",
      "Bikin tambah semangat! Info tambahannya ada di komentar.",
      "Pesannya kuat banget… lanjutannya aku simpan di komentar."
    ];

    // Ambil 4 varian random
    const shuffled = [...commentPool].sort(() => Math.random() - 0.5);
    const commentVariants = shuffled.slice(0, 4);

    // -----------------------------
    // 6. BANGUN CAPTION (3 VARIAN)
    // -----------------------------
    function buildCaption(variantIndex) {
      const hook = presetSelected.hook || "Ada cerita menarik di sini...";
      const problem =
        theme === "motivation"
          ? "Kadang kita merasa langkah hidup ini terasa berat—kayak nggak tahu harus mulai dari mana."
          : theme === "umkm"
          ? "Banyak usaha bagus sebenarnya tinggal selangkah lagi untuk dikenal luas."
          : "Sering kali kita lupa, proses kecil itu punya arti yang besar.";

      const solution =
        theme === "motivation"
          ? "Mulailah dari langkah paling kecil—yang penting bergerak."
          : theme === "umkm"
          ? "Ceritakan prosesnya, tunjukkan nilainya—orang connect karena cerita."
          : "Ambil napas, jalan pelan, dan tetap lanjut. Hidup mengikuti ritmemu.";

      const cta = buildCTA(!!referral);
      const tags = "#KontenLebihUtama #SmartCreator2025 #BangkitBersama";

      return `${variantIndex === 1 ? "Jangan lewatkan ini." : variantIndex === 2 ? "Baca ini dulu." : ""}

${hook}

${problem}

${solution}

${cta}

${tags}`;
    }

    const captionVariants = [
      buildCaption(0),
      buildCaption(1),
      buildCaption(2)
    ];

    // -----------------------------
    // 7. HASHTAGS + META ADVICE
    // -----------------------------
    const hashtags = [
      "#KontenLebihUtama",
      "#SmartCreator2025",
      "#BangkitBersama",
      "#DukungLokal",
      "#UMKMBerproses"
    ];

    const metaAdvice =
      "Gunakan pola HOOK → MASALAH → SOLUSI → CTA → TAG. Link sebaiknya di komentar (soft). Hindari hard-sell agar algoritma Meta tetap ramah.";

    // -----------------------------
    // 8. RETURN RESPONSE
    // -----------------------------
    return res.status(200).json({
      ok: true,
      analysis: {
        labels,
        theme,
        preset,
        tone,
        type
      },
      captionVariants,
      commentVariants,
      hashtags,
      referralLink: referral || "",
      metaAdvice
    });
  } catch (err) {
    console.error("ERR:", err);
    return res.status(500).json({ error: "Internal Error", detail: err.message });
  }
  }
