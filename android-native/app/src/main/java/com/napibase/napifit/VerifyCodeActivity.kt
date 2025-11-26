package com.napibase.napifit

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.view.animation.AnimationUtils
import android.view.inputmethod.InputMethodManager
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.napibase.napifit.api.ApiClient
import com.napibase.napifit.api.models.VerifyCodeRequest
import com.napibase.napifit.databinding.ActivityVerifyCodeBinding
import kotlinx.coroutines.launch

class VerifyCodeActivity : AppCompatActivity() {
    private lateinit var binding: ActivityVerifyCodeBinding
    private var email: String = ""
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityVerifyCodeBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        email = intent.getStringExtra("email") ?: ""
        
        if (email.isEmpty()) {
            // No email provided, go back to forgot password
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
            finish()
            return
        }
        
        setupUI()
        setupAnimations()
        setupCodeInputs()
        setupClickListeners()
    }
    
    private fun setupUI() {
        binding.emailText.text = email
        
        // Float animations
        binding.floatCircle1.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation))
        binding.floatCircle2.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation).apply {
            startOffset = 750
        })
    }
    
    private fun setupAnimations() {
        binding.verifyCodeCard.alpha = 0f
        binding.verifyCodeCard.translationY = 20f
        binding.verifyCodeCard.animate()
            .alpha(1f)
            .translationY(0f)
            .setDuration(600)
            .start()
    }
    
    private fun setupCodeInputs() {
        val inputs = listOf(
            binding.codeInput1,
            binding.codeInput2,
            binding.codeInput3,
            binding.codeInput4,
            binding.codeInput5,
            binding.codeInput6
        )
        
        inputs.forEachIndexed { index, input ->
            input.addTextChangedListener(object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
                
                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                    if (s?.length == 1 && index < inputs.size - 1) {
                        // Move to next input
                        inputs[index + 1].requestFocus()
                    } else if (s?.isEmpty() == true && index > 0) {
                        // Move to previous input on backspace
                        inputs[index - 1].requestFocus()
                    }
                    
                    // Auto-submit when all 6 digits are entered
                    if (index == inputs.size - 1 && s?.length == 1) {
                        val code = inputs.joinToString("") { it.text.toString() }
                        if (code.length == 6) {
                            verifyCode(code)
                        }
                    }
                }
                
                override fun afterTextChanged(s: Editable?) {}
            })
        }
        
        // Focus first input
        inputs[0].requestFocus()
    }
    
    private fun setupClickListeners() {
        binding.btnResendCode.setOnClickListener {
            resendCode()
        }
        
        binding.btnBack.setOnClickListener {
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
            finish()
        }
    }
    
    private fun verifyCode(code: String) {
        if (code.length != 6) {
            showError("Lütfen 6 haneli kodu girin")
            return
        }
        
        binding.btnVerify.isEnabled = false
        binding.loadingIndicator.visibility = View.VISIBLE
        binding.errorMessage.visibility = View.GONE
        
        // Hide keyboard
        val imm = getSystemService(INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(binding.root.windowToken, 0)
        
        lifecycleScope.launch {
            try {
                val request = VerifyCodeRequest(email, code)
                val response = ApiClient.apiService.verifyCode(request)
                
                if (response.isSuccessful && response.body()?.verified == true) {
                    // Code verified, navigate to reset password
                    val intent = Intent(this@VerifyCodeActivity, ResetPasswordActivity::class.java)
                    intent.putExtra("email", email)
                    intent.putExtra("code", code)
                    startActivity(intent)
                    finish()
                } else {
                    showError("Geçersiz kod. Lütfen tekrar deneyin.")
                    clearCodeInputs()
                }
            } catch (e: Exception) {
                showError("Hata: ${e.message}")
                clearCodeInputs()
            } finally {
                binding.btnVerify.isEnabled = true
                binding.loadingIndicator.visibility = View.GONE
            }
        }
    }
    
    private fun resendCode() {
        binding.btnResendCode.isEnabled = false
        binding.resendStatus.visibility = View.VISIBLE
        binding.resendStatus.text = "Kod gönderiliyor..."
        
        lifecycleScope.launch {
            try {
                val request = com.napibase.napifit.api.models.ForgotPasswordRequest(email)
                val response = ApiClient.apiService.forgotPassword(request)
                
                if (response.isSuccessful) {
                    binding.resendStatus.text = "✅ Yeni kod gönderildi!"
                    clearCodeInputs()
                } else {
                    binding.resendStatus.text = "❌ Kod gönderilemedi"
                }
            } catch (e: Exception) {
                binding.resendStatus.text = "❌ Hata: ${e.message}"
            } finally {
                binding.btnResendCode.isEnabled = true
            }
        }
    }
    
    private fun clearCodeInputs() {
        val inputs = listOf(
            binding.codeInput1,
            binding.codeInput2,
            binding.codeInput3,
            binding.codeInput4,
            binding.codeInput5,
            binding.codeInput6
        )
        inputs.forEach { it.text?.clear() }
        inputs[0].requestFocus()
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


