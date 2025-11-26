package com.napibase.napifit.api;

/**
 * API Error data class containing all error information
 */
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00006\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010\t\n\u0002\b\u0003\n\u0002\u0010\u0003\n\u0002\b\u001b\n\u0002\u0010\u000b\n\u0002\b\t\b\u0086\b\u0018\u0000 22\u00020\u0001:\u00012B[\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u0005\u0012\b\b\u0002\u0010\u0006\u001a\u00020\u0007\u0012\b\b\u0002\u0010\b\u001a\u00020\u0007\u0012\b\b\u0002\u0010\t\u001a\u00020\n\u0012\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\u0007\u0012\n\b\u0002\u0010\f\u001a\u0004\u0018\u00010\u0007\u0012\n\b\u0002\u0010\r\u001a\u0004\u0018\u00010\u000e\u00a2\u0006\u0002\u0010\u000fJ\u0006\u0010\u001e\u001a\u00020\u0007J\t\u0010\u001f\u001a\u00020\u0003H\u00c6\u0003J\u0010\u0010 \u001a\u0004\u0018\u00010\u0005H\u00c6\u0003\u00a2\u0006\u0002\u0010\u0013J\t\u0010!\u001a\u00020\u0007H\u00c6\u0003J\t\u0010\"\u001a\u00020\u0007H\u00c6\u0003J\t\u0010#\u001a\u00020\nH\u00c6\u0003J\u000b\u0010$\u001a\u0004\u0018\u00010\u0007H\u00c6\u0003J\u000b\u0010%\u001a\u0004\u0018\u00010\u0007H\u00c6\u0003J\u000b\u0010&\u001a\u0004\u0018\u00010\u000eH\u00c6\u0003Jf\u0010\'\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u00052\b\b\u0002\u0010\u0006\u001a\u00020\u00072\b\b\u0002\u0010\b\u001a\u00020\u00072\b\b\u0002\u0010\t\u001a\u00020\n2\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\u00072\n\b\u0002\u0010\f\u001a\u0004\u0018\u00010\u00072\n\b\u0002\u0010\r\u001a\u0004\u0018\u00010\u000eH\u00c6\u0001\u00a2\u0006\u0002\u0010(J\u0013\u0010)\u001a\u00020*2\b\u0010+\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\u0006\u0010,\u001a\u00020\u0007J\t\u0010-\u001a\u00020\u0005H\u00d6\u0001J\u0006\u0010.\u001a\u00020*J\u0006\u0010/\u001a\u00020*J\u0006\u00100\u001a\u00020*J\t\u00101\u001a\u00020\u0007H\u00d6\u0001R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0010\u0010\u0011R\u0015\u0010\u0004\u001a\u0004\u0018\u00010\u0005\u00a2\u0006\n\n\u0002\u0010\u0014\u001a\u0004\b\u0012\u0010\u0013R\u0011\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0015\u0010\u0016R\u0013\u0010\r\u001a\u0004\u0018\u00010\u000e\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0017\u0010\u0018R\u0013\u0010\f\u001a\u0004\u0018\u00010\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0019\u0010\u0016R\u0013\u0010\u000b\u001a\u0004\u0018\u00010\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001a\u0010\u0016R\u0011\u0010\b\u001a\u00020\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001b\u0010\u0016R\u0011\u0010\t\u001a\u00020\n\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001c\u0010\u001d\u00a8\u00063"}, d2 = {"Lcom/napibase/napifit/api/ApiError;", "", "errorCode", "Lcom/napibase/napifit/api/ErrorCode;", "httpStatusCode", "", "message", "", "technicalDetails", "timestamp", "", "requestUrl", "requestMethod", "originalException", "", "(Lcom/napibase/napifit/api/ErrorCode;Ljava/lang/Integer;Ljava/lang/String;Ljava/lang/String;JLjava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)V", "getErrorCode", "()Lcom/napibase/napifit/api/ErrorCode;", "getHttpStatusCode", "()Ljava/lang/Integer;", "Ljava/lang/Integer;", "getMessage", "()Ljava/lang/String;", "getOriginalException", "()Ljava/lang/Throwable;", "getRequestMethod", "getRequestUrl", "getTechnicalDetails", "getTimestamp", "()J", "buildTechnicalMessage", "component1", "component2", "component3", "component4", "component5", "component6", "component7", "component8", "copy", "(Lcom/napibase/napifit/api/ErrorCode;Ljava/lang/Integer;Ljava/lang/String;Ljava/lang/String;JLjava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)Lcom/napibase/napifit/api/ApiError;", "equals", "", "other", "getUserMessage", "hashCode", "isAuthError", "isNetworkError", "isServerError", "toString", "Companion", "app_debug"})
public final class ApiError {
    @org.jetbrains.annotations.NotNull()
    private final com.napibase.napifit.api.ErrorCode errorCode = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.Integer httpStatusCode = null;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String message = null;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String technicalDetails = null;
    private final long timestamp = 0L;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String requestUrl = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String requestMethod = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.Throwable originalException = null;
    @org.jetbrains.annotations.NotNull()
    public static final com.napibase.napifit.api.ApiError.Companion Companion = null;
    
