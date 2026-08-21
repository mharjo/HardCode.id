/**
 * Bilingual (ID/EN) UI copy for the homepage.
 * Ported from SOURCE `src/i18n.js`, restricted to the keys the homepage
 * actually renders. HTML entities from SOURCE (&middot;, &mdash;, &rarr;,
 * &amp;, &#9679;) were converted to literal characters so components render
 * plain text — no `dangerouslySetInnerHTML` anywhere on this page. Keys that
 * wrapped a `<span>`/`<em>` in SOURCE (hero pill dot, hero title emphasis,
 * service badge dot) were split so the markup is real JSX instead.
 */

export type Locale = "id" | "en";

const id = {
  nav_layanan: "layanan",
  nav_cara_kerja: "cara-kerja",
  nav_faq: "faq",
  nav_testimoni: "testimoni",
  nav_tulisan: "tulisan",
  skip_to_content: "Langsung ke konten utama",
  theme_toggle_aria: "Ganti mode gelap/terang",
  lang_toggle_aria: "Ganti Bahasa / Switch Language",

  hero_pill: "terbuka untuk klien baru",
  hero_title_main: "HardCode.",
  hero_title_em: "No more.",
  hero_desc:
    "Belajar kode dan AI dengan cara yang masuk akal — bukan dihafal kaku. Sesi belajar privat untuk pemula dan anak-anak, atau bikin project sesuai kebutuhan spesifik kamu.",
  hero_search_ph: "Cari materi, topik AI, jenis project, atau FAQ...",
  hero_search_clear_aria: "Bersihkan pencarian",
  hero_search_stats: "{count} hasil untuk \"{query}\"",

  sec_services_title: "Layanan",
  sec_how_title: "Cara Kerja",
  sec_faq_title: "FAQ",
  sec_testimonials_title: "Testimoni",
  sec_articles_title: "Tulisan",
  sec_articles_subtitle:
    "Kumpulan catatan teknis, model mental pemrograman, dan panduan praktis AI & otomasi sistem.",

  srv1_badge: "GRATIS · 30–60 Mnt",
  srv1_title: "1-on-1 Konsultasi & Mentoring",
  srv1_tagline: "free 1-on-1 call · 30–60 menit",
  srv1_desc:
    "Sesi ngobrol santai 1-on-1 via Google Meet. Mau validasi ide project, review kebutuhan automasi, atau tanya arahan belajar coding & AI? Bebas diskusi tanpa komitmen apa pun.",
  srv1_li1: "Diskusi 1-on-1 langsung & santai via Meet",
  srv1_li2: "Bedah ide project, arsitektur, atau roadmap belajar",
  srv1_li3: "100% gratis tanpa biaya & tanpa paksaan order",
  srv1_topics_title: "Contoh Topik Diskusi:",
  srv1_tag1: "Validasi Ide Project",
  srv1_tag2: "Review Tech Stack",
  srv1_tag3: "Roadmap Belajar AI",
  srv1_tag4: "Q&A Bebas",
  srv1_action: "Kirim email untuk jadwalkan →",

  srv2_badge: "BERBAYAR · Kustom",
  srv2_title: "Bikin Project Sesuai Kebutuhan",
  srv2_tagline: "custom build · end-to-end",
  srv2_desc:
    "Punya kasus spesifik yang butuh dikerjakan — automation, tool internal, atau aplikasi kecil? Dibantu dari desain sampai siap pakai dengan kode rapi.",
  srv2_li1: "Konsultasi kebutuhan sebelum mulai kerja",
  srv2_li2: "Update progres berkala, bukan diam-diam raib",
  srv2_li3: "Serah terima + dokumentasi singkat cara pakai",
  srv2_topics_title: "Contoh Project:",
  srv2_tag1: "Landing Page",
  srv2_tag2: "Automasi Workflow",
  srv2_tag3: "Integrasi API (AI/Payment)",
  srv2_tag4: "Internal Tools",
  srv2_action: "Lihat 7 jenis project →",

  srv3_badge: "BERBAYAR · Privat",
  srv3_title: "Belajar Coding & AI Privat",
  srv3_tagline: "1-on-1 · online atau offline",
  srv3_desc:
    "Untuk anak-anak atau orang awam yang mau mulai belajar programming atau dasar-dasar AI. Materi disesuaikan pace dan tujuan masing-masing.",
  srv3_li1: "Kurikulum disesuaikan level & tujuan belajar",
  srv3_li2: "Latihan langsung praktik, bukan cuma teori",
  srv3_li3: "Jadwal fleksibel, per sesi atau paket",
  srv3_topics_title: "Contoh Materi:",
  srv3_tag1: "Dasar Web (HTML/CSS/JS)",
  srv3_tag2: "Python Pemula",
  srv3_tag3: "Prompt Engineering",
  srv3_tag4: "AI for Productivity",
  srv3_action: "Lihat 7 detail materi →",

  empty_services: "Tidak ada kartu layanan yang cocok dengan kata kunci pencarian.",
  cta_email_btn: "Kirim Email →",

  step1_title: "Cerita kebutuhannya",
  step1_desc: "Email singkat aja — mau belajar apa, atau project seperti apa yang dibutuhkan.",
  step2_title: "Selaraskan rencana",
  step2_desc: "Diskusi singkat buat nentuin materi/scope, jadwal, dan ekspektasi bareng-bareng.",
  step3_title: "Jalan & selesai",
  step3_desc: "Sesi belajar rutin, atau progres project sampai selesai dan siap dipakai.",

  faq_q1: "Apakah sesi 1-on-1 konsultasi benar-benar gratis?",
  faq_a1:
    "Ya, 100% gratis. Sesi 30–60 menit via Google Meet ini dibuat untuk saling mengenal, membedah kendala teknis atau kebutuhan project kamu, serta memberi gambaran roadmap belajar tanpa kewajiban atau komitmen apa pun.",
  faq_q2: "Berapa biaya untuk bikin project atau les privat?",
  faq_a2:
    "Biaya disesuaikan secara fleksibel dengan skala (scope) project atau paket bimbingan belajar yang kamu ambil. Karena setiap kebutuhan unik, kita bisa obrolkan dulu di sesi konsultasi gratis untuk menyepakati estimasi yang adil dan transparan.",
  faq_q3: "Saya sama sekali belum pernah coding, apakah bisa?",
  faq_a3:
    "Sangat bisa. Pendekatan untuk pemula dirancang dari nol, fokus pada logika dasar dengan bahasa yang mudah dipahami sebelum masuk ke hal teknis yang rumit.",
  faq_q4: "Berapa lama waktu yang dibutuhkan untuk mahir?",
  faq_a4:
    "Sangat bergantung pada target dan pace masing-masing. Untuk memahami konsep dasar, biasanya butuh 4-8 sesi. Jika tujuannya untuk project spesifik, kita akan susun timeline yang realistis sejak awal.",
  faq_q5: "Untuk project custom, teknologi apa yang digunakan?",
  faq_a5:
    "Pemilihan teknologi akan disesuaikan dengan kebutuhan project agar efisien dan mudah di-maintain. Saya terbiasa menggunakan ekosistem modern berbasis web, Python, serta integrasi berbagai layanan AI.",
  faq_q6: "Apakah materi belajar mengikuti kurikulum baku?",
  faq_a6:
    "Tidak. Materi selalu disesuaikan (tailor-made). Kita akan bahas topik yang relevan dengan minat atau masalah nyata yang ingin kamu selesaikan, sehingga proses belajar terasa masuk akal dan praktis.",
  empty_faq: "Tidak ada pertanyaan FAQ yang cocok dengan kata kunci pencarian.",

  testi_q1:
    "Belajar coding yang awalnya kelihatan ribet jadi kerasa masuk akal. Penjelasannya praktis, ramah untuk pemula, dan langsung kepake buat project kuliah.",
  testi_role1: "Mahasiswa & Pemula AI",
  testi_q2:
    "Sangat puas dengan custom tool yang dibuatkan. Alur kerjanya jelas, komunikasi lancar, dan yang paling penting tool-nya berjalan sesuai ekspektasi operasional bisnis.",
  testi_role2: "Small Business Owner",
  testi_q3:
    "Sesi konsultasi 1-on-1 sangat insightful. Arsitektur backend dan otomasi webhook yang dibedah langsung memecahkan bottleneck sinkronisasi di startup kami.",
  testi_role3: "Tech Lead & Co-Founder",
  testi_q4:
    "Materinya to-the-point tanpa basa-basi teori berbelit. Dalam 3 sesi bimbingan privat sudah bisa deploy bot scraping & integrasi Telegram otomatis sendiri.",
  testi_role4: "Digital Marketer & Freelancer",
  testi_q5:
    "Automasi rekap inventory dan sinkronisasi Google Sheets ke dashboard CRUD internal menghemat waktu tim hingga 15 jam per minggu. Efisiensi luar biasa!",
  testi_role5: "Operations Manager",
  testi_autoslide: "geser otomatis",
  testi_prev_aria: "Testimoni Sebelumnya",
  testi_next_aria: "Testimoni Berikutnya",

  articles_filter_all: "Semua Topik",
  articles_filter_ai: "🤖 AI & LLM",
  articles_filter_python: "🐍 Python & Automasi",
  articles_filter_web: "🌐 Web & Frontend",
  articles_filter_mental: "🧠 Mental Model",
  articles_read_more: "Baca artikel →",
  articles_view_all: "Lihat semua tulisan →",

  breadcrumb_home: "Beranda",
  breadcrumb_articles: "Tulisan",

  articles_page_title: "Tulisan",
  articles_search_ph: "Cari judul, topik, atau tag...",
  articles_search_clear_aria: "Bersihkan pencarian",
  articles_sort_label: "Urutkan",
  articles_sort_newest: "Terbaru",
  articles_sort_alpha: "A–Z",
  articles_tags_all: "Semua Tag",
  articles_tags_clear: "Hapus filter tag",
  articles_empty_title: "Tidak ada tulisan yang cocok",
  articles_empty_desc: "Coba ubah kata kunci pencarian, kategori, atau tag yang dipilih.",
  articles_reset_btn: "Reset semua filter",
  articles_result_count: "{count} dari {total} tulisan",
  articles_result_count_all: "{count} tulisan",

  article_back_btn: "Kembali ke Daftar Tulisan",
  article_share_btn: "Bagikan",
  article_share_btn_footer: "Bagikan Tulisan",
  article_share_copied: "Tersalin!",
  article_share_toast: "Tautan artikel berhasil disalin ke clipboard!",
  article_share_failed: "Gagal menyalin tautan. Salin manual dari address bar.",
  article_code_copy: "Salin",
  article_code_copied: "Tersalin!",
  article_related_heading: "Baca Tulisan Lainnya",
  article_related_sub: "Eksplorasi artikel dan panduan teknis lainnya seputar arsitektur kode dan AI.",
  article_footer_tags_label: "Topik Terkait:",
  article_cta_title: "Tertarik mendiskusikan topik ini secara langsung?",
  article_cta_desc:
    "Kirim email kalau ada topik dari tulisan ini yang mau dibahas lebih dalam atau didiskusikan langsung.",
  article_cta_action: "Kirim Email untuk Diskusi →",
  article_words_suffix: "kata",
  article_not_found_title: "Tulisan tidak ditemukan",
  article_not_found_desc: "Artikel yang kamu cari mungkin sudah dipindahkan atau tidak pernah ada.",
  article_not_found_back: "← Kembali ke Daftar Tulisan",

  seo_home_title: "hardcode.id — Belajar kode dan AI",
  seo_home_desc:
    "Belajar kode dan AI dengan cara yang masuk akal — bukan dihafal kaku. Sesi belajar privat, konsultasi gratis, dan project custom di hardcode.id.",
  seo_articles_title: "Tulisan — hardcode.id",
  seo_articles_desc:
    "Kumpulan catatan teknis, model mental pemrograman, dan panduan praktis AI & otomasi sistem dari HardCode Studio.",
  seo_learning_title: "Belajar — hardcode.id",
  seo_learning_desc:
    "Peta jalur belajar coding & AI privat 1-on-1: 7 modul, 3 jalur spesialisasi, dari fondasi web/Python sampai integrasi AI full-stack.",
  seo_proyek_title: "Proyek — hardcode.id",
  seo_proyek_desc:
    "7 jenis project custom yang bisa dikerjakan end-to-end: landing page, automasi workflow, internal tools, chatbot AI RAG, web scraping, payment gateway, hingga refactoring kode.",
  seo_konsultasi_title: "Konsultasi — hardcode.id",
  seo_konsultasi_desc:
    "Booking sesi 1-on-1 konsultasi & mentoring gratis via Google Meet (maks. 60 menit). Pilih tanggal & jam yang cocok untuk bedah ide, arsitektur sistem, atau roadmap belajar coding & AI.",

  nav_belajar: "belajar",
  nav_proyek: "proyek",
  nav_konsultasi: "konsultasi",

  learn_back_link: "← Kembali ke Beranda",
  learn_main_title: "Belajar Coding & AI Privat",
  learn_main_desc:
    "Materi yang disusun secara logis dan praktikal, dipelajari langsung dengan bimbingan 1-on-1 sesuai pace belajarmu.",
  learn_search_ph: "Cari materi belajar...",
  learn_search_clear_aria: "Bersihkan pencarian",
  learn_module_prefix: "MODUL",

  learn_path_badge: "// ROADMAP & PETA PROGRESI BELAJAR",
  learn_path_title: "Peta Jalur Belajar (Skill Path)",
  learn_path_desc:
    "Visualisasi urutan materi dari fondasi dasar hingga integrasi sistem kecerdasan buatan mandiri. Klik salah satu modul untuk langsung melompat ke detail silabus.",
  learn_path_tab_all: "Semua Jalur (7 Modul)",
  learn_path_tab_web: "🌐 Jalur Web",
  learn_path_tab_python: "🐍 Jalur Python & Data",
  learn_path_tab_ai: "🤖 Jalur AI & LLM",
  learn_path_stage1_title: "Tahap 1: Fondasi Logika & Sintaks",
  learn_path_stage1_badge: "LEVEL 01 · PEMULA",
  learn_path_stage2_title: "Tahap 2: Penerapan Praktis & Otomasi",
  learn_path_stage2_badge: "LEVEL 02 · MENENGAH",
  learn_path_stage3_title: "Tahap 3: Arsitektur & Spesialisasi Lanjutan",
  learn_path_stage3_badge: "LEVEL 03 · MAHIR",
  learn_path_stage4_title: "Tahap 4: Integrasi Puncak (Capstone)",
  learn_path_stage4_badge: "LEVEL 04 · CAPSTONE MASTERY",
  learn_path_node_action: "Lihat Silabus →",
  learn_path_stats_mods: "7 Modul Terstruktur",
  learn_path_stats_tracks: "3 Jalur Spesialisasi",
  learn_path_stats_stages: "4 Tahap Progresif",
  learn_path_stats_pace: "1-on-1 Mentoring Santai",
  learn_path_hint: "💡 Tip: Klik node modul di atas untuk langsung membaca ringkasan materi dan target pembelajaran di bawah.",

  learn_c1_title: "1. Dasar Web (HTML/CSS/JS)",
  learn_c1_p1:
    "Website adalah gerbang utama dari hampir semua produk digital saat ini. Memahami cara kerjanya bukan sekadar tentang membuat halaman yang tampil cantik, tetapi memahami struktur komunikasi antara pengguna dan browser.",
  learn_c1_p2:
    "Dalam materi ini, kita akan membedah anatomi web dari nol. Mulai dari HTML untuk menyusun kerangka data, CSS untuk mengatur tata letak dan estetika visual, hingga JavaScript murni untuk memberikan interaksi dinamis tanpa bergantung pada sistem yang berat.",
  learn_c1_p3:
    "Hasil akhirnya, kamu tidak hanya akan mampu membangun landing page mandiri, tetapi juga memiliki fondasi yang kuat untuk nantinya melompat ke framework modern (seperti React atau Vue) dengan pemahaman fundamental yang kokoh dan tidak mudah goyah.",

  learn_c2_title: "2. Pemrograman Python",
  learn_c2_p1:
    "Python dikenal luas sebagai bahasa pemrograman yang bahasanya paling menyerupai bahasa manusia (Bahasa Inggris). Kesederhanaan ini membuatnya sangat cocok sebagai bahasa pertama bagi pemula yang baru mengenal konsep logika pemrograman.",
  learn_c2_p2:
    "Kita akan memulai perjalanan dari variabel dasar, perulangan (loops), pengkondisian (if-else), hingga struktur data esensial seperti list dan dictionary. Setiap materi langsung dipraktikkan melalui studi kasus sederhana agar konsep abstrak menjadi lebih membumi.",
  learn_c2_p3:
    "Setelah menguasai dasar Python, kamu secara otomatis sudah membuka kunci ke banyak bidang yang sangat dicari di industri saat ini, mulai dari otomatisasi skrip sehari-hari, pengolahan data besar, hingga fondasi untuk belajar Machine Learning dan AI.",

  learn_c3_title: "3. Prompt Engineering Dasar",
  learn_c3_p1:
    "Banyak orang mengira menggunakan AI itu hanya sekadar \"ngobrol\" layaknya dengan manusia. Padahal, Prompt Engineering sejatinya adalah proses memprogram model bahasa besar (LLM) dengan intruksi spesifik agar menghasilkan output yang presisi dan tidak halu.",
  learn_c3_p2:
    "Sesi ini mengajarkan teknik memberikan konteks yang benar, mengatur persona, membangun instruksi langkah demi langkah (Chain of Thought), hingga teknik few-shot prompting untuk mengatur struktur jawaban AI (seperti JSON atau tabel).",
  learn_c3_p3:
    "Pemahaman ini akan mengubah cara kerjamu secara drastis. Kamu tidak lagi mendapatkan jawaban generik yang membosankan dari ChatGPT atau Claude, melainkan hasil analisis, draf, dan kode yang langsung siap pakai untuk mendongkrak produktivitasmu 10 kali lipat.",

  learn_c4_title: "4. Otomatisasi Tugas Harian",
  learn_c4_p1:
    "Seberapa sering kamu menghabiskan waktu berjam-jam hanya untuk menyalin data dari satu file Excel ke file lain, atau mengganti nama ratusan foto satu per satu? Pekerjaan repetitif ini sangat rentan terhadap human error dan membuang banyak waktu berharga.",
  learn_c4_p2:
    "Materi ini fokus pada penyelesaian masalah nyata menggunakan skrip komputer. Kita akan belajar cara membaca dan menulis file secara massal, mengekstrak data dari dokumen PDF, atau menyortir ratusan email secara otomatis tanpa harus membukanya satu-satu.",
  learn_c4_p3:
    "Begitu kamu berhasil membuat satu robot kecil pertamamu, cara pandangmu terhadap pekerjaan admin akan berubah selamanya. Kamu akan terbiasa mendelegasikan tugas-tugas membosankan kepada mesin, dan fokus pada hal yang butuh kreativitas.",

  learn_c5_title: "5. Konsep Dasar Machine Learning",
  learn_c5_p1:
    "Machine Learning sering kali terdengar menakutkan karena selalu dikaitkan dengan kalkulus dan aljabar linear yang rumit. Namun, inti sebenarnya dari ML adalah mengajarkan komputer untuk mengenali pola data, bukan sekadar menghafal rumus.",
  learn_c5_p2:
    "Kita akan menelusuri konsep fundamental seperti regresi (memprediksi angka), klasifikasi (membedakan kategori), dan klastering (mengelompokkan data yang mirip) dengan pendekatan visual dan intuitif. Penekanan utamanya adalah mengapa model itu bekerja, bukan rumus matematikanya.",
  learn_c5_p3:
    "Ini adalah pijakan awal yang sempurna jika kamu tertarik masuk ke dunia Data Science. Kamu akan memiliki pemahaman konsep yang solid (intuisi algoritmik) yang membuat proses belajar alat-alat canggih seperti Scikit-Learn atau TensorFlow nantinya menjadi sangat mudah.",

  learn_c6_title: "6. Frontend Modern (React/Vite)",
  learn_c6_p1:
    "Web modern tidak lagi bekerja dengan cara me-refresh halaman berulang kali setiap ada interaksi. Aplikasi yang kita gunakan saat ini bersifat mulus, reaktif, dan secepat aplikasi desktop. Itulah yang disebut Single Page Application (SPA).",
  learn_c6_p2:
    "Kita akan belajar bagaimana membangun antarmuka web modern menggunakan React JS dan Vite. Fokus kita adalah pada arsitektur berbasis komponen, pengelolaan state (data yang berubah), dan cara mengintegrasikan Tailwind CSS untuk styling yang responsif dan cepat.",
  learn_c6_p3:
    "Di akhir sesi, kamu akan mampu meracik komponen UI yang bisa dipakai ulang dan mengerti standar arsitektur web modern yang banyak dipakai di perusahaan teknologi berskala besar saat ini.",

  learn_c7_title: "7. Integrasi AI ke Aplikasi",
  learn_c7_p1:
    "Menggunakan ChatGPT lewat browser memang menyenangkan, tapi akan jauh lebih kuat jika kita bisa menyematkan 'otak' AI tersebut ke dalam aplikasi atau sistem buatan kita sendiri. Inilah dunia API Integration.",
  learn_c7_p2:
    "Kamu akan belajar cara mendapatkan API Key dari penyedia LLM (seperti OpenAI atau Google Gemini), cara mengirim request yang terenkripsi, menangani respons JSON, serta membuat efek teks yang mengetik secara real-time (streaming).",
  learn_c7_p3:
    "Keterampilan ini memungkinkanmu untuk membuat layanan otomatis yang jenius, mulai dari alat pembuat kesimpulan otomatis untuk dokumen, bot asisten di Telegram/WhatsApp, hingga generator konten mandiri sesuai dengan sistemmu.",

  learn_empty_title: "Tidak ada materi yang cocok",
  learn_empty: "Tidak ada materi yang sesuai dengan pencarian.",
  learn_reset_btn: "Reset semua filter",
  learn_result_count: "{count} dari {total} modul",
  learn_result_count_all: "{count} modul",

  proj_back_link: "← Kembali ke Beranda",
  proj_main_title: "Bikin Project Custom",
  proj_main_desc:
    "Solusi aplikasi dan automasi terukur yang dibangun end-to-end sesuai kebutuhan bisnis atau personal kamu.",
  proj_search_ph: "Cari jenis project...",
  proj_search_clear_aria: "Bersihkan pencarian",

  proj_c1_title: "1. Landing Page Bisnis & Portofolio",
  proj_c1_p1:
    "Impresi pertama di dunia digital adalah segalanya. Website yang terlihat lambat atau menggunakan template usang yang pasaran akan secara tidak sadar menurunkan tingkat kepercayaan calon klien atau perekrutmu.",
  proj_c1_p2:
    "Layanan ini berfokus pada pembuatan halaman single-page yang kustom, ringan, dan dioptimasi penuh. Bukan sekadar instalasi WordPress biasa, melainkan kode bersih yang di-host secara mandiri agar kecepatan muatnya berada dalam hitungan milidetik.",
  proj_c1_p3:
    "Setiap website akan disesuaikan dengan identitas brand, responsif (tampil sempurna di layar HP maupun layar lebar), dan langsung diserah-terimakan lengkap dengan konfigurasi domain (misal: namakamu.com).",

  proj_c2_title: "2. Sistem Automasi & Workflow",
  proj_c2_p1:
    "Pekerjaan administratif bisnis sering kali terhambat karena data terpisah-pisah di berbagai aplikasi: pelanggan isi form di Google Forms, notifikasinya harus diteruskan ke Telegram, lalu datanya direkap di Google Sheets.",
  proj_c2_p2:
    "Sistem ini mengkoneksikan berbagai layanan menggunakan konsep Webhook dan API, menghilangkan kebutuhan untuk memindahkan data secara manual. Kami merancang alur kerja (workflow) yang bekerja secara diam-diam selama 24 jam sehari layaknya staf yang tak pernah tidur.",
  proj_c2_p3:
    "Solusi ini menghemat puluhan jam kerja setiap minggunya, mengurangi kesalahan ketik (human error), dan memastikan sistem pelaporan datamu selalu real-time.",

  proj_c3_title: "3. Internal Tools & Dashboard",
  proj_c3_p1:
    "Ketika operasional bisnis mulai berkembang, spreadsheet dan Excel sering kali menjadi terlalu berat, lambat, atau berbahaya karena data bisa terhapus tanpa sengaja oleh karyawan. Kamu butuh sistem yang lebih terstruktur.",
  proj_c3_p2:
    "Layanan ini membangun aplikasi *Custom CRUD* (Create, Read, Update, Delete) berorientasi database. Ini bisa berupa panel admin khusus, sistem manajemen inventori gudang, atau pencatatan metrik pesanan yang dilengkapi dengan akses login terbatas (Role-Based Access).",
  proj_c3_p3:
    "Tampilannya sengaja dirancang seringkas mungkin agar operasional harian tidak bingung. Alat internal yang tepat akan mempercepat pengambilan keputusan manajerial.",

  proj_c4_title: "4. Chatbot AI Custom (RAG)",
  proj_c4_p1:
    "Chatbot AI biasa hanya menjawab berdasarkan data umum dari internet. Bagaimana jika kamu butuh bot yang bisa menjawab pertanyaan pelanggan secara spesifik sesuai dengan SOP, katalog produk, atau modul bisnismu sendiri?",
  proj_c4_p2:
    "Inilah sistem RAG (Retrieval-Augmented Generation). Kami akan mengunggah dokumen spesifikmu ke dalam Vector Database. Saat pelanggan bertanya, AI akan merujuk ke dokumen pribadimu tersebut untuk menyusun jawabannya.",
  proj_c4_p3:
    "Hasilnya adalah AI Customer Service atau asisten internal yang sangat pintar, memahami produkmu secara mendalam, dan yang terpenting: tidak memberikan jawaban halusinasi atau informasi dari luar kendalimu.",

  proj_c5_title: "5. Ekstraksi Data (Web Scraping)",
  proj_c5_p1:
    "Di era digital, data publik bertebaran di mana-mana—harga produk kompetitor di marketplace, daftar kontak properti, atau artikel riset. Masalahnya, sangat tidak masuk akal untuk melakukan *copy-paste* puluhan ribu baris data tersebut secara manual.",
  proj_c5_p2:
    "Kami akan mengembangkan skrip (scraper) yang mampu menelusuri halaman web, melewati rintangan sederhana, dan mengekstraksi titik-titik data krusial secara terstruktur ke dalam format siap pakai seperti CSV, JSON, atau menyuntikkannya langsung ke Databasemu.",
  proj_c5_p3:
    "Data mentah yang terkumpul otomatis ini menjadi modal kuat bagimu untuk melakukan riset pasar, pemantauan harga kompetitor, atau menyusun strategi *leads generation* skala besar.",

  proj_c6_title: "6. Integrasi Payment Gateway",
  proj_c6_p1:
    "Jika kamu memiliki aplikasi atau website namun masih menerima pembayaran dengan proses transfer manual dan konfirmasi via WhatsApp, kamu berpotensi kehilangan penjualan dari pembeli yang menginginkan transaksi instan.",
  proj_c6_p2:
    "Layanan ini menyambungkan ekosistem aplikasimu ke Payment Gateway lokal (seperti Midtrans, Xendit, atau Stripe). Prosesnya mencakup penanganan webhook agar status pesanan berubah menjadi 'Lunas' secara otomatis setelah pembayaran sukses.",
  proj_c6_p3:
    "Ini memungkinkan transaksimu berjalan dengan sistematis 24/7, mencakup dukungan QRIS, Virtual Account, hingga Kartu Kredit dengan jaminan keamanan finansial standar industri.",

  proj_c7_title: "7. Refactoring & Perbaikan Kode",
  proj_c7_p1:
    'Banyak bisnis membangun aplikasi pertama mereka dengan terburu-buru. Hasilnya? Aplikasi berjalan, tapi di baliknya berisi "spaghetti code" yang sangat sulit dipelihara, lambat dimuat, dan mudah rusak (bug) jika ada fitur baru yang ditambahkan.',
  proj_c7_p2:
    'Kami bertugas sebagai "dokter bedah" untuk kode warisanmu. Prosesnya meliputi pembersihan baris kode yang tak terpakai, modernisasi sintaks, pengoptimalan pemanggilan database (agar load time cepat), hingga memperbaiki arsitektur agar tidak *error* di masa depan.',
  proj_c7_p3:
    "Investasi pada *code refactoring* sangat vital sebelum aplikasi diluncurkan ke pasar massal, memastikan sistem stabil menangani puluhan ribu klik pengguna tanpa *server crash*.",

  proj_empty_title: "Tidak ada project yang cocok",
  proj_empty: "Tidak ada jenis project yang sesuai dengan pencarian.",
  proj_reset_btn: "Reset semua filter",
  proj_result_count: "{count} dari {total} jenis project",
  proj_result_count_all: "{count} jenis project",

  cal_back_link: "← Kembali ke Beranda",
  cal_main_title: "1-on-1 Sesi Konsultasi & Mentoring",
  cal_main_desc:
    "Sesi video call santai 1-on-1 via Google Meet secara 100% gratis (maks. 60 menit). Pilih tanggal & jam yang cocok untuk bedah ide, arsitektur sistem, atau panduan belajar coding & AI.",
  cal_mentor_name: "HardCode Mentoring",
  cal_event_title: "Exclusive Mentoring 1-on-1",
  cal_event_greeting:
    "Hi! 👋 Terima kasih sudah meluangkan waktu. Senang sekali bisa membantu perjalanan karier & project codingmu! 😊",
  cal_event_subhint:
    "Agar sesi konsultasi kita lebih optimal dan insightful, mohon siapkan pertanyaan atau hal yang ingin kita bahas bersama.",
  cal_meta_dur: "1h (Maks. 60 Menit · Gratis)",
  cal_meta_loc: "Google Meet",
  cal_meta_tz: "Asia/Jakarta (WIB)",
  cal_perks_title: "Yang bisa kamu dapatkan:",
  cal_perk1: "✓ Validasi ide & arsitektur project MVP",
  cal_perk2: "✓ Roadmap belajar coding & AI personal",
  cal_perk3: "✓ Live share screen untuk review & debug kode",
  cal_perk4: "✓ Rangkuman catatan & referensi dikirim ke email",
  cal_schedule_rule: "🟢 Senin–Jumat: 20:00–22:00 WIB · Weekend: 13:00–20:00 WIB · 🔴 Libur Nasional: Tidak Tersedia",
  cal_month_prev_aria: "Bulan sebelumnya",
  cal_month_next_aria: "Bulan berikutnya",
  cal_slot_confirm_btn: "Lanjut ke Pengisian Data →",
  cal_holiday_title: "Libur Nasional",
  cal_holiday_desc:
    "Sesi konsultasi ditiadakan pada hari libur nasional. Silakan pilih tanggal kerja lainnya di kalender.",
  cal_btn_change_time: "Ganti Jadwal / Jam",
  cal_form_title: "Informasi & Rencana Diskusi",
  cal_form_free_badge: "100% GRATIS · 60 MENIT",
  cal_form_desc: "Detail konfirmasi & tautan Google Meet akan dikirimkan otomatis ke email Anda.",
  cal_btn_change_recap: "Ubah Jadwal",
  cal_lbl_name: "Nama Lengkap",
  cal_ph_name: "misal: Arya Pratama",
  cal_lbl_email: "Email Aktif",
  cal_hint_email: "Untuk link Meet",
  cal_ph_email: "misal: arya@gmail.com",
  cal_err_email: "Format email tidak valid (contoh: nama@domain.com)",
  cal_err_email_required: "Email wajib diisi untuk pengiriman link Google Meet",
  cal_err_name_required: "Nama lengkap wajib diisi",
  cal_err_notes_required: "Ceritakan dulu apa yang ingin didiskusikan",
  cal_lbl_wa: "Nomor WhatsApp",
  cal_hint_wa: "Opsional (pengingat)",
  cal_ph_wa: "08xxxxxxxxxx",
  cal_lbl_topic: "Kategori Utama",
  cal_opt_topic1: "💡 Validasi Ide & Rencana Bikin Project Baru",
  cal_opt_topic2: "⚙️ Konsultasi Tech Stack & Arsitektur Project",
  cal_opt_topic3: "🗺️ Roadmap Belajar Coding & AI dari Pemula",
  cal_opt_topic4: "🔍 Review Kode / Pemecahan Masalah Teknis",
  cal_opt_topic5: "☕ Diskusi Santai / Q&A Umum Seputar AI & Kode",
  cal_opt_topic6: "✨ Topik Khusus Lainnya",
  cal_lbl_chips: "Pilihan Cepat Kategori:",
  cal_chip1: "💡 Validasi Ide MVP",
  cal_chip2: "⚙️ Tech Stack & DB",
  cal_chip3: "🗺️ Roadmap Belajar AI",
  cal_chip4: "🔍 Code Review & Debugging",
  cal_chip5: "☕ Tanya Jawab Santai",
  cal_lbl_notes: "Apa yang Ingin Kita Diskusikan?",
  cal_hint_notes: "Maks. 60 menit",
  cal_ph_notes:
    "Tuliskan topik, tantangan teknis, error coding, arsitektur, atau rencana ide aplikasi yang mau kita bedah bersama...",
  cal_btn_back_form: "Kembali",
  cal_btn_submit: "Konfirmasi Booking (100% Gratis) →",
  cal_security_notice: "🔒 Privasi aman · Tanpa biaya tersembunyi · Undangan Meet instan",
  cal_succ_title: "Sesi Berhasil Dijadwalkan!",
  cal_succ_desc: "Sesi 1-on-1 kamu telah tersimpan di kalender. Link Google Meet dan konfirmasi telah dibuat di bawah ini:",
  cal_succ_dur_val: "60 Menit (100% Gratis)",
  cal_succ_copy_btn: "Salin Link",
  cal_succ_gcal_btn: "📅 Tambahkan ke Google Calendar →",
  cal_succ_reset_btn: "Jadwalkan Sesi Lain",
  cal_summary_name_label: "Nama:",
  cal_summary_email_label: "Email:",
  cal_summary_time_label: "Waktu:",
  cal_summary_dur_label: "Durasi:",
  cal_summary_topic_label: "Kategori:",
  cal_summary_notes_label: "Catatan Diskusi:",
  cal_summary_meet_label: "Google Meet:",
  cal_topic_chips_group_aria: "Pilihan cepat kategori topik",

  bot_gate_desc:
    "Ada pertanyaan seputar konsultasi, materi belajar coding & AI, atau estimasi project? Masukkan kontakmu untuk mulai ngobrol.",
  bot_gate_lbl_contact: "Kontak / Email",
  bot_gate_ph_contact: "email@kamu.com atau 08xxxxxxxxxx",
  bot_gate_quick_title: "Pilih topik cepat:",
  bot_gate_chip1: "💡 Konsultasi 1-on-1",
  bot_gate_chip2: "🗺️ Belajar Coding",
  bot_gate_chip3: "⚙️ Jasa Bikin App",
  bot_gate_chip_quote: "📊 Estimasi Project / Quote",
  bot_gate_btn: "Mulai Ngobrol →",
  bot_sys_start: "// Sesi obrolan dimulai dengan bot asisten hardcode.id",
  bot_greeting_pre: "Halo! 👋 Saya asisten virtual dari HardCode. Mau tanya seputar sesi ",
  bot_greeting_b1: "konsultasi gratis 1-on-1",
  bot_greeting_mid1: ", ",
  bot_greeting_b2: "kelas belajar privat",
  bot_greeting_mid2: ", atau ",
  bot_greeting_b3: "pembuatan aplikasi web/MVP",
  bot_greeting_end: "?",
  bot_prompt1: "📅 Jadwal konsultasi?",
  bot_prompt2: "💰 Berapa biayanya?",
  bot_prompt3: "👶 Belajar dari nol?",
  bot_prompt4: "🛠️ Tech stack?",
  bot_prompt5: "📊 Estimasi Fitur & Biaya",
  bot_prompt_q1: "Jadwal konsultasi kapan aja?",
  bot_prompt_q2: "Berapa biaya konsultasinya?",
  bot_prompt_q3: "Bisa belajar dari pemula?",
  bot_prompt_q4: "Tech stack apa yang dipakai?",
  bot_prompt_q5: "Berapa estimasi biaya dan waktu bikin aplikasi/fitur custom?",
  bot_input_ph: "Tulis pertanyaanmu...",
  bot_input_label: "Tulis pertanyaan untuk asisten HardCode",
  bot_send_btn: "Kirim",
  bot_send_btn_aria: "Kirim pertanyaan",
  bot_btn_aria: "Buka Chat Tanya Jawab",
  bot_close_aria: "Tutup widget tanya",
  bot_quota_left_txt: "Sisa {rem} dari {tot} kuota",
  bot_quota_last_txt: "Sisa 1 pertanyaan (terakhir)",
  bot_quota_depleted_txt: "Kuota sesi habis",
  bot_quota_done_pill: "0/5 Selesai",
  bot_quota_done_header: "0/5 Habis",
  bot_quota_active_header: "{rem}/{tot} Sesi",
  bot_quota_depleted_ph: "Kuota sesi tanya jawab ini telah habis (5/5)",
  bot_quota_alert_exhausted:
    "Kuota pertanyaan untuk sesi tanya-jawab ini telah selesai (5/5). Silakan jadwalkan langsung sesi 1-on-1 gratis 60 menit atau email kami di hello@hardcode.id ya! 😊",
  bot_quota_aria: "Indikator 5 kuota pertanyaan",
  bot_typing_text: "// sedang memproses respon...",
  bot_btn_expand: "Lebarkan tampilan",
  bot_btn_collapse: "Perkecil tampilan",
  bot_btn_fullpage: "Layar penuh (Fullpage)",
  bot_btn_restore: "Kembalikan ukuran normal",
  bot_size_toast_wide: "Tampilan chat diperlebar",
  bot_size_toast_full: "Mode layar penuh diaktifkan",
  bot_size_toast_compact: "Tampilan chat kembali ke mode standar",
  bot_tab_chat: "💬 Obrolan",
  bot_tab_quote: "📊 Estimasi Quote",
  bot_action_open_quote: "Buka Kalkulator Estimasi →",
  bot_action_consult: "Konsultasi 1-on-1 Gratis →",
  bot_action_projects: "Katalog Project →",
  bot_action_learning: "Lihat Halaman Belajar →",
  bot_dialog_aria: "Widget Tanya Jawab HardCode",
  quote_title: "📊 Kalkulator Estimasi Project",
  quote_subtitle: "Dapatkan estimasi waktu & biaya transparan berdasarkan kompleksitas dan fitur kustom yang kamu butuhkan.",
  quote_type_label: "1. Jenis Project / Layanan",
  quote_complexity_label: "2. Tingkat Kompleksitas",
  quote_features_label: "3. Fitur Tambahan & Integrasi",
  quote_result_title: "Ringkasan Estimasi",
  quote_est_timeline: "Estimasi Timeline",
  quote_est_investment: "Kisaran Investasi",
  quote_est_complexity: "Tingkat Kompleksitas",
  quote_btn_consult: "📅 Bawa Estimasi ke Sesi 1-on-1 Gratis",
  quote_btn_copy: "📋 Salin Ringkasan Quote",
  quote_btn_send_chat: "💬 Kirim ke Obrolan Chat",
  quote_btn_print: "🖨️ Cetak / PDF",
  quote_btn_reset: "🔄 Reset Pilihan",
  quote_toast_copied: "Ringkasan estimasi berhasil disalin ke clipboard!",
  quote_toast_printing: "Mempersiapkan dokumen cetak & PDF...",
  quote_toast_applied: "Estimasi berhasil diterapkan ke form booking 1-on-1!",
  quote_toast_reset: "Pilihan estimasi telah di-reset.",
  quote_toast_sent: "Estimasi dikirim ke obrolan chat.",
  quote_active_badge: "📊 Sesi Quote Aktif",
  quote_banner_view: "Lihat & Ubah",
  quote_banner_dismiss_aria: "Sembunyikan banner quote",
  quote_summary_prefix: "Estimasi Project",
  quote_saved_session_banner: "Tersimpan estimasi aktif: {type} ({complexity})",
  quote_included: "Termasuk",
  quote_category_grid_aria: "Pilih jenis project",
  quote_complexity_grid_aria: "Pilih tingkat kompleksitas",
  quote_features_grid_aria: "Pilih fitur tambahan",
  quote_print_summary_title: "Estimasi & Rincian Project",
  quote_print_footer: "Estimasi ini berlaku 30 hari sejak tanggal cetak.",
} as const;

