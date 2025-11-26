package com.napibase.napifit

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.animation.AnimationUtils
import androidx.appcompat.app.AppCompatActivity
import com.napibase.napifit.auth.AuthManager
import com.napibase.napifit.databinding.ActivitySplashBinding

class SplashActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivitySplashBinding
    private val splashDuration = 2000L // 2 saniye
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Setup float animations
        binding.floatCircle1.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation))
        binding.floatCircle2.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation).apply {
            startOffset = 750 // Stagger animation
        })
        
        // Fade in logo
        binding.loadingIndicator.alpha = 0f
        binding.loadingIndicator.animate()
            .alpha(1f)
            .setDuration(800)
            .start()
        
        // Check auth state after splash delay
        Handler(Looper.getMainLooper()).postDelayed({
            checkAuthAndNavigate()
        }, splashDuration)
    }
    
    private fun checkAuthAndNavigate() {
        val authManager = AuthManager(this)
        val token = authManager.getAuthToken()
        
        if (token != null) {
            // Token var, MainActivity'ye git
            startActivity(Intent(this, MainActivity::class.java))
        } else {
            // Token yok, LoginActivity'ye git
            startActivity(Intent(this, LoginActivity::class.java))
        }
        finish()
    }
}

