-- Create weekly_plans table
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create coach_suggestions table
CREATE TABLE IF NOT EXISTS coach_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'water', 'calorie', 'workout', 'general'
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own plans" 
  ON weekly_plans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plans" 
  ON weekly_plans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own suggestions" 
  ON coach_suggestions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own suggestions" 
  ON coach_suggestions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_date ON weekly_plans(user_id, start_date);
CREATE INDEX IF NOT EXISTS idx_coach_suggestions_user_unread ON coach_suggestions(user_id) WHERE is_read = FALSE;
