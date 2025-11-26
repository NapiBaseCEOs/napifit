package com.napibase.napifit.api;

/**
 * Centralized logging utility
 * - DEBUG mode: Logs all levels (VERBOSE, DEBUG, INFO, WARN, ERROR)
 * - RELEASE mode: Only logs ERROR and WARN
 */
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000F\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0003\n\u0002\u0010\u0003\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0006\n\u0002\u0010$\n\u0002\b\u0003\n\u0002\u0010\b\n\u0000\n\u0002\u0010\t\n\u0002\b\u0003\b\u00c6\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J$\u0010\u0007\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\u00042\u0006\u0010\n\u001a\u00020\u00042\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\fJ$\u0010\r\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\u00042\u0006\u0010\n\u001a\u00020\u00042\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\fJ$\u0010\u000e\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\u00042\u0006\u0010\n\u001a\u00020\u00042\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\fJ\u0018\u0010\u000f\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\u00042\u0006\u0010\u0010\u001a\u00020\u0011J(\u0010\u0012\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\u00042\u0006\u0010\u0013\u001a\u00020\u00042\u0006\u0010\u0014\u001a\u00020\u00042\u0006\u0010\u0015\u001a\u00020\fJD\u0010\u0016\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\u00042\u0006\u0010\u0013\u001a\u00020\u00042\u0006\u0010\u0014\u001a\u00020\u00042\u0016\b\u0002\u0010\u0017\u001a\u0010\u0012\u0004\u0012\u00020\u0004\u0012\u0004\u0012\u00020\u0004\u0018\u00010\u00182\n\b\u0002\u0010\u0019\u001a\u0004\u0018\u00010\u0004J<\u0010\u001a\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\u00042\u0006\u0010\u0013\u001a\u00020\u00042\u0006\u0010\u0014\u001a\u00020\u00042\u0006\u0010\u001b\u001a\u00020\u001c2\u0006\u0010\u001d\u001a\u00020\u001e2\n\b\u0002\u0010\u0019\u001a\u0004\u0018\u00010\u0004J$\u0010\u001f\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\u00042\u0006\u0010\n\u001a\u00020\u00042\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\fJ$\u0010 \u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\u00042\u0006\u0010\n\u001a\u00020\u00042\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\fR\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006!"}, d2 = {"Lcom/napibase/napifit/api/Logger;", "", "()V", "DEFAULT_TAG", "", "isDebugMode", "", "d", "", "tag", "message", "throwable", "", "e", "i", "logError", "apiError", "Lcom/napibase/napifit/api/ApiError;", "logNetworkError", "method", "url", "exception", "logRequest", "headers", "", "body", "logResponse", "statusCode", "", "responseTime", "", "v", "w", "app_debug"})
public final class Logger {
    @org.jetbrains.annotations.NotNull()
    private static final java.lang.String DEFAULT_TAG = "NapiFit";
    private static final boolean isDebugMode = false;
    @org.jetbrains.annotations.NotNull()
    public static final com.napibase.napifit.api.Logger INSTANCE = null;
    
    private Logger() {
        super();
    }
    
    /**
     * Log VERBOSE message (only in DEBUG mode)
     */
    public final void v(@org.jetbrains.annotations.NotNull()
    java.lang.String tag, @org.jetbrains.annotations.NotNull()
    java.lang.String message, @org.jetbrains.annotations.Nullable()
    java.lang.Throwable throwable) {
    }
    
    /**
     * Log DEBUG message (only in DEBUG mode)
     */
    public final void d(@org.jetbrains.annotations.NotNull()
    java.lang.String tag, @org.jetbrains.annotations.NotNull()
    java.lang.String message, @org.jetbrains.annotations.Nullable()
    java.lang.Throwable throwable) {
    }
    
    /**
     * Log INFO message (only in DEBUG mode)
     */
    public final void i(@org.jetbrains.annotations.NotNull()
    java.lang.String tag, @org.jetbrains.annotations.NotNull()
    java.lang.String message, @org.jetbrains.annotations.Nullable()
    java.lang.Throwable throwable) {
    }
    
    /**
     * Log WARN message (always logged)
     */
    public final void w(@org.jetbrains.annotations.NotNull()
    java.lang.String tag, @org.jetbrains.annotations.NotNull()
    java.lang.String message, @org.jetbrains.annotations.Nullable()
    java.lang.Throwable throwable) {
    }
    
    /**
     * Log ERROR message (always logged)
     */
    public final void e(@org.jetbrains.annotations.NotNull()
    java.lang.String tag, @org.jetbrains.annotations.NotNull()
    java.lang.String message, @org.jetbrains.annotations.Nullable()
    java.lang.Throwable throwable) {
    }
    
    /**
     * Log ApiError
     */
    public final void logError(@org.jetbrains.annotations.NotNull()
    java.lang.String tag, @org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.ApiError apiError) {
    }
    
    /**
     * Log API request
     */
    public final void logRequest(@org.jetbrains.annotations.NotNull()
    java.lang.String tag, @org.jetbrains.annotations.NotNull()
    java.lang.String method, @org.jetbrains.annotations.NotNull()
    java.lang.String url, @org.jetbrains.annotations.Nullable()
    java.util.Map<java.lang.String, java.lang.String> headers, @org.jetbrains.annotations.Nullable()
    java.lang.String body) {
    }
    
    /**
     * Log API response
     */
    public final void logResponse(@org.jetbrains.annotations.NotNull()
    java.lang.String tag, @org.jetbrains.annotations.NotNull()
    java.lang.String method, @org.jetbrains.annotations.NotNull()
    java.lang.String url, int statusCode, long responseTime, @org.jetbrains.annotations.Nullable()
    java.lang.String body) {
    }
    
    /**
     * Log network error
     */
    public final void logNetworkError(@org.jetbrains.annotations.NotNull()
    java.lang.String tag, @org.jetbrains.annotations.NotNull()
    java.lang.String method, @org.jetbrains.annotations.NotNull()
    java.lang.String url, @org.jetbrains.annotations.NotNull()
    java.lang.Throwable exception) {
    }
}