    public ApiError(@org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.ErrorCode errorCode, @org.jetbrains.annotations.Nullable()
    java.lang.Integer httpStatusCode, @org.jetbrains.annotations.NotNull()
    java.lang.String message, @org.jetbrains.annotations.NotNull()
    java.lang.String technicalDetails, long timestamp, @org.jetbrains.annotations.Nullable()
    java.lang.String requestUrl, @org.jetbrains.annotations.Nullable()
    java.lang.String requestMethod, @org.jetbrains.annotations.Nullable()
    java.lang.Throwable originalException) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.napibase.napifit.api.ErrorCode getErrorCode() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Integer getHttpStatusCode() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getMessage() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getTechnicalDetails() {
        return null;
    }
    
    public final long getTimestamp() {
        return 0L;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getRequestUrl() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getRequestMethod() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Throwable getOriginalException() {
        return null;
    }
    
    /**
     * Get user-friendly message
     */
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getUserMessage() {
        return null;
    }
    
    /**
     * Build technical message for logging
     */
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String buildTechnicalMessage() {
        return null;
    }
    
    /**
     * Check if error is network related
     */
    public final boolean isNetworkError() {
        return false;
    }
    
    /**
     * Check if error is authentication related
     */
    public final boolean isAuthError() {
        return false;
    }
    
    /**
     * Check if error is server related
     */
    public final boolean isServerError() {
        return false;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.napibase.napifit.api.ErrorCode component1() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Integer component2() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String component3() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String component4() {
        return null;
    }
    
    public final long component5() {
        return 0L;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component6() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component7() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Throwable component8() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.napibase.napifit.api.ApiError copy(@org.jetbrains.annotations.NotNull()
    com.napibase.napifit.api.ErrorCode errorCode, @org.jetbrains.annotations.Nullable()
    java.lang.Integer httpStatusCode, @org.jetbrains.annotations.NotNull()
    java.lang.String message, @org.jetbrains.annotations.NotNull()
    java.lang.String technicalDetails, long timestamp, @org.jetbrains.annotations.Nullable()
    java.lang.String requestUrl, @org.jetbrains.annotations.Nullable()
    java.lang.String requestMethod, @org.jetbrains.annotations.Nullable()
    java.lang.Throwable originalException) {
        return null;
    }
    
    @java.lang.Override()
    public boolean equals(@org.jetbrains.annotations.Nullable()
    java.lang.Object other) {
        return false;
    }
    
    @java.lang.Override()
    public int hashCode() {
        return 0;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public java.lang.String toString() {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000(\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0003\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0003\n\u0002\u0010\b\n\u0002\b\u0002\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J&\u0010\u0003\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u00062\n\b\u0002\u0010\u0007\u001a\u0004\u0018\u00010\b2\n\b\u0002\u0010\t\u001a\u0004\u0018\u00010\bJ2\u0010\n\u001a\u00020\u00042\u0006\u0010\u000b\u001a\u00020\f2\n\b\u0002\u0010\u0007\u001a\u0004\u0018\u00010\b2\n\b\u0002\u0010\t\u001a\u0004\u0018\u00010\b2\n\b\u0002\u0010\r\u001a\u0004\u0018\u00010\b\u00a8\u0006\u000e"}, d2 = {"Lcom/napibase/napifit/api/ApiError$Companion;", "", "()V", "fromException", "Lcom/napibase/napifit/api/ApiError;", "exception", "", "url", "", "method", "fromHttpResponse", "statusCode", "", "errorBody", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
        
        /**
         * Create ApiError from HTTP response
         */
        @org.jetbrains.annotations.NotNull()
        public final com.napibase.napifit.api.ApiError fromHttpResponse(int statusCode, @org.jetbrains.annotations.Nullable()
        java.lang.String url, @org.jetbrains.annotations.Nullable()
        java.lang.String method, @org.jetbrains.annotations.Nullable()
        java.lang.String errorBody) {
            return null;
        }
        
        /**
         * Create ApiError from exception
         */
        @org.jetbrains.annotations.NotNull()
        public final com.napibase.napifit.api.ApiError fromException(@org.jetbrains.annotations.NotNull()
        java.lang.Throwable exception, @org.jetbrains.annotations.Nullable()
        java.lang.String url, @org.jetbrains.annotations.Nullable()
        java.lang.String method) {
            return null;
        }
    }
}