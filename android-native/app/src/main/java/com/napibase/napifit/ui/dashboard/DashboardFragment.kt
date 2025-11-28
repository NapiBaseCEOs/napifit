package com.napibase.napifit.ui.dashboard

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.viewpager2.widget.ViewPager2
import com.napibase.napifit.ViewPagerAdapter
import com.napibase.napifit.api.ApiError
import com.napibase.napifit.databinding.FragmentDashboardBinding

class DashboardFragment : Fragment() {
    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var viewModel: DashboardViewModel
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        viewModel = ViewModelProvider(this)[DashboardViewModel::class.java]
        
        // Set up SwipeRefreshLayout
        binding.swipeRefresh.setColorSchemeColors(
            resources.getColor(com.napibase.napifit.R.color.primary, null),
            resources.getColor(com.napibase.napifit.R.color.primary_500, null)
        )
        binding.swipeRefresh.setProgressBackgroundColorSchemeColor(
            resources.getColor(com.napibase.napifit.R.color.bg_gray_900_90, null)
        )
        binding.swipeRefresh.setOnRefreshListener {
            viewModel.loadStats()
        }
        
        // Add fade-up animation to all cards (staggered)
        val cards = listOfNotNull(
            binding.cardWeight,
            binding.cardTargetWeight,
            binding.cardSteps,
            binding.cardCalories,
            binding.cardBurned,
            binding.cardWater,
            binding.cardBmr.takeIf { it.visibility == View.VISIBLE },
            binding.cardBalance.takeIf { it.visibility == View.VISIBLE },
            binding.cardBowel.takeIf { it.visibility == View.VISIBLE }
        )
        cards.forEachIndexed { index, card ->
            card.alpha = 0f
            card.translationY = 20f
            card.animate()
                .alpha(1f)
                .translationY(0f)
                .setDuration(600)
                .setStartDelay((index * 100).toLong())
                .start()
        }
        
        // Observe data
        viewModel.stats.observe(viewLifecycleOwner) { stats ->
            try {
                // Update calories (today's calories)
                binding.caloriesCount.text = "${stats.weeklyCalories.toInt()} kcal"
                
                // TODO: Update other cards when profile data is available
                // binding.weightValue.text = "${user.weight} kg"
                // binding.targetWeightValue.text = "${user.targetWeight} kg"
                // binding.stepsValue.text = "${user.dailySteps} adım"
                // binding.burnedCalories.text = "${todayBurned} kcal"
            } catch (e: Exception) {
                // Ignore UI update errors
            }
        }
        
        // Observe loading state
        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            // Update SwipeRefreshLayout
            binding.swipeRefresh.isRefreshing = isLoading
            
            binding.loadingIndicator.visibility = if (isLoading) View.VISIBLE else View.GONE
            
            // Animate loading indicator
            if (isLoading) {
                binding.loadingIndicator.alpha = 0f
                binding.loadingIndicator.animate()
                    .alpha(1f)
                    .setDuration(300)
                    .start()
            } else {
                binding.loadingIndicator.animate()
                    .alpha(0f)
                    .setDuration(300)
                    .withEndAction {
                        binding.loadingIndicator.visibility = View.GONE
                    }
                    .start()
            }
        }
        
        // Observe errors
        viewModel.error.observe(viewLifecycleOwner) { apiError ->
            apiError?.let {
                // Show user-friendly message
                // Network errors are expected and handled gracefully, but show other errors
                if (!it.isNetworkError() && !it.isAuthError()) {
                    android.widget.Toast.makeText(
                        requireContext(),
                        "⚠️ ${it.getUserMessage()}",
                        android.widget.Toast.LENGTH_LONG
                    ).show()
                } else if (it.isNetworkError()) {
                    // Show network error with retry suggestion
                    android.widget.Toast.makeText(
                        requireContext(),
                        "⚠️ ${it.getUserMessage()}",
                        android.widget.Toast.LENGTH_LONG
                    ).show()
                }
                // Auth errors are handled by MainActivity's unauthorized callback
            }
        }
        
        // Quick action buttons - navigate to Health tab
        binding.btnAddMeal.setOnClickListener {
            // Get ViewPager2 from activity and navigate to Health tab
            val viewPager = activity?.findViewById<ViewPager2>(com.napibase.napifit.R.id.view_pager)
            viewPager?.currentItem = ViewPagerAdapter.TAB_HEALTH
        }
        
        binding.btnAddWorkout.setOnClickListener {
            // Get ViewPager2 from activity and navigate to Health tab
            val viewPager = activity?.findViewById<ViewPager2>(com.napibase.napifit.R.id.view_pager)
            viewPager?.currentItem = ViewPagerAdapter.TAB_HEALTH
        }
        
        // Load data
        viewModel.loadStats()
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

