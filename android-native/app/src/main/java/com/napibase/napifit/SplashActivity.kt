package com.napibase.napifit

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.animation.AnimationUtils
import androidx.appcompat.app.AppCompatActivity
import com.napibase.napifit.auth.AuthManager
import com.napibase.napifit.databinding.ActivitySplashBinding
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class SplashActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivitySplashBinding
    private val splashDuration = 1200L // Optimized: 2000ms -> 1200ms
    private var authCheckComplete = false
    private var hasToken: Boolean? = null
    private var minimumTimeElapsed = false
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Start auth check in parallel (background thread)
        startParallelAuthCheck()
        
        // Setup float animations with hardware acceleration
        binding.floatCircle1.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null)
        binding.floatCircle2.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null)
        
        binding.floatCircle1.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation))
        binding.floatCircle2.startAnimation(AnimationUtils.loadAnimation(this, R.anim.float_animation).apply {
            startOffset = 400 // Reduced stagger for faster feel
        })
        
        // Fade in logo with optimized duration
        binding.loadingIndicator.alpha = 0f
        binding.loadingIndicator.animate()
            .alpha(1f)
            .setDuration(500) // Reduced from 800ms
            .start()
        
        // Minimum splash time elapsed
        Handler(Looper.getMainLooper()).postDelayed({
            minimumTimeElapsed = true
            tryNavigate()
        }, splashDuration)
    }
    
    /**
     * Start auth check in background while splash animation plays
     */
    private fun startParallelAuthCheck() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val authManager = AuthManager(this@SplashActivity)
                val token = authManager.getAuthToken()
                
                withContext(Dispatchers.Main) {
                    hasToken = token != null
                    authCheckComplete = true
                    tryNavigate()
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    hasToken = false
                    authCheckComplete = true
                    tryNavigate()
                }
            }
        }
    }
    
    /**
     * Navigate only when both auth check is complete AND minimum time elapsed
     */
    private fun tryNavigate() {
        if (authCheckComplete && minimumTimeElapsed) {
            navigateToNextScreen()
        }
    }
    
    private fun navigateToNextScreen() {
        if (hasToken == true) {
            // Token exists, go to MainActivity
            startActivity(Intent(this, MainActivity::class.java))
        } else {
            // No token, go to LoginActivity
            startActivity(Intent(this, LoginActivity::class.java))
        }
        finish()
        // Disable exit animation for faster transition
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
    }
}

