package com.napibase.napifit.ui.health

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.napibase.napifit.databinding.FragmentHealthBinding
import kotlinx.coroutines.launch

class HealthFragment : Fragment() {
    private var _binding: FragmentHealthBinding? = null
    private val binding get() = _binding!!
    
    private var activeTab: String = "meal" // meal, workout, metric
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHealthBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Setup tab cards (web sitesi gibi custom tabs)
        binding.tabMetric.setOnClickListener {
            switchTab("metric")
        }
        
        binding.tabWorkout.setOnClickListener {
            switchTab("workout")
        }
        
        binding.tabMeal.setOnClickListener {
            switchTab("meal")
        }
        
        // Set default tab
        switchTab("meal")
        
        // Add animations to tab cards
        animateTabCards()
        
        // Save meal button
        binding.btnSaveMeal.setOnClickListener {
            val mealName = binding.mealName.text?.toString() ?: ""
            val calories = binding.mealCalories.text?.toString()?.toDoubleOrNull() ?: 0.0
            
            if (mealName.isNotEmpty() && calories > 0) {
                saveMeal(mealName, calories)
            } else {
                android.widget.Toast.makeText(
                    requireContext(),
                    "Lütfen tüm alanları doldurun",
                    android.widget.Toast.LENGTH_SHORT
                ).show()
            }
        }
        
        // Save workout button
        binding.btnSaveWorkout.setOnClickListener {
            val workoutName = binding.workoutName.text?.toString() ?: ""
            val duration = binding.workoutDuration.text?.toString() ?: ""
            val calories = binding.workoutCalories.text?.toString()?.toDoubleOrNull()
            
            if (workoutName.isNotEmpty() && duration.isNotEmpty()) {
                saveWorkout(workoutName, duration, calories)
            } else {
                android.widget.Toast.makeText(
                    requireContext(),
                    "Lütfen tüm alanları doldurun",
                    android.widget.Toast.LENGTH_SHORT
                ).show()
            }
        }
        
