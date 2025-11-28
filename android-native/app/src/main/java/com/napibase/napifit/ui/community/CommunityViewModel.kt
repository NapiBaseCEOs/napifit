package com.napibase.napifit.ui.community

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.napibase.napifit.api.ApiClient
import com.napibase.napifit.api.ApiError
import com.napibase.napifit.api.models.FeatureRequest
import kotlinx.coroutines.launch

class CommunityViewModel : ViewModel() {
    
    private val _loading = MutableLiveData<Boolean>(false)
    val loading: LiveData<Boolean> = _loading
    
    private val _error = MutableLiveData<ApiError?>()
    val error: LiveData<ApiError?> = _error
    
    private val _featureRequests = MutableLiveData<List<FeatureRequest>>(emptyList())
    val featureRequests: LiveData<List<FeatureRequest>> = _featureRequests
    
    private val _voteSuccess = MutableLiveData<Boolean>(false)
    val voteSuccess: LiveData<Boolean> = _voteSuccess
    
    fun loadFeatureRequests(sortBy: String = "likes") {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null
                
                val response = ApiClient.apiService.getFeatureRequests(
                    sort = sortBy,
                    limit = 50,
                    offset = 0
                )
                
                if (response.isSuccessful) {
                    val data = response.body()
                    _featureRequests.value = data?.requests ?: emptyList()
                } else {
                    _error.value = ApiError.fromHttpResponse(response.code(), "feature-requests", "GET")
                }
            } catch (e: Exception) {
                _error.value = ApiError.fromException(e, "feature-requests")
            } finally {
                _loading.value = false
            }
        }
    }
    
    fun likeFeatureRequest(requestId: String) {
        viewModelScope.launch {
            try {
                _error.value = null
                
                val response = ApiClient.apiService.likeFeatureRequest(requestId)
                
                if (response.isSuccessful) {
                    _voteSuccess.value = true
                    // Update local list
                    updateLocalRequest(requestId, isLike = true)
                } else {
                    _error.value = ApiError.fromHttpResponse(response.code(), "feature-requests/$requestId/like", "POST")
                }
            } catch (e: Exception) {
                _error.value = ApiError.fromException(e, "feature-requests/$requestId/like")
            }
        }
    }
    
    fun dislikeFeatureRequest(requestId: String) {
        viewModelScope.launch {
            try {
                _error.value = null
                
                val response = ApiClient.apiService.dislikeFeatureRequest(requestId)
                
                if (response.isSuccessful) {
                    _voteSuccess.value = true
                    // Update local list
                    updateLocalRequest(requestId, isLike = false)
                } else {
                    _error.value = ApiError.fromHttpResponse(response.code(), "feature-requests/$requestId/dislike", "POST")
                }
            } catch (e: Exception) {
                _error.value = ApiError.fromException(e, "feature-requests/$requestId/dislike")
            }
        }
    }
    
    private fun updateLocalRequest(requestId: String, isLike: Boolean) {
        val currentList = _featureRequests.value ?: return
        val updatedList = currentList.map { request ->
            if (request.id == requestId) {
                if (isLike) {
                    request.copy(likeCount = request.likeCount + 1, isLiked = true)
                } else {
                    request.copy(dislikeCount = request.dislikeCount + 1, isDisliked = true)
                }
            } else {
                request
            }
        }
        _featureRequests.value = updatedList
    }
    
    fun resetVoteSuccess() {
        _voteSuccess.value = false
    }
}

