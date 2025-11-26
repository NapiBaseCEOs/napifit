package com.napibase.napifit

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.animation.AnimationUtils
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.napibase.napifit.auth.AuthManager
import com.napibase.napifit.databinding.ActivityLoginBinding
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var authManager: AuthManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        try {
            binding = ActivityLoginBinding.inflate(layoutInflater)
            setContentView(binding.root)
            
            authManager = AuthManager(this)
            
            // Clear unauthorized callback (we're already on login screen)
            com.napibase.napifit.api.ApiClient.setOnUnauthorizedCallback(null)
            
            setupUI()
            setupAnimations()
            setupClickListeners()
        } catch (e: Exception) {
            android.util.Log.e("LoginActivity", "Error in onCreate", e)
            e.printStackTrace()
            // Show error and finish
            android.widget.Toast.makeText(
                this,
                "Uygulama başlatılırken bir hata oluştu: ${e.message}",
                android.widget.Toast.LENGTH_LONG
            ).show()
            finish()
        }
    }
    
    private fun setupUI() {
        try {
            // Float animations for circles
            binding.floatCircle1.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation))
            binding.floatCircle2.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation).apply {
                startOffset = 750 // Stagger animation
            })
        } catch (e: Exception) {
            android.util.Log.e("LoginActivity", "Error in setupUI", e)
            e.printStackTrace()
        }
    }
    
    private fun setupAnimations() {
        try {
            // Fade up animation for login card
            binding.loginCard.alpha = 0f
            binding.loginCard.translationY = 20f
            binding.loginCard.animate()
                .alpha(1f)
                .translationY(0f)
                .setDuration(600)
                .start()
        } catch (e: Exception) {
            android.util.Log.e("LoginActivity", "Error in setupAnimations", e)
            e.printStackTrace()
        }
    }
    
    private fun setupClickListeners() {
        try {
            binding.btnLogin.setOnClickListener {
                performLogin()
            }
            
            binding.btnForgotPassword.setOnClickListener {
                startActivity(Intent(this, ForgotPasswordActivity::class.java))
            }
            
            binding.btnRegister.setOnClickListener {
                // TODO: Navigate to register screen
                android.widget.Toast.makeText(
                    this,
                    "Kayıt özelliği yakında eklenecek",
                    android.widget.Toast.LENGTH_SHORT
                ).show()
            }
        } catch (e: Exception) {
            android.util.Log.e("LoginActivity", "Error in setupClickListeners", e)
            e.printStackTrace()
        }
    }
    
    private fun performLogin() {
        try {
            val email = binding.inputEmail.text?.toString() ?: ""
            val password = binding.inputPassword.text?.toString() ?: ""
            
            if (email.isEmpty() || password.isEmpty()) {
                showError("Lütfen email ve şifre girin")
                return
            }
            
            binding.btnLogin.isEnabled = false
            binding.loadingIndicator.visibility = View.VISIBLE
            binding.errorMessage.visibility = View.GONE
            
            lifecycleScope.launch {
                try {
                    val result = authManager.signIn(email, password)
                    
                    if (result.isSuccess) {
                        // Login successful, navigate to MainActivity
                        startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                        finish()
                    } else {
                        // Login failed
                        val error = result.exceptionOrNull()?.message ?: "Giriş başarısız"
                        showError(error)
                    }
                } catch (e: Exception) {
                    android.util.Log.e("LoginActivity", "Error in performLogin", e)
                    e.printStackTrace()
                    showError("Giriş sırasında bir hata oluştu: ${e.message}")
                } finally {
                    binding.btnLogin.isEnabled = true
                    binding.loadingIndicator.visibility = View.GONE
                }
            }
        } catch (e: Exception) {
            android.util.Log.e("LoginActivity", "Error in performLogin setup", e)
            e.printStackTrace()
            binding.btnLogin.isEnabled = true
            binding.loadingIndicator.visibility = View.GONE
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

