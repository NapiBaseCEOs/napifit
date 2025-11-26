package com.napibase.napifit.api;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u00f8\u0001\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010$\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\bf\u0018\u00002\u00020\u0001J\u001e\u0010\u0002\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0001\u0010\u0005\u001a\u00020\u0006H\u00a7@\u00a2\u0006\u0002\u0010\u0007J\u001e\u0010\b\u001a\b\u0012\u0004\u0012\u00020\t0\u00032\b\b\u0001\u0010\n\u001a\u00020\u000bH\u00a7@\u00a2\u0006\u0002\u0010\fJ\u001e\u0010\r\u001a\b\u0012\u0004\u0012\u00020\u000e0\u00032\b\b\u0001\u0010\u000f\u001a\u00020\u0010H\u00a7@\u00a2\u0006\u0002\u0010\u0011J\u001e\u0010\u0012\u001a\b\u0012\u0004\u0012\u00020\u00130\u00032\b\b\u0001\u0010\u0014\u001a\u00020\u0015H\u00a7@\u00a2\u0006\u0002\u0010\u0016J\u001e\u0010\u0017\u001a\b\u0012\u0004\u0012\u00020\u00180\u00032\b\b\u0001\u0010\u0019\u001a\u00020\u001aH\u00a7@\u00a2\u0006\u0002\u0010\u001bJ\u001e\u0010\u001c\u001a\b\u0012\u0004\u0012\u00020\u001d0\u00032\b\b\u0001\u0010\u001e\u001a\u00020\u001fH\u00a7@\u00a2\u0006\u0002\u0010 J\u001e\u0010!\u001a\b\u0012\u0004\u0012\u00020\"0\u00032\b\b\u0001\u0010\n\u001a\u00020#H\u00a7@\u00a2\u0006\u0002\u0010$J2\u0010%\u001a\b\u0012\u0004\u0012\u00020&0\u00032\b\b\u0003\u0010\'\u001a\u00020\u001f2\b\b\u0003\u0010(\u001a\u00020)2\b\b\u0003\u0010*\u001a\u00020)H\u00a7@\u00a2\u0006\u0002\u0010+J(\u0010,\u001a\b\u0012\u0004\u0012\u00020-0\u00032\b\b\u0003\u0010(\u001a\u00020)2\b\b\u0003\u0010*\u001a\u00020)H\u00a7@\u00a2\u0006\u0002\u0010.J\u0014\u0010/\u001a\b\u0012\u0004\u0012\u0002000\u0003H\u00a7@\u00a2\u0006\u0002\u00101J4\u00102\u001a\b\u0012\u0004\u0012\u0002030\u00032\b\b\u0003\u0010(\u001a\u00020)2\b\b\u0003\u0010*\u001a\u00020)2\n\b\u0003\u00104\u001a\u0004\u0018\u00010\u001fH\u00a7@\u00a2\u0006\u0002\u00105J\u0014\u00106\u001a\b\u0012\u0004\u0012\u0002070\u0003H\u00a7@\u00a2\u0006\u0002\u00101J\u0014\u00108\u001a\b\u0012\u0004\u0012\u0002090\u0003H\u00a7@\u00a2\u0006\u0002\u00101J \u0010:\u001a\b\u0012\u0004\u0012\u00020;0\u00032\n\b\u0003\u00104\u001a\u0004\u0018\u00010\u001fH\u00a7@\u00a2\u0006\u0002\u0010 J(\u0010<\u001a\b\u0012\u0004\u0012\u00020=0\u00032\b\b\u0003\u0010(\u001a\u00020)2\b\b\u0003\u0010*\u001a\u00020)H\u00a7@\u00a2\u0006\u0002\u0010.J\u001e\u0010>\u001a\b\u0012\u0004\u0012\u00020?0\u00032\b\b\u0001\u0010\u001e\u001a\u00020\u001fH\u00a7@\u00a2\u0006\u0002\u0010 J\u001e\u0010@\u001a\b\u0012\u0004\u0012\u00020A0\u00032\b\b\u0001\u0010\n\u001a\u00020BH\u00a7@\u00a2\u0006\u0002\u0010CJ\u001e\u0010D\u001a\b\u0012\u0004\u0012\u00020E0\u00032\b\b\u0001\u0010\n\u001a\u00020FH\u00a7@\u00a2\u0006\u0002\u0010GJ \u0010H\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020\u001f\u0012\u0004\u0012\u00020\u001f0I0\u0003H\u00a7@\u00a2\u0006\u0002\u00101J\u001e\u0010J\u001a\b\u0012\u0004\u0012\u00020K0\u00032\b\b\u0001\u0010\n\u001a\u00020LH\u00a7@\u00a2\u0006\u0002\u0010MJ\u001e\u0010N\u001a\b\u0012\u0004\u0012\u00020O0\u00032\b\b\u0001\u0010P\u001a\u00020QH\u00a7@\u00a2\u0006\u0002\u0010RJ\u001e\u0010S\u001a\b\u0012\u0004\u0012\u00020T0\u00032\b\b\u0001\u0010\n\u001a\u00020UH\u00a7@\u00a2\u0006\u0002\u0010V\u00a8\u0006W"}, d2 = {"Lcom/napibase/napifit/api/ApiService;", "", "addWaterIntake", "Lretrofit2/Response;", "Lcom/napibase/napifit/api/models/WaterIntakeAddResponse;", "intake", "Lcom/napibase/napifit/api/models/WaterIntakeRequest;", "(Lcom/napibase/napifit/api/models/WaterIntakeRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "createFeatureRequest", "Lcom/napibase/napifit/api/models/FeatureRequestResponse;", "request", "Lcom/napibase/napifit/api/models/FeatureRequestCreateRequest;", "(Lcom/napibase/napifit/api/models/FeatureRequestCreateRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "createHealthMetric", "Lcom/napibase/napifit/api/models/HealthMetricResponse;", "metric", "Lcom/napibase/napifit/api/models/HealthMetricCreateRequest;", "(Lcom/napibase/napifit/api/models/HealthMetricCreateRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "createMeal", "Lcom/napibase/napifit/api/models/MealResponse;", "meal", "Lcom/napibase/napifit/api/models/MealCreateRequest;", "(Lcom/napibase/napifit/api/models/MealCreateRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "createWorkout", "Lcom/napibase/napifit/api/models/WorkoutResponse;", "workout", "Lcom/napibase/napifit/api/models/WorkoutCreateRequest;", "(Lcom/napibase/napifit/api/models/WorkoutCreateRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "dislikeFeatureRequest", "Lcom/napibase/napifit/api/models/DislikeResponse;", "id", "", "(Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "forgotPassword", "Lcom/napibase/napifit/api/models/ForgotPasswordResponse;", "Lcom/napibase/napifit/api/models/ForgotPasswordRequest;", "(Lcom/napibase/napifit/api/models/ForgotPasswordRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getFeatureRequests", "Lcom/napibase/napifit/api/models/FeatureRequestsResponse;", "sort", "limit", "", "offset", "(Ljava/lang/String;IILkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getHealthMetrics", "Lcom/napibase/napifit/api/models/HealthMetricsResponse;", "(IILkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getLeaderboard", "Lcom/napibase/napifit/api/models/LeaderboardResponse;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getMeals", "Lcom/napibase/napifit/api/models/MealsResponse;", "date", "(IILjava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getProfile", "Lcom/napibase/napifit/api/models/ProfileResponse;", "getSession", "Lcom/napibase/napifit/api/models/SessionResponse;", "getWaterIntake", "Lcom/napibase/napifit/api/models/WaterIntakeResponse;", "getWorkouts", "Lcom/napibase/napifit/api/models/WorkoutsResponse;", "likeFeatureRequest", "Lcom/napibase/napifit/api/models/LikeResponse;", "resetPassword", "Lcom/napibase/napifit/api/models/ResetPasswordResponse;", "Lcom/napibase/napifit/api/models/ResetPasswordRequest;", "(Lcom/napibase/napifit/api/models/ResetPasswordRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "signIn", "Lcom/napibase/napifit/api/models/SignInResponse;", "Lcom/napibase/napifit/api/models/SignInRequest;", "(Lcom/napibase/napifit/api/models/SignInRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "signOut", "", "signUp", "Lcom/napibase/napifit/api/models/SignUpResponse;", "Lcom/napibase/napifit/api/models/SignUpRequest;", "(Lcom/napibase/napifit/api/models/SignUpRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "updateProfile", "Lcom/napibase/napifit/api/models/ProfileUpdateResponse;", "profile", "Lcom/napibase/napifit/api/models/ProfileUpdateRequest;", "(Lcom/napibase/napifit/api/models/ProfileUpdateRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "verifyCode", "Lcom/napibase/napifit/api/models/VerifyCodeResponse;", "Lcom/napibase/napifit/api/models/VerifyCodeRequest;", "(Lcom/napibase/napifit/api/models/VerifyCodeRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public abstract interface ApiService {
    
    @retrofit2.http.POST(value = "auth/signin")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object signIn(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.models.SignInRequest request, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.SignInResponse>> $completion);
    
    @retrofit2.http.POST(value = "auth/signup")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object signUp(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.models.SignUpRequest request, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.SignUpResponse>> $completion);
    
    @retrofit2.http.POST(value = "auth/signout")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object signOut(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<java.util.Map<java.lang.String, java.lang.String>>> $completion);
    
    @retrofit2.http.POST(value = "auth/forgot-password")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object forgotPassword(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.models.ForgotPasswordRequest request, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.ForgotPasswordResponse>> $completion);
    
    @retrofit2.http.POST(value = "auth/verify-code")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object verifyCode(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.models.VerifyCodeRequest request, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.VerifyCodeResponse>> $completion);
    
    @retrofit2.http.POST(value = "auth/reset-password")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object resetPassword(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.models.ResetPasswordRequest request, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.ResetPasswordResponse>> $completion);
    
    @retrofit2.http.GET(value = "auth/session")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getSession(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.SessionResponse>> $completion);
    
    @retrofit2.http.GET(value = "profile")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getProfile(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.ProfileResponse>> $completion);
    
    @retrofit2.http.PUT(value = "profile")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object updateProfile(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.models.ProfileUpdateRequest profile, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.ProfileUpdateResponse>> $completion);
    
    @retrofit2.http.GET(value = "meals")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getMeals(@retrofit2.http.Query(value = "limit")
    int limit, @retrofit2.http.Query(value = "offset")
    int offset, @retrofit2.http.Query(value = "date")
    @org.jetbrains.annotations.Nullable()
    java.lang.String date, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.MealsResponse>> $completion);
    
    @retrofit2.http.POST(value = "meals")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object createMeal(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.models.MealCreateRequest meal, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.MealResponse>> $completion);
    
    @retrofit2.http.GET(value = "workouts")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getWorkouts(@retrofit2.http.Query(value = "limit")
    int limit, @retrofit2.http.Query(value = "offset")
    int offset, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.WorkoutsResponse>> $completion);
    
    @retrofit2.http.POST(value = "workouts")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object createWorkout(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.models.WorkoutCreateRequest workout, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.WorkoutResponse>> $completion);
    
    @retrofit2.http.GET(value = "water-intake")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getWaterIntake(@retrofit2.http.Query(value = "date")
    @org.jetbrains.annotations.Nullable()
    java.lang.String date, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.WaterIntakeResponse>> $completion);
    
    @retrofit2.http.POST(value = "water-intake")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object addWaterIntake(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.models.WaterIntakeRequest intake, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.WaterIntakeAddResponse>> $completion);
    
    @retrofit2.http.GET(value = "health-metrics")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getHealthMetrics(@retrofit2.http.Query(value = "limit")
    int limit, @retrofit2.http.Query(value = "offset")
    int offset, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.HealthMetricsResponse>> $completion);
    
    @retrofit2.http.POST(value = "health-metrics")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object createHealthMetric(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.models.HealthMetricCreateRequest metric, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.HealthMetricResponse>> $completion);
    
    @retrofit2.http.GET(value = "feature-requests")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getFeatureRequests(@retrofit2.http.Query(value = "sort")
    @org.jetbrains.annotations.NotNull()
    java.lang.String sort, @retrofit2.http.Query(value = "limit")
    int limit, @retrofit2.http.Query(value = "offset")
    int offset, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.FeatureRequestsResponse>> $completion);
    
    @retrofit2.http.POST(value = "feature-requests")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object createFeatureRequest(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.models.FeatureRequestCreateRequest request, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.FeatureRequestResponse>> $completion);
    
    @retrofit2.http.POST(value = "feature-requests/{id}/like")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object likeFeatureRequest(@retrofit2.http.Path(value = "id")
    @org.jetbrains.annotations.NotNull()
    java.lang.String id, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.LikeResponse>> $completion);
    
    @retrofit2.http.POST(value = "feature-requests/{id}/dislike")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object dislikeFeatureRequest(@retrofit2.http.Path(value = "id")
    @org.jetbrains.annotations.NotNull()
    java.lang.String id, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.DislikeResponse>> $completion);
    
    @retrofit2.http.GET(value = "feature-requests/leaderboard")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getLeaderboard(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<com.napibase.napifit.api.models.LeaderboardResponse>> $completion);
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 3, xi = 48)
    public static final class DefaultImpls {
    }
}