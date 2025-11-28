package com.napibase.napifit

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.animation.AccelerateDecelerateInterpolator
import androidx.appcompat.app.AppCompatActivity
import androidx.viewpager2.widget.ViewPager2
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator
import com.napibase.napifit.auth.AuthManager

class MainActivity : AppCompatActivity() {

    private lateinit var viewPager: ViewPager2
    private lateinit var tabLayout: TabLayout
    private lateinit var fab: FloatingActionButton
    private lateinit var speedDialContainer: android.widget.LinearLayout
    private lateinit var fabOverlay: View
    private lateinit var fabAddMeal: FloatingActionButton
    private lateinit var fabAddWorkout: FloatingActionButton
    private lateinit var fabAddWater: FloatingActionButton
    
    private var isSpeedDialOpen = false
    
    private val tabIcons = arrayOf(
        R.drawable.ic_dashboard,
        R.drawable.ic_health,
        R.drawable.ic_water,
        R.drawable.ic_community,
        R.drawable.ic_profile
    )
    
    private val tabTitles = arrayOf(
        R.string.nav_dashboard,
        R.string.nav_health,
        R.string.nav_water,
        R.string.nav_community,
        R.string.nav_profile
    )

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

            // Initialize views
            viewPager = findViewById(R.id.view_pager)
            tabLayout = findViewById(R.id.tab_layout)
            fab = findViewById(R.id.fab)
            speedDialContainer = findViewById<android.widget.LinearLayout>(R.id.speed_dial_container)
            fabOverlay = findViewById(R.id.fab_overlay)
            fabAddMeal = findViewById(R.id.fab_add_meal)
            fabAddWorkout = findViewById(R.id.fab_add_workout)
            fabAddWater = findViewById(R.id.fab_add_water)
            
            // Set up ViewPager2 with adapter
            val adapter = ViewPagerAdapter(this)
            viewPager.adapter = adapter
            
            // Performance optimizations
            viewPager.offscreenPageLimit = 2 // Preload adjacent pages for smoother swiping
            viewPager.isUserInputEnabled = true
            
            // Reduce overscroll effect for better performance
            viewPager.getChildAt(0)?.overScrollMode = View.OVER_SCROLL_NEVER
            
            // Connect TabLayout with ViewPager2
            TabLayoutMediator(tabLayout, viewPager) { tab, position ->
                tab.setIcon(tabIcons[position])
                tab.setText(tabTitles[position])
            }.attach()
            
            // Set up FAB click listener
            fab.setOnClickListener {
                toggleSpeedDial()
            }
            
            // Set up overlay click to close speed dial
            fabOverlay.setOnClickListener {
                closeSpeedDial()
            }
            
            // Set up speed dial item click listeners
            fabAddMeal.setOnClickListener {
                viewPager.currentItem = ViewPagerAdapter.TAB_HEALTH
                closeSpeedDial()
            }
            
            fabAddWorkout.setOnClickListener {
                viewPager.currentItem = ViewPagerAdapter.TAB_HEALTH
                closeSpeedDial()
            }
            
            fabAddWater.setOnClickListener {
                viewPager.currentItem = ViewPagerAdapter.TAB_WATER
                closeSpeedDial()
            }
            
