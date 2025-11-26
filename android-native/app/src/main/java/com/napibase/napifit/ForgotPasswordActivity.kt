package com.napibase.napifit

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.animation.AnimationUtils
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.napibase.napifit.api.ApiClient
import com.napibase.napifit.api.models.ForgotPasswordRequest
import com.napibase.napifit.databinding.ActivityForgotPasswordBinding
import kotlinx.coroutines.launch

class ForgotPasswordActivity : AppCompatActivity() {
    private lateinit var binding: ActivityForgotPasswordBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityForgotPasswordBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupUI()
        setupAnimations()
        setupClickListeners()
    }
    
    private fun setupUI() {
        // Float animations for circles
        binding.floatCircle1.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation))
        binding.floatCircle2.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation).apply {
            startOffset = 750
        })
    }
    
    private fun setupAnimations() {
        // Fade up animation for card
        binding.forgotPasswordCard.alpha = 0f
        binding.forgotPasswordCard.translationY = 20f
        binding.forgotPasswordCard.animate()
            .alpha(1f)
            .translationY(0f)
            .setDuration(600)
            .start()
    }
    
    private fun setupClickListeners() {
        binding.btnSendCode.setOnClickListener {
            sendResetCode()
        }
        
        binding.btnBackToLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }
    
    private fun sendResetCode() {
        val email = binding.inputEmail.text?.toString() ?: ""
        
        if (email.isEmpty()) {
            showError("Lütfen email adresinizi girin")
            return
        }
        
        binding.btnSendCode.isEnabled = false
        binding.loadingIndicator.visibility = View.VISIBLE
        binding.errorMessage.visibility = View.GONE
        binding.successMessage.visibility = View.GONE
        
        lifecycleScope.launch {
            try {
                val request = ForgotPasswordRequest(email)
                val response = ApiClient.apiService.forgotPassword(request)
                
                if (response.isSuccessful) {
                    val body = response.body()
                    if (body != null) {
                        // Navigate to code verification screen
                        val intent = Intent(this@ForgotPasswordActivity, VerifyCodeActivity::class.java)
                        intent.putExtra("email", email)
                        startActivity(intent)
                        finish()
                    } else {
                        showError("Geçersiz yanıt alındı")
                    }
                } else {
                    val errorBody = response.errorBody()?.string() ?: "Bilinmeyen hata"
                    showError("Hata: ${response.code()} - $errorBody")
                }
            } catch (e: Exception) {
                showError("Hata: ${e.message}")
            } finally {
                binding.btnSendCode.isEnabled = true
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


