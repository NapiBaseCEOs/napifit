export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          date_of_birth: string | null;
          height_cm: number | null;
          weight_kg: number | null;
          age: number | null;
          gender: "male" | "female" | "other" | null;
          target_weight_kg: number | null;
          daily_steps: number | null;
          activity_level: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          age?: number | null;
          gender?: "male" | "female" | "other" | null;
          target_weight_kg?: number | null;
          daily_steps?: number | null;
          activity_level?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      health_metrics: {
        Row: {
          id: string;
          user_id: string;
          weight_kg: number | null;
          body_fat: number | null;
          muscle_mass: number | null;
          water: number | null;
          bmi: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weight_kg?: number | null;
          body_fat?: number | null;
          muscle_mass?: number | null;
          water?: number | null;
          bmi?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["health_metrics"]["Insert"]>;
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: "cardio" | "strength" | "flexibility" | "sports" | "other";
          duration_minutes: number | null;
          calories: number | null;
          distance_km: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: "cardio" | "strength" | "flexibility" | "sports" | "other";
          duration_minutes?: number | null;
          calories?: number | null;
          distance_km?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["workouts"]["Insert"]>;
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          image_url: string | null;
          foods: Json;
          total_calories: number;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack" | null;
          notes: string | null;
          recommendations: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url?: string | null;
          foods: Json;
          total_calories: number;
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack" | null;
          notes?: string | null;
          recommendations?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["meals"]["Insert"]>;
      };
    };
    Functions: Record<string, never>;
    Enums: {
      gender: "male" | "female" | "other";
      workout_type: "cardio" | "strength" | "flexibility" | "sports" | "other";
      meal_type: "breakfast" | "lunch" | "dinner" | "snack";
    };
  };
}

