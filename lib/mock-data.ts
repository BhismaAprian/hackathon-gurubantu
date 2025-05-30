export interface User {
  id: string
  name: string
  email: string
  role: "guru" | "relawan"
  avatar?: string
  subject: string
  experience: string
  level: string
  joinedAt: string
}

export interface Thread {
  id: string
  title: string
  content: string
  author: User
  tags: string[]
  votes: number
  comments: Comment[]
  createdAt: string
  hasFile?: boolean
  fileName?: string
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
  replies?: Comment[]
  votes: number
  isAI?: boolean
  hasFile?: boolean
  fileName?: string
}

export interface Resource {
  id: string
  title: string
  description: string
  type: "pdf" | "doc" | "ppt" | "video" | "image"
  subject: string
  level: string
  author: User
  downloadCount: number
  createdAt: string
  fileSize: string
}

export interface Notification {
  id: string
  type: "comment" | "like" | "mention" | "resource"
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sari Dewi",
    email: "sari.dewi@email.com",
    role: "guru",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Matematika",
    experience: "3-6 tahun",
    level: "SD",
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    role: "relawan",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Bahasa Indonesia",
    experience: "1-3 tahun",
    level: "SMP",
    joinedAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Maya Sari",
    email: "maya.sari@email.com",
    role: "guru",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "IPA",
    experience: "6-10 tahun",
    level: "SMA",
    joinedAt: "2024-01-10",
  },
]

// Mock Comments
const mockComments: Comment[] = [
  {
    id: "1",
    content: "Terima kasih atas tipsnya! Sangat membantu untuk pembelajaran online.",
    author: mockUsers[1],
    createdAt: "2024-03-15T10:30:00Z",
    votes: 5,
    replies: [
      {
        id: "2",
        content: "Sama-sama! Senang bisa membantu sesama pendidik.",
        author: mockUsers[0],
        createdAt: "2024-03-15T11:00:00Z",
        votes: 2,
      },
    ],
  },
  {
    id: "3",
    content: "Apakah ada contoh presentasi yang bisa dibagikan?",
    author: mockUsers[2],
    createdAt: "2024-03-15T14:20:00Z",
    votes: 3,
  },
]

// Add more comprehensive tags and subjects
export const availableSubjects = [
  "Matematika",
  "Bahasa Indonesia",
  "IPA",
  "IPS",
  "Bahasa Inggris",
  "Fisika",
  "Kimia",
  "Biologi",
  "Sejarah",
  "Geografi",
  "Seni",
  "Olahraga",
  "Umum",
]

export const availableTags = [
  "ujian-nasional",
  "kurikulum-merdeka",
  "lks",
  "tips-mengajar",
  "strategi",
  "kreatif",
  "eksperimen",
  "pembelajaran-online",
  "media-pembelajaran",
  "evaluasi",
  "remedial",
  "pengayaan",
  "karakter",
  "literasi",
  "numerasi",
]

// Enhanced mock threads with more variety
export const mockThreads: Thread[] = [
  {
    id: "1",
    title: "Tips Mengajar Matematika untuk Siswa SD di Daerah Terpencil",
    content:
      "Halo rekan-rekan guru! Saya ingin berbagi pengalaman mengajar matematika di daerah terpencil dengan keterbatasan fasilitas. Berikut beberapa tips yang bisa diterapkan: 1. Gunakan benda-benda di sekitar sebagai alat peraga, 2. Buat permainan sederhana untuk konsep matematika, 3. Libatkan orang tua dalam pembelajaran di rumah.",
    author: mockUsers[0],
    tags: ["matematika", "tips-mengajar", "pembelajaran-online"],
    votes: 15,
    comments: mockComments,
    createdAt: "2024-03-15T09:00:00Z",
    hasFile: true,
    fileName: "tips-matematika-sd.pdf",
  },
  {
    id: "2",
    title: "Implementasi Kurikulum Merdeka di Sekolah Dasar",
    content:
      "Bagaimana pengalaman teman-teman dalam mengimplementasikan Kurikulum Merdeka? Saya masih kesulitan dalam menyesuaikan metode penilaian dan perencanaan pembelajaran.",
    author: mockUsers[1],
    tags: ["kurikulum-merdeka", "evaluasi", "strategi"],
    votes: 23,
    comments: [],
    createdAt: "2024-03-14T15:30:00Z",
  },
  {
    id: "3",
    title: "Persiapan Ujian Nasional Fisika SMA - Strategi Efektif",
    content:
      "Berbagi strategi untuk mempersiapkan siswa menghadapi UN Fisika. Fokus pada konsep dasar dan latihan soal yang tepat sasaran.",
    author: mockUsers[2],
    tags: ["ujian-nasional", "fisika", "strategi"],
    votes: 18,
    comments: [],
    createdAt: "2024-03-13T11:15:00Z",
    hasFile: true,
    fileName: "strategi-un-fisika.docx",
  },
  {
    id: "4",
    title: "Media Pembelajaran Interaktif untuk Bahasa Indonesia",
    content:
      "Saya sedang mengembangkan media pembelajaran interaktif untuk mata pelajaran Bahasa Indonesia. Ada yang punya pengalaman atau saran?",
    author: mockUsers[0],
    tags: ["bahasa-indonesia", "media-pembelajaran", "kreatif"],
    votes: 12,
    comments: [],
    createdAt: "2024-03-12T14:20:00Z",
  },
  {
    id: "5",
    title: "Lembar Kerja Siswa (LKS) Kreatif untuk IPA",
    content:
      "Berbagi ide dan template LKS yang menarik untuk pembelajaran IPA di tingkat SMP. Fokus pada eksperimen sederhana yang bisa dilakukan di rumah.",
    author: mockUsers[1],
    tags: ["lks", "ipa", "kreatif", "eksperimen"],
    votes: 20,
    comments: [],
    createdAt: "2024-03-11T10:45:00Z",
    hasFile: true,
    fileName: "lks-ipa-kreatif.pdf",
  },
]

