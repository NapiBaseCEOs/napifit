package com.napibase.napifit

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.animation.AnimationUtils
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.napibase.napifit.api.ApiClient
import com.napibase.napifit.api.models.ResetPasswordRequest
import com.napibase.napifit.databinding.ActivityResetPasswordBinding
import kotlinx.coroutines.launch

class ResetPasswordActivity : AppCompatActivity() {
    private lateinit var binding: ActivityResetPasswordBinding
    private var email: String = ""
    private var code: String = ""
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityResetPasswordBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        email = intent.getStringExtra("email") ?: ""
        code = intent.getStringExtra("code") ?: ""
        
        if (email.isEmpty() || code.isEmpty()) {
            // No email or code provided, go back
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
            finish()
            return
        }
        
        setupUI()
        setupAnimations()
        setupClickListeners()
    }
    
    private fun setupUI() {
        // Float animations
        binding.floatCircle1.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation))
        binding.floatCircle2.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation).apply {
            startOffset = 750
        })
    }
    
    private fun setupAnimations() {
        binding.resetPasswordCard.alpha = 0f
        binding.resetPasswordCard.translationY = 20f
        binding.resetPasswordCard.animate()
            .alpha(1f)
            .translationY(0f)
            .setDuration(600)
            .start()
    }
    
    private fun setupClickListeners() {
        binding.btnResetPassword.setOnClickListener {
            resetPassword()
        }
        
        binding.btnBack.setOnClickListener {
            finish()
        }
    }
    
    private fun resetPassword() {
        val password = binding.inputPassword.text?.toString() ?: ""
        val confirmPassword = binding.inputConfirmPassword.text?.toString() ?: ""
        
        if (password.isEmpty() || confirmPassword.isEmpty()) {
            showError("Lütfen tüm alanları doldurun")
            return
        }
        
        if (password.length < 6) {
            showError("Şifre en az 6 karakter olmalıdır")
            return
        }
        
        if (password != confirmPassword) {
            showError("Şifreler eşleşmiyor")
            return
        }
        
        binding.btnResetPassword.isEnabled = false
        binding.loadingIndicator.visibility = View.VISIBLE
        binding.errorMessage.visibility = View.GONE
        
        lifecycleScope.launch {
            try {
                val request = ResetPasswordRequest(email, code, password)
                val response = ApiClient.apiService.resetPassword(request)
                
                if (response.isSuccessful) {
                    // Password reset successful, navigate to login
                    binding.successMessage.visibility = View.VISIBLE
                    binding.successMessage.alpha = 0f
                    binding.successMessage.animate()
                        .alpha(1f)
                        .setDuration(300)
                        .start()
                    
                    // Navigate to login after 2 seconds
                    android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
                        startActivity(Intent(this@ResetPasswordActivity, LoginActivity::class.java))
                        finishAffinity() // Clear all activities
                    }, 2000)
                } else {
                    val errorBody = response.errorBody()?.string() ?: "Bilinmeyen hata"
                    showError("Hata: ${response.code()} - $errorBody")
                }
            } catch (e: Exception) {
                showError("Hata: ${e.message}")
            } finally {
                binding.btnResetPassword.isEnabled = true
                binding.loadingIndicator.visibility = View.GONE
            }
        }
    }
    
    private fun showError(message: String) {
        binding.errorMessage.text = message
        binding.errorMessage.visibility = View.VISIBLE
        binding.errorMessage.alpha = 0f
        binding.errorMessage.animate()
            .alpha(1f)
            .setDuration(300)
            .start()
    }
}


