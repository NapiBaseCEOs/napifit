// XP and Level System
// Handles experience points, level progression, and rewards

export const XP_PER_LEVEL = 100;
export const LEVEL_MULTIPLIER = 1.5;

export interface XPReward {
  action: string;
  xp: number;
}

export const XP_REWARDS: Record<string, number> = {
  MEAL_LOGGED: 10,
  WORKOUT_LOGGED: 20,
  WATER_LOGGED: 5,
  DAILY_GOAL_COMPLETE: 50,
  WEEKLY_GOAL_COMPLETE: 100,
  STREAK_7_DAYS: 100,
  STREAK_30_DAYS: 500,
  ACHIEVEMENT_UNLOCKED: 25,
  PROFILE_COMPLETE: 50,
  AI_CHAT: 5,
};

export function calculateLevel(totalXP: number): number {
  let level = 1;
  let xpNeeded = XP_PER_LEVEL;
  let xpAccumulated = 0;

  while (xpAccumulated + xpNeeded <= totalXP) {
    xpAccumulated += xpNeeded;
    level++;
    xpNeeded = Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, level - 1));
  }

  return level;
}

export function getXPForNextLevel(currentLevel: number): number {
  return Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, currentLevel));
}

export function getXPProgress(totalXP: number): { current: number; needed: number; percentage: number } {
  const level = calculateLevel(totalXP);
  const xpForCurrentLevel = getXPForPreviousLevels(level);
  const xpForNextLevel = getXPForNextLevel(level);
  const currentXP = totalXP - xpForCurrentLevel;

  return {
    current: currentXP,
    needed: xpForNextLevel,
    percentage: Math.round((currentXP / xpForNextLevel) * 100),
  };
}

function getXPForPreviousLevels(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, i - 1));
  }
  return total;
}

export async function awardXP(
  supabase: any,
  userId: string,
  action: keyof typeof XP_REWARDS
): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
  const xpAmount = XP_REWARDS[action] || 0;

  // Get current gamification data
  const { data: current } = await supabase
    .from('user_gamification')
    .select('total_xp, level')
    .eq('user_id', userId)
    .single();

  const currentXP = current?.total_xp || 0;
  const currentLevel = current?.level || 1;
  const newXP = currentXP + xpAmount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > currentLevel;

  // Update gamification data
  await supabase
    .from('user_gamification')
    .upsert({
      user_id: userId,
      total_xp: newXP,
      level: newLevel,
      updated_at: new Date().toISOString(),
    });

  return { newXP, newLevel, leveledUp };
}
