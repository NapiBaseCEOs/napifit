package com.napibase.napifit.ui.dashboard

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.napibase.napifit.api.ApiClient
import com.napibase.napifit.api.ApiError
import com.napibase.napifit.api.Logger
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class DashboardViewModel : ViewModel() {
    companion object {
        private const val TAG = "DashboardViewModel"
    }
    
    private val _stats = MutableLiveData<DashboardStats>()
    val stats: LiveData<DashboardStats> = _stats
    
    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading
    
    private val _error = MutableLiveData<ApiError?>()
    val error: LiveData<ApiError?> = _error
    
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    
    fun loadStats() {
        viewModelScope.launch {
            _loading.value = true
            _error.value = null
            
            try {
                val today = dateFormat.format(Date())
                
                // Load today's meals (with error handling)
                val todayMeals = try {
                    val mealsResponse = ApiClient.apiService.getMeals(date = today)
                    if (mealsResponse.isSuccessful) {
                        mealsResponse.body()?.meals?.size ?: 0
                    } else {
                        val apiError = ApiError.fromHttpResponse(
                            statusCode = mealsResponse.code(),
                            url = mealsResponse.raw().request.url.toString(),
                            method = mealsResponse.raw().request.method,
                            errorBody = mealsResponse.errorBody()?.string()
                        )
                        Logger.logError(TAG, apiError)
                        // Don't set error for individual API failures, just log
                        0
                    }
                } catch (e: Exception) {
                    val apiError = ApiError.fromException(e, url = "meals?date=$today", method = "GET")
                    Logger.logError(TAG, apiError)
                    // Don't set error for individual API failures, just log
                    0
                }
                
                // Load today's workouts (with error handling)
                val todayWorkouts = try {
                    val workoutsResponse = ApiClient.apiService.getWorkouts()
                    if (workoutsResponse.isSuccessful) {
                        val workouts = workoutsResponse.body()?.workouts ?: emptyList()
                        workouts.count { workout ->
                            workout.created_at.startsWith(today)
                        }
                    } else {
                        val apiError = ApiError.fromHttpResponse(
                            statusCode = workoutsResponse.code(),
                            url = workoutsResponse.raw().request.url.toString(),
                            method = workoutsResponse.raw().request.method,
                            errorBody = workoutsResponse.errorBody()?.string()
                        )
                        Logger.logError(TAG, apiError)
                        0
                    }
                } catch (e: Exception) {
                    val apiError = ApiError.fromException(e, url = "workouts", method = "GET")
                    Logger.logError(TAG, apiError)
                    0
                }
                
                // Load today's water intake (with error handling)
                val todayWater = try {
                    val waterResponse = ApiClient.apiService.getWaterIntake(date = today)
                    if (waterResponse.isSuccessful) {
                        waterResponse.body()?.totalAmount?.toInt() ?: 0
                    } else {
                        val apiError = ApiError.fromHttpResponse(
                            statusCode = waterResponse.code(),
                            url = waterResponse.raw().request.url.toString(),
                            method = waterResponse.raw().request.method,
                            errorBody = waterResponse.errorBody()?.string()
                        )
                        Logger.logError(TAG, apiError)
                        0
                    }
                } catch (e: Exception) {
                    val apiError = ApiError.fromException(e, url = "water-intake?date=$today", method = "GET")
                    Logger.logError(TAG, apiError)
                    0
                }
                
                // Calculate weekly calories (last 7 days) - simplified to avoid too many API calls
                var weeklyCalories = 0.0
                try {
                    val calendar = Calendar.getInstance()
                    for (i in 0..6) {
                        calendar.time = Date()
                        calendar.add(Calendar.DAY_OF_YEAR, -i)
                        val date = dateFormat.format(calendar.time)
                        
                        try {
                            val mealsResp = ApiClient.apiService.getMeals(date = date)
                            if (mealsResp.isSuccessful) {
                                val meals = mealsResp.body()?.meals ?: emptyList()
                                weeklyCalories += meals.sumOf { it.total_calories }
                            }
                        } catch (e: Exception) {
                            // Ignore individual day errors for weekly calculation
                            Logger.d(TAG, "Failed to load meals for date $date: ${e.message}")
                        }
                    }
                } catch (e: Exception) {
                    // Ignore weekly calories error
                    Logger.d(TAG, "Failed to calculate weekly calories: ${e.message}")
                    weeklyCalories = 0.0
                }
                
                _stats.value = DashboardStats(
                    todayMeals = todayMeals,
                    todayWorkouts = todayWorkouts,
                    todayWater = todayWater,
                    weeklyCalories = weeklyCalories
                )
            } catch (e: Exception) {
                val apiError = ApiError.fromException(
                    exception = e,
                    url = "dashboard/stats",
                    method = "GET"
                )
                Logger.logError(TAG, apiError)
                _error.value = apiError
                // Set default values on error
                _stats.value = DashboardStats(
                    todayMeals = 0,
                    todayWorkouts = 0,
                    todayWater = 0,
                    weeklyCalories = 0.0
                )
            } finally {
                _loading.value = false
            }
        }
    }
}

data class DashboardStats(
    val todayMeals: Int,
    val todayWorkouts: Int,
    val todayWater: Int,
    val weeklyCalories: Double
)

