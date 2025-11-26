package com.napibase.napifit

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.napibase.napifit.auth.AuthManager

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Check authentication first
        val authManager = AuthManager(this)
        val token = authManager.getAuthToken()
        
        if (token == null) {
            // No token, redirect to login
            Log.d("MainActivity", "No auth token, redirecting to LoginActivity")
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
            return
        }
        
        // Set up unauthorized callback to redirect to login
        com.napibase.napifit.api.ApiClient.setOnUnauthorizedCallback {
            runOnUiThread {
                Log.d("MainActivity", "401 Unauthorized, redirecting to LoginActivity")
                val authManager = AuthManager(this@MainActivity)
                authManager.clearAuthData()
                startActivity(Intent(this@MainActivity, LoginActivity::class.java))
                finish()
            }
        }
        
        try {
            Log.d("MainActivity", "onCreate: Setting content view")
            setContentView(R.layout.activity_main)

            Log.d("MainActivity", "onCreate: Finding navigation view")
            val navView: BottomNavigationView = findViewById(R.id.nav_view)
            
            // Wait for FragmentContainerView to create the fragment, then get NavController
            val navHostFragmentContainer = findViewById<androidx.fragment.app.FragmentContainerView>(
                R.id.nav_host_fragment_activity_main
            )
            
            // Post to ensure fragment is created
            navHostFragmentContainer.post {
                try {
                    val navHostFragment = supportFragmentManager
                        .findFragmentById(R.id.nav_host_fragment_activity_main) as? NavHostFragment
                    
                    if (navHostFragment == null) {
                        Log.e("MainActivity", "NavHostFragment not found!")
                        return@post
                    }
                    
                    Log.d("MainActivity", "onCreate: Getting nav controller from NavHostFragment")
                    val navController = navHostFragment.navController

                    Log.d("MainActivity", "onCreate: Setting up navigation")
                    // No ActionBar needed (using NoActionBar theme)
                    navView.setupWithNavController(navController)
                    
                    Log.d("MainActivity", "onCreate: Success")
                } catch (e: Exception) {
                    Log.e("MainActivity", "Error in post block", e)
                    e.printStackTrace()
                }
            }
        } catch (e: Exception) {
            Log.e("MainActivity", "Error in onCreate", e)
            e.printStackTrace()
            // Re-throw to see the actual error
            throw e
        }
    }
}

