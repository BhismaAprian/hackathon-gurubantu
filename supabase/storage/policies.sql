-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('forum-attachments', 'forum-attachments', true),
('library-materials', 'library-materials', true);

-- Avatar storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Forum attachments policies
CREATE POLICY "Forum attachments are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'forum-attachments');

CREATE POLICY "Authenticated users can upload forum attachments" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'forum-attachments' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own forum attachments" ON storage.objects
FOR DELETE USING (
  bucket_id = 'forum-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Library materials policies
CREATE POLICY "Library materials are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'library-materials');

CREATE POLICY "Authenticated users can upload library materials" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'library-materials' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own library materials" ON storage.objects
FOR DELETE USING (
  bucket_id = 'library-materials' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
