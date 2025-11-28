package com.napibase.napifit.ui.water

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.napibase.napifit.api.ApiClient
import com.napibase.napifit.api.ApiError
import com.napibase.napifit.api.models.WaterIntakeRequest
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class WaterViewModel : ViewModel() {
    
    private val _loading = MutableLiveData<Boolean>(false)
    val loading: LiveData<Boolean> = _loading
    
    private val _error = MutableLiveData<ApiError?>()
    val error: LiveData<ApiError?> = _error
    
    private val _currentWater = MutableLiveData<Int>(0)
    val currentWater: LiveData<Int> = _currentWater
    
    private val _waterGoal = MutableLiveData<Int>(2000)
    val waterGoal: LiveData<Int> = _waterGoal
    
    private val _waterAdded = MutableLiveData<Boolean>(false)
    val waterAdded: LiveData<Boolean> = _waterAdded
    
    fun loadWaterIntake() {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null
                
                val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
                val today = dateFormat.format(Date())
                
                val response = ApiClient.apiService.getWaterIntake(today)
                
                if (response.isSuccessful) {
                    val data = response.body()
                    data?.let {
                        _currentWater.value = it.totalAmount.toInt()
                        _waterGoal.value = it.dailyGoal
                    }
                } else {
                    _error.value = ApiError.fromHttpResponse(response.code(), "water-intake", "GET")
                }
            } catch (e: Exception) {
                _error.value = ApiError.fromException(e, "water-intake")
            } finally {
                _loading.value = false
            }
        }
    }
    
    fun addWater(amount: Int) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null
                
                val request = WaterIntakeRequest(amount_ml = amount)
                val response = ApiClient.apiService.addWaterIntake(request)
                
                if (response.isSuccessful) {
                    // Update local state
                    _currentWater.value = (_currentWater.value ?: 0) + amount
                    _waterAdded.value = true
                } else {
                    _error.value = ApiError.fromHttpResponse(response.code(), "water-intake", "POST")
                }
            } catch (e: Exception) {
                _error.value = ApiError.fromException(e, "water-intake")
            } finally {
                _loading.value = false
            }
        }
    }
    
    fun resetWaterAdded() {
        _waterAdded.value = false
    }
}

