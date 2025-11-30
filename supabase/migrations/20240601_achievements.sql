-- Achievement system database schema
-- Creates tables for gamification features

-- Achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- 'meals', 'workouts', 'streaks', 'social', 'milestones'
  requirement_type TEXT NOT NULL, -- 'count', 'streak', 'milestone'
  requirement_value INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User achievements (unlocked achievements)
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User XP and levels
CREATE TABLE IF NOT EXISTS public.user_gamification (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

-- Achievements are public (everyone can see available achievements)
CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  USING (true);

-- Users can only view their own unlocked achievements
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view and update their own gamification data
CREATE POLICY "Users can view own gamification"
  ON public.user_gamification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification"
  ON public.user_gamification FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification"
  ON public.user_gamification FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, category, requirement_type, requirement_value, points) VALUES
  ('İlk Adım', 'İlk öğününü kaydet', '🍽️', 'meals', 'count', 1, 10),
  ('Yemek Ustası', '10 öğün kaydet', '👨‍🍳', 'meals', 'count', 10, 50),
  ('Fitness Başlangıcı', 'İlk egzersizini kaydet', '💪', 'workouts', 'count', 1, 10),
  ('Spor Tutkunu', '20 egzersiz yap', '🏋️', 'workouts', 'count', 20, 100),
  ('Kararlı', '7 gün üst üste kayıt yap', '🔥', 'streaks', 'streak', 7, 50),
  ('Azimli', '30 gün üst üste kayıt yap', '⚡', 'streaks', 'streak', 30, 200),
  ('Su İçici', '50 bardak su iç', '💧', 'milestones', 'count', 50, 30),
  ('Hedef Kovalayan', 'İlk hedefine ulaş', '🎯', 'milestones', 'milestone', 1, 100)
ON CONFLICT DO NOTHING;