// Mock Resources
export const mockResources: Resource[] = [
  {
    id: "1",
    title: "Modul Pembelajaran Matematika SD Kelas 1-3",
    description: "Modul lengkap untuk pembelajaran matematika dasar dengan pendekatan yang mudah dipahami anak-anak.",
    type: "pdf",
    subject: "Matematika",
    level: "SD",
    author: mockUsers[0],
    downloadCount: 45,
    createdAt: "2024-03-10T08:00:00Z",
    fileSize: "2.5 MB",
  },
  {
    id: "2",
    title: "Template Presentasi Bahasa Indonesia",
    description: "Template PowerPoint yang menarik untuk pembelajaran bahasa Indonesia.",
    type: "ppt",
    subject: "Bahasa Indonesia",
    level: "SMP",
    author: mockUsers[1],
    downloadCount: 32,
    createdAt: "2024-03-08T14:20:00Z",
    fileSize: "1.8 MB",
  },
  {
    id: "3",
    title: "Video Tutorial Eksperimen Fisika",
    description: "Kumpulan video tutorial eksperimen fisika sederhana untuk SMA.",
    type: "video",
    subject: "Fisika",
    level: "SMA",
    author: mockUsers[2],
    downloadCount: 67,
    createdAt: "2024-03-05T16:45:00Z",
    fileSize: "15.2 MB",
  },
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "comment",
    title: "Komentar Baru",
    message: 'Ahmad Rizki mengomentari thread "Tips Mengajar Matematika"',
    read: false,
    createdAt: "2024-03-15T10:30:00Z",
    actionUrl: "/forum/thread/1",
  },
  {
    id: "2",
    type: "like",
    title: "Thread Disukai",
    message: "Maya Sari menyukai thread Anda",
    read: false,
    createdAt: "2024-03-15T09:15:00Z",
    actionUrl: "/forum/thread/2",
  },
  {
    id: "3",
    type: "resource",
    title: "Resource Baru",
    message: 'Resource baru "Modul IPA" telah diunggah',
    read: true,
    createdAt: "2024-03-14T13:20:00Z",
    actionUrl: "/library",
  },
]

export const currentUser = mockUsers[0]

// Mock user history data
export const mockUserHistory = {
  threads: [
    {
      id: "1",
      title: "Tips Mengajar Matematika untuk Siswa SD di Daerah Terpencil",
      status: "active",
      replies: 8,
      lastActivity: "2024-03-15T10:30:00Z",
      subject: "Matematika",
    },
    {
      id: "4",
      title: "Strategi Pembelajaran Jarak Jauh yang Efektif",
      status: "closed",
      replies: 12,
      lastActivity: "2024-03-10T14:20:00Z",
      subject: "Umum",
    },
  ],
  comments: [
    {
      threadId: "2",
      threadTitle: "Strategi Pembelajaran Bahasa Indonesia yang Menyenangkan",
      comment: "Saya setuju dengan pendekatan ini. Di sekolah saya juga menerapkan metode serupa.",
      createdAt: "2024-03-14T09:15:00Z",
    },
    {
      threadId: "3",
      threadTitle: "Eksperimen Sains Sederhana dengan Bahan Seadanya",
      comment: "Terima kasih idenya! Akan saya coba di kelas besok.",
      createdAt: "2024-03-13T16:45:00Z",
    },
  ],
}

// Mock AI response generator
export const generateAIResponse = (threadTitle: string, threadContent: string): Comment => {
  const aiResponses = [
    {
      content: `Berdasarkan analisis konten thread ini, saya merekomendasikan beberapa pendekatan: 1) Gunakan metode pembelajaran berbasis masalah untuk meningkatkan engagement siswa, 2) Integrasikan teknologi sederhana yang tersedia, 3) Buat assessment formatif yang berkelanjutan. Semoga membantu!`,
      context: "general",
    },
    {
      content: `Untuk topik ini, saya sarankan menggunakan pendekatan scaffolding: mulai dari konsep dasar, berikan contoh konkret, lalu ajak siswa berlatih mandiri. Jangan lupa untuk memberikan feedback yang konstruktif di setiap tahap pembelajaran.`,
      context: "teaching",
    },
    {
      content: `Berdasarkan best practices dalam pendidikan, beberapa strategi yang bisa diterapkan: 1) Diferensiasi pembelajaran sesuai gaya belajar siswa, 2) Penggunaan multimedia untuk memperkaya pengalaman belajar, 3) Kolaborasi antar siswa untuk peer learning.`,
      context: "strategy",
    },
  ]

  const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

  return {
    id: `ai-${Date.now()}`,
    content: randomResponse.content,
    author: {
      id: "ai-assistant",
      name: "AI Assistant GuruBantu",
      email: "ai@gurubantu.com",
      role: "relawan",
      avatar: "/placeholder.svg?height=40&width=40",
      subject: "AI",
      experience: "Unlimited",
      level: "Semua",
      joinedAt: "2024-01-01",
    },
    createdAt: new Date().toISOString(),
    votes: 0,
    isAI: true,
  }
}