const en: Record<keyof typeof id, string> = {
  nav_layanan: "services",
  nav_cara_kerja: "how-it-works",
  nav_faq: "faq",
  nav_testimoni: "testimonials",
  nav_tulisan: "articles",
  skip_to_content: "Skip to main content",
  theme_toggle_aria: "Toggle dark mode",
  lang_toggle_aria: "Ganti Bahasa / Switch Language",

  hero_pill: "open for new clients",
  hero_title_main: "HardCode.",
  hero_title_em: "No more.",
  hero_desc:
    "Learn code & AI the intuitive, sensible way — never rigid rote memorization. Private 1-on-1 mentoring for beginners and kids, or custom software built for your exact needs.",
  hero_search_ph: "Search topics, AI concepts, project types, or FAQs...",
  hero_search_clear_aria: "Clear search",
  hero_search_stats: "{count} results for \"{query}\"",

  sec_services_title: "Services",
  sec_how_title: "How We Work",
  sec_faq_title: "FAQ",
  sec_testimonials_title: "Testimonials",
  sec_articles_title: "Articles",
  sec_articles_subtitle:
    "Engineering notes, computational mental models, and hands-on guides for modern AI & software systems.",

  srv1_badge: "FREE · 30–60 Mins",
  srv1_title: "1-on-1 Consultation & Mentoring",
  srv1_tagline: "free 1-on-1 call · 30–60 mins",
  srv1_desc:
    "A relaxed 1-on-1 video session via Google Meet. Validate project concepts, review automation needs, or get personalized guidance on learning coding & AI. Zero strings attached.",
  srv1_li1: "Direct 1-on-1 casual call via Google Meet",
  srv1_li2: "Project breakdown, system architecture, or learning roadmap",
  srv1_li3: "100% free with zero cost & no sales pressure",
  srv1_topics_title: "Example Discussion Topics:",
  srv1_tag1: "Project Idea Validation",
  srv1_tag2: "Tech Stack Review",
  srv1_tag3: "AI Learning Roadmap",
  srv1_tag4: "Open Q&A",
  srv1_action: "Email to schedule a call →",

  srv2_badge: "PAID · Custom",
  srv2_title: "Tailored Software & MVP Development",
  srv2_tagline: "custom build · end-to-end",
  srv2_desc:
    "Have a specific business need — workflow automation, internal tool, or standalone MVP? Handled end-to-end from wireframe to production with clean, maintainable code.",
  srv2_li1: "In-depth requirement discovery before starting",
  srv2_li2: "Consistent progress updates, never disappearing",
  srv2_li3: "Handover + concise operational documentation",
  srv2_topics_title: "Example Projects:",
  srv2_tag1: "Landing Pages & Portals",
  srv2_tag2: "Workflow Automation",
  srv2_tag3: "API Integrations (AI / Payments)",
  srv2_tag4: "Internal Dashboards",
  srv2_action: "Explore 7 project types →",

  srv3_badge: "PAID · Private",
  srv3_title: "Private Coding & AI Mentoring",
  srv3_tagline: "1-on-1 · online or in-person",
  srv3_desc:
    "For kids, career switchers, and non-tech folks eager to master programming or AI fundamentals. Curriculum tailored to your pace and specific personal goals.",
  srv3_li1: "Personalized curriculum matched to your skill level",
  srv3_li2: "Hands-on practice on real projects, not dry theory",
  srv3_li3: "Flexible scheduling, per session or bundled package",
  srv3_topics_title: "Example Topics:",
  srv3_tag1: "Web Basics (HTML/CSS/JS)",
  srv3_tag2: "Python for Beginners",
  srv3_tag3: "Prompt Engineering",
  srv3_tag4: "AI for Productivity",
  srv3_action: "View 7 syllabus modules →",

  empty_services: "No service cards matched your search query.",
  cta_email_btn: "Send Email →",

  step1_title: "Share your vision",
  step1_desc: "Drop a short email — what you want to learn, or what software solution you want built.",
  step2_title: "Align on blueprint",
  step2_desc: "A quick talk to lock in the curriculum or project scope, timeline, and expectations together.",
  step3_title: "Build & deliver",
  step3_desc: "Regular mentoring sessions, or sprint-based development until your software is fully live.",

  faq_q1: "Is the 1-on-1 consultation session truly free?",
  faq_a1:
    "Yes, 100% free. This 30–60 minute session via Google Meet is designed to get acquainted, troubleshoot technical bottlenecks or project requirements, and map out a custom roadmap with zero obligation.",
  faq_q2: "How much does custom development or private tutoring cost?",
  faq_a2:
    "Pricing is structured flexibly based on project scope or tutoring packages. Because every requirement is unique, we discuss everything upfront during the free consultation for a fair, transparent estimate.",
  faq_q3: "I have never coded before. Can I still join?",
  faq_a3:
    "Absolutely. Our beginner pedagogy is built from ground zero, prioritizing core logic and approachable language before introducing complex technical syntax.",
  faq_q4: "How long does it take to become proficient?",
  faq_a4:
    "It depends on your target and personal pace. Understanding core concepts usually takes 4–8 sessions. For specific project builds, we will outline a realistic, milestone-based timeline from day one.",
  faq_q5: "What technology stack do you use for custom projects?",
  faq_a5:
    "Tech stack choices are customized to make your project efficient and effortless to maintain. We specialize in modern web ecosystems (TypeScript, React, Node.js), Python, and cutting-edge AI integrations.",
  faq_q6: "Do lessons follow a rigid, inflexible curriculum?",
  faq_a6:
    "No. Lessons are always tailor-made. We focus on topics aligned with your direct interests or real problems you want to solve, making the learning journey practical and immediately applicable.",
  empty_faq: "No FAQ items matched your search query.",

  testi_q1:
    "Coding used to look so intimidating, but HardCode made it intuitive and fun. Practical explanations, super beginner-friendly, and immediately useful for my university projects.",
  testi_role1: "Student & AI Beginner",
  testi_q2:
    "Extremely satisfied with the custom automation tool. Clear workflow, proactive communication, and most importantly, it runs flawlessly for our daily business operations.",
  testi_role2: "Small Business Owner",
  testi_q3:
    "The 1-on-1 session was incredibly insightful. The backend architecture and webhook automations we mapped out instantly solved our startup's data synchronization bottleneck.",
  testi_role3: "Tech Lead & Co-Founder",
  testi_q4:
    "To-the-point lessons with zero fluff. Within 3 private mentoring sessions, I was able to build and deploy my own web scraping bot and automated Telegram alerts.",
  testi_role4: "Digital Marketer & Freelancer",
  testi_q5:
    "The inventory recap automation and Google Sheets sync to our internal CRUD dashboard saved our team over 15 hours every single week. Unbelievable efficiency boost!",
  testi_role5: "Operations Manager",
  testi_autoslide: "auto-sliding",
  testi_prev_aria: "Previous testimonial",
  testi_next_aria: "Next testimonial",

  articles_filter_all: "All Topics",
  articles_filter_ai: "🤖 AI & LLM",
  articles_filter_python: "🐍 Python & Automation",
  articles_filter_web: "🌐 Web & Frontend",
  articles_filter_mental: "🧠 Mental Models",
  articles_read_more: "Read article →",
  articles_view_all: "View all articles →",

  breadcrumb_home: "Home",
  breadcrumb_articles: "Articles",

  articles_page_title: "Articles",
  articles_search_ph: "Search titles, topics, or tags...",
  articles_search_clear_aria: "Clear search",
  articles_sort_label: "Sort by",
  articles_sort_newest: "Newest",
  articles_sort_alpha: "A–Z",
  articles_tags_all: "All Tags",
  articles_tags_clear: "Clear tag filter",
  articles_empty_title: "No articles matched",
  articles_empty_desc: "Try adjusting your search query, category, or selected tag.",
  articles_reset_btn: "Reset all filters",
  articles_result_count: "{count} of {total} articles",
  articles_result_count_all: "{count} articles",

  article_back_btn: "Back to Articles List",
  article_share_btn: "Share",
  article_share_btn_footer: "Share Article",
  article_share_copied: "Copied!",
  article_share_toast: "Article link copied to clipboard!",
  article_share_failed: "Couldn't copy the link. Copy it manually from the address bar.",
  article_code_copy: "Copy",
  article_code_copied: "Copied!",
  article_related_heading: "Read More Articles",
  article_related_sub: "Explore more technical guides, system architecture essays, and practical AI notes.",
  article_footer_tags_label: "Related Topics:",
  article_cta_title: "Want to discuss this topic directly?",
  article_cta_desc: "Email us if anything from this article is worth digging into further or discussing live.",
  article_cta_action: "Email to Discuss →",
  article_words_suffix: "words",
  article_not_found_title: "Article not found",
  article_not_found_desc: "The article you're looking for may have moved or never existed.",
  article_not_found_back: "← Back to Articles List",

  seo_home_title: "hardcode.id — Learn Code & AI with Intuition",
  seo_home_desc:
    "Learn software engineering, frontend, backend, and AI prompt engineering with mental models — not rote memorization.",
  seo_articles_title: "Articles — hardcode.id",
  seo_articles_desc:
    "Engineering notes, computational mental models, and hands-on guides for modern AI & software systems from HardCode Studio.",
  seo_learning_title: "Learn — hardcode.id",
  seo_learning_desc:
    "Private 1-on-1 coding & AI skill path: 7 modules across 3 specialization tracks, from web/Python foundations to full-stack AI integration.",
  seo_proyek_title: "Projects — hardcode.id",
  seo_proyek_desc:
    "7 custom project types built end-to-end: landing pages, workflow automation, internal tools, AI RAG chatbots, web scraping, payment gateway integration, and code refactoring.",
  seo_konsultasi_title: "Consultation — hardcode.id",
  seo_konsultasi_desc:
    "Book a free 1-on-1 consultation & mentoring session via Google Meet (max 60 mins). Pick a date & time to validate ideas, system architecture, or your coding & AI learning roadmap.",

  nav_belajar: "learn",
  nav_proyek: "projects",
  nav_konsultasi: "consultation",

  learn_back_link: "← Back to Home",
  learn_main_title: "Private Coding & AI Mentoring",
  learn_main_desc: "Logically structured, practical topics taught 1-on-1 aligned with your unique learning pace.",
  learn_search_ph: "Search learning syllabus...",
  learn_search_clear_aria: "Clear search",
  learn_module_prefix: "MODULE",

  learn_path_badge: "// ROADMAP & PROGRESSION PATHWAY",
  learn_path_title: "Skill Path & Learning Roadmap",
  learn_path_desc:
    "Visual progression blueprint from fundamental coding logic to full-stack AI system integration. Click any module node to jump directly to its syllabus breakdown.",
  learn_path_tab_all: "All Tracks (7 Modules)",
  learn_path_tab_web: "🌐 Web Track",
  learn_path_tab_python: "🐍 Python & Automation",
  learn_path_tab_ai: "🤖 AI & LLM Track",
  learn_path_stage1_title: "Stage 1: Logic & Syntax Foundations",
  learn_path_stage1_badge: "LEVEL 01 · BEGINNER",
  learn_path_stage2_title: "Stage 2: Practical Application & Automation",
  learn_path_stage2_badge: "LEVEL 02 · INTERMEDIATE",
  learn_path_stage3_title: "Stage 3: Advanced Architecture & Specialization",
  learn_path_stage3_badge: "LEVEL 03 · ADVANCED",
  learn_path_stage4_title: "Stage 4: Capstone Mastery (System Integration)",
  learn_path_stage4_badge: "LEVEL 04 · CAPSTONE MASTERY",
  learn_path_node_action: "View Syllabus →",
  learn_path_stats_mods: "7 Modules Structured",
  learn_path_stats_tracks: "3 Tracks Specialization",
  learn_path_stats_stages: "4 Stages Progressive",
  learn_path_stats_pace: "1-on-1 Mentoring Pace",
  learn_path_hint: "💡 Tip: Click any module node above to immediately navigate to its detailed syllabus breakdown below.",

  learn_c1_title: "1. Web Fundamentals (HTML/CSS/JS)",
  learn_c1_p1:
    "Websites are the primary gateway for almost every digital product today. Understanding how they work is not just about designing pretty layouts, but mastering the communication structure between browsers and users.",
  learn_c1_p2:
    "In this module, we dissect web architecture from scratch: HTML for data semantics, CSS for responsive layouts and modern typography, and vanilla JavaScript for dynamic interactions without bulky bloat.",
  learn_c1_p3:
    "You will graduate with the ability to construct fast, standalone landing pages, equipped with rock-solid foundations ready to jump into modern reactive frameworks like React or Vue.",

  learn_c2_title: "2. Python Programming",
  learn_c2_p1:
    "Python is celebrated worldwide for its readable, human-like syntax. This simplicity makes it the perfect gateway language for beginners discovering computational logic.",
  learn_c2_p2:
    "We start from variables, control loops, and conditionals, progressing to essential data structures like lists, tuples, and dictionaries. Every concept is grounded in practical micro-projects.",
  learn_c2_p3:
    "Mastering Python unlocks modern high-demand domains: script automation, data analytics, and the foundational algorithms underpinning Machine Learning and AI models.",

  learn_c3_title: "3. Prompt Engineering Fundamentals",
  learn_c3_p1:
    "Many assume utilizing AI is just informal chatting. In reality, Prompt Engineering is the disciplined technique of programming Large Language Models (LLMs) to generate deterministic, hallucination-free outputs.",
  learn_c3_p2:
    "This masterclass covers persona steering, Chain-of-Thought prompting, contextual framing, and few-shot formatting for structured outputs (JSON, markdown tables).",
  learn_c3_p3:
    "Radically elevate your daily productivity: shift from generic answers to precise, deployable code drafts, syntheses, and automated business documents.",

  learn_c4_title: "4. Daily Task Automation",
  learn_c4_p1:
    "Stop wasting hours manually copying rows across spreadsheets or renaming hundreds of asset files. Repetitive chores are error-prone and drain creative momentum.",
  learn_c4_p2:
    "Learn to build robust automations in Python. We parse PDFs, manipulate bulk Excel/CSV sheets, and automate email dispatch workflows seamlessly.",
  learn_c4_p3:
    "Once you deploy your first automated script, your operational mindset changes permanently. Delegate monotony to code and reclaim time for high-value strategic work.",

  learn_c5_title: "5. Core Machine Learning Concepts",
  learn_c5_p1:
    "Machine Learning does not have to be an impenetrable wall of abstract calculus. At its core, ML teaches computers to recognize patterns in empirical data.",
  learn_c5_p2:
    "Explore regression, classification, and clustering with visual, intuitive mental models. We emphasize algorithmic intuition and model mechanics over dry formulas.",
  learn_c5_p3:
    "The ideal launchpad for aspiring data practitioners, giving you the clarity needed to comfortably explore Scikit-Learn, PyTorch, or TensorFlow.",

  learn_c6_title: "6. Modern Frontend (React/Vite)",
  learn_c6_p1:
    "Modern web applications no longer reload pages on every click. They are fast, fluid, and responsive single-page experiences (SPAs).",
  learn_c6_p2:
    "Learn component-driven design with React and Vite. Master reactive state management, lifecycle hooks, and Tailwind CSS utility architectures.",
  learn_c6_p3:
    "Gain the skills to architect reusable UI design systems conforming to enterprise-grade web standards used across modern tech startups.",

  learn_c7_title: "7. AI API Integration into Apps",
  learn_c7_p1:
    "Using web chatbots is useful, but embedding generative AI directly into your custom apps is transformative. Welcome to the power of API integration.",
  learn_c7_p2:
    "Master API key security, authenticated REST requests, structured JSON schema handling, and real-time streaming text effects with OpenAI and Google Gemini.",
  learn_c7_p3:
    "Empower yourself to engineer automated document summarizers, Telegram/WhatsApp bot assistants, and bespoke AI copilot features for your products.",

  learn_empty_title: "No matching modules",
  learn_empty: "No learning modules match your search query.",
  learn_reset_btn: "Reset all filters",
  learn_result_count: "{count} of {total} modules",
  learn_result_count_all: "{count} modules",

  proj_back_link: "← Back to Home",
  proj_main_title: "Custom Software & MVP Development",
  proj_main_desc:
    "Scalable web applications and custom automations engineered end-to-end for your business or personal vision.",
  proj_search_ph: "Search project types...",
  proj_search_clear_aria: "Clear search",

  proj_c1_title: "1. Business Landing Pages & Portfolios",
  proj_c1_p1:
    "First impressions are everything online. A slow, cookie-cutter website inadvertently diminishes trust with prospective clients and investors.",
  proj_c1_p2:
    "We build ultra-fast, bespoke single-page applications optimized for performance, clean typography, and search visibility with sub-second load times.",
  proj_c1_p3:
    "Tailored precisely to your visual brand identity, fully responsive across mobile and desktop, delivered complete with custom domain setup.",

  proj_c2_title: "2. Automation Systems & Workflows",
  proj_c2_p1:
    "Business operations stall when data is fragmented across forms, spreadsheets, and chat channels. Manual copy-pasting invites costly errors.",
  proj_c2_p2:
    "We connect your services using Webhooks and APIs (Make, Zapier, custom scripts), creating background pipelines that operate reliably 24/7.",
  proj_c2_p3:
    "Save dozens of staff hours each week, eliminate typos, and ensure real-time reporting synchronization across your core tools.",

  proj_c3_title: "3. Internal Tools & Dashboards",
  proj_c3_p1:
    "As operations expand, shared spreadsheets become slow, fragile, and vulnerable to accidental data overwrites. You need structured systems.",
  proj_c3_p2:
    "We build custom database-backed CRUD portals: admin panels, warehouse inventories, and operational metrics with Role-Based Access Control.",
  proj_c3_p3:
    "Intentionally streamlined for operational clarity, empowering leadership to make fast, data-informed decisions.",

  proj_c4_title: "4. Custom AI Chatbots (RAG)",
  proj_c4_p1:
    "Generic AI bots only answer with public internet data. What if you need an assistant that speaks strictly from your SOPs, manuals, or product catalogs?",
  proj_c4_p2:
    "Using Retrieval-Augmented Generation (RAG) and vector databases, we index your proprietary knowledge so the AI grounds every answer in your source material.",
  proj_c4_p3:
    "Deploy an intelligent 24/7 support copilot that knows your business inside-out without hallucinatory speculation.",

  proj_c5_title: "5. Web Data Extraction (Scraping)",
  proj_c5_p1:
    "Public web data—competitor marketplace prices, market listings, research archives—is invaluable, but manual aggregation is unviable at scale.",
  proj_c5_p2:
    "We build resilient scrapers that systematically parse web pages and export clean, structured datasets directly to CSV, JSON, or SQL databases.",
  proj_c5_p3:
    "Turn unstructured public web information into strategic advantages for market intelligence and lead generation pipelines.",

  proj_c6_title: "6. Payment Gateway Integration",
  proj_c6_p1:
    "Relying on manual bank transfers and manual chat verification limits scalability and risks lost checkout conversions.",
  proj_c6_p2:
    "We seamlessly integrate industry-standard gateways (Midtrans, Xendit, Stripe), handling webhooks to automatically mark orders as settled.",
  proj_c6_p3:
    "Enable effortless, 24/7 automated monetization supporting QRIS, Virtual Accounts, e-Wallets, and Credit Cards with robust security.",

  proj_c7_title: "7. Code Refactoring & Optimization",
  proj_c7_p1:
    "Early prototypes are often built in haste, accumulating tech debt and fragile spaghetti code that breaks whenever new features are introduced.",
  proj_c7_p2:
    "We audit and refactor legacy codebases: eliminating dead code, modernizing architecture, optimizing queries, and stabilizing core workflows.",
  proj_c7_p3:
    "Prepare your application for production scale, guaranteeing stability and sub-second responsiveness under thousands of active users.",

  proj_empty_title: "No matching projects",
  proj_empty: "No project types match your search query.",
  proj_reset_btn: "Reset all filters",
  proj_result_count: "{count} of {total} project types",
  proj_result_count_all: "{count} project types",

  cal_back_link: "← Back to Home",
  cal_main_title: "1-on-1 Consultation & Mentoring Session",
  cal_main_desc:
    "A relaxed 1-on-1 video call via Google Meet — 100% Free (max 60 mins). Choose a suitable date & time to validate project ideas, system architecture, or your custom coding roadmap.",
  cal_mentor_name: "HardCode Mentoring",
  cal_event_title: "Exclusive Mentoring 1-on-1",
  cal_event_greeting:
    "Hi! 👋 Thank you for taking the time. Thrilled to support your coding career and software project journey! 😊",
  cal_event_subhint:
    "To make our session as impactful as possible, feel free to prepare any questions or ideas you want to explore together.",
  cal_meta_dur: "1h (Max 60 Mins · Free)",
  cal_meta_loc: "Google Meet",
  cal_meta_tz: "Asia/Jakarta (WIB / UTC+7)",
  cal_perks_title: "What you will receive:",
  cal_perk1: "✓ MVP project concept & architecture validation",
  cal_perk2: "✓ Personalized coding & AI roadmap",
  cal_perk3: "✓ Live screen-share for code review & debugging",
  cal_perk4: "✓ Summary notes & curated references sent to your email",
  cal_schedule_rule: "🟢 Mon–Fri: 20:00–22:00 WIB · Weekends: 13:00–20:00 WIB · 🔴 Holidays: Unavailable",
  cal_month_prev_aria: "Previous month",
  cal_month_next_aria: "Next month",
  cal_slot_confirm_btn: "Proceed to Details Form →",
  cal_holiday_title: "National Holiday",
  cal_holiday_desc:
    "Consultations are unavailable on national holidays. Please select another working date on the calendar.",
  cal_btn_change_time: "Change Schedule / Slot",
  cal_form_title: "Contact Info & Discussion Scope",
  cal_form_free_badge: "100% FREE · 60 MINS",
  cal_form_desc: "Confirmation details & your Google Meet invite link will be sent automatically to your email.",
  cal_btn_change_recap: "Change Slot",
  cal_lbl_name: "Full Name",
  cal_ph_name: "e.g. Alex Johnson",
  cal_lbl_email: "Active Email",
  cal_hint_email: "For Google Meet invite",
  cal_ph_email: "e.g. alex@example.com",
  cal_err_email: "Invalid email format (e.g. name@domain.com)",
  cal_err_email_required: "Email is required to send the Google Meet link",
  cal_err_name_required: "Full name is required",
  cal_err_notes_required: "Tell us what you'd like to discuss first",
  cal_lbl_wa: "WhatsApp / Phone",
  cal_hint_wa: "Optional (reminder)",
  cal_ph_wa: "+1 234 567 890",
  cal_lbl_topic: "Primary Category",
  cal_opt_topic1: "💡 MVP Concept Validation & New App Planning",
  cal_opt_topic2: "⚙️ Tech Stack & Backend Architecture Consultation",
  cal_opt_topic3: "🗺️ Beginner Coding & AI Learning Roadmap",
  cal_opt_topic4: "🔍 Code Review & Technical Troubleshooting",
  cal_opt_topic5: "☕ Casual Tech Talk & General AI/Code Q&A",
  cal_opt_topic6: "✨ Other Custom Topic",
  cal_lbl_chips: "Quick Topic Presets:",
  cal_chip1: "💡 MVP Idea Validation",
  cal_chip2: "⚙️ Tech Stack & DB",
  cal_chip3: "🗺️ AI Learning Roadmap",
  cal_chip4: "🔍 Code Review & Debug",
  cal_chip5: "☕ Casual Q&A",
  cal_lbl_notes: "What would you like to discuss?",
  cal_hint_notes: "Max 60 mins",
  cal_ph_notes:
    "Describe your goals, technical hurdles, architecture questions, or app concepts you would like to explore together...",
  cal_btn_back_form: "Back",
  cal_btn_submit: "Confirm Booking (100% Free) →",
  cal_security_notice: "🔒 Secure privacy · Zero hidden fees · Instant Meet invitation",
  cal_succ_title: "Session Successfully Scheduled!",
  cal_succ_desc: "Your 1-on-1 session is booked on the calendar. Your Google Meet link and details are shown below:",
  cal_succ_dur_val: "60 Minutes (100% Free)",
  cal_succ_copy_btn: "Copy Link",
  cal_succ_gcal_btn: "📅 Add to Google Calendar →",
  cal_succ_reset_btn: "Schedule Another Session",
  cal_summary_name_label: "Name:",
  cal_summary_email_label: "Email:",
  cal_summary_time_label: "Time:",
  cal_summary_dur_label: "Duration:",
  cal_summary_topic_label: "Category:",
  cal_summary_notes_label: "Discussion Notes:",
  cal_summary_meet_label: "Google Meet:",
  cal_topic_chips_group_aria: "Quick topic category presets",

  bot_gate_desc:
    "Have questions about 1-on-1 consultation, coding & AI tutoring, or custom project estimates? Enter your contact to chat.",
  bot_gate_lbl_contact: "Contact / Email",
  bot_gate_ph_contact: "name@email.com or phone number",
  bot_gate_quick_title: "Quick topic selection:",
  bot_gate_chip1: "💡 1-on-1 Consultation",
  bot_gate_chip2: "🗺️ Learn Coding",
  bot_gate_chip3: "⚙️ Build MVP App",
  bot_gate_chip_quote: "📊 Project Quote / Estimate",
  bot_gate_btn: "Start Chatting →",
  bot_sys_start: "// Chat session initialized with HardCode assistant bot",
  bot_greeting_pre: "Hello! 👋 I am HardCode's virtual assistant. Ask me anything about our ",
  bot_greeting_b1: "free 1-on-1 consultation",
  bot_greeting_mid1: ", ",
  bot_greeting_b2: "private coding classes",
  bot_greeting_mid2: ", or ",
  bot_greeting_b3: "custom web/MVP development",
  bot_greeting_end: "!",
  bot_prompt1: "📅 Consultation schedule?",
  bot_prompt2: "💰 Pricing & rates?",
  bot_prompt3: "👶 Beginner friendly?",
  bot_prompt4: "🛠️ Tech stack?",
  bot_prompt5: "📊 Quick Project Estimate",
  bot_prompt_q1: "When is the 1-on-1 consultation available?",
  bot_prompt_q2: "How much does consultation cost?",
  bot_prompt_q3: "Can total beginners learn from scratch?",
  bot_prompt_q4: "What tech stack do you specialize in?",
  bot_prompt_q5: "How much is the estimated cost and timeline for a custom app or feature?",
  bot_input_ph: "Type your question...",
  bot_input_label: "Type a question for the HardCode assistant",
  bot_send_btn: "Send",
  bot_send_btn_aria: "Send question",
  bot_btn_aria: "Open Chat Q&A Widget",
  bot_close_aria: "Close chat widget",
  bot_quota_left_txt: "{rem} of {tot} questions remaining",
  bot_quota_last_txt: "1 question remaining (last)",
  bot_quota_depleted_txt: "Session quota finished",
  bot_quota_done_pill: "0/5 Done",
  bot_quota_done_header: "0/5 Done",
  bot_quota_active_header: "{rem}/{tot} Session",
  bot_quota_depleted_ph: "Chat quota for this session is exhausted (5/5)",
  bot_quota_alert_exhausted:
    "Your question quota for this chat session is complete (5/5). Feel free to reserve a free 60-minute 1-on-1 session or email us at hello@hardcode.id! 😊",
  bot_quota_aria: "5-question quota indicator",
  bot_typing_text: "// processing response...",
  bot_btn_expand: "Widen chat window",
  bot_btn_collapse: "Compact chat window",
  bot_btn_fullpage: "Full page mode",
  bot_btn_restore: "Restore floating size",
  bot_size_toast_wide: "Chat window widened",
  bot_size_toast_full: "Full page mode activated",
  bot_size_toast_compact: "Chat window restored to standard mode",
  bot_tab_chat: "💬 Chat Q&A",
  bot_tab_quote: "📊 Quote Estimator",
  bot_action_open_quote: "Open Quote Calculator →",
  bot_action_consult: "Schedule Free 1-on-1 Session →",
  bot_action_projects: "Project Catalog →",
  bot_action_learning: "View Learning Syllabus →",
  bot_dialog_aria: "HardCode Chat Q&A Widget",
  quote_title: "📊 Project Estimate Calculator",
  quote_subtitle: "Get transparent timeline & investment estimates based on your required complexity and feature add-ons.",
  quote_type_label: "1. Project Category / Service",
  quote_complexity_label: "2. Complexity Level",
  quote_features_label: "3. Add-on Features & Integrations",
  quote_result_title: "Estimate Breakdown",
  quote_est_timeline: "Estimated Timeline",
  quote_est_investment: "Estimated Investment",
  quote_est_complexity: "Complexity Rating",
  quote_btn_consult: "📅 Bring Quote to Free 1-on-1 Session",
  quote_btn_copy: "📋 Copy Quote Summary",
  quote_btn_send_chat: "💬 Send to Chat Stream",
  quote_btn_print: "🖨️ Print / PDF",
  quote_btn_reset: "🔄 Reset Selections",
  quote_toast_copied: "Quote summary successfully copied to clipboard!",
  quote_toast_printing: "Preparing printable PDF document...",
  quote_toast_applied: "Quote estimate copied into consultation form!",
  quote_toast_reset: "Quote configuration reset.",
  quote_toast_sent: "Quote sent to the chat stream.",
  quote_active_badge: "📊 Active Quote Session",
  quote_banner_view: "View & Edit",
  quote_banner_dismiss_aria: "Dismiss quote banner",
  quote_summary_prefix: "Project Estimate",
  quote_saved_session_banner: "Saved active estimate: {type} ({complexity})",
  quote_included: "Included",
  quote_category_grid_aria: "Choose a project category",
  quote_complexity_grid_aria: "Choose a complexity level",
  quote_features_grid_aria: "Choose add-on features",
  quote_print_summary_title: "Project Estimate & Scope",
  quote_print_footer: "This estimate is valid for 30 days from the print date.",
};

export const translations: Record<Locale, Record<keyof typeof id, string>> = {
  id,
  en,
};

export type TranslationKey = keyof typeof id;
