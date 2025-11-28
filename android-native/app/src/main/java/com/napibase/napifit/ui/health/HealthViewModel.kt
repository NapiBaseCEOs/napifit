package com.napibase.napifit.ui.health

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.napibase.napifit.api.ApiClient
import com.napibase.napifit.api.ApiError
import com.napibase.napifit.api.models.MealCreateRequest
import com.napibase.napifit.api.models.WorkoutCreateRequest
import kotlinx.coroutines.launch

class HealthViewModel : ViewModel() {
    
    private val _loading = MutableLiveData<Boolean>(false)
    val loading: LiveData<Boolean> = _loading
    
    private val _error = MutableLiveData<ApiError?>()
    val error: LiveData<ApiError?> = _error
    
    private val _mealSaved = MutableLiveData<Boolean>(false)
    val mealSaved: LiveData<Boolean> = _mealSaved
    
    private val _workoutSaved = MutableLiveData<Boolean>(false)
    val workoutSaved: LiveData<Boolean> = _workoutSaved
    
    fun saveMeal(meal: MealCreateRequest) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null
                
                val response = ApiClient.apiService.createMeal(meal)
                
                if (response.isSuccessful) {
                    _mealSaved.value = true
                } else {
                    _error.value = ApiError.fromHttpResponse(response.code(), "meals", "POST")
                }
            } catch (e: Exception) {
                _error.value = ApiError.fromException(e, "meals")
            } finally {
                _loading.value = false
            }
        }
    }
    
    fun saveWorkout(workout: WorkoutCreateRequest) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null
                
                val response = ApiClient.apiService.createWorkout(workout)
                
                if (response.isSuccessful) {
                    _workoutSaved.value = true
                } else {
                    _error.value = ApiError.fromHttpResponse(response.code(), "workouts", "POST")
                }
            } catch (e: Exception) {
                _error.value = ApiError.fromException(e, "workouts")
            } finally {
                _loading.value = false
            }
        }
    }
    
    fun resetMealSaved() {
        _mealSaved.value = false
    }
    
    fun resetWorkoutSaved() {
        _workoutSaved.value = false
    }
}

