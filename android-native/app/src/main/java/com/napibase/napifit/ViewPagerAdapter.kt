package com.napibase.napifit

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.napibase.napifit.ui.community.CommunityFragment
import com.napibase.napifit.ui.dashboard.DashboardFragment
import com.napibase.napifit.ui.health.HealthFragment
import com.napibase.napifit.ui.profile.ProfileFragment
import com.napibase.napifit.ui.water.WaterFragment

/**
 * ViewPager2 adapter for main navigation tabs
 */
class ViewPagerAdapter(activity: FragmentActivity) : FragmentStateAdapter(activity) {
    
    companion object {
        const val TAB_DASHBOARD = 0
        const val TAB_HEALTH = 1
        const val TAB_WATER = 2
        const val TAB_COMMUNITY = 3
        const val TAB_PROFILE = 4
        const val TAB_COUNT = 5
    }
    
    override fun getItemCount(): Int = TAB_COUNT
    
    override fun createFragment(position: Int): Fragment {
        return when (position) {
            TAB_DASHBOARD -> DashboardFragment()
            TAB_HEALTH -> HealthFragment()
            TAB_WATER -> WaterFragment()
            TAB_COMMUNITY -> CommunityFragment()
            TAB_PROFILE -> ProfileFragment()
            else -> DashboardFragment()
        }
    }
}

