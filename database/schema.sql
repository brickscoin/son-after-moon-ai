-- =============================================
-- SON AFTER MOON AI — DATABASE SCHEMA
-- India's First Multilingual AI Ecosystem
-- By Rounak Ranjan
-- =============================================

-- USERS TABLE
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    profile_picture TEXT,
    language_preference VARCHAR(20) DEFAULT 'hindi',
    plan_type VARCHAR(20) DEFAULT 'free',
    plan_expiry TIMESTAMP,
    total_tokens_used BIGINT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    google_id VARCHAR(255),
    github_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP DEFAULT NOW()
);

-- CONVERSATIONS TABLE
CREATE TABLE conversations (
    conv_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    title VARCHAR(255),
    tool_used VARCHAR(50) DEFAULT 'chat',
    language VARCHAR(20) DEFAULT 'hindi',
    messages JSONB DEFAULT '[]',
    tokens_used INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- MESSAGES TABLE
CREATE TABLE messages (
    msg_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conv_id UUID REFERENCES conversations(conv_id),
    user_id UUID REFERENCES users(user_id),
    role VARCHAR(10) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    language VARCHAR(20),
    tokens INTEGER DEFAULT 0,
    tool_used VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- USAGE TABLE
CREATE TABLE usage_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    tool_name VARCHAR(50) NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    api_used VARCHAR(50),
    language VARCHAR(20),
    status VARCHAR(20) DEFAULT 'success',
    response_time INTEGER, -- milliseconds
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PAYMENTS TABLE
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    plan_type VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    payment_gateway VARCHAR(20), -- 'razorpay' or 'stripe'
    gateway_payment_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    plan_start TIMESTAMP,
    plan_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- FEEDBACK TABLE
CREATE TABLE feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    tool_used VARCHAR(50),
    language VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- API KEYS TABLE (For developers)
CREATE TABLE api_keys (
    key_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    api_key VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(100),
    total_calls BIGINT DEFAULT 0,
    monthly_limit INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    last_used TIMESTAMP
);

-- TOOLS TABLE
CREATE TABLE tools (
    tool_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    category VARCHAR(50),
    min_plan VARCHAR(20) DEFAULT 'free',
    api_provider VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert all tools
INSERT INTO tools (name, display_name, description, icon, category, min_plan) VALUES
('chat', 'Chat AI', 'Intelligent conversation in any language', '💬', 'communication', 'free'),
('deep_research', 'Deep Research', 'In-depth research on any topic', '🤔', 'research', 'free'),
('web_search', 'Web Search', 'Real-time internet search', '🌐', 'research', 'free'),
('image_gen', 'Image Generation', 'Create images from text', '🖼️', 'creative', 'free'),
('video_create', 'Video Creation', 'Create videos with AI', '🎥', 'creative', 'creator'),
('video_edit', 'Video Editing', 'Edit and enhance videos', '✂️', 'creative', 'creator'),
('audio_music', 'Audio & Music', 'Create music and audio', '🎵', 'creative', 'creator'),
('code_write', 'Code Writer', 'Write and debug code', '💻', 'developer', 'chat_pro'),
('write_draft', 'Write & Draft', 'Writing assistant for any content', '📝', 'productivity', 'free'),
('analyze_docs', 'Analyze Documents', 'Analyze PDF, Word, Excel files', '📊', 'productivity', 'free'),
('camera_photo', 'Camera & Photo', 'Edit and enhance photos', '📷', 'creative', 'free'),
('file_create', 'File Creator', 'Create any type of file', '📁', 'productivity', 'chat_pro'),
('quiz_gen', 'Quiz Generator', 'Generate quizzes on any topic', '❓', 'education', 'free'),
('translate', 'Translator', 'Translate between 100+ languages', '🌍', 'communication', 'free'),
('tax_finance', 'Tax & Finance', 'Financial guidance and tax help', '💰', 'business', 'chat_pro'),
('health_guide', 'Health Guidance', 'Basic health information', '🏥', 'health', 'free'),
('legal_help', 'Legal Help', 'Basic legal information', '⚖️', 'legal', 'chat_pro'),
('study_assist', 'Study Assistant', 'Learn anything with AI tutor', '📚', 'education', 'free'),
('ai_agents', 'AI Agents', 'Autonomous AI task agents', '🤖', 'advanced', 'business'),
('simulation', 'Simulation', 'Universe and Earth simulation', '🌌', 'advanced', 'enterprise'),
('summarize', 'Summarize', 'Summarize any content quickly', '📄', 'productivity', 'free'),
('voice_ai', 'Voice AI', 'Text to speech and voice clone', '🎙️', 'communication', 'creator'),
('presentation', 'Presentation', 'Create slides and presentations', '📊', 'productivity', 'creator');

-- LANGUAGE SUPPORT TABLE
CREATE TABLE languages (
    lang_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100),
    category VARCHAR(20), -- 'indian', 'global', 'rare'
    script VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- Insert Indian Languages
INSERT INTO languages (code, name, native_name, category, script) VALUES
('hi', 'Hindi', 'हिन्दी', 'indian', 'Devanagari'),
('bn', 'Bengali', 'বাংলা', 'indian', 'Bengali'),
('ta', 'Tamil', 'தமிழ்', 'indian', 'Tamil'),
('te', 'Telugu', 'తెలుగు', 'indian', 'Telugu'),
('mr', 'Marathi', 'मराठी', 'indian', 'Devanagari'),
('gu', 'Gujarati', 'ગુજરાતી', 'indian', 'Gujarati'),
('kn', 'Kannada', 'ಕನ್ನಡ', 'indian', 'Kannada'),
('ml', 'Malayalam', 'മലയാളം', 'indian', 'Malayalam'),
('or', 'Odia', 'ଓଡ଼ିଆ', 'indian', 'Odia'),
('pa', 'Punjabi', 'ਪੰਜਾਬੀ', 'indian', 'Gurmukhi'),
('ur', 'Urdu', 'اردو', 'indian', 'Arabic'),
('as', 'Assamese', 'অসমীয়া', 'indian', 'Bengali'),
('bho', 'Bhojpuri', 'भोजपुरी', 'indian', 'Devanagari'),
('raj', 'Rajasthani', 'राजस्थानी', 'indian', 'Devanagari'),
('en', 'English', 'English', 'global', 'Latin'),
('ar', 'Arabic', 'العربية', 'global', 'Arabic'),
('zh', 'Chinese', '中文', 'global', 'Chinese'),
('es', 'Spanish', 'Español', 'global', 'Latin'),
('fr', 'French', 'Français', 'global', 'Latin'),
('de', 'German', 'Deutsch', 'global', 'Latin'),
('ja', 'Japanese', '日本語', 'global', 'Japanese'),
('ru', 'Russian', 'Русский', 'global', 'Cyrillic'),
('pt', 'Portuguese', 'Português', 'global', 'Latin'),
('ko', 'Korean', '한국어', 'global', 'Hangul');

-- PLAN LIMITS TABLE
CREATE TABLE plan_limits (
    plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_name VARCHAR(20) UNIQUE NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    price_inr INTEGER NOT NULL,
    price_usd DECIMAL(10,2),
    chat_messages_per_day INTEGER DEFAULT 50,
    image_gen_per_day INTEGER DEFAULT 3,
    video_create_per_day INTEGER DEFAULT 0,
    languages_count INTEGER DEFAULT 5,
    api_calls_per_month INTEGER DEFAULT 0,
    team_members INTEGER DEFAULT 1,
    features JSONB DEFAULT '[]'
);

INSERT INTO plan_limits (plan_name, display_name, price_inr, chat_messages_per_day, image_gen_per_day, video_create_per_day, languages_count, api_calls_per_month) VALUES
('free', 'Free Plan', 0, 50, 3, 0, 5, 0),
('chat_pro', 'Chat Pro', 99, -1, 10, 0, 22, 0),
('creator', 'Creator Plan', 299, -1, 100, 10, 50, 0),
('business', 'Business Plan', 799, -1, -1, -1, 100, 10000),
('enterprise', 'Enterprise', 0, -1, -1, -1, -1, -1);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_messages_conv ON messages(conv_id);
CREATE INDEX idx_usage_user_date ON usage_logs(user_id, date);
CREATE INDEX idx_payments_user ON payments(user_id);

-- =============================================
-- DATABASE SETUP COMPLETE!
-- Son After Moon AI 🌙☀️
-- =============================================
