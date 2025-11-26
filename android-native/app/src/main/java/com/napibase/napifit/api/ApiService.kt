package com.napibase.napifit.api

import com.napibase.napifit.api.models.*
import retrofit2.Response
import retrofit2.http.*

// Import auth models
import com.napibase.napifit.api.models.SignInRequest
import com.napibase.napifit.api.models.SignInResponse
import com.napibase.napifit.api.models.SignUpRequest
import com.napibase.napifit.api.models.SignUpResponse
import com.napibase.napifit.api.models.ForgotPasswordRequest
import com.napibase.napifit.api.models.ForgotPasswordResponse
import com.napibase.napifit.api.models.VerifyCodeRequest
import com.napibase.napifit.api.models.VerifyCodeResponse
import com.napibase.napifit.api.models.ResetPasswordRequest
import com.napibase.napifit.api.models.ResetPasswordResponse
import com.napibase.napifit.api.models.SessionResponse

interface ApiService {
    
    // Auth
    @POST("auth/signin")
    suspend fun signIn(@Body request: SignInRequest): Response<SignInResponse>
    
    @POST("auth/signup")
    suspend fun signUp(@Body request: SignUpRequest): Response<SignUpResponse>
    
    @POST("auth/signout")
    suspend fun signOut(): Response<Map<String, String>>
    
    @POST("auth/forgot-password")
    suspend fun forgotPassword(@Body request: ForgotPasswordRequest): Response<ForgotPasswordResponse>
    
    @POST("auth/verify-code")
    suspend fun verifyCode(@Body request: VerifyCodeRequest): Response<VerifyCodeResponse>
    
    @POST("auth/reset-password")
    suspend fun resetPassword(@Body request: ResetPasswordRequest): Response<ResetPasswordResponse>
    
    @GET("auth/session")
    suspend fun getSession(): Response<SessionResponse>
    
    // Profile
    @GET("profile")
    suspend fun getProfile(): Response<ProfileResponse>
    
    @PUT("profile")
    suspend fun updateProfile(@Body profile: ProfileUpdateRequest): Response<ProfileUpdateResponse>
    
    // Meals
    @GET("meals")
    suspend fun getMeals(
        @Query("limit") limit: Int = 50,
        @Query("offset") offset: Int = 0,
        @Query("date") date: String? = null
    ): Response<MealsResponse>
    
    @POST("meals")
    suspend fun createMeal(@Body meal: MealCreateRequest): Response<MealResponse>
    
    // Workouts
    @GET("workouts")
    suspend fun getWorkouts(
        @Query("limit") limit: Int = 50,
        @Query("offset") offset: Int = 0
    ): Response<WorkoutsResponse>
    
    @POST("workouts")
    suspend fun createWorkout(@Body workout: WorkoutCreateRequest): Response<WorkoutResponse>
    
    // Water Intake
    @GET("water-intake")
    suspend fun getWaterIntake(@Query("date") date: String? = null): Response<WaterIntakeResponse>
    
    @POST("water-intake")
    suspend fun addWaterIntake(@Body intake: WaterIntakeRequest): Response<WaterIntakeAddResponse>
    
    // Health Metrics
    @GET("health-metrics")
    suspend fun getHealthMetrics(
        @Query("limit") limit: Int = 50,
        @Query("offset") offset: Int = 0
    ): Response<HealthMetricsResponse>
    
    @POST("health-metrics")
    suspend fun createHealthMetric(@Body metric: HealthMetricCreateRequest): Response<HealthMetricResponse>
    
    // Feature Requests
    @GET("feature-requests")
    suspend fun getFeatureRequests(
        @Query("sort") sort: String = "likes",
        @Query("limit") limit: Int = 50,
        @Query("offset") offset: Int = 0
    ): Response<FeatureRequestsResponse>
    
    @POST("feature-requests")
    suspend fun createFeatureRequest(@Body request: FeatureRequestCreateRequest): Response<FeatureRequestResponse>
    
    @POST("feature-requests/{id}/like")
    suspend fun likeFeatureRequest(@Path("id") id: String): Response<LikeResponse>
    
    @POST("feature-requests/{id}/dislike")
    suspend fun dislikeFeatureRequest(@Path("id") id: String): Response<DislikeResponse>
    
    @GET("feature-requests/leaderboard")
    suspend fun getLeaderboard(): Response<LeaderboardResponse>
}

