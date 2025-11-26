package com.napibase.napifit.api

/**
 * API Error data class containing all error information
 */
data class ApiError(
    val errorCode: ErrorCode,
    val httpStatusCode: Int? = null,
    val message: String = errorCode.userMessage,
    val technicalDetails: String = errorCode.technicalDetails,
    val timestamp: Long = System.currentTimeMillis(),
    val requestUrl: String? = null,
    val requestMethod: String? = null,
    val originalException: Throwable? = null
) {
    /**
     * Get user-friendly message
     */
    fun getUserMessage(): String = message
    
    /**
     * Build technical message for logging
     */
    fun buildTechnicalMessage(): String {
        val base = technicalDetails
        val url = requestUrl?.let { " | URL: $it" } ?: ""
        val method = requestMethod?.let { " | Method: $it" } ?: ""
        val httpCode = httpStatusCode?.let { " | HTTP: $it" } ?: ""
        val exception = originalException?.message?.let { " | Exception: $it" } ?: ""
        return "$base$url$method$httpCode$exception"
    }
    
    /**
     * Check if error is network related
     */
    fun isNetworkError(): Boolean {
        return errorCode == ErrorCode.NETWORK_ERROR_1001 || 
               errorCode == ErrorCode.TIMEOUT_ERROR_1002
    }
    
    /**
     * Check if error is authentication related
     */
    fun isAuthError(): Boolean {
        return errorCode == ErrorCode.AUTH_ERROR_1003 || 
               errorCode == ErrorCode.HTTP_401 ||
               errorCode == ErrorCode.HTTP_403
    }
    
    /**
     * Check if error is server related
     */
    fun isServerError(): Boolean {
        return errorCode == ErrorCode.SERVER_ERROR_1004 ||
               errorCode == ErrorCode.HTTP_500 ||
               errorCode == ErrorCode.HTTP_502 ||
               errorCode == ErrorCode.HTTP_503
    }
    
    companion object {
        /**
         * Create ApiError from HTTP response
         */
        fun fromHttpResponse(
            statusCode: Int,
            url: String? = null,
            method: String? = null,
            errorBody: String? = null
        ): ApiError {
            val errorCode = ErrorCode.fromHttpStatusCode(statusCode)
            val technicalMsg = errorBody?.let { 
                "${errorCode.technicalDetails} | Response: $it"
            } ?: errorCode.technicalDetails
            
            return ApiError(
                errorCode = errorCode,
                httpStatusCode = statusCode,
                message = errorCode.userMessage,
                technicalDetails = technicalMsg,
                requestUrl = url,
                requestMethod = method
            )
        }
        
        /**
         * Create ApiError from exception
         */
        fun fromException(
            exception: Throwable,
            url: String? = null,
            method: String? = null
        ): ApiError {
            val errorCode = ErrorCode.fromException(exception)
            val technicalMsg = "${errorCode.technicalDetails} | ${exception.javaClass.simpleName}: ${exception.message}"
            
            return ApiError(
                errorCode = errorCode,
                message = errorCode.userMessage,
                technicalDetails = technicalMsg,
                requestUrl = url,
                requestMethod = method,
                originalException = exception
            )
        }
    }
}

