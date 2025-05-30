-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_materials ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can view published posts" ON posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can create posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts" ON posts
    FOR DELETE USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE USING (auth.uid() = author_id);

-- Votes policies
CREATE POLICY "Anyone can view votes" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Users can create votes" ON votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON votes
    FOR DELETE USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (is_active = true);

-- Tags policies
CREATE POLICY "Anyone can view tags" ON tags
    FOR SELECT USING (true);

-- Post tags policies
CREATE POLICY "Anyone can view post tags" ON post_tags
    FOR SELECT USING (true);

CREATE POLICY "Users can manage tags for own posts" ON post_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = post_tags.post_id 
            AND posts.author_id = auth.uid()
        )
    );

-- Library materials policies
CREATE POLICY "Anyone can view approved materials" ON library_materials
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can view own materials" ON library_materials
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create materials" ON library_materials
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own materials" ON library_materials
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own materials" ON library_materials
    FOR DELETE USING (auth.uid() = user_id);
