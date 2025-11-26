package com.napibase.napifit.api

import android.util.Log
import com.napibase.napifit.BuildConfig

/**
 * Centralized logging utility
 * - DEBUG mode: Logs all levels (VERBOSE, DEBUG, INFO, WARN, ERROR)
 * - RELEASE mode: Only logs ERROR and WARN
 */
object Logger {
    private const val DEFAULT_TAG = "NapiFit"
    private val isDebugMode = BuildConfig.DEBUG
    
    /**
     * Log VERBOSE message (only in DEBUG mode)
     */
    fun v(tag: String = DEFAULT_TAG, message: String, throwable: Throwable? = null) {
        if (isDebugMode) {
            if (throwable != null) {
                Log.v(tag, message, throwable)
            } else {
                Log.v(tag, message)
            }
        }
    }
    
    /**
     * Log DEBUG message (only in DEBUG mode)
     */
    fun d(tag: String = DEFAULT_TAG, message: String, throwable: Throwable? = null) {
        if (isDebugMode) {
            if (throwable != null) {
                Log.d(tag, message, throwable)
            } else {
                Log.d(tag, message)
            }
        }
    }
    
    /**
     * Log INFO message (only in DEBUG mode)
     */
    fun i(tag: String = DEFAULT_TAG, message: String, throwable: Throwable? = null) {
        if (isDebugMode) {
            if (throwable != null) {
                Log.i(tag, message, throwable)
            } else {
                Log.i(tag, message)
            }
        }
    }
    
    /**
     * Log WARN message (always logged)
     */
    fun w(tag: String = DEFAULT_TAG, message: String, throwable: Throwable? = null) {
        if (throwable != null) {
            Log.w(tag, message, throwable)
        } else {
            Log.w(tag, message)
        }
    }
    
    /**
     * Log ERROR message (always logged)
     */
    fun e(tag: String = DEFAULT_TAG, message: String, throwable: Throwable? = null) {
        if (throwable != null) {
            Log.e(tag, message, throwable)
        } else {
            Log.e(tag, message)
        }
    }
    
    /**
     * Log ApiError
     */
    fun logError(tag: String = DEFAULT_TAG, apiError: ApiError) {
        val level = apiError.errorCode.logLevel
        val message = apiError.buildTechnicalMessage()
        
        when (level) {
            LogLevel.ERROR -> e(tag, "[${apiError.errorCode.code}] $message", apiError.originalException)
            LogLevel.WARN -> w(tag, "[${apiError.errorCode.code}] $message", apiError.originalException)
            LogLevel.INFO -> i(tag, "[${apiError.errorCode.code}] $message")
            LogLevel.DEBUG -> d(tag, "[${apiError.errorCode.code}] $message")
            LogLevel.VERBOSE -> v(tag, "[${apiError.errorCode.code}] $message")
        }
    }
    
    /**
     * Log API request
     */
    fun logRequest(
        tag: String = DEFAULT_TAG,
        method: String,
        url: String,
        headers: Map<String, String>? = null,
        body: String? = null
    ) {
        if (isDebugMode) {
            val headersStr = headers?.entries?.joinToString(", ") { "${it.key}=${it.value}" } ?: "None"
            val bodyStr = body?.take(500) ?: "None" // Limit body to 500 chars
            d(tag, "→ $method $url | Headers: $headersStr | Body: $bodyStr")
        }
    }
    
    /**
     * Log API response
     */
    fun logResponse(
        tag: String = DEFAULT_TAG,
        method: String,
        url: String,
        statusCode: Int,
        responseTime: Long,
        body: String? = null
    ) {
        val statusEmoji = when {
            statusCode in 200..299 -> "✓"
            statusCode in 400..499 -> "⚠"
            statusCode >= 500 -> "✗"
            else -> "?"
        }
        
        val level = when {
            statusCode in 200..299 -> LogLevel.INFO
            statusCode in 400..499 -> LogLevel.WARN
            statusCode >= 500 -> LogLevel.ERROR
            else -> LogLevel.DEBUG
        }
        
        val message = "$statusEmoji $method $url - $statusCode (${responseTime}ms)"
        val bodyStr = if (isDebugMode && body != null) {
            " | Body: ${body.take(500)}" // Limit body to 500 chars
        } else {
            ""
        }
        
        when (level) {
            LogLevel.ERROR -> e(tag, "$message$bodyStr")
            LogLevel.WARN -> w(tag, "$message$bodyStr")
            LogLevel.INFO -> i(tag, "$message$bodyStr")
            LogLevel.DEBUG -> d(tag, "$message$bodyStr")
            LogLevel.VERBOSE -> v(tag, "$message$bodyStr")
        }
    }
    
    /**
     * Log network error
     */
    fun logNetworkError(
        tag: String = DEFAULT_TAG,
        method: String,
        url: String,
        exception: Throwable
    ) {
        val errorCode = ErrorCode.fromException(exception)
        e(tag, "✗ $method $url - ${errorCode.code} | ${exception.javaClass.simpleName}: ${exception.message}", exception)
    }
}

