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
          show_public_profile: boolean | null;
          show_community_stats: boolean | null;
          daily_water_goal_ml: number | null;
          water_reminder_enabled: boolean | null;
          water_reminder_interval_minutes: number | null;
          country_code: string | null;
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
          show_public_profile?: boolean | null;
          show_community_stats?: boolean | null;
          daily_water_goal_ml?: number | null;
          water_reminder_enabled?: boolean | null;
          water_reminder_interval_minutes?: number | null;
          country_code?: string | null;
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
          bowel_movement_days: number | null;
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
          bowel_movement_days?: number | null;
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
      learned_calories: {
        Row: {
          id: string;
          food_name: string | null;
          preparation_method: string | null;
          quantity: string | null;
          calories_per_100g: number | null;
          calories_per_gram: number | null;
          workout_name: string | null;
          workout_preparation_method: string | null;
          workout_duration_minutes: number | null;
          workout_type: string | null;
          workout_calories: number | null;
          usage_count: number;
          last_used_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          food_name?: string | null;
          preparation_method?: string | null;
          quantity?: string | null;
          calories_per_100g?: number | null;
          calories_per_gram?: number | null;
          workout_name?: string | null;
          workout_preparation_method?: string | null;
          workout_duration_minutes?: number | null;
          workout_type?: string | null;
          workout_calories?: number | null;
          usage_count?: number;
          last_used_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["learned_calories"]["Insert"]>;
      };
      user_reviews: {
        Row: {
          id: string;
          user_id: string;
          rating: number;
          comment: string;
          is_featured: boolean;
          ai_sentiment_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          rating: number;
          comment: string;
          is_featured?: boolean;
          ai_sentiment_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_reviews"]["Insert"]>;
      };
      feature_requests: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          like_count: number;
          dislike_count: number;
          is_implemented: boolean;
          implemented_at: string | null;
          implemented_version: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          deleted_reason: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          like_count?: number;
          dislike_count?: number;
          is_implemented?: boolean;
          implemented_at?: string | null;
          implemented_version?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          deleted_reason?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["feature_requests"]["Insert"]>;
      };
      feature_request_likes: {
        Row: {
          id: string;
          feature_request_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          feature_request_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["feature_request_likes"]["Insert"]>;
      };
      feature_request_dislikes: {
        Row: {
          id: string;
          feature_request_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          feature_request_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["feature_request_dislikes"]["Insert"]>;
      };
      water_intake: {
        Row: {
          id: string;
          user_id: string;
          amount_ml: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount_ml: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["water_intake"]["Insert"]>;
      },
      assistant_notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          link: string | null;
          metadata: Json | null;
          dedupe_key: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: string;
          link?: string | null;
          metadata?: Json | null;
          dedupe_key?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assistant_notifications"]["Insert"]>;
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

