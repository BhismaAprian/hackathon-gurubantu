-- Insert dummy categories
INSERT INTO categories (name, slug, description, color, icon, sort_order) VALUES
('Matematika', 'matematika', 'Diskusi tentang pembelajaran matematika', '#EF4444', 'calculator', 1),
('Bahasa Indonesia', 'bahasa-indonesia', 'Diskusi tentang pembelajaran bahasa Indonesia', '#3B82F6', 'book-open', 2),
('IPA', 'ipa', 'Diskusi tentang pembelajaran IPA', '#10B981', 'flask', 3),
('IPS', 'ips', 'Diskusi tentang pembelajaran IPS', '#F59E0B', 'globe', 4),
('Bahasa Inggris', 'bahasa-inggris', 'Diskusi tentang pembelajaran bahasa Inggris', '#8B5CF6', 'message-circle', 5),
('Umum', 'umum', 'Diskusi umum tentang pendidikan', '#6B7280', 'chat', 6);

-- Insert dummy tags
INSERT INTO tags (name, slug, description) VALUES
('tips-mengajar', 'tips-mengajar', 'Tips dan trik mengajar'),
('kurikulum-merdeka', 'kurikulum-merdeka', 'Pembahasan kurikulum merdeka'),
('pembelajaran-online', 'pembelajaran-online', 'Strategi pembelajaran online'),
('media-pembelajaran', 'media-pembelajaran', 'Media dan alat bantu pembelajaran'),
('evaluasi', 'evaluasi', 'Metode evaluasi dan penilaian'),
('kreatif', 'kreatif', 'Ide-ide kreatif dalam mengajar'),
('teknologi', 'teknologi', 'Penggunaan teknologi dalam pendidikan'),
('karakter', 'karakter', 'Pendidikan karakter'),
('literasi', 'literasi', 'Literasi dan numerasi'),
('remedial', 'remedial', 'Program remedial dan pengayaan');

-- Insert dummy users
INSERT INTO users (id, full_name, email, role, subject, education_level, teaching_experience, location, school_name, bio) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sari Dewi', 'sari.dewi@email.com', 'guru', 'Matematika', 'sd', '3-6 tahun', 'Jakarta', 'SDN 01 Jakarta', 'Guru matematika yang passionate dalam mengembangkan metode pembelajaran inovatif'),
('550e8400-e29b-41d4-a716-446655440002', 'Ahmad Rizki', 'ahmad.rizki@email.com', 'relawan', 'Bahasa Indonesia', 'smp', '1-3 tahun', 'Bandung', 'SMPN 5 Bandung', 'Relawan pendidik yang fokus pada literasi dan pengembangan karakter siswa'),
('550e8400-e29b-41d4-a716-446655440003', 'Maya Sari', 'maya.sari@email.com', 'guru', 'IPA', 'sma', '6-10 tahun', 'Surabaya', 'SMAN 3 Surabaya', 'Guru IPA dengan pengalaman dalam pembelajaran berbasis eksperimen'),
('550e8400-e29b-41d4-a716-446655440004', 'Budi Santoso', 'budi.santoso@email.com', 'guru', 'IPS', 'smp', '10+ tahun', 'Yogyakarta', 'SMPN 2 Yogyakarta', 'Guru senior yang aktif dalam pengembangan kurikulum'),
('550e8400-e29b-41d4-a716-446655440005', 'Rina Wati', 'rina.wati@email.com', 'relawan', 'Bahasa Inggris', 'sma', '3-6 tahun', 'Medan', 'SMAN 1 Medan', 'Relawan yang berfokus pada pengembangan kemampuan komunikasi siswa');

-- Insert dummy posts
INSERT INTO posts (id, title, content, category_id, summary, slug, author_id, status, is_pinned) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Tips Mengajar Matematika untuk Siswa SD di Daerah Terpencil', 'Halo rekan-rekan guru! Saya ingin berbagi pengalaman mengajar matematika di daerah terpencil dengan keterbatasan fasilitas. Berikut beberapa tips yang bisa diterapkan: 1. Gunakan benda-benda di sekitar sebagai alat peraga, 2. Buat permainan sederhana untuk konsep matematika, 3. Libatkan orang tua dalam pembelajaran di rumah.', 1, 'Tips praktis mengajar matematika dengan keterbatasan fasilitas', 'tips-mengajar-matematika-sd-terpencil', '550e8400-e29b-41d4-a716-446655440001', 'published', true),
('650e8400-e29b-41d4-a716-446655440002', 'Implementasi Kurikulum Merdeka di Sekolah Dasar', 'Bagaimana pengalaman teman-teman dalam mengimplementasikan Kurikulum Merdeka? Saya masih kesulitan dalam menyesuaikan metode penilaian dan perencanaan pembelajaran. Mohon sharing pengalamannya.', 6, 'Diskusi implementasi kurikulum merdeka', 'implementasi-kurikulum-merdeka-sd', '550e8400-e29b-41d4-a716-446655440002', 'published', false),
('650e8400-e29b-41d4-a716-446655440003', 'Media Pembelajaran Interaktif untuk Bahasa Indonesia', 'Saya sedang mengembangkan media pembelajaran interaktif untuk mata pelajaran Bahasa Indonesia. Ada yang punya pengalaman atau saran untuk tools yang mudah digunakan?', 2, 'Pengembangan media pembelajaran interaktif', 'media-pembelajaran-interaktif-bahasa', '550e8400-e29b-41d4-a716-446655440001', 'published', false),
('650e8400-e29b-41d4-a716-446655440004', 'Strategi Pembelajaran IPA yang Menyenangkan', 'Berbagi ide untuk membuat pembelajaran IPA lebih menyenangkan dan mudah dipahami siswa. Fokus pada eksperimen sederhana yang bisa dilakukan dengan alat seadanya.', 3, 'Strategi pembelajaran IPA yang engaging', 'strategi-pembelajaran-ipa-menyenangkan', '550e8400-e29b-41d4-a716-446655440003', 'published', false);

