package com.napibase.napifit.api;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000L\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0006\n\u0002\u0010$\n\u0002\u0010 \n\u0000\b\u00c6\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u0010\u0010\u0017\u001a\u00020\u00132\b\u0010\u0018\u001a\u0004\u0018\u00010\u0004J\u0016\u0010\u0019\u001a\u00020\u00132\u000e\u0010\u001a\u001a\n\u0012\u0004\u0012\u00020\u0013\u0018\u00010\u0012J*\u0010\u001b\u001a\u000e\u0012\u0004\u0012\u00020\u0004\u0012\u0004\u0012\u00020\u00040\u001c*\u0014\u0012\u0004\u0012\u00020\u0004\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00040\u001d0\u001cH\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u0011\u0010\u0005\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0007\u0010\bR\u000e\u0010\t\u001a\u00020\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0010\u0010\u000b\u001a\u0004\u0018\u00010\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\f\u001a\u00020\rX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000e\u001a\u00020\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000f\u001a\u00020\u0010X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0016\u0010\u0011\u001a\n\u0012\u0004\u0012\u00020\u0013\u0018\u00010\u0012X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0016\u0010\u0014\u001a\n \u0016*\u0004\u0018\u00010\u00150\u0015X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u001e"}, d2 = {"Lcom/napibase/napifit/api/ApiClient;", "", "()V", "TAG", "", "apiService", "Lcom/napibase/napifit/api/ApiService;", "getApiService", "()Lcom/napibase/napifit/api/ApiService;", "authInterceptor", "Lokhttp3/Interceptor;", "authToken", "connectionPool", "Lokhttp3/ConnectionPool;", "loggingInterceptor", "okHttpClient", "Lokhttp3/OkHttpClient;", "onUnauthorized", "Lkotlin/Function0;", "", "retrofit", "Lretrofit2/Retrofit;", "kotlin.jvm.PlatformType", "setAuthToken", "token", "setOnUnauthorizedCallback", "callback", "flatten", "", "", "app_debug"})
public final class ApiClient {
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String TAG = "ApiClient";
    @org.jetbrains.annotations.Nullable()
    private static java.lang.String authToken;
    @org.jetbrains.annotations.Nullable()
    private static kotlin.jvm.functions.Function0<kotlin.Unit> onUnauthorized;
    
    /**
     * Auth interceptor - Adds authorization header and handles 401 responses
     */
    @org.jetbrains.annotations.NotNull()
    private static final okhttp3.Interceptor authInterceptor = null;
    
    /**
     * Request/Response logging interceptor
     */
    @org.jetbrains.annotations.NotNull()
    private static final okhttp3.Interceptor loggingInterceptor = null;
    
    /**
     * Optimized connection pool for better performance
     * - 5 idle connections kept alive
     * - 5 minutes keep-alive duration
     */
    @org.jetbrains.annotations.NotNull()
    private static final okhttp3.ConnectionPool connectionPool = null;
    @org.jetbrains.annotations.NotNull()
    private static final okhttp3.OkHttpClient okHttpClient = null;
    private static final retrofit2.Retrofit retrofit = null;
    @org.jetbrains.annotations.NotNull()
    private static final com.napibase.napifit.api.ApiService apiService = null;
    @org.jetbrains.annotations.NotNull()
    public static final com.napibase.napifit.api.ApiClient INSTANCE = null;
    
    private ApiClient() {
        super();
    }
    
    public final void setAuthToken(@org.jetbrains.annotations.Nullable()
    java.lang.String token) {
    }
    
    public final void setOnUnauthorizedCallback(@org.jetbrains.annotations.Nullable()
    kotlin.jvm.functions.Function0<kotlin.Unit> callback) {
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.napibase.napifit.api.ApiService getApiService() {
        return null;
    }
    
    /**
     * Helper function to convert Map<String, List<String>> to Map<String, String>
     */
    private final java.util.Map<java.lang.String, java.lang.String> flatten(java.util.Map<java.lang.String, ? extends java.util.List<java.lang.String>> $this$flatten) {
        return null;
    }
}