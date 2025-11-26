package com.napibase.napifit.api.models

// Auth
data class SignInRequest(
    val email: String,
    val password: String
)

data class SignInResponse(
    val message: String,
    val token: String,
    val refreshToken: String?,
    val user: AuthUser
)

data class AuthUser(
    val id: String,
    val email: String?
)

data class SignUpRequest(
    val email: String,
    val password: String,
    val name: String? = null
)

data class SignUpResponse(
    val message: String,
    val user: AuthUser,
    val requiresEmailVerification: Boolean
)

data class ForgotPasswordRequest(
    val email: String
)

data class ForgotPasswordResponse(
    val message: String,
    val code: String? = null // Only in development
)

data class VerifyCodeRequest(
    val email: String,
    val code: String
)

data class VerifyCodeResponse(
    val message: String,
    val verified: Boolean
)

data class ResetPasswordRequest(
    val email: String,
    val code: String,
    val newPassword: String
)

data class ResetPasswordResponse(
    val message: String
)

data class SessionResponse(
    val user: AuthUser,
    val authenticated: Boolean
)

// Profile
data class ProfileResponse(
    val id: String,
    val name: String?,
    val email: String?,
    val image: String?,
    val height: Double?,
    val weight: Double?,
    val age: Int?,
    val gender: String?,
    val targetWeight: Double?,
    val dailySteps: Int?,
    val onboardingCompleted: Boolean,
    val showPublicProfile: Boolean,
    val showCommunityStats: Boolean,
    val createdAt: String
)

data class ProfileUpdateRequest(
    val name: String? = null,
    val height: Double? = null,
    val weight: Double? = null,
    val age: Int? = null,
    val gender: String? = null,
    val targetWeight: Double? = null,
    val dailySteps: Int? = null,
    val showPublicProfile: Boolean? = null,
    val showCommunityStats: Boolean? = null,
    val dailyWaterGoalMl: Int? = null,
    val waterReminderEnabled: Boolean? = null,
    val waterReminderIntervalMinutes: Int? = null
)

data class ProfileUpdateResponse(
    val message: String,
    val user: ProfileUser
)

data class ProfileUser(
    val id: String,
    val name: String?,
    val email: String?,
    val image: String?,
    val height: Double?,
    val weight: Double?,
    val age: Int?,
    val gender: String?,
    val targetWeight: Double?,
    val dailySteps: Int?
)

// Meals
data class MealsResponse(
    val meals: List<Meal>,
    val total: Int,
    val limit: Int,
    val offset: Int
)

data class Meal(
    val id: String,
    val user_id: String,
    val foods: List<Food>,
    val total_calories: Double,
    val meal_type: String?,
    val notes: String?,
    val created_at: String,
    val createdAt: String
)

data class Food(
    val name: String,
    val calories: Double?,
    val quantity: String?
)

data class MealCreateRequest(
    val foods: List<Food>,
    val totalCalories: Double? = null,
    val mealType: String? = null,
    val notes: String? = null,
    val imageUrl: String? = null
)

data class MealResponse(
    val message: String,
    val meal: Meal
)

// Workouts
data class WorkoutsResponse(
    val workouts: List<Workout>,
    val total: Int,
    val limit: Int,
    val offset: Int
)

data class Workout(
    val id: String,
    val user_id: String,
    val name: String,
    val type: String,
    val duration: Int?,
    val calories: Double?,
    val distance: Double?,
    val notes: String?,
    val created_at: String,
    val createdAt: String
)

data class WorkoutCreateRequest(
    val name: String,
    val type: String,
    val duration: Int? = null,
    val calories: Double? = null,
    val distance: Double? = null,
    val notes: String? = null
)

data class WorkoutResponse(
    val message: String,
    val workout: Workout
)

// Water Intake
data class WaterIntakeResponse(
    val intakes: List<WaterIntake>,
    val totalAmount: Double,
    val dailyGoal: Int,
    val progress: Double,
    val reminderEnabled: Boolean,
    val reminderInterval: Int
)

data class WaterIntake(
    val id: String,
    val user_id: String,
    val amount_ml: Int,
    val created_at: String
)

data class WaterIntakeRequest(
    val amount_ml: Int
)

data class WaterIntakeAddResponse(
    val message: String,
    val intake: WaterIntake,
    val totalAmount: Double,
    val dailyGoal: Int,
    val progress: Double
)

// Health Metrics
data class HealthMetricsResponse(
    val healthMetrics: List<HealthMetric>,
    val total: Int,
    val limit: Int,
    val offset: Int
)

data class HealthMetric(
    val id: String,
    val user_id: String,
    val weight_kg: Double?,
    val body_fat: Double?,
    val muscle_mass: Double?,
    val water: Double?,
    val bmi: Double?,
    val bowel_movement_days: Double?,
    val notes: String?,
    val created_at: String,
    val createdAt: String
)

data class HealthMetricCreateRequest(
    val weight: Double? = null,
    val bodyFat: Double? = null,
    val muscleMass: Double? = null,
    val water: Double? = null,
    val bmi: Double? = null,
    val bowelMovementDays: Double? = null,
    val notes: String? = null
)

data class HealthMetricResponse(
    val message: String,
    val healthMetric: HealthMetric
)

// Feature Requests
data class FeatureRequestsResponse(
    val requests: List<FeatureRequest>
)

data class FeatureRequest(
    val id: String,
    val title: String,
    val description: String,
    val likeCount: Int,
    val dislikeCount: Int,
    val isLiked: Boolean,
    val isDisliked: Boolean,
    val isImplemented: Boolean,
    val implementedAt: String?,
    val implementedVersion: String?,
    val createdAt: String,
    val user: FeatureRequestUser
)

data class FeatureRequestUser(
    val id: String,
    val name: String,
    val avatar: String?,
    val joinedAt: String,
    val showStats: Boolean,
    val showPublicProfile: Boolean,
    val countryCode: String?
)

data class FeatureRequestCreateRequest(
    val title: String,
    val description: String
)

data class FeatureRequestResponse(
    val message: String,
    val request: FeatureRequest
)

data class LikeResponse(
    val liked: Boolean
)

data class DislikeResponse(
    val disliked: Boolean
)

// Leaderboard
data class LeaderboardResponse(
    val leaderboard: List<LeaderboardEntry>
)

data class LeaderboardEntry(
    val userId: String,
    val name: String,
    val avatar: String?,
    val implementedCount: Int,
    val joinedAt: String,
    val showStats: Boolean,
    val showPublicProfile: Boolean,
    val countryCode: String?
)