-- Insert dummy comments
INSERT INTO comments (id, content, post_id, author_id, is_ai_generated) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Terima kasih atas tipsnya! Sangat membantu untuk pembelajaran di daerah saya yang juga terbatas fasilitas. Saya akan coba terapkan metode permainan matematika.', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', false),
('750e8400-e29b-41d4-a716-446655440002', 'Setuju sekali! Di sekolah saya juga menerapkan pendekatan serupa. Tambahan dari saya: gunakan lagu-lagu sederhana untuk mengingat rumus matematika dasar.', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', false),
('750e8400-e29b-41d4-a716-446655440003', 'Untuk Kurikulum Merdeka, saya sarankan fokus pada asesmen formatif yang berkelanjutan. Jangan terpaku pada nilai, tapi lihat perkembangan proses belajar siswa.', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', false),
('750e8400-e29b-41d4-a716-446655440004', 'Berdasarkan pengalaman implementasi Kurikulum Merdeka, beberapa strategi yang efektif: 1) Diferensiasi pembelajaran sesuai kebutuhan siswa, 2) Pembelajaran berbasis proyek untuk mengembangkan keterampilan abad 21, 3) Asesmen autentik yang mengukur kompetensi secara holistik. Semoga membantu!', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', true);

-- Insert post tags relationships
INSERT INTO post_tags (post_id, tag_id) VALUES
('650e8400-e29b-41d4-a716-446655440001', 1), -- tips-mengajar
('650e8400-e29b-41d4-a716-446655440001', 6), -- kreatif
('650e8400-e29b-41d4-a716-446655440002', 2), -- kurikulum-merdeka
('650e8400-e29b-41d4-a716-446655440002', 5), -- evaluasi
('650e8400-e29b-41d4-a716-446655440003', 4), -- media-pembelajaran
('650e8400-e29b-41d4-a716-446655440003', 7), -- teknologi
('650e8400-e29b-41d4-a716-446655440004', 1), -- tips-mengajar
('650e8400-e29b-41d4-a716-446655440004', 6); -- kreatif

-- Insert dummy votes
INSERT INTO votes (user_id, post_id, value) VALUES
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 1),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 1),
('550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', 1),
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 1),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', 1);

INSERT INTO votes (user_id, comment_id, value) VALUES
('550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 1),
('550e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440003', 1);

-- Insert dummy library materials
INSERT INTO library_materials (id, user_id, title, description, file_url, file_name, file_size, file_type, subject, education_level, tags, learning_objectives) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Modul Pembelajaran Matematika SD Kelas 1-3', 'Modul lengkap untuk pembelajaran matematika dasar dengan pendekatan yang mudah dipahami anak-anak. Dilengkapi dengan latihan soal dan aktivitas menyenangkan.', 'materials/modul-matematika-sd.pdf', 'modul-matematika-sd.pdf', 2621440, 'PDF', 'Matematika', 'sd', '{"pembelajaran", "interaktif", "matematika-dasar"}', '{"Memahami konsep bilangan 1-100", "Menguasai operasi penjumlahan dan pengurangan", "Mengenal bentuk geometri dasar"}'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Template Presentasi Bahasa Indonesia', 'Template PowerPoint yang menarik untuk pembelajaran bahasa Indonesia dengan desain yang engaging dan mudah disesuaikan.', 'materials/template-bahasa-indonesia.pptx', 'template-bahasa-indonesia.pptx', 1887436, 'PowerPoint', 'Bahasa Indonesia', 'smp', '{"presentasi", "template", "bahasa-indonesia"}', '{"Meningkatkan kemampuan presentasi siswa", "Memahami struktur teks yang baik", "Mengembangkan kreativitas dalam berbahasa"}'),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Panduan Eksperimen IPA Sederhana', 'Kumpulan panduan eksperimen IPA yang dapat dilakukan dengan alat dan bahan sederhana yang mudah ditemukan di sekitar kita.', 'materials/panduan-eksperimen-ipa.pdf', 'panduan-eksperimen-ipa.pdf', 3145728, 'PDF', 'IPA', 'sma', '{"eksperimen", "praktikum", "ipa"}', '{"Memahami metode ilmiah", "Mengembangkan keterampilan observasi", "Menerapkan konsep IPA dalam kehidupan sehari-hari"}');

-- Update usage counts for tags
UPDATE tags SET usage_count = (
    SELECT COUNT(*) FROM post_tags WHERE post_tags.tag_id = tags.id
);
