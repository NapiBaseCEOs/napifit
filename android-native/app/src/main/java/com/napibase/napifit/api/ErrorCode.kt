package com.napibase.napifit.api

/**
 * Error codes for API and network operations
 * Combines custom error codes with HTTP status codes
 */
enum class ErrorCode(
    val code: String,
    val userMessage: String,
    val technicalDetails: String,
    val logLevel: LogLevel
) {
    // Network Errors
    NETWORK_ERROR_1001(
        code = "NETWORK_ERROR_1001",
        userMessage = "İnternet bağlantınızı kontrol edin",
        technicalDetails = "Failed to connect to server. Check network connection.",
        logLevel = LogLevel.ERROR
    ),
    
    TIMEOUT_ERROR_1002(
        code = "TIMEOUT_ERROR_1002",
        userMessage = "İstek zaman aşımına uğradı, lütfen tekrar deneyin",
        technicalDetails = "Request timeout. Server did not respond in time.",
        logLevel = LogLevel.ERROR
    ),
    
    // Authentication Errors
    AUTH_ERROR_1003(
        code = "AUTH_ERROR_1003",
        userMessage = "Oturumunuz sona erdi, lütfen tekrar giriş yapın",
        technicalDetails = "Authentication failed. Token expired or invalid.",
        logLevel = LogLevel.WARN
    ),
    
    // Server Errors
    SERVER_ERROR_1004(
        code = "SERVER_ERROR_1004",
        userMessage = "Sunucu hatası, lütfen daha sonra tekrar deneyin",
        technicalDetails = "Server error occurred.",
        logLevel = LogLevel.ERROR
    ),
    
    // Unknown Errors
    UNKNOWN_ERROR_1005(
        code = "UNKNOWN_ERROR_1005",
        userMessage = "Beklenmeyen bir hata oluştu",
        technicalDetails = "Unknown error occurred.",
        logLevel = LogLevel.ERROR
    ),
    
    // HTTP Status Code Based Errors
    HTTP_400(
        code = "HTTP_400",
        userMessage = "Geçersiz istek, lütfen bilgilerinizi kontrol edin",
        technicalDetails = "Bad Request (400)",
        logLevel = LogLevel.WARN
    ),
    
    HTTP_401(
        code = "HTTP_401",
        userMessage = "Oturumunuz sona erdi, lütfen tekrar giriş yapın",
        technicalDetails = "Unauthorized (401)",
        logLevel = LogLevel.WARN
    ),
    
    HTTP_403(
        code = "HTTP_403",
        userMessage = "Bu işlem için yetkiniz bulunmamaktadır",
        technicalDetails = "Forbidden (403)",
        logLevel = LogLevel.WARN
    ),
    
    HTTP_404(
        code = "HTTP_404",
        userMessage = "İstenen kaynak bulunamadı",
        technicalDetails = "Not Found (404)",
        logLevel = LogLevel.WARN
    ),
    
    HTTP_500(
        code = "HTTP_500",
        userMessage = "Sunucu hatası, lütfen daha sonra tekrar deneyin",
        technicalDetails = "Internal Server Error (500)",
        logLevel = LogLevel.ERROR
    ),
    
    HTTP_502(
        code = "HTTP_502",
        userMessage = "Sunucu geçici olarak kullanılamıyor",
        technicalDetails = "Bad Gateway (502)",
        logLevel = LogLevel.ERROR
    ),
    
    HTTP_503(
        code = "HTTP_503",
        userMessage = "Servis geçici olarak kullanılamıyor",
        technicalDetails = "Service Unavailable (503)",
        logLevel = LogLevel.ERROR
    );
    
    companion object {
        /**
         * Get ErrorCode from HTTP status code
         */
        fun fromHttpStatusCode(statusCode: Int): ErrorCode {
            return when (statusCode) {
                400 -> HTTP_400
                401 -> HTTP_401
                403 -> HTTP_403
                404 -> HTTP_404
                500 -> HTTP_500
                502 -> HTTP_502
                503 -> HTTP_503
                in 400..499 -> HTTP_400 // Client errors
                in 500..599 -> HTTP_500 // Server errors
                else -> UNKNOWN_ERROR_1005
            }
        }
        
        /**
         * Get ErrorCode from exception type
         */
        fun fromException(exception: Throwable): ErrorCode {
            return when (exception) {
                is java.net.SocketTimeoutException,
                is java.util.concurrent.TimeoutException -> TIMEOUT_ERROR_1002
                is java.net.ConnectException,
                is java.net.UnknownHostException,
                is javax.net.ssl.SSLException -> NETWORK_ERROR_1001
                is java.io.IOException -> {
                    if (exception.message?.contains("timeout", ignoreCase = true) == true) {
                        TIMEOUT_ERROR_1002
                    } else {
                        NETWORK_ERROR_1001
                    }
                }
                else -> UNKNOWN_ERROR_1005
            }
        }
    }
}

/**
 * Log level enum
 */
enum class LogLevel {
    VERBOSE,
    DEBUG,
    INFO,
    WARN,
    ERROR
}