            // Change FAB icon based on current tab
            viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
                override fun onPageSelected(position: Int) {
                    super.onPageSelected(position)
                    updateFabForTab(position)
                }
            })
            
            Log.d("MainActivity", "onCreate: ViewPager2 setup complete")
        } catch (e: Exception) {
            Log.e("MainActivity", "Error in onCreate", e)
            e.printStackTrace()
            throw e
        }
    }
    
    private fun updateFabForTab(position: Int) {
        // Close speed dial when changing tabs
        if (isSpeedDialOpen) {
            closeSpeedDial()
        }
        
        when (position) {
            ViewPagerAdapter.TAB_DASHBOARD -> {
                fab.show()
                fab.setImageResource(android.R.drawable.ic_input_add)
            }
            ViewPagerAdapter.TAB_HEALTH -> {
                fab.show()
                fab.setImageResource(android.R.drawable.ic_input_add)
            }
            ViewPagerAdapter.TAB_WATER -> {
                fab.show()
                fab.setImageResource(android.R.drawable.ic_input_add)
            }
            ViewPagerAdapter.TAB_COMMUNITY -> {
                fab.show()
                fab.setImageResource(android.R.drawable.ic_input_add)
            }
            ViewPagerAdapter.TAB_PROFILE -> {
                fab.hide()
            }
        }
    }
    
    private fun toggleSpeedDial() {
        if (isSpeedDialOpen) {
            closeSpeedDial()
        } else {
            openSpeedDial()
        }
    }
    
    private fun openSpeedDial() {
        isSpeedDialOpen = true
        
        // Show overlay and container
        fabOverlay.visibility = View.VISIBLE
        speedDialContainer.visibility = View.VISIBLE
        
        // Enable hardware acceleration for animations
        fabOverlay.setLayerType(View.LAYER_TYPE_HARDWARE, null)
        speedDialContainer.setLayerType(View.LAYER_TYPE_HARDWARE, null)
        
        // Animate overlay fade in (optimized duration)
        fabOverlay.alpha = 0f
        fabOverlay.animate()
            .alpha(1f)
            .setDuration(150) // Reduced from 200
            .start()
        
        // Rotate main FAB (optimized duration)
        fab.animate()
            .rotation(135f)
            .setDuration(200) // Reduced from 300
            .setInterpolator(AccelerateDecelerateInterpolator())
            .start()
        
        // Animate speed dial items (optimized)
        val speedDialItems = listOf(
            speedDialContainer.getChildAt(0),
            speedDialContainer.getChildAt(1),
            speedDialContainer.getChildAt(2)
        )
        
        speedDialItems.forEachIndexed { index, view ->
            view?.apply {
                setLayerType(View.LAYER_TYPE_HARDWARE, null)
                alpha = 0f
                translationY = 30f // Reduced from 50
                animate()
                    .alpha(1f)
                    .translationY(0f)
                    .setDuration(200) // Reduced from 300
                    .setStartDelay((index * 30).toLong()) // Reduced from 50
                    .setInterpolator(AccelerateDecelerateInterpolator())
                    .withEndAction { setLayerType(View.LAYER_TYPE_NONE, null) }
                    .start()
            }
        }
    }
    
    private fun closeSpeedDial() {
        isSpeedDialOpen = false
        
        // Rotate main FAB back (optimized)
        fab.animate()
            .rotation(0f)
            .setDuration(200) // Reduced from 300
            .setInterpolator(AccelerateDecelerateInterpolator())
            .start()
        
        // Animate overlay fade out (optimized)
        fabOverlay.animate()
            .alpha(0f)
            .setDuration(150) // Reduced from 200
            .withEndAction {
                fabOverlay.visibility = View.GONE
                fabOverlay.setLayerType(View.LAYER_TYPE_NONE, null)
            }
            .start()
        
        // Animate speed dial items out (optimized)
        val speedDialItems = listOf(
            speedDialContainer.getChildAt(0),
            speedDialContainer.getChildAt(1),
            speedDialContainer.getChildAt(2)
        )
        
        speedDialItems.reversed().forEachIndexed { index, view ->
            view?.animate()
                ?.alpha(0f)
                ?.translationY(30f) // Reduced from 50
                ?.setDuration(150) // Reduced from 200
                ?.setStartDelay((index * 20).toLong()) // Reduced from 30
                ?.setInterpolator(AccelerateDecelerateInterpolator())
                ?.withEndAction {
                    view.setLayerType(View.LAYER_TYPE_NONE, null)
                    if (index == speedDialItems.size - 1) {
                        speedDialContainer.visibility = View.GONE
                        speedDialContainer.setLayerType(View.LAYER_TYPE_NONE, null)
                    }
                }
                ?.start()
        }
    }
    
    override fun onBackPressed() {
        if (isSpeedDialOpen) {
            closeSpeedDial()
        } else {
            super.onBackPressed()
        }
    }
}

