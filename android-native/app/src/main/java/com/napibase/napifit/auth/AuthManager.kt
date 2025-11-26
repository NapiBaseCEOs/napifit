package com.napibase.napifit.auth

import android.content.Context
import android.content.SharedPreferences
import com.napibase.napifit.api.ApiClient
import com.napibase.napifit.api.ApiError
import com.napibase.napifit.api.Logger
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * AuthManager - API Server based authentication
 * 
 * Note: Supabase Kotlin SDK dependency removed.
 * All authentication is handled through the API server.
 * API server manages Supabase operations.
 * 
 * TODO: Add auth endpoints to API server:
 * - POST /api/auth/signin
 * - POST /api/auth/signup
 * - POST /api/auth/signout
 * - GET /api/auth/session
 */
class AuthManager(private val context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("napifit_auth", Context.MODE_PRIVATE)
    
    private val _isAuthenticated = MutableStateFlow<Boolean>(false)
    val isAuthenticated: Flow<Boolean> = _isAuthenticated.asStateFlow()
    
    private val _currentUser = MutableStateFlow<String?>(null)
    val currentUser: Flow<String?> = _currentUser.asStateFlow()
    
    init {
        checkAuthState()
    }
    
    private fun checkAuthState() {
        val token = getAuthToken()
        _isAuthenticated.value = token != null
        _currentUser.value = getUserId()
        
        // Set token in API client
        token?.let { ApiClient.setAuthToken(it) }
    }
    
    suspend fun signIn(email: String, password: String): Result<Unit> {
        return try {
            val request = com.napibase.napifit.api.models.SignInRequest(email, password)
            val response = com.napibase.napifit.api.ApiClient.apiService.signIn(request)
            
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    saveAuthToken(body.token)
                    body.user.id.let { saveUserId(it) }
                    ApiClient.setAuthToken(body.token)
                    _isAuthenticated.value = true
                    _currentUser.value = body.user.id
                    Logger.i("AuthManager", "Sign in successful for user: ${body.user.email}")
                    Result.success(Unit)
                } else {
                    val apiError = ApiError.fromHttpResponse(
                        statusCode = response.code(),
                        url = response.raw().request.url.toString(),
                        method = response.raw().request.method,
                        errorBody = "Empty response body"
                    )
                    Logger.logError("AuthManager", apiError)
                    Result.failure(Exception(apiError.getUserMessage()))
                }
            } else {
                val errorBody = try {
                    response.errorBody()?.string()
                } catch (e: Exception) {
                    "Unable to read error body: ${e.message}"
                }
                
                val apiError = ApiError.fromHttpResponse(
                    statusCode = response.code(),
                    url = response.raw().request.url.toString(),
                    method = response.raw().request.method,
                    errorBody = errorBody
                )
                Logger.logError("AuthManager", apiError)
                Result.failure(Exception(apiError.getUserMessage()))
            }
        } catch (e: Exception) {
            val apiError = ApiError.fromException(
                exception = e,
                url = "auth/signin",
                method = "POST"
            )
            Logger.logError("AuthManager", apiError)
            Result.failure(Exception(apiError.getUserMessage()))
        }
    }
    
    suspend fun signUp(email: String, password: String, name: String? = null): Result<Unit> {
        return try {
            val request = com.napibase.napifit.api.models.SignUpRequest(email, password, name)
            val response = com.napibase.napifit.api.ApiClient.apiService.signUp(request)
            
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    Logger.i("AuthManager", "Sign up successful for user: $email")
                    // Email verification might be required
                    if (!body.requiresEmailVerification) {
                        // Auto login if no verification needed
                        signIn(email, password)
                    } else {
                        Result.success(Unit)
                    }
                } else {
                    val apiError = ApiError.fromHttpResponse(
                        statusCode = response.code(),
                        url = response.raw().request.url.toString(),
                        method = response.raw().request.method,
                        errorBody = "Empty response body"
                    )
                    Logger.logError("AuthManager", apiError)
                    Result.failure(Exception(apiError.getUserMessage()))
                }
            } else {
                val errorBody = try {
                    response.errorBody()?.string()
                } catch (e: Exception) {
                    "Unable to read error body: ${e.message}"
                }
                
                val apiError = ApiError.fromHttpResponse(
                    statusCode = response.code(),
                    url = response.raw().request.url.toString(),
                    method = response.raw().request.method,
                    errorBody = errorBody
                )
                Logger.logError("AuthManager", apiError)
                Result.failure(Exception(apiError.getUserMessage()))
            }
        } catch (e: Exception) {
            val apiError = ApiError.fromException(
                exception = e,
                url = "auth/signup",
                method = "POST"
            )
            Logger.logError("AuthManager", apiError)
            Result.failure(Exception(apiError.getUserMessage()))
        }
    }
    
    suspend fun signOut() {
        try {
            // Call API server sign out endpoint
            val response = com.napibase.napifit.api.ApiClient.apiService.signOut()
            if (response.isSuccessful) {
                Logger.i("AuthManager", "Sign out successful")
            } else {
                val apiError = ApiError.fromHttpResponse(
                    statusCode = response.code(),
                    url = response.raw().request.url.toString(),
                    method = response.raw().request.method
                )
                Logger.logError("AuthManager", apiError)
            }
        } catch (e: Exception) {
            // Log but don't fail sign out - always clear local data
            val apiError = ApiError.fromException(
                exception = e,
                url = "auth/signout",
                method = "POST"
            )
            Logger.logError("AuthManager", apiError)
        } finally {
            clearAuthData() // clearAuthData already handles all cleanup
            Logger.d("AuthManager", "Auth data cleared")
        }
    }
    
    fun getAuthToken(): String? {
        return prefs.getString("auth_token", null)
    }
    
    private fun saveAuthToken(token: String) {
        prefs.edit().putString("auth_token", token).apply()
    }
    
    private fun getUserId(): String? {
        return prefs.getString("user_id", null)
    }
    
    private fun saveUserId(userId: String) {
        prefs.edit().putString("user_id", userId).apply()
    }
    
    fun clearAuthData() {
        prefs.edit().remove("auth_token").remove("user_id").apply()
        ApiClient.setAuthToken(null)
        _isAuthenticated.value = false
        _currentUser.value = null
    }
}