        // Save metric button
        binding.btnSaveMetric.setOnClickListener {
            val weight = binding.metricWeight.text?.toString()?.toDoubleOrNull()
            val bowel = binding.metricBowel.text?.toString()?.toDoubleOrNull()
            
            if (weight != null || bowel != null) {
                saveMetric(weight, bowel)
            } else {
                android.widget.Toast.makeText(
                    requireContext(),
                    "Lütfen en az bir alanı doldurun",
                    android.widget.Toast.LENGTH_SHORT
                ).show()
            }
        }
    }
    
    private fun switchTab(tab: String) {
        activeTab = tab
        
        // Hide all cards
        binding.cardMeal.visibility = View.GONE
        binding.cardWorkout.visibility = View.GONE
        binding.cardMetric.visibility = View.GONE
        
        // Reset tab card styles
        resetTabStyles()
        
        // Show selected card and highlight tab
        when (tab) {
            "meal" -> {
                binding.cardMeal.visibility = View.VISIBLE
                highlightTab(binding.tabMeal)
            }
            "workout" -> {
                binding.cardWorkout.visibility = View.VISIBLE
                highlightTab(binding.tabWorkout)
            }
            "metric" -> {
                binding.cardMetric.visibility = View.VISIBLE
                highlightTab(binding.tabMetric)
            }
        }
    }
    
    private fun resetTabStyles() {
        // Reset all tabs to default style
        binding.tabMeal.alpha = 0.8f
        binding.tabWorkout.alpha = 0.8f
        binding.tabMetric.alpha = 0.8f
    }
    
    private fun highlightTab(tabCard: com.google.android.material.card.MaterialCardView) {
        // Highlight selected tab
        tabCard.alpha = 1.0f
        tabCard.animate()
            .scaleX(1.02f)
            .scaleY(1.02f)
            .setDuration(200)
            .start()
    }
    
    private fun animateTabCards() {
        val tabs = listOf(binding.tabMetric, binding.tabWorkout, binding.tabMeal)
        tabs.forEachIndexed { index, tab ->
            tab.alpha = 0f
            tab.translationY = 15f
            tab.animate()
                .alpha(0.8f)
                .translationY(0f)
                .setDuration(400)
                .setStartDelay((index * 100).toLong())
                .start()
        }
    }
    
    private fun saveMeal(name: String, calories: Double) {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val request = com.napibase.napifit.api.models.MealCreateRequest(
                    foods = listOf(
                        com.napibase.napifit.api.models.Food(
                            name = name,
                            calories = calories,
                            quantity = null
                        )
                    ),
                    totalCalories = calories,
                    mealType = null,
                    notes = null,
                    imageUrl = null
                )
                
                val response = com.napibase.napifit.api.ApiClient.apiService.createMeal(request)
                
                if (response.isSuccessful) {
                    android.widget.Toast.makeText(
                        requireContext(),
                        "✅ Öğün kaydedildi: $name ($calories kcal)",
                        android.widget.Toast.LENGTH_SHORT
                    ).show()
                    
                    // Clear fields
                    binding.mealName.text?.clear()
                    binding.mealCalories.text?.clear()
                } else {
                    android.widget.Toast.makeText(
                        requireContext(),
                        "❌ Hata: ${response.message()}",
                        android.widget.Toast.LENGTH_SHORT
                    ).show()
                }
            } catch (e: Exception) {
                android.widget.Toast.makeText(
                    requireContext(),
                    "❌ Hata: ${e.message}",
                    android.widget.Toast.LENGTH_SHORT
                ).show()
            }
        }
    }
    
    private fun saveWorkout(name: String, durationStr: String, calories: Double?) {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val duration = durationStr.toIntOrNull()
                val request = com.napibase.napifit.api.models.WorkoutCreateRequest(
                    name = name,
                    type = "cardio",
                    duration = duration,
                    calories = calories,
                    distance = null,
                    notes = null
                )
                
                val response = com.napibase.napifit.api.ApiClient.apiService.createWorkout(request)
                
                if (response.isSuccessful) {
                    android.widget.Toast.makeText(
                        requireContext(),
                        "✅ Antrenman kaydedildi: $name",
                        android.widget.Toast.LENGTH_SHORT
                    ).show()
                    
                    // Clear fields
                    binding.workoutName.text?.clear()
                    binding.workoutDuration.text?.clear()
                    binding.workoutCalories.text?.clear()
                } else {
                    android.widget.Toast.makeText(
                        requireContext(),
                        "❌ Hata: ${response.message()}",
                        android.widget.Toast.LENGTH_SHORT
                    ).show()
                }
            } catch (e: Exception) {
                android.widget.Toast.makeText(
                    requireContext(),
                    "❌ Hata: ${e.message}",
                    android.widget.Toast.LENGTH_SHORT
                ).show()
            }
        }
    }
    
    private fun saveMetric(weight: Double?, bowel: Double?) {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val request = com.napibase.napifit.api.models.HealthMetricCreateRequest(
                    weight = weight,
                    bodyFat = null,
                    muscleMass = null,
                    water = null,
                    bmi = null,
                    bowelMovementDays = bowel,
                    notes = null
                )
                
                val response = com.napibase.napifit.api.ApiClient.apiService.createHealthMetric(request)
                
                if (response.isSuccessful) {
                    android.widget.Toast.makeText(
                        requireContext(),
                        "✅ Metrik kaydedildi",
                        android.widget.Toast.LENGTH_SHORT
                    ).show()
                    
                    // Clear fields
                    binding.metricWeight.text?.clear()
                    binding.metricBowel.text?.clear()
                } else {
                    android.widget.Toast.makeText(
                        requireContext(),
                        "❌ Hata: ${response.message()}",
                        android.widget.Toast.LENGTH_SHORT
                    ).show()
                }
            } catch (e: Exception) {
                android.widget.Toast.makeText(
                    requireContext(),
                    "❌ Hata: ${e.message}",
                    android.widget.Toast.LENGTH_SHORT
                ).show()
            }
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

