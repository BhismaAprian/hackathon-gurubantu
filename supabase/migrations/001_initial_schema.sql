-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('guru', 'relawan');
CREATE TYPE post_status AS ENUM ('published', 'draft');
CREATE TYPE education_level AS ENUM ('paud', 'sd', 'smp', 'sma', 'universitas');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'guru',
    subject TEXT,
    education_level education_level,
    teaching_experience TEXT,
    location TEXT,
    school_name TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT 'folder',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    summary TEXT,
    slug TEXT NOT NULL UNIQUE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status post_status DEFAULT 'published',
    is_pinned BOOLEAN DEFAULT false,
    is_solved BOOLEAN DEFAULT false,
    has_ai_responded BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    attachment_url TEXT,
    attachment_name TEXT,
    search_vector tsvector,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_solution BOOLEAN DEFAULT false,
    is_ai_generated BOOLEAN DEFAULT false,
    like_count INTEGER DEFAULT 0,
    attachment_url TEXT,
    attachment_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table (for upvote/downvote functionality)
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    value INTEGER NOT NULL CHECK (value IN (-1, 1)), -- -1 for downvote, 1 for upvote
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure user can only vote once per post or comment
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, comment_id),
    
    -- Ensure vote is for either post or comment, not both
    CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR 
        (post_id IS NULL AND comment_id IS NOT NULL)
    )
);

-- Post tags pivot table
CREATE TABLE post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Library materials table
CREATE TABLE library_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    subject TEXT,
    education_level education_level,
    curriculum TEXT DEFAULT 'Kurikulum Merdeka',
    tags TEXT[] DEFAULT '{}',
    learning_objectives TEXT[] DEFAULT '{}',
    is_approved BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_search_vector ON posts USING gin(search_vector);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_post_id ON votes(post_id);
CREATE INDEX idx_votes_comment_id ON votes(comment_id);

CREATE INDEX idx_library_materials_user_id ON library_materials(user_id);
CREATE INDEX idx_library_materials_subject ON library_materials(subject);
CREATE INDEX idx_library_materials_education_level ON library_materials(education_level);
CREATE INDEX idx_library_materials_created_at ON library_materials(created_at DESC);

-- Create full-text search index
CREATE INDEX idx_posts_title_content ON posts USING gin(to_tsvector('indonesian', title || ' ' || content));

-- Functions and triggers for updating search vector
CREATE OR REPLACE FUNCTION update_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('indonesian', NEW.title || ' ' || NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_search_vector
    BEFORE INSERT OR UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_post_search_vector();

-- Function to update like counts
CREATE OR REPLACE FUNCTION update_like_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.post_id IS NOT NULL THEN
            UPDATE posts 
            SET like_count = like_count + NEW.value 
            WHERE id = NEW.post_id;
        END IF;
        
        IF NEW.comment_id IS NOT NULL THEN
            UPDATE comments 
            SET like_count = like_count + NEW.value 
            WHERE id = NEW.comment_id;
        END IF;
        
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'UPDATE' THEN
        IF NEW.post_id IS NOT NULL THEN
            UPDATE posts 
            SET like_count = like_count + (NEW.value - OLD.value)
            WHERE id = NEW.post_id;
        END IF;
        
        IF NEW.comment_id IS NOT NULL THEN
            UPDATE comments 
            SET like_count = like_count + (NEW.value - OLD.value)
            WHERE id = NEW.comment_id;
        END IF;
        
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        IF OLD.post_id IS NOT NULL THEN
            UPDATE posts 
            SET like_count = like_count - OLD.value 
            WHERE id = OLD.post_id;
        END IF;
        
        IF OLD.comment_id IS NOT NULL THEN
            UPDATE comments 
            SET like_count = like_count - OLD.value 
            WHERE id = OLD.comment_id;
        END IF;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vote_counts
    AFTER INSERT OR UPDATE OR DELETE ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_like_counts();

-- Function to update reply counts
CREATE OR REPLACE FUNCTION update_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts 
        SET reply_count = reply_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        UPDATE posts 
        SET reply_count = reply_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_reply_count
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_reply_count();

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags 
        SET usage_count = usage_count + 1 
        WHERE id = NEW.tag_id;
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        UPDATE tags 
        SET usage_count = usage_count - 1 
        WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_usage
    AFTER INSERT OR DELETE ON post_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_tag_usage_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_materials_updated_at
    BEFORE UPDATE ON library_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
