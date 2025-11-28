package com.napibase.napifit.api

import com.napibase.napifit.BuildConfig
import okhttp3.ConnectionPool
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.ResponseBody.Companion.toResponseBody
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.IOException
import java.util.concurrent.TimeUnit

object ApiClient {
    private const val TAG = "ApiClient"
    
    private var authToken: String? = null
    private var onUnauthorized: (() -> Unit)? = null
    
    fun setAuthToken(token: String?) {
        authToken = token
        if (token != null) {
            Logger.d(TAG, "Auth token set (length: ${token.length})")
        } else {
            Logger.d(TAG, "Auth token cleared")
        }
    }
    
    fun setOnUnauthorizedCallback(callback: (() -> Unit)?) {
        onUnauthorized = callback
        Logger.d(TAG, "Unauthorized callback ${if (callback != null) "set" else "cleared"}")
    }
    
    /**
     * Auth interceptor - Adds authorization header and handles 401 responses
     */
    private val authInterceptor = Interceptor { chain ->
        val originalRequest = chain.request()
        val requestBuilder = originalRequest.newBuilder()
        
        // Add auth token if available
        authToken?.let { token ->
            requestBuilder.header("Authorization", "Bearer $token")
        }
        
        // Add platform header
        requestBuilder.header("x-platform", "android")
        
        // Add Vercel bypass token if available (for deployment protection)
        val bypassToken = BuildConfig.VERCEL_BYPASS_TOKEN
        if (bypassToken.isNotEmpty()) {
            requestBuilder.header("x-vercel-protection-bypass", bypassToken)
            Logger.d(TAG, "Vercel bypass token added to request")
        }
        
        val newRequest = requestBuilder.build()
        val startTime = System.currentTimeMillis()
        
        try {
            val response = chain.proceed(newRequest)
            val responseTime = System.currentTimeMillis() - startTime
            
            // Handle 401 Unauthorized
            if (response.code == 401) {
                Logger.w(TAG, "401 Unauthorized response received")
                authToken = null
                onUnauthorized?.invoke()
            }
            
            response
        } catch (e: Exception) {
            val responseTime = System.currentTimeMillis() - startTime
            Logger.logNetworkError(TAG, newRequest.method, newRequest.url.toString(), e)
            throw e
        }
    }
    
    /**
     * Request/Response logging interceptor
     */
    private val loggingInterceptor = Interceptor { chain ->
        val request = chain.request()
        val startTime = System.currentTimeMillis()
        
        // Log request
        val headers = request.headers.toMultimap()
        val requestBody = request.body?.let {
            try {
                val buffer = okio.Buffer()
                it.writeTo(buffer)
                buffer.readUtf8()
            } catch (e: Exception) {
                "Unable to read request body: ${e.message}"
            }
        }
        
        Logger.logRequest(
            TAG,
            request.method,
            request.url.toString(),
            headers.flatten(),
            requestBody
        )
        
        // Execute request
        val response: Response
        var responseTime: Long
        val responseBody: String?
        
        try {
            response = chain.proceed(request)
            responseTime = System.currentTimeMillis() - startTime
            
            // Read response body (peek to avoid consuming it)
            responseBody = response.body?.let { body ->
                try {
                    val source = body.source()
                    source.request(Long.MAX_VALUE)
                    val buffer = source.buffer
                    val bodyString = buffer.clone().readUtf8()
                    bodyString
                } catch (e: Exception) {
                    "Unable to read response body: ${e.message}"
                }
            }
            
            // Log response
            Logger.logResponse(
                TAG,
                request.method,
                request.url.toString(),
                response.code,
                responseTime,
                responseBody
            )
            
            // Return original response (body is not consumed)
            response
            
        } catch (e: Exception) {
            responseTime = System.currentTimeMillis() - startTime
            Logger.logNetworkError(TAG, request.method, request.url.toString(), e)
            throw e
        }
    }
    
    /**
     * Optimized connection pool for better performance
     * - 5 idle connections kept alive
     * - 5 minutes keep-alive duration
     */
    private val connectionPool = ConnectionPool(
        maxIdleConnections = 5,
        keepAliveDuration = 5,
        timeUnit = TimeUnit.MINUTES
    )
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        // Optimized timeouts (reduced from 30s)
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(20, TimeUnit.SECONDS)
        .writeTimeout(20, TimeUnit.SECONDS)
        // Connection pooling for reuse
        .connectionPool(connectionPool)
        // Retry on failure
        .retryOnConnectionFailure(true)
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.API_BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val apiService: ApiService = retrofit.create(ApiService::class.java)
    
    /**
     * Helper function to convert Map<String, List<String>> to Map<String, String>
     */
    private fun Map<String, List<String>>.flatten(): Map<String, String> {
        return this.mapValues { it.value.joinToString(", ") }
    }
}

