export type WorkoutCalorieAIResponse = {
  mode: "workout";
  result: {
    calories: number;
    explanation: string;
    confidence: "low" | "medium" | "high";
    references?: string[];
  };
};

export type MealCalorieAIResponse = {
  mode: "meal";
  result: {
    totalCalories: number;
    explanation: string;
    breakdown: Array<{
      index: number;
      name: string;
      calories: number;
      quantity?: string | null;
      notes?: string;
    }>;
  };
};

export type CalorieAIResponse = WorkoutCalorieAIResponse | MealCalorieAIResponse;

