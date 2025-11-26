package com.napibase.napifit.api;

/**
 * Error codes for API and network operations
 * Combines custom error codes with HTTP status codes
 */
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u001a\n\u0002\u0018\u0002\n\u0002\u0010\u0010\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0015\b\u0086\u0081\u0002\u0018\u0000 \u001b2\b\u0012\u0004\u0012\u00020\u00000\u0001:\u0001\u001bB\'\b\u0002\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0003\u0012\u0006\u0010\u0005\u001a\u00020\u0003\u0012\u0006\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\u0002\u0010\bR\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\t\u0010\nR\u0011\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000b\u0010\fR\u0011\u0010\u0005\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\r\u0010\nR\u0011\u0010\u0004\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\nj\u0002\b\u000fj\u0002\b\u0010j\u0002\b\u0011j\u0002\b\u0012j\u0002\b\u0013j\u0002\b\u0014j\u0002\b\u0015j\u0002\b\u0016j\u0002\b\u0017j\u0002\b\u0018j\u0002\b\u0019j\u0002\b\u001a\u00a8\u0006\u001c"}, d2 = {"Lcom/napibase/napifit/api/ErrorCode;", "", "code", "", "userMessage", "technicalDetails", "logLevel", "Lcom/napibase/napifit/api/LogLevel;", "(Ljava/lang/String;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/napibase/napifit/api/LogLevel;)V", "getCode", "()Ljava/lang/String;", "getLogLevel", "()Lcom/napibase/napifit/api/LogLevel;", "getTechnicalDetails", "getUserMessage", "NETWORK_ERROR_1001", "TIMEOUT_ERROR_1002", "AUTH_ERROR_1003", "SERVER_ERROR_1004", "UNKNOWN_ERROR_1005", "HTTP_400", "HTTP_401", "HTTP_403", "HTTP_404", "HTTP_500", "HTTP_502", "HTTP_503", "Companion", "app_debug"})
public enum ErrorCode {
    /*public static final*/ NETWORK_ERROR_1001 /* = new NETWORK_ERROR_1001(null, null, null, null) */,
    /*public static final*/ TIMEOUT_ERROR_1002 /* = new TIMEOUT_ERROR_1002(null, null, null, null) */,
    /*public static final*/ AUTH_ERROR_1003 /* = new AUTH_ERROR_1003(null, null, null, null) */,
    /*public static final*/ SERVER_ERROR_1004 /* = new SERVER_ERROR_1004(null, null, null, null) */,
    /*public static final*/ UNKNOWN_ERROR_1005 /* = new UNKNOWN_ERROR_1005(null, null, null, null) */,
    /*public static final*/ HTTP_400 /* = new HTTP_400(null, null, null, null) */,
    /*public static final*/ HTTP_401 /* = new HTTP_401(null, null, null, null) */,
    /*public static final*/ HTTP_403 /* = new HTTP_403(null, null, null, null) */,
    /*public static final*/ HTTP_404 /* = new HTTP_404(null, null, null, null) */,
    /*public static final*/ HTTP_500 /* = new HTTP_500(null, null, null, null) */,
    /*public static final*/ HTTP_502 /* = new HTTP_502(null, null, null, null) */,
    /*public static final*/ HTTP_503 /* = new HTTP_503(null, null, null, null) */;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String code = null;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String userMessage = null;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String technicalDetails = null;
    @org.jetbrains.annotations.NotNull()
    private final com.napibase.napifit.api.LogLevel logLevel = null;
    @org.jetbrains.annotations.NotNull()
    public static final com.napibase.napifit.api.ErrorCode.Companion Companion = null;
    
    ErrorCode(java.lang.String code, java.lang.String userMessage, java.lang.String technicalDetails, com.napibase.napifit.api.LogLevel logLevel) {
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getCode() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getUserMessage() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getTechnicalDetails() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.napibase.napifit.api.LogLevel getLogLevel() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public static kotlin.enums.EnumEntries<com.napibase.napifit.api.ErrorCode> getEntries() {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000 \n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0003\n\u0002\b\u0002\n\u0002\u0010\b\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u000e\u0010\u0003\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u0006J\u000e\u0010\u0007\u001a\u00020\u00042\u0006\u0010\b\u001a\u00020\t\u00a8\u0006\n"}, d2 = {"Lcom/napibase/napifit/api/ErrorCode$Companion;", "", "()V", "fromException", "Lcom/napibase/napifit/api/ErrorCode;", "exception", "", "fromHttpStatusCode", "statusCode", "", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
        
        /**
         * Get ErrorCode from HTTP status code
         */
        @org.jetbrains.annotations.NotNull()
        public final com.napibase.napifit.api.ErrorCode fromHttpStatusCode(int statusCode) {
            return null;
        }
        
        /**
         * Get ErrorCode from exception type
         */
        @org.jetbrains.annotations.NotNull()
        public final com.napibase.napifit.api.ErrorCode fromException(@org.jetbrains.annotations.NotNull()
        java.lang.Throwable exception) {
            return null;
        }
    }
}