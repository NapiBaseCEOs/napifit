package com.napibase.napifit.ui.profile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.napibase.napifit.api.ApiClient
import com.napibase.napifit.api.ApiError
import com.napibase.napifit.api.Logger
import com.napibase.napifit.databinding.FragmentProfileBinding
import kotlinx.coroutines.launch

class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private val TAG = "ProfileFragment"
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        loadProfile()
        loadStats()
        
        // Logout button
        binding.btnLogout.setOnClickListener {
            performLogout()
        }
    }
    
    private fun performLogout() {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val authManager = com.napibase.napifit.auth.AuthManager(requireContext())
                authManager.signOut()
                
                // Navigate to login
                val intent = android.content.Intent(requireContext(), com.napibase.napifit.LoginActivity::class.java)
                intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK or android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK
                startActivity(intent)
                activity?.finish()
            } catch (e: Exception) {
                android.widget.Toast.makeText(
                    requireContext(),
                    "Çıkış yapılırken hata oluştu: ${e.message}",
                    android.widget.Toast.LENGTH_SHORT
                ).show()
            }
        }
    }
    
    private fun loadProfile() {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val response = ApiClient.apiService.getProfile()
                if (response.isSuccessful) {
                    val profile = response.body()
                    profile?.let {
                        binding.profileName.text = it.name ?: "Kullanıcı"
                        binding.profileEmail.text = it.email ?: "email@example.com"
                    }
                } else {
                    val apiError = ApiError.fromHttpResponse(
                        statusCode = response.code(),
                        url = response.raw().request.url.toString(),
                        method = response.raw().request.method,
                        errorBody = response.errorBody()?.string()
                    )
                    // 401 is expected if not authenticated, don't show error
                    if (response.code() != 401) {
                        Logger.logError(TAG, apiError)
                    }
                    // Set default values
                    binding.profileName.text = "Kullanıcı"
                    binding.profileEmail.text = "email@example.com"
                }
            } catch (e: kotlinx.coroutines.CancellationException) {
                // Ignore cancellation exceptions (normal when fragment is destroyed)
                throw e
            } catch (e: Exception) {
                // Only log non-cancellation errors
                if (e !is kotlinx.coroutines.CancellationException) {
                    val apiError = ApiError.fromException(
                        exception = e,
                        url = "profile",
                        method = "GET"
                    )
                    Logger.logError(TAG, apiError)
                }
                // Set default values on error
                binding.profileName.text = "Kullanıcı"
                binding.profileEmail.text = "email@example.com"
            }
        }
    }
    
    private fun loadStats() {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                // Load total meals count
                val mealsResponse = ApiClient.apiService.getMeals(limit = 1, offset = 0)
                val totalMeals = if (mealsResponse.isSuccessful) {
                    mealsResponse.body()?.total ?: 0
                } else {
                    0
                }
                binding.totalMeals.text = totalMeals.toString()
                
                // Load total workouts count
                val workoutsResponse = ApiClient.apiService.getWorkouts(limit = 1, offset = 0)
                val totalWorkouts = if (workoutsResponse.isSuccessful) {
                    workoutsResponse.body()?.total ?: 0
                } else {
                    0
                }
                binding.totalWorkouts.text = totalWorkouts.toString()
            } catch (e: kotlinx.coroutines.CancellationException) {
                // Ignore cancellation exceptions (normal when fragment is destroyed)
                throw e
            } catch (e: Exception) {
                // Only log non-cancellation errors
                if (e !is kotlinx.coroutines.CancellationException) {
                    val apiError = ApiError.fromException(
                        exception = e,
                        url = "profile/stats",
                        method = "GET"
                    )
                    Logger.logError(TAG, apiError)
                }
                // Set default values on error
                binding.totalMeals.text = "0"
                binding.totalWorkouts.text = "0"
            }
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

