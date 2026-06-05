import {
  Activity,
  BadgeCheck,
  BrainCircuit,
  ClipboardList,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const landingFeatures = [
  {
    title: "Chat Screening Terarah",
    description:
      "Jawab pertanyaan satu per satu dengan alur yang ringan, ramah, dan mudah diikuti.",
    icon: BrainCircuit,
  },
  {
    title: "Hasil Screening yang Jelas",
    description:
      "Terima level risiko, skor, insight utama, dan rekomendasi awal dalam bahasa yang mudah dipahami.",
    icon: Sparkles,
  },
  {
    title: "Riwayat Screening Pribadi",
    description:
      "Simpan dan tinjau hasil screening sebelumnya untuk membantu memantau perubahan kondisi dari waktu ke waktu.",
    icon: Activity,
  },
  {
    title: "Privasi Data Terjaga",
    description:
      "Data akun dan hasil screening dikelola dengan akses aman agar Anda merasa lebih tenang saat menggunakan layanan.",
    icon: ShieldCheck,
  },
];

export const landingSteps = [
  {
    step: "01",
    title: "Mulai screening dengan tenang",
    description:
      "Pengguna menjawab pertanyaan terarah tentang tidur, stres, aktivitas, dan suasana hati secara bertahap.",
  },
  {
    step: "02",
    title: "Sistem menganalisis jawaban",
    description:
      "Setiap jawaban diolah menjadi data terstruktur untuk membaca pola yang perlu diperhatikan sejak dini.",
  },
  {
    step: "03",
    title: "Terima hasil dan rekomendasi awal",
    description:
      "Pengguna memperoleh level risiko, insight utama, dan saran awal yang dapat dijadikan bahan refleksi atau konsultasi lanjutan.",
  },
];

export const landingBenefits = [
  "Membantu Anda mengenali sinyal awal ketika stres, kelelahan, atau perubahan suasana hati mulai terasa mengganggu.",
  "Pertanyaannya ringan, terarah, dan nyaman diikuti oleh pengguna dari berbagai usia.",
  "Hasil screening disampaikan dengan bahasa yang jelas agar lebih mudah dipahami dan ditindaklanjuti.",
  "Privasi dan riwayat hasil Anda dijaga agar proses screening terasa lebih aman dan menenangkan.",
];

export const testimonials = [
  {
    name: "Rania Putri",
    role: "Mahasiswa",
    quote:
      "PsyScreening membantu saya memahami bahwa pola tidur dan tingkat stres saya memang perlu lebih diperhatikan. Hasilnya singkat, jelas, dan menenangkan.",
  },
  {
    name: "Aditya Pranata",
    role: "Karyawan Swasta",
    quote:
      "Pertanyaannya terasa ringan dan tidak menghakimi. Saya jadi lebih nyaman melakukan screening awal sebelum memutuskan untuk berkonsultasi lebih lanjut.",
  },
  {
    name: "Nadia F.",
    role: "Pengguna PsyScreening",
    quote:
      "Riwayat hasil screening memudahkan saya melihat perubahan kondisi dari waktu ke waktu. Fitur ini sangat membantu untuk refleksi diri secara lebih terarah.",
  },
];

export const faqs = [
  {
    question: "Apakah PsyScreening bisa menggantikan psikolog atau psikiater?",
    answer:
      "Tidak. Sistem ini hanya untuk screening awal dan edukasi. Keputusan klinis tetap harus dilakukan profesional yang berwenang.",
  },
  {
    question: "Apakah data dan hasil screening saya bersifat pribadi?",
    answer:
      "Ya. Data akun dan hasil screening disimpan dengan akses yang dibatasi agar privasi pengguna tetap terjaga.",
  },
  {
    question: "Apa yang perlu saya lakukan jika hasil menunjukkan risiko sedang atau tinggi?",
    answer:
      "Gunakan hasil tersebut sebagai sinyal awal untuk segera mencari dukungan dari orang tepercaya, konselor, psikolog, atau psikiater sesuai kebutuhan.",
  },
];

export const trustIndicators = [
  { label: "Alur Pertanyaan", value: "8 tahap" },
  { label: "Model Analisis", value: "3 model" },
  { label: "Durasi Screening", value: "< 3 menit" },
  { label: "Privasi Pengguna", value: "Terlindungi" },
];

export const heroMetrics = [
  {
    label: "Screening cepat",
    value: "3-5 menit",
    icon: ClipboardList,
  },
  {
    label: "Insight terarah",
    value: "Actionable",
    icon: BadgeCheck,
  },
];
