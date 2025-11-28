package com.napibase.napifit.ui.profile

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.napibase.napifit.api.ApiClient
import com.napibase.napifit.api.ApiError
import com.napibase.napifit.api.models.ProfileResponse
import com.napibase.napifit.api.models.ProfileUpdateRequest
import kotlinx.coroutines.launch

class ProfileViewModel : ViewModel() {
    
    private val _loading = MutableLiveData<Boolean>(false)
    val loading: LiveData<Boolean> = _loading
    
    private val _error = MutableLiveData<ApiError?>()
    val error: LiveData<ApiError?> = _error
    
    private val _profile = MutableLiveData<ProfileResponse?>()
    val profile: LiveData<ProfileResponse?> = _profile
    
    private val _profileUpdated = MutableLiveData<Boolean>(false)
    val profileUpdated: LiveData<Boolean> = _profileUpdated
    
    fun loadProfile() {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null
                
                val response = ApiClient.apiService.getProfile()
                
                if (response.isSuccessful) {
                    _profile.value = response.body()
                } else {
                    _error.value = ApiError.fromHttpResponse(response.code(), "profile", "GET")
                }
            } catch (e: Exception) {
                _error.value = ApiError.fromException(e, "profile")
            } finally {
                _loading.value = false
            }
        }
    }
    
    fun updateProfile(profileUpdate: ProfileUpdateRequest) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null
                
                val response = ApiClient.apiService.updateProfile(profileUpdate)
                
                if (response.isSuccessful) {
                    _profileUpdated.value = true
                    // Reload profile to get updated data
                    loadProfile()
                } else {
                    _error.value = ApiError.fromHttpResponse(response.code(), "profile", "PUT")
                }
            } catch (e: Exception) {
                _error.value = ApiError.fromException(e, "profile")
            } finally {
                _loading.value = false
            }
        }
    }
    
    fun resetProfileUpdated() {
        _profileUpdated.value = false
    }
}

