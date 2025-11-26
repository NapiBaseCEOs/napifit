package com.napibase.napifit.ui.water

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.napibase.napifit.databinding.FragmentWaterBinding
import kotlinx.coroutines.launch

class WaterFragment : Fragment() {
    private var _binding: FragmentWaterBinding? = null
    private val binding get() = _binding!!
    
    private var currentWater = 0
    private var waterGoal = 2000
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentWaterBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Initialize water glass container after view is created
        binding.waterGlassContainer.post {
            updateWaterDisplay()
        }
        
        // Quick add buttons
        binding.btnAdd100.setOnClickListener { addWater(100) }
        binding.btnAdd250.setOnClickListener { addWater(250) }
        binding.btnAdd500.setOnClickListener { addWater(500) }
        binding.btnAdd1000.setOnClickListener { addWater(1000) }
        
        // Load water intake data
        loadWaterIntake()
    }
    
    private fun addWater(amount: Int) {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val request = com.napibase.napifit.api.models.WaterIntakeRequest(
                    amount_ml = amount
                )
                
                val response = com.napibase.napifit.api.ApiClient.apiService.addWaterIntake(request)
                
                if (response.isSuccessful) {
                    val totalAmount = response.body()?.totalAmount?.toInt() ?: 0
                    currentWater = totalAmount
                    updateWaterDisplay()
                    
                    android.widget.Toast.makeText(
                        requireContext(),
                        "+$amount ml eklendi! 💧",
                        android.widget.Toast.LENGTH_SHORT
                    ).show()
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
    
    override fun onResume() {
        super.onResume()
        loadWaterIntake()
    }
    
    private fun loadWaterIntake() {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val today = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault())
                    .format(java.util.Date())
                val response = com.napibase.napifit.api.ApiClient.apiService.getWaterIntake(date = today)
                
                if (response.isSuccessful) {
                    val totalAmount = response.body()?.totalAmount?.toInt() ?: 0
                    currentWater = totalAmount
                    val dailyGoal = response.body()?.dailyGoal ?: 2000
                    waterGoal = dailyGoal
                    updateWaterDisplay()
                }
            } catch (e: Exception) {
                // Ignore errors, use default values
            }
        }
    }
    
    private fun updateWaterDisplay() {
        binding.waterAmount.text = "$currentWater ml"
        binding.waterGoal.text = "/ $waterGoal ml"
        binding.waterProgress.max = waterGoal
        binding.waterProgress.progress = currentWater
        
        // Calculate progress percentage
        val progress = (currentWater.toFloat() / waterGoal.toFloat() * 100f).coerceAtMost(100f)
        
        // Update water glass fill animation
        val glassHeight = binding.waterGlassContainer.height
        if (glassHeight > 0) {
            val fillHeight = (glassHeight * progress / 100f).toInt()
            binding.waterFill.layoutParams.height = fillHeight
            binding.waterFill.requestLayout()
            
            // Animate fill
            binding.waterFill.animate()
                .setDuration(1000)
                .start()
        }
        
        // Update progress bar color based on progress
        when {
            progress < 50 -> {
                binding.waterProgress.progressTintList = android.content.res.ColorStateList.valueOf(
                    requireContext().getColor(com.napibase.napifit.R.color.error)
                )
            }
            progress < 80 -> {
                binding.waterProgress.progressTintList = android.content.res.ColorStateList.valueOf(
                    requireContext().getColor(com.napibase.napifit.R.color.warning)
                )
            }
            progress < 100 -> {
                binding.waterProgress.progressTintList = android.content.res.ColorStateList.valueOf(
                    requireContext().getColor(com.napibase.napifit.R.color.fitness_blue)
                )
            }
            else -> {
                binding.waterProgress.progressTintList = android.content.res.ColorStateList.valueOf(
                    requireContext().getColor(com.napibase.napifit.R.color.primary)
                )
            }
        }
        
        // Update status text
        if (currentWater >= waterGoal) {
            binding.waterAmount.setTextColor(requireContext().getColor(com.napibase.napifit.R.color.primary))
            binding.waterStatus.text = "🎉 Tebrikler! Günlük hedefinize ulaştınız!"
            binding.waterStatus.setTextColor(requireContext().getColor(com.napibase.napifit.R.color.primary))
        } else {
            binding.waterAmount.setTextColor(requireContext().getColor(com.napibase.napifit.R.color.text_primary))
            val remaining = waterGoal - currentWater
            binding.waterStatus.text = "Hedefe $remaining ml kaldı"
            binding.waterStatus.setTextColor(requireContext().getColor(com.napibase.napifit.R.color.text_secondary))
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

