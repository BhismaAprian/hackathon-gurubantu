import { ImageProps } from "next/image"

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

export interface Benefit {
  id: string
  title: string
  description: string
  image: ImageProps
}

export const mockBenefits: Benefit[] = [
  {
    id: "1",
    title: "Forum Diskusi Interaktif",
    description: "Bergabunglah dalam diskusi aktif dengan guru dan relawan lainnya untuk berbagi pengalaman dan strategi mengajar.",
    image: {
      src: "/benefit-forum.png",
      alt: "Forum Diskusi Interaktif",
    }
  },
  { 
    id: "2",
    title: "AI Assistensi Pembelajaran",
    description: "Dapatkan bantuan AI untuk membuat rencana pembelajaran, materi ajar, dan sumber daya pendidikan yang sesuai dengan kebutuhan siswa Anda.",
    image: {
      src: "/benefit-ai.png",
      alt: "AI Assistensi Pembelajaran",
    }
  },
  {
    id: "3",
    title: "Perpustakaan ",
    description: "Perpustakaan digital yang menyediakan berbagai sumber daya pendidikan, termasuk modul, video, dan template presentasi.",
    image: {
      src: "/benefit-training.png",
      alt: "Perpustakaan",
    }
  },
]


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

// Mock Threads
export const mockThreads: Thread[] = [
  {
    id: "1",
    title: "Tips Mengajar Matematika untuk Siswa SD di Daerah Terpencil",
    content:
      "Halo rekan-rekan guru! Saya ingin berbagi pengalaman mengajar matematika di daerah terpencil dengan keterbatasan fasilitas. Berikut beberapa tips yang bisa diterapkan...",
    author: mockUsers[0],
    tags: ["matematika", "SD", "tips-mengajar"],
    votes: 15,
    comments: mockComments,
    createdAt: "2024-03-15T09:00:00Z",
    hasFile: true,
    fileName: "tips-matematika-sd.pdf",
  },
  {
    id: "2",
    title: "Strategi Pembelajaran Bahasa Indonesia yang Menyenangkan",
    content:
      "Bagaimana cara membuat pembelajaran bahasa Indonesia lebih menarik? Mari diskusikan strategi-strategi kreatif yang pernah kalian coba.",
    author: mockUsers[1],
    tags: ["bahasa-indonesia", "strategi", "kreatif"],
    votes: 8,
    comments: [],
    createdAt: "2024-03-14T15:30:00Z",
  },
  {
    id: "3",
    title: "Eksperimen Sains Sederhana dengan Bahan Seadanya",
    content: "Berbagi ide eksperimen sains yang bisa dilakukan dengan bahan-bahan yang mudah ditemukan di desa.",
    author: mockUsers[2],
    tags: ["IPA", "eksperimen", "kreatif"],
    votes: 12,
    comments: [],
    createdAt: "2024-03-13T11:15:00Z",
    hasFile: true,
    fileName: "eksperimen-sains.docx",
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
