# Supabase Setup Guide for BARTER App

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New project"
4. Fill in:
   - **Project name**: `barter`
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project" and wait for setup (2-3 minutes)

## Step 2: Get API Credentials

1. In your Supabase project, go to **Settings > API**
2. Copy:
   - **Project URL** (under "API URL")
   - **Anon Public Key** (under "anon public")
3. Save these values

## Step 3: Update Environment Variables

1. Open `.env.local` in your project root
2. Replace placeholders:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```

## Step 4: Create Database Schema

**ВАЖНО:** Копирайте SQL от файла `database.sql` в този репозиторий!

### Метод 1: Прямо копиране (препоръчано)
1. Отворете файла `database.sql` в VS Code
2. Копирайте ВСИЧКИЯ текст (Ctrl+A, Ctrl+C)
3. В Supabase SQL Editor, вставете го
4. Щракнете "Run" 

### Метод 2: Откъс по откъс
Ако имате проблеми, изпълнете следните SQL командии отделно:

**1. Създайте таблици:**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    city TEXT,
    avatar_url TEXT,
    rating NUMERIC DEFAULT 5.0,
    listings_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE listings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price TEXT,
    location TEXT,
    condition TEXT,
    year INTEGER,
    working BOOLEAN DEFAULT true,
    image_url TEXT,
    images JSON,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT
);

CREATE TABLE messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id BIGINT REFERENCES listings(id) ON DELETE SET NULL,
    message TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id BIGINT REFERENCES listings(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**2. Създайте индекси:**
```sql
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_reviews_user ON reviews(reviewed_user_id);
```

**3. Вставете категории:**
```sql
INSERT INTO categories (name, icon, description) VALUES
('Компютри', '💻', 'Ретро компютри и системи'),
('Клавиатури', '⌨️', 'Механични и стари клавиатури'),
('Монитори', '🖥️', 'CRT и старинни дисплеи'),
('Мишки', '🖱️', 'Механични мишки'),
('Периферия', '🔌', 'Принтери, скенери и др.'),
('Части', '🔧', 'Компоненти и резервни части');
```

## Step 5: Enable Row Level Security (RLS)

1. Go to **Authentication > Policies** in Supabase
2. For each table, click "Enable RLS"
3. Add policy to allow public read:
   ```sql
   CREATE POLICY "Allow public read" 
   ON listings FOR SELECT 
   TO public 
   USING (true);
   ```

## Step 6: Test Connection

1. Save your `.env.local` file
2. Run: `npm run dev`
3. Go to Auth page and try logging in
4. Check browser console for any errors

## Step 7: Create Test User (Optional)

1. In Supabase, go to **Authentication > Users**
2. Click "Create user"
3. Fill in:
   - **Email**: test@example.com
   - **Password**: password123
4. Uncheck "Auto confirm user"
5. Click "Create user"

## Step 8: Create Sample Data (Optional)

Use the SQL Editor in Supabase to insert sample listings:

```sql
INSERT INTO listings (user_id, title, description, category, price, location, condition, year, working)
VALUES (
    (SELECT id FROM users LIMIT 1),
    'Commodore 64',
    'Работи отлично, комплект с джойстик',
    'Компютри',
    'за разговор',
    'София',
    'Добро',
    1983,
    true
);
```

## Troubleshooting

### Can't connect to Supabase?
- Check `.env.local` is not in `.gitignore` (it shouldn't be committed)
- Verify API URL and Key are correct
- Check browser console for errors

### Auth not working?
- Make sure Supabase auth is enabled
- Check users table has correct schema
- Verify RLS policies are correct

### Need help?
- Check [Supabase Docs](https://supabase.com/docs)
- See `.github/copilot-instructions.md` for more info